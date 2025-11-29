import React, { useState } from "react";
import API from "../api";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/forgot-password", { email });
      alert("Password reset link sent to your email");
    } catch (err) {
      alert("Email not found");
    }
  };

  return (
    <div className="reset-container">
      <h2>Forgot Password</h2>

      <form onSubmit={handleSubmit}>
        <input 
          type="email"
          placeholder="Enter your email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />

        <button type="submit">Send Reset Link</button>
      </form>
    </div>
  );
}

export default ForgotPassword;
