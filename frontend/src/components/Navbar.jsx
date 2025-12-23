import React, { useEffect, useState, useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout, getToken } from "../services/authService";
import api from "../api/axios";
import { DarkModeContext } from "../context/DarkModeContext";

// --- 1. Import WebSocket Libraries ---
import SockJS from "sockjs-client";
import Stomp from "stompjs";

function Navbar() {
  const [userName, setUserName] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [role, setRole] = useState("");
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();
  const token = getToken();
  const [unreadCount, setUnreadCount] = useState(0);

  // --- 2. New State for Notifications ---
  const [notification, setNotification] = useState(null);
  const stompClientRef = useRef(null);

  // Existing Polling for Unread Messages
  useEffect(() => {
    if (token) {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 5000); // Poll every 5 seconds
      return () => clearInterval(interval);
    }
  }, [token]);

  // --- 3. WebSocket Connection for Order Notifications ---
  useEffect(() => {
    if (!token) return;

    // Connect to WebSocket
    const socket = new SockJS("http://localhost:8080/ws");
    const client = Stomp.over(socket);
    client.debug = null; // Disable debug logs

    client.connect(
      { Authorization: `Bearer ${token}` },
      () => {
        // Subscribe to Notifications (e.g. "New Order Received!")
        client.subscribe("/user/queue/notifications", (payload) => {
          setNotification(payload.body);
          
          // Hide popup automatically after 5 seconds
          setTimeout(() => setNotification(null), 5000);
        });
      },
      (err) => console.error("Navbar Socket Error:", err)
    );

    stompClientRef.current = client;

    // Cleanup on unmount
    return () => {
      if (client && client.connected) {
        client.disconnect();
      }
    };
  }, [token]);

  const fetchUnreadCount = async () => {
    try {
      const res = await api.get("/messages/unread-count");
      setUnreadCount(res.data);
    } catch (err) {
      console.error(err);
    }
  };

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

  const handleLogout = () => {
    // Disconnect socket on logout
    if (stompClientRef.current) {
        stompClientRef.current.disconnect();
    }
    logout();
    navigate("/");
  };

  if (!token) return null;

  const imageUrl = profilePic
    ? `http://localhost:8080${profilePic}`
    : "/default-avatar.png";

  return (
    <nav
      className={`${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"
        } shadow-md border-b border-gray-200 sticky top-0 z-50 transition-colors duration-300`}
    >
      
      {/* --- 4. Notification Popup Toast --- */}
      {notification && (
        <div className="fixed top-20 right-5 bg-green-600 text-white px-6 py-4 rounded-xl shadow-2xl z-50 animate-bounce flex items-center space-x-3 border border-green-500">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <div>
            <h4 className="font-bold text-lg">New Notification</h4>
            <p className="text-sm font-medium">{notification}</p>
          </div>
          <button onClick={() => setNotification(null)} className="ml-4 hover:text-gray-200 font-bold text-xl">✕</button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Left side */}
          <div className="flex items-center space-x-8">
            <Link to={role === "admin" ? "/admin" : "/dashboard"} className="flex items-center space-x-2">
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
              {role !== "admin" && (
                <Link
                  to="/messages"
                  className={`relative px-4 py-2 rounded-lg font-medium transition duration-200 ${isDarkMode ? "text-white hover:bg-gray-800" : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                >
                  Messages
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              )}
              {role !== "admin" && (
  <Link
    to="/incoming-orders"
    className={`px-4 py-2 rounded-lg font-medium transition duration-200 ${
      isDarkMode
        ? "text-white hover:bg-gray-800"
        : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
    }`}
  >
    My Sales
    {/* Optional: Add a red dot if you want to notify them of new sales later */}
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
            {role !== "admin" && (
              <Link
                to="/messages"
                onClick={() => setIsMenuOpen(false)}
                className="block w-full text-left px-4 py-2 rounded-lg font-medium hover:bg-blue-50 hover:text-blue-600 transition duration-200"
              >
                Messages
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