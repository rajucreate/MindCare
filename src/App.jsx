import React, { useRef, useState } from 'react';
import { useNavigate, BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Homepage from './Homepage'; // Import your component

function LoginSignup() {
  const containerRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();

  // Sign Up
  const handleSignUp = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      alert("User already exists. Please sign in.");
      setIsActive(false);
      return;
    }

    users.push({ name, email, password });
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("user", JSON.stringify({ name, email }));
    alert("Signup successful!");
    setIsActive(false);
  };

  // Sign In
  const handleSignIn = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find((u) => u.email === email && u.password === password);

    if (user) {
      localStorage.setItem("user", JSON.stringify({ name: user.name, email: user.email }));
      alert(`Welcome back, ${user.name}!`);
      navigate("/homepage"); // <-- Navigate to the target route!
    } else {
      alert("Invalid email or password");
    }
  };

  return (
    <div id="main">
      <div ref={containerRef} className={`container ${isActive ? 'active' : ''}`} id="container">
        {/* ... Same as before: forms and toggle panels ... */}
        {/* Sign Up Form */}
        <div className="form-container sign-up">
          <form onSubmit={handleSignUp}>
            <h1>Create Account</h1>
            <div className="social-icons">
              <a href="#" className="icon"><i className="fab fa-google-plus-g"></i></a>
              <a href="#" className="icon"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="icon"><i className="fab fa-github"></i></a>
              <a href="#" className="icon"><i className="fab fa-linkedin-in"></i></a>
            </div>
            <span>or use your email for registration</span>
            <input type="text" name="name" placeholder="Name" required />
            <input type="email" name="email" placeholder="Email" required />
            <input type="password" name="password" placeholder="Password" required />
            <button type="submit">Sign Up</button>
          </form>
        </div>

        {/* Sign In Form */}
        <div className="form-container sign-in">
          <form onSubmit={handleSignIn}>
            <h1>Sign In</h1>
            <div className="social-icons">
              <a href="#" className="icon"><i className="fab fa-google-plus-g"></i></a>
              <a href="#" className="icon"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="icon"><i className="fab fa-github"></i></a>
              <a href="#" className="icon"><i className="fab fa-linkedin-in"></i></a>
            </div>
            <span>or use your email and password</span>
            <input type="email" name="email" placeholder="Email" required />
            <input type="password" name="password" placeholder="Password" required />
            <button type="submit">Sign In</button>
          </form>
        </div>
        {/* Toggle Panels */}
        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1>Welcome Back!</h1>
              <p>Enter your personal details to use all of our site’s features</p>
              <button className="hidden" onClick={() => setIsActive(false)}>Sign In</button>
            </div>
            <div className="toggle-panel toggle-right">
              <h1>Hello, Friend!</h1>
              <p>Register with your personal details to use all of our site’s features</p>
              <button className="hidden" onClick={() => setIsActive(true)}>Sign Up</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// App Component with Routing
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginSignup />} />
        <Route path="/homepage" element={<Homepage/>} />
      </Routes>
    </Router>
  );
}

export default App;
