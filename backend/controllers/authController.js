import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/User.js";

// Generate JWT token
const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password, role, parentId } = req.body;

    // Validate required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate role
    if (!["parent", "child"].includes(role)) {
      return res.status(400).json({ message: "Role must be 'parent' or 'child'" });
    }

    // Child must have a parentId
    if (role === "child" && !parentId) {
      return res
        .status(400)
        .json({ message: "Parent ID is required for child registration" });
    }

    if (role === "child" && !mongoose.Types.ObjectId.isValid(parentId)) {
      return res.status(400).json({ message: "Invalid parent ID format" });
    }

    // If child, verify parent exists
    if (role === "child") {
      const parent = await User.findById(parentId);
      if (!parent || parent.role !== "parent") {
        return res.status(400).json({ message: "Invalid parent ID" });
      }
    }

    // Check if email already exists
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role,
      parentId: role === "child" ? parentId : null,
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error.message);

    if (error.name === "ValidationError") {
      const message = Object.values(error.errors)
        .map((err) => err.message)
        .join(", ");
      return res.status(400).json({ message });
    }

    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already registered" });
    }

    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find user and include password field
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id, user.role);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get children linked to parent
// @route   GET /api/auth/children
export const getChildren = async (req, res) => {
  try {
    if (req.user.role !== "parent") {
      return res.status(403).json({ message: "Only parents can access this" });
    }

    const children = await User.find({
      parentId: req.user.id,
      role: "child",
    }).select("name email createdAt");

    res.json(children);
  } catch (error) {
    console.error("Get children error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
