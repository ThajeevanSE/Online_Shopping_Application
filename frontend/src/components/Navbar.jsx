import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout, getToken } from "../services/authService";
import api from "../api/axios";

function Navbar() {
  const [userName, setUserName] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
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
        } catch (error) {
          console.error("Failed to fetch user data", error);
        }
      };

      fetchUser();
    } else {
      setUserName("");
      setProfilePic("");
    }
  }, [token]);

  // If no token, hide navbar
  if (!token) return null;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle("dark-mode", !isDarkMode);
  };

  // Generate image URL
  const imageUrl = profilePic
    ? `http://localhost:8080${profilePic}`
    : "/default-avatar.png"; 

  return (
    <nav
      style={{
        padding: "15px",
        borderBottom: "1px solid #ccc",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* Left side links */}
      <div>
        <Link to="/dashboard">Dashboard</Link> |{" "}
        <Link to="/profile">Profile</Link>
      </div>

      {/* Right side user info */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span>{userName ? `Hello, ${userName}` : "Hello"}</span>

        {/* Profile Picture */}
        <img
  src={imageUrl}
  alt="Profile"
  onError={(e) => { e.target.src = "/default-avatar.png"; }}
  style={{
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid #333",
  }}
/>


        <button onClick={toggleDarkMode}>
          {isDarkMode ? "Light Mode" : "Dark Mode"}
        </button>

        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;
