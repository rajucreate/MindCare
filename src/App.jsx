import React, { useRef, useState } from 'react';
import { useNavigate, BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import API from "./api";

import Homepage from './Homepage';
import VideosContent from './Videos';
import ArticlesContent from './Articles';
import SelfHelpGuidesContent from './SelfHelpGuides';
import TherapistHomepage from './Components/TherapistHomepage';

function LoginSignup() {
  const containerRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();

  /* --------------------------
      SIGN UP (Student/Therapist)
  -------------------------- */
  const handleSignUp = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const role = formData.get("role");

    try {
      await API.post("/auth/signup", { name, email, password, role });

      alert("Signup successful! Please sign in.");
      setIsActive(false);
    } catch (err) {
      alert(err.response?.data?.msg || "Signup failed");
    }
  };

  /* --------------------------
        SIGN IN (Detect Role)
  -------------------------- */
  const handleSignIn = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const res = await API.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert(`Welcome back, ${res.data.user.name}!`);

      if (res.data.user.role === "therapist") {
        navigate("/therapist");
      } else {
        navigate("/homepage");
      }
    } catch (err) {
      alert(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div id="main">
      <div ref={containerRef} className={`container ${isActive ? 'active' : ''}`}>

        {/* SIGN UP */}
        <div className="form-container sign-up">
          <form onSubmit={handleSignUp}>
            <h1>Create Account</h1>

            <span>or use your email for registration</span>

            <input type="text" name="name" placeholder="Name" required />
            <input type="email" name="email" placeholder="Email" required />
            <input type="password" name="password" placeholder="Password" required />

            {/* ROLE DROPDOWN */}
            <select name="role" required>
              <option value="student">Student</option>
              <option value="therapist">Therapist</option>
            </select>

            <button type="submit">Sign Up</button>
          </form>
        </div>

        {/* SIGN IN */}
        <div className="form-container sign-in">
          <form onSubmit={handleSignIn}>
            <h1>Sign In</h1>
            <span>or use your email and password</span>

            <input type="email" name="email" placeholder="Email" required />
            <input type="password" name="password" placeholder="Password" required />

            <button type="submit">Sign In</button>
          </form>
        </div>

        {/* TOGGLE PANELS */}
        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1>Welcome Back!</h1>
              <p>Enter your credentials to access your dashboard</p>
              <button className="hidden" onClick={() => setIsActive(false)}>Sign In</button>
            </div>

            <div className="toggle-panel toggle-right">
              <h1>Hello!</h1>
              <p>Create your account to get started</p>
              <button className="hidden" onClick={() => setIsActive(true)}>Sign Up</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

/* --------------------------
      ROUTING SETUP
-------------------------- */
function App() {
  return (
    <Router>
      <Routes>

        {/* DEFAULT ROUTE: LOGIN PAGE */}
        <Route path="/" element={<LoginSignup />} />

        {/* Student Dashboard */}
        <Route path="/homepage" element={<Homepage />} />

        {/* Extra Pages */}
        <Route path="/videos" element={<VideosContent />} />
        <Route path="/articles" element={<ArticlesContent />} />
        <Route path="/guides" element={<SelfHelpGuidesContent />} />

        {/* Therapist Dashboard */}
        <Route path="/therapist" element={<TherapistHomepage />} />

      </Routes>
    </Router>
  );
}

export default App;
