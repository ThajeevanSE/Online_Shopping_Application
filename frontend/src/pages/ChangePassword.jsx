import { useState } from "react";
import api from "../api/axios";
import { getToken } from "../services/authService";
import { useNavigate } from "react-router-dom";

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const handleChangePassword = async (e) => {
    e.preventDefault();

    try {
      const token = getToken();

      await api.put(
        "/user/change-password",
        {
          oldPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Password updated successfully ✅");

      // optional redirect
      navigate("/dashboard", {
        state: { message: "Password changed successfully ✅" },
      });
    } catch (err) {
      alert("Change password failed ❌");
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Change Password</h2>

      <form onSubmit={handleChangePassword}>
        <div>
          <label>Old Password</label><br />
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </div>

        <br />

        <div>
          <label>New Password</label><br />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>

        <br />

        <button type="submit">Update Password</button>
      </form>
    </div>
  );
}

export default ChangePassword;
