import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post(`/auth/reset-password/${token}`, { password });
      alert("Password reset successfully!");
      navigate("/");
    } catch (err) {
      alert("Invalid or expired link");
    }
  };

  return (
    <div className="reset-container">
      <h2>Set New Password</h2>

      <form onSubmit={handleSubmit}>
        <input 
          type="password"
          placeholder="New password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
}

export default ResetPassword;
