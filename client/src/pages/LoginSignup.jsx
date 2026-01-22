import React, { useState, useEffect } from "react";
import { Leaf } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const MIN_NAME_LENGTH = 5;
const MIN_PASSWORD_LENGTH = 6;

export default function LoginSignup() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  // ✅ Auto-hide all messages after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setMessage("");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!isLogin) {
      if (formData.name.trim().length < MIN_NAME_LENGTH) {
        setMessage(`Name must be at least ${MIN_NAME_LENGTH} characters long ❌`);
        return;
      }
      if (formData.password.length < MIN_PASSWORD_LENGTH) {
        setMessage(`Password must be at least ${MIN_PASSWORD_LENGTH} characters long ❌`);
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setMessage("Passwords do not match ❌");
        return;
      }
    }

    setLoading(true);

    const endpoint = isLogin
      ? `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth/login`
      : `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth/register`;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        if (isLogin && res.status === 401) {
          if (data.error && data.error.toLowerCase().includes("user not found")) {
            setMessage("User does not exist ❌");
          } else {
            setMessage("Email or password is incorrect ❌");
          }
        } else {
          setMessage(data.error || data.message || "Something went wrong ❌");
        }
        return;
      }

      if (isLogin) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.user?.id);
        localStorage.setItem("userName", data.user?.name);

        setMessage("Login successful ✅ Redirecting...");
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        setMessage("Signup successful 🎉 Please login.");
        setTimeout(() => {
          setIsLogin(true);
          setMessage("");
          setFormData({ name: "", email: "", password: "", confirmPassword: "" });
        }, 1500);
      }
    } catch (err) {
      setMessage("Server error, please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!resetEmail || !newPassword) {
      setMessage("Please fill all fields ❌");
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: resetEmail, newPassword }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Failed to reset password ❌");
        return;
      }

      setMessage("Password updated successfully ✅ Please login now.");
      setShowReset(false);
      setResetEmail("");
      setNewPassword("");
    } catch (err) {
      setMessage("Server error, please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-green-50">
      <section className="flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-5xl flex flex-col md:flex-row rounded-2xl shadow-lg overflow-hidden bg-white">
          {/* Left Panel */}
          <div className="hidden md:flex md:w-1/2 p-10 flex-col justify-center items-center text-center border-r border-green-200">
            <div className="flex items-center gap-3 mb-4">
              <Leaf className="w-12 h-12 text-emerald-700" />
              <h1 className="text-5xl font-extrabold text-emerald-700">AyurMate</h1>
            </div>
            <p className="text-green-800 text-lg">
              Your digital Ayurvedic wellness companion 🌿 – discover remedies, lifestyle tips, and holistic wellness.
            </p>
          </div>

          {/* Right Panel */}
          <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
            <div className="flex justify-center mb-6">
              <button
                className={`px-6 py-2 font-semibold rounded-t-xl transition ${
                  isLogin ? "bg-green-700 text-white" : "bg-green-100 text-green-700"
                }`}
                onClick={() => setIsLogin(true)}
              >
                Login
              </button>
              <button
                className={`px-6 py-2 font-semibold rounded-t-xl transition ${
                  !isLogin ? "bg-green-700 text-white" : "bg-green-100 text-green-700"
                }`}
                onClick={() => setIsLogin(false)}
              >
                Signup
              </button>
            </div>

            {message && (
              <p
                className={`text-sm text-center mb-4 font-medium ${
                  message.includes("successful") ? "text-green-600" : "text-red-500"
                }`}
              >
                {message}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    className="w-full border border-green-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-green-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="w-full border border-green-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-green-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="w-full border border-green-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>

              {isLogin && (
                <p
                  onClick={() => setShowReset(true)}
                  className="text-sm text-right text-green-600 hover:underline cursor-pointer"
                >
                  Forgot Password?
                </p>
              )}

              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    required
                    className="w-full border border-green-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-700 text-white font-semibold py-2.5 px-4 rounded-lg shadow hover:bg-green-800 transition disabled:opacity-50"
              >
                {loading ? "Please wait..." : isLogin ? "Login" : "Signup"}
              </button>
            </form>

            <p className="mt-4 text-center text-green-700">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <span
                className="text-green-500 cursor-pointer font-medium hover:underline"
                onClick={toggleForm}
              >
                {isLogin ? "Signup" : "Login"}
              </span>
            </p>

            <p className="mt-2 text-center text-sm text-gray-500">
              <Link to="/" className="hover:underline text-green-600 font-medium">
                Back to Home
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* ✅ Forgot Password Modal */}
      {showReset && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-96 shadow-lg">
            <h2 className="text-xl font-semibold text-green-700 mb-4 text-center">
              Reset Password
            </h2>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <input
                type="email"
                placeholder="Enter your registered email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="w-full border border-green-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                required
              />
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border border-green-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                required
              />
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setShowReset(false)}
                  className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}