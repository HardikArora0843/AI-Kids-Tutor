import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { registerUser } from "../services/api";

const childUrl = import.meta.env.VITE_CHILD_URL || "http://localhost:5173";
const SESSION_MS = 7 * 24 * 60 * 60 * 1000;

const ParentRegister = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordRules = [
    { label: "At least 8 characters", valid: form.password.length >= 8 },
    { label: "1 uppercase letter", valid: /[A-Z]/.test(form.password) },
    { label: "1 lowercase letter", valid: /[a-z]/.test(form.password) },
    { label: "1 number", valid: /\d/.test(form.password) },
    { label: "1 special character", valid: /[^A-Za-z0-9]/.test(form.password) },
  ];
  const isPasswordValid = passwordRules.every((rule) => rule.valid);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
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
      const { data } = await registerUser({ ...form, role: "parent" });
      localStorage.setItem("parentToken", data.token);
      localStorage.setItem("parentUser", JSON.stringify(data.user));
      localStorage.setItem("parentSessionExpiresAt", String(Date.now() + SESSION_MS));
      navigate("/parent");
    } catch (err) {
      setError(err.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Create Parent Account</h1>
          <p className="text-gray-500">Set up your parent dashboard</p>
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
                placeholder="Parent name"
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
                placeholder="parent@example.com"
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

            <button
              type="submit"
              disabled={loading || !isPasswordValid}
              className="w-full py-3 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl shadow-lg shadow-primary-500/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? "Creating Account..." : "Create Parent Account"}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-primary-500 font-semibold hover:text-primary-600">
              Sign In
            </Link>
          </p>

          <a
            href={childUrl}
            className="block text-center text-gray-400 hover:text-gray-600 text-xs font-semibold mt-4"
          >
            Go to Child Portal
          </a>
        </div>
      </div>
    </div>
  );
};

export default ParentRegister;
