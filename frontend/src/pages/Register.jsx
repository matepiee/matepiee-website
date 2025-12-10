import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/authService";
import { useNotification } from "../contexts/NotificationsContext";

const CheckIcon = () => (
  <svg
    className="w-4 h-4 text-green-400 shrink-0"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M5 13l4 4L19 7"
    />
  </svg>
);

const XIcon = () => (
  <svg
    className="w-4 h-4 text-red-400 shrink-0"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const Register = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const [validations, setValidations] = useState({
    length: false,
    lower: false,
    upper: false,
    number: false,
    symbol: false,
    match: false,
  });

  useEffect(() => {
    const { password, confirmPassword } = formData;

    setValidations({
      length: password.length >= 6 && password.length <= 16,
      lower: /[a-z]/.test(password),
      upper: /[A-Z]/.test(password),
      number: /\d/.test(password),
      symbol: /[\W_]/.test(password),
      match: password.length > 0 && password === confirmPassword,
    });
  }, [formData.password, formData.confirmPassword]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const allValid = Object.values(validations).every(Boolean);

    if (!allValid) {
      showNotification("Password doesn't meet criteria.", "error");
      return;
    }

    setIsLoading(true);
    try {
      await registerUser(formData);
      showNotification("Registration successful! Redirecting...", "success");
      navigate("/login");
    } catch (err) {
      showNotification(err.message || "Registration failed.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const RequirementItem = ({ met, text }) => (
    <li
      className={`flex items-center gap-2 transition-colors duration-300 ${
        met ? "text-green-400" : "text-red-400"
      }`}
    >
      {met ? <CheckIcon /> : <XIcon />}
      <span>{text}</span>
    </li>
  );

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-dark-purple-800/50 backdrop-blur-sm p-8 rounded-2xl border border-dark-purple-600 shadow-glow-purple">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-white tracking-wide">
            Create a profile!
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">Join us</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-3 border border-dark-purple-600 placeholder-gray-500 text-white bg-dark-purple-900/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-purple-400 focus:border-transparent transition-all duration-300"
                placeholder="username123"
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none relative block w-full px-3 py-3 border border-dark-purple-600 placeholder-gray-500 text-white bg-dark-purple-900/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-purple-400 focus:border-transparent transition-all duration-300"
                placeholder="email@address.com"
                value={formData.email}
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
                placeholder="strongpassword123"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                Password again
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-3 border border-dark-purple-600 placeholder-gray-500 text-white bg-dark-purple-900/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-purple-400 focus:border-transparent transition-all duration-300"
                placeholder="strongpassword123"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="bg-dark-purple-900/30 p-4 rounded-lg border border-dark-purple-700/50">
            <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-2">
              Criteria:
            </p>
            <ul className="text-sm space-y-1">
              <RequirementItem
                met={validations.length}
                text="6 - 16 characters"
              />
              <RequirementItem
                met={validations.lower && validations.upper}
                text="Has uppercase & lowercase"
              />
              <RequirementItem
                met={validations.number && validations.symbol}
                text="Has number & symbol"
              />
              <RequirementItem met={validations.match} text="Passwords match" />
            </ul>
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
              {isLoading ? "Registering..." : "Register"}
            </button>
          </div>

          <div className="text-center text-sm text-gray-400">
            You have an account already?{" "}
            <Link
              to="/login"
              className="font-medium text-dark-purple-300 hover:text-white transition-colors"
            >
              Log in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
