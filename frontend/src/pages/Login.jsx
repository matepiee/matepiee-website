import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/authService";
import { useNotification } from "../contexts/NotificationsContext";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.identifier || !formData.password) {
      showNotification("Please fill in all fields.", "error");
      return;
    }

    setIsLoading(true);
    try {
      const loginData = {
        username: formData.identifier,
        password: formData.password,
      };

      const response = await loginUser(loginData);

      login(response.user);

      showNotification("Login successful!", "success");
      navigate("/");
    } catch (err) {
      showNotification(err.message || "Login failed.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-dark-purple-800/50 backdrop-blur-sm p-8 rounded-2xl border border-dark-purple-600 shadow-glow-purple">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-white tracking-wide">
            Welcome back!
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Sign in to your account
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="identifier" className="sr-only">
                Username or Email
              </label>
              <input
                id="identifier"
                name="identifier"
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-3 border border-dark-purple-600 placeholder-gray-500 text-white bg-dark-purple-900/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-purple-400 focus:border-transparent transition-all duration-300"
                placeholder="Username or Email"
                value={formData.identifier}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-3 border border-dark-purple-600 placeholder-gray-500 text-white bg-dark-purple-900/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-purple-400 focus:border-transparent transition-all duration-300"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white 
                ${
                  isLoading
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-gradient-to-r from-dark-purple-600 to-dark-purple-500 hover:from-dark-purple-500 hover:to-dark-purple-400 shadow-glow-purple hover:shadow-glow-purple-hover"
                }
                transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dark-purple-500`}
            >
              {isLoading ? "Logging in..." : "Log in"}
            </button>
          </div>

          <div className="text-center text-sm text-gray-400">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-dark-purple-300 hover:text-white transition-colors"
            >
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
