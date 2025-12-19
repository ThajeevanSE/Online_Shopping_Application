import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout, getToken } from "../services/authService";
import api from "../api/axios";
import { DarkModeContext } from "../context/DarkModeContext";

function Navbar() {
  const [userName, setUserName] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [role, setRole] = useState("");
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();
  const token = getToken();

  useEffect(() => {
    if (token) {
      const fetchUser = async () => {
        try {
          const response = await api.get("/user/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUserName(response.data.name);
          setProfilePic(response.data.profilePicture);
          setRole(response.data.role?.toLowerCase()); // normalize role
        } catch (error) {
          console.error("Failed to fetch user data", error);
        }
      };

      fetchUser();
    } else {
      setUserName("");
      setProfilePic("");
      setRole("");
    }
  }, [token]);

  if (!token) return null;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const imageUrl = profilePic
    ? `http://localhost:8080${profilePic}`
    : "/default-avatar.png";

  return (
    <nav
      className={`${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"
        } shadow-md border-b border-gray-200 sticky top-0 z-50 transition-colors duration-300`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Left side */}
          <div className="flex items-center space-x-8">
            <Link to="/admin" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
            </Link>

            {/* Desktop Links */}
            <div className="text-xl font-bold hidden sm:flex space-x-4">
              <Link
                to="/dashboard"
                className={`px-4 py-2 rounded-lg font-medium transition duration-200 ${isDarkMode
                  ? "text-white hover:bg-gray-800"
                  : "text-gray-800 hover:bg-blue-50 hover:text-blue-600"
                  }`}
              >
                {role === "admin" ? "Admin Dashboard" : "Dashboard"}
              </Link>




              {role !== "admin" && (
                <Link
                  to="/my-products"
                  className={`px-4 py-2 rounded-lg font-medium transition duration-200 ${isDarkMode
                    ? "text-white hover:bg-gray-800"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                >
                  Add Products
                </Link>
              )}
              {role !== "admin" && (
                <Link
                  to="/shopping"
                  className={`px-4 py-2 rounded-lg font-medium transition duration-200 ${isDarkMode
                    ? "text-white hover:bg-gray-800"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                >
                  Shopping
                </Link>
              )}
              {role !== "admin" && (
                <Link
                  to="/favorites"
                  className={`px-4 py-2 rounded-lg font-medium transition duration-200 ${isDarkMode
                    ? "text-white hover:bg-gray-800"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                >
                  Favorites
                </Link>
              )}

            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition duration-200 ${isDarkMode
                ? "text-yellow-300 hover:bg-gray-700"
                : "text-gray-600 hover:bg-gray-100"
                }`}
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>

            {/* Desktop user info */}
            <div className="hidden md:flex items-center space-x-3">
              <span className={`${isDarkMode ? "text-white" : "text-gray-700"} text-sm font-medium`}>
                {userName ? `Hello, ${userName}` : "Hello"}
              </span>

              <Link to="/profile">
                <img
                  src={imageUrl}
                  alt="Profile"
                  onError={(e) => { e.target.src = "/default-avatar.png"; }}
                  className="w-10 h-10 rounded-full object-cover border-2 border-blue-500 hover:border-blue-600 transition duration-200 cursor-pointer"
                />
              </Link>

              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition duration-200"
              >
                Logout
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`md:hidden p-2 rounded-lg transition duration-200 ${isDarkMode ? "text-white hover:bg-gray-800" : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              {isMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className={`${isDarkMode ? "bg-gray-800 text-white border-gray-700" : "bg-white text-gray-800 border-gray-200"} md:hidden border-t`}>
          <div className="px-4 py-3 space-y-3">
            <div className="flex items-center space-x-3 pb-3 border-b">

              <Link to="/profile">
                <img
                  src={imageUrl}
                  alt="Profile"
                  onError={(e) => { e.target.src = "/default-avatar.png"; }}
                  className="w-10 h-10 rounded-full object-cover border-2 border-blue-500 hover:border-blue-600 transition duration-200 cursor-pointer"
                />
              </Link>

              <span className="text-sm font-medium">{userName ? `Hello, ${userName}` : "Hello"}</span>


            </div>

            <Link
              to="/dashboard"
              onClick={() => setIsMenuOpen(false)}
              className="block w-full text-left px-4 py-2 rounded-lg font-medium hover:bg-blue-50 hover:text-blue-600 transition duration-200"
            >
              {role === "admin" ? "Admin Dashboard" : "Dashboard"}
            </Link>

            {role !== "admin" && (
              <Link
                to="/profile"
                onClick={() => setIsMenuOpen(false)}
                className="block w-full text-left px-4 py-2 rounded-lg font-medium hover:bg-blue-50 hover:text-blue-600 transition duration-200"
              >
                Profile
              </Link>
            )}
            {role !== "admin" && (
              <Link
                to="/favorites"
                onClick={() => setIsMenuOpen(false)}
                className="block w-full text-left px-4 py-2 rounded-lg font-medium hover:bg-blue-50 hover:text-blue-600 transition duration-200"
              >
                Favorites
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
