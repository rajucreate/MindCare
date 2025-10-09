import React, { Component } from "react";
import './homepage.css';

class Homepage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: "overview",
      user: null
    };
  }

  componentDidMount() {
    // Fetch the user object from localStorage on mount
    const userStr = localStorage.getItem("user");
    if (userStr) {
      this.setState({ user: JSON.parse(userStr) });
    }
  }

  handleTabClick = (tab) => {
    this.setState({ activeTab: tab });
  };

  render() {
    const { activeTab, user } = this.state;

    return (
      <div>
        <header>
          <div>
            <div className="brand">
              <span>♥</span> MindCare
            </div>
            <div className="greeting">
              {user ? (
                <>
                  Welcome back, {user.name} <br />
                  <span style={{ fontSize: "13px", fontWeight: "normal" }}>{user.email}</span>
                </>
              ) : (
                "Welcome back"
              )}
            </div>
          </div>
          <button className="emergency">Emergency Help</button>
        </header>

        <div className="dashboard">
          <div className="stats">
            <div className="card">
              <h2>12</h2>
              <p>Resources Read</p>
            </div>
            <div className="card">
              <h2>3</h2>
              <p>Sessions Booked</p>
            </div>
            <div className="card">
              <h2>8</h2>
              <p>Forum Posts</p>
            </div>
            <div className="card">
              <h2>45</h2>
              <p>Days Active</p>
            </div>
          </div>

          <div className="tabs">
            <div
              className={`tab ${activeTab === "overview" ? "active" : ""}`}
              data-tab="overview"
              onClick={() => this.handleTabClick("overview")}
            >
              Overview
            </div>
            <div
              className={`tab ${activeTab === "resources" ? "active" : ""}`}
              data-tab="resources"
              onClick={() => this.handleTabClick("resources")}
            >
              Resources
            </div>
            <div
              className={`tab ${activeTab === "therapy" ? "active" : ""}`}
              data-tab="therapy"
              onClick={() => this.handleTabClick("therapy")}
            >
              Therapy
            </div>
            <div
              className={`tab ${activeTab === "forums" ? "active" : ""}`}
              data-tab="forums"
              onClick={() => this.handleTabClick("forums")}
            >
              Forums
            </div>
            <div
              className={`tab ${activeTab === "support" ? "active" : ""}`}
              data-tab="support"
              onClick={() => this.handleTabClick("support")}
            >
              Support
            </div>
          </div>

          <div id="overview" className={`tab-content ${activeTab === "overview" ? "active" : ""}`}>
            <div className="section-grid">
              <div className="subcard">
                <h3>Upcoming Sessions</h3>
                <p>
                  <strong>Dr. Sarah Johnson</strong>
                  <br />
                  Individual Therapy
                  <br />
                  <em>Tomorrow · 2:00 PM</em>
                </p>
                <br />
                <p>
                  <strong>Group Therapy</strong>
                  <br />
                  Anxiety Support
                  <br />
                  <em>Friday · 4:00 PM</em>
                </p>
                <button>View All Sessions</button>
              </div>
              <div className="subcard">
                <h3>Recommended for You</h3>
                <p>
                  <strong>Managing Test Anxiety</strong>
                  <br />
                  5-minute guided meditation · <em>Video</em>
                </p>
                <br />
                <p>
                  <strong>Sleep Hygiene Tips</strong>
                  <br />
                  Evidence-based strategies · <em>Article</em>
                </p>
                <button>Browse All Resources</button>
              </div>
            </div>
            <div className="subcard" style={{ marginTop: "1rem" }}>
              <h3>Recent Forum Activity</h3>
              <p>
                <strong>Study Stress Support Group</strong>
                <br />
                “Tips for managing finals week stress” — 12 new replies
                <br />
                <em>2 hours ago</em>
              </p>
              <br />
              <p>
                <strong>Mindfulness & Meditation</strong>
                <br />
                “Daily meditation challenge – Week 3” — 8 new replies
                <br />
                <em>5 hours ago</em>
              </p>
              <button>Join Discussions</button>
            </div>
          </div>

          <div id="resources" className={`tab-content ${activeTab === "resources" ? "active" : ""}`}>
            <div className="section-grid">
              <div className="subcard">
                <h3>Videos</h3>
                <p>Guided meditations and educational content</p>
                <p>
                  <strong>Breathing Exercises</strong>
                  <br />
                  10 minutes
                </p>
                <p>
                  <strong>Progressive Muscle Relaxation</strong>
                  <br />
                  15 minutes
                </p>
                <button>View All Videos</button>
              </div>
              <div className="subcard">
                <h3>Articles</h3>
                <p>Research-backed mental health information</p>
                <p>
                  <strong>Understanding Anxiety</strong>
                  <br />
                  5 min read
                </p>
                <p>
                  <strong>Building Resilience</strong>
                  <br />
                  8 min read
                </p>
                <button>View All Articles</button>
              </div>
              <div className="subcard">
                <h3>Self-Help Guides</h3>
                <p>Step-by-step wellness strategies</p>
                <p>
                  <strong>Stress Management Toolkit</strong>
                  <br />
                  12 pages
                </p>
                <p>
                  <strong>Sleep Better Guide</strong>
                  <br />
                  8 pages
                </p>
                <button>View All Guides</button>
              </div>
            </div>
          </div>

          <div id="therapy" className={`tab-content ${activeTab === "therapy" ? "active" : ""}`}>
            <div className="coming-soon">Therapy content coming soon…</div>
          </div>

          <div id="forums" className={`tab-content ${activeTab === "forums" ? "active" : ""}`}>
            <div className="coming-soon">Forums content coming soon…</div>
          </div>

          <div id="support" className={`tab-content ${activeTab === "support" ? "active" : ""}`}>
            <div className="coming-soon">Support content coming soon…</div>
          </div>
        </div>
      </div>
    );
  }
}

export default Homepage;
