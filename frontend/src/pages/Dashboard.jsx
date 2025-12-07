import { useEffect, useState } from "react";
import api from "../api/axios";
import { getToken } from "../services/authService";
import { useLocation } from "react-router-dom";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [showLogs, setShowLogs] = useState(false);
  const [logs, setLogs] = useState([]);

  const location = useLocation();
  const message = location.state?.message;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = getToken();
        const response = await api.get("/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user data", error);
      }
    };

    fetchUser();
  }, []);

  const toggleLogs = async () => {
    const newState = !showLogs;
    setShowLogs(newState);

    if (newState && logs.length === 0) {
      try {
        const token = getToken();
        const res = await api.get("/activity", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLogs(res.data);
      } catch (error) {
        console.error("Failed to load logs", error);
      }
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      {message && (
        <p style={{ color: "green" }}>
          {message}
        </p>
      )}

      <h2>Dashboard</h2>

      {user ? (
        <div>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>

          <br />

          {/* Toggle Button */}
          <button onClick={toggleLogs}>
            {showLogs ? "Hide Activity Logs" : "Show Activity Logs"}
          </button>

          {/* Logs Table */}
          {showLogs && (
            <div style={{ marginTop: "20px" }}>
              <h3>Activity Logs</h3>

              <table border="1" cellPadding="10" cellSpacing="0">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.length > 0 ? (
                    logs.map((log, index) => (
                      <tr key={index}>
                        <td>{new Date(log.createdAt).toLocaleDateString()}</td>
                        <td>{log.action}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2">No activity found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Dashboard;
