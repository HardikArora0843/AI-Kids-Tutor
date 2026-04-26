import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/api";

const parentUrl = import.meta.env.VITE_PARENT_URL || "http://localhost:5174";
const SESSION_MS = 7 * 24 * 60 * 60 * 1000;

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "child",
    parentId: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const passwordRules = [
    { label: "At least 8 characters", valid: form.password.length >= 8 },
    { label: "1 uppercase letter", valid: /[A-Z]/.test(form.password) },
    { label: "1 lowercase letter", valid: /[a-z]/.test(form.password) },
    { label: "1 number", valid: /\d/.test(form.password) },
    { label: "1 special character", valid: /[^A-Za-z0-9]/.test(form.password) },
  ];
  const isPasswordValid = passwordRules.every((rule) => rule.valid);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!isPasswordValid) {
      setError("Password must meet all the requirements below.");
      return;
    }

    setLoading(true);

    try {
      const { data } = await registerUser(form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("sessionExpiresAt", String(Date.now() + SESSION_MS));
      navigate("/child");
    } catch (err) {
      setError(err.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Create Child Account</h1>
          <p className="text-gray-500">Join the learning adventure</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          {error && (
            <div className="mb-4 p-3 bg-error-500/10 border border-error-400/30 rounded-xl text-error-600 text-sm font-semibold text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Child name"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1.5">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="child@example.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                  placeholder="Create a strong password"
                  className="w-full px-4 py-3 pr-20 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-gray-800"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-3 text-sm font-bold text-primary-500 hover:text-primary-600 cursor-pointer"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <div className="mt-3 grid grid-cols-1 gap-1.5">
                {passwordRules.map((rule) => (
                  <p
                    key={rule.label}
                    className={`text-xs font-semibold ${
                      rule.valid ? "text-success-600" : "text-gray-400"
                    }`}
                  >
                    {rule.valid ? "✓" : "•"} {rule.label}
                  </p>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1.5">
                Parent ID
              </label>
              <input
                type="text"
                name="parentId"
                value={form.parentId}
                onChange={handleChange}
                required
                placeholder="Enter your parent's account ID"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-secondary-400 focus:ring-2 focus:ring-secondary-100 outline-none transition-all text-gray-800"
              />
              <p className="text-xs text-gray-400 mt-1">
                Ask your parent for their account ID from the Parent Portal.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !isPasswordValid}
              className="w-full py-3 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl shadow-lg shadow-primary-500/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? "Creating Account..." : "Create Child Account"}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-primary-500 font-semibold hover:text-primary-600">
              Sign In
            </Link>
          </p>

          <a
            href={parentUrl}
            className="block text-center text-gray-400 hover:text-gray-600 text-xs font-semibold mt-4"
          >
            Parent? Create your account in the Parent Portal
          </a>
        </div>
      </div>
    </div>
  );
};

export default Register;
