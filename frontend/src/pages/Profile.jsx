import { useEffect, useState } from "react";
import api from "../api/axios";
import { getToken } from "../services/authService";

function Profile() {
  const [user, setUser] = useState({
    name: "",
    dateOfBirth: ""
  });
  const [file, setFile] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = getToken();
        const res = await api.get("/user/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser({
          name: res.data.name || "",
          dateOfBirth: res.data.dateOfBirth || ""
        });
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (e) => {
    setUser({ 
      ...user, 
      [e.target.name]: e.target.value 
    });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", user.name);
    formData.append("dateOfBirth", user.dateOfBirth);

    if (file) {
      formData.append("profilePicture", file);
    }

    try {
      const token = getToken();
      await api.put("/user/update", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Profile updated successfully ✅");
    } catch (err) {
      alert("Update failed ❌");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Edit Profile</h2>

      <form onSubmit={handleUpdate}>
        <div>
          <label>Name</label><br />
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={handleChange}
          />
        </div>

        <br />

        <div>
          <label>Date of Birth</label><br />
          <input
            type="date"
            name="dateOfBirth"
            value={user.dateOfBirth}
            onChange={handleChange}
          />
        </div>

        <br />

        <div>
          <label>Profile Picture</label><br />
          <input
            type="file"
            onChange={handleFileChange}
          />
        </div>

        <br />

        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
}

export default Profile;
