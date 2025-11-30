import React, { useRef, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import API from "./api";
import ReCAPTCHA from "react-google-recaptcha";

import Homepage from "./Homepage";
import VideosContent from "./Videos";
import ArticlesContent from "./Articles";
import SelfHelpGuidesContent from "./SelfHelpGuides";
import TherapistHomepage from "./Components/TherapistHomepage";
import TherapistAvailability from "./Components/TherapistAvailability";
import ForgotPassword from "./Components/ForgotPassword";
import ResetPassword from "./Components/ResetPassword";

const SITE_KEY = "6Ld-VBwsAAAAADMe2ddP_kD4YBbZhwO6tKkOa3vC"; // <-- paste your site key

function LoginSignup() {
  const containerRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const navigate = useNavigate();

  // SIGN UP
  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!captchaToken) {
      alert("Please complete the captcha!");
      return;
    }

    const formData = new FormData(e.target);
    const name = formData.get("name");
    const email = formData.get("email");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return alert("Invalid email format.");

    const allowedDomains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "icloud.com"];
    const domain = email.split("@")[1];
    if (!allowedDomains.includes(domain))
      return alert("Email must be Gmail, Yahoo, Outlook etc.");

    const password = formData.get("password");
    const role = formData.get("role");

    try {
      await API.post("/auth/signup", { name, email, password, role, captchaToken });

      alert("Signup successful!");
      setIsActive(false);
    } catch (err) {
      alert(err.response?.data?.msg || "Signup failed");
    }
  };

  // SIGN IN
  const handleSignIn = async (e) => {
    e.preventDefault();

    if (!captchaToken) {
      alert("Please complete the captcha!");
      return;
    }

    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const res = await API.post("/auth/login", { email, password, captchaToken });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert(`Welcome back, ${res.data.user.name}!`);
      navigate(res.data.user.role === "therapist" ? "/therapist" : "/homepage");

    } catch (err) {
      alert(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div id="main">
      <div ref={containerRef} className={`container ${isActive ? "active" : ""}`}>

        {/* SIGN UP */}
        <div className="form-container sign-up">
          <form onSubmit={handleSignUp}>
            <h1>Create Account</h1>

            <input type="text" name="name" placeholder="Name" required />
            <input type="email" name="email" placeholder="Email" required />
            <input type="password" name="password" placeholder="Password" required />

            <select name="role" required>
              <option value="student">Student</option>
              <option value="therapist">Therapist</option>
            </select>

            {/* CAPTCHA */}
            <ReCAPTCHA sitekey={SITE_KEY} onChange={(token) => setCaptchaToken(token)} />

            <button type="submit">Sign Up</button>
          </form>
        </div>

        {/* SIGN IN */}
        <div className="form-container sign-in">
          <form onSubmit={handleSignIn}>
            <h1>Sign In</h1>

            <input type="email" name="email" placeholder="Email" required />
            <input type="password" name="password" placeholder="Password" required />

            {/* CAPTCHA */}
            <ReCAPTCHA sitekey={SITE_KEY} onChange={(token) => setCaptchaToken(token)} />

            <button type="submit">Sign In</button>

            <p 
              className="forgot-link"
              onClick={() => navigate("/forgot-password")}
              style={{ cursor: "pointer", marginTop: "10px" }}
            >
              Forgot Password?
            </p>
          </form>
        </div>

        {/* TOGGLE PANELS */}
        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1>Welcome Back!</h1>
              <button className="hidden" onClick={() => setIsActive(false)}>Sign In</button>
            </div>

            <div className="toggle-panel toggle-right">
              <h1>Hello!</h1>
              <button className="hidden" onClick={() => setIsActive(true)}>Sign Up</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginSignup />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/videos" element={<VideosContent />} />
        <Route path="/articles" element={<ArticlesContent />} />
        <Route path="/self-help-guides" element={<SelfHelpGuidesContent />} />
        <Route path="/therapist" element={<TherapistHomepage />} />
        <Route path="/therapist/availability" element={<TherapistAvailability />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
} 

export default App;