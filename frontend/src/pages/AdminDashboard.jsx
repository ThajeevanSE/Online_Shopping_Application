// AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import api from "../api/axios";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get token from localStorage
  const token = localStorage.getItem("token");

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/admin/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch users. Are you an admin?");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  // Delete user
  const handleDelete = async (userId) => {
  if (!window.confirm("Are you sure you want to delete this user?")) return;

  const token = localStorage.getItem("token");
  if (!token) {
    alert("No token found, please login as admin.");
    return;
  }

  try {
    const res = await api.delete(`/admin/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token.trim()}`,
      },
    });
    alert(res.data);
    console.log(token + " trimmed: " );
    setUsers(users.filter(u => Number(u.id) !== Number(userId)));
  } catch (err) {
    console.error(err);
    if (err.response?.status === 403) {
      alert("Access denied: Admin only");
    } else {
      alert("Failed to delete user.");
    }
  }
};


  if (loading) return <p>Loading users...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Dashboard</h1>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                <button onClick={() => handleDelete(u.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;
