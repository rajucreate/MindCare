import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div id="Home">
      <div className="header">
        <h1>MindCare</h1>
        <p>Mental Health Support Platform for Students</p>
      </div>

      <div className="credentialCard">
        <h1>Welcome</h1>
        <p>Sign in to access your mental health resources and support</p>
        <div className="button-section">
          <button className="sign-in-btn">Sign In</button>
          <button className="sign-up-btn">Sign Up</button>
        </div>
        <div className="info-details">
          <div className="sign-in-form">
            <p>Email</p>
            <input type="text" placeholder="your.email@university" pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$" required />
            <p>Password</p>
            <input type="password" placeholder="password" required />
            <p>I am a</p>
            <select>
              <option value="student">Student</option>
              <option value="counselor">Administrator</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
