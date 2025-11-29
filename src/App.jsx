import React, { useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Homepage from './Homepage';
import VideosContent from './Videos';
import ArticlesContent from './Articles';
import SelfHelpGuidesContent from './SelfHelpGuides';
import TherapistHomepage from './Components/TherapistHomepage';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './App.css'


function LoginSignup() {
  const containerRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();

  /* --------------------------
      SIGN UP (Student/Therapist)
  -------------------------- */
  const handleSignUp = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const role = formData.get("role");       // <-- NEW (student/therapist)

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      alert("User already exists. Please sign in.");
      setIsActive(false);
      return;
    }

    // Save new user
    users.push({ name, email, password, role });
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("user", JSON.stringify({ name, email, role }));

    alert("Signup successful! Please sign in.");
    setIsActive(false);
  };

  /* --------------------------
        SIGN IN (Detect Role)
  -------------------------- */
  const handleSignIn = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find((u) => u.email === email && u.password === password);

    if (!user) {
      alert("Invalid email or password");
      return;
    }

    // Save login session
    localStorage.setItem("user", JSON.stringify({ 
      name: user.name, 
      email: user.email,
      role: user.role
    }));

    alert(`Welcome back, ${user.name}!`);

    // Redirect based on role
    if (user.role === "therapist") {
      navigate("/therapist");
    } else {
      navigate("/homepage");
    }
  };

  return (
    <div id="main">
      <div ref={containerRef} className={`container ${isActive ? 'active' : ''}`} id="container">

        {/* ---------------------
              SIGN UP FORM
        ---------------------- */}
        <div className="form-container sign-up">
          <form onSubmit={handleSignUp}>
            <h1>Create Account</h1>

            <span>or use your email for registration</span>

            <input type="text" name="name" placeholder="Name" required />
            <input type="email" name="email" placeholder="Email" required />
            <input type="password" name="password" placeholder="Password" required />

            {/* NEW: Role selection */}
            <select name="role" required style={{ padding: "0.7rem", borderRadius: "8px", border: "1px solid #ccc" }}>
              <option value="student">Student</option>
              <option value="therapist">Therapist</option>
            </select>

            <button type="submit">Sign Up</button>
          </form>
        </div>

        {/* ---------------------
             SIGN IN FORM
        ---------------------- */}
        <div className="form-container sign-in">
          <form onSubmit={handleSignIn}>
            <h1>Sign In</h1>
            <div className="social-icons">
              <i className="fab fa-google"></i>
              <i className="fab fa-facebook" style={{ color: "#1877f2" }}></i>
            </div>
            <span>or use your email and password</span>

            <input type="email" name="email" placeholder="Email" required />
            <input type="password" name="password" placeholder="Password" required />

            <button type="submit">Sign In</button>
          </form>
        </div>

        {/* ---------------------
            TOGGLE PANELS
        ---------------------- */}
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
        <Route path="/" element={<LoginSignup />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/videos" element={<VideosContent />} />
        <Route path="/articles" element={<ArticlesContent />} />
        <Route path="/guides" element={<SelfHelpGuidesContent />} />
        <Route path="/therapist" element={<TherapistHomepage />} />
      </Routes>
    </Router>
  );
}

export default App;
