import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <nav className="bg-dark-purple-900/80 backdrop-blur-md border-b border-dark-purple-700 sticky top-0 z-50 shadow-glow-purple">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-dark-purple-600 to-dark-purple-400 group-hover:shadow-glow-purple-hover transition-all duration-300"></div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-dark-purple-300 tracking-wider group-hover:to-white transitions-all duration-300">
                matepiee
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors duration-300 ${
                  isActive
                    ? "text-white"
                    : "text-gray-400 hover:text-dark-purple-300"
                }`
              }
            >
              Home
            </NavLink>

            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <span className="text-gray-300 text-sm">Hello, user!</span>
                <button
                  onClick={() => setIsLoggedIn(false)}
                  className="px-5 py-2 rounded-full border border-dark-purple-500 text-dark-purple-300 hover:bg-dark-purple-600 hover:text-white hover:shadow-glow-purple-hover transition-all duration-300 text-sm font-semibold"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    `relative px-1 py-1 transition-all duration-300 ${
                      isActive ? "text-white" : "text-gray-400 hover:text-white"
                    }`
                  }
                >
                  Register
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-dark-purple-400 transition-all duration-300 group-hover:w-full"></span>
                </NavLink>

                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `px-6 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-md ${
                      isActive
                        ? "bg-dark-purple-500 text-white shadow-glow-purple"
                        : "bg-dark-purple-700 text-white hover:bg-dark-purple-600 hover:shadow-glow-purple-hover"
                    }`
                  }
                >
                  Login
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
