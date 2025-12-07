import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { saveToken } from "../services/authService";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); 

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      const { token, user } = res.data;

      // Save token and user info in localStorage
      saveToken(token);
      localStorage.setItem("user", JSON.stringify(user));

      // Redirect based on role
      if (user.role === "admin") {
        navigate("/admin"); // Admin dashboard page
      } else {
        navigate("/dashboard"); // Normal user dashboard
      }

    } catch (err) {
      alert("Login failed. Please check your email and password.");
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br /><br />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
