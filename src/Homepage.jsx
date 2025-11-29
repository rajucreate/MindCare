import React, { Component } from "react";
import TherapistHomepage from "./Components/TherapistHomepage";
import BookingModal from "./Components/BookingModal";
import './homepage.css';
import API from "./api";

class Homepage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: "overview",
      user: null,
      darkMode: false,
      moodEntries: JSON.parse(localStorage.getItem("moodEntries")) || [],
      currentMood: "",
      journalEntry: "",
      searchQuery: "",
      showProfile: false,
      therapists: [],
      showBookingModal: false,
      selectedTherapist: null,

      // New: student sessions
      sessions: [],
      sessionsLoading: false,
      actionLoadingId: null
    };
  }

  async componentDidMount() {
    // Load logged-in user
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      this.setState({ user });
    }

    // Load therapist list from backend
    try {
      const res = await API.get("/therapist/all");
      this.setState({ therapists: res.data });
    } catch (err) {
      console.error("Failed to fetch therapists:", err);
    }

    // If logged in student, load sessions
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user._id && user.role === "student") {
      this.loadStudentSessions(user._id);
    }

    // Load dark mode flag
    const darkMode = localStorage.getItem("darkMode") === "true";
    if (darkMode) {
      this.setState({ darkMode: true });
      document.body.classList.add("dark-mode");
    }
  }

  loadStudentSessions = async (studentId) => {
    this.setState({ sessionsLoading: true });
    try {
      const res = await API.get(`/sessions/student/${studentId}`);
      // sort sessions by date/time ascending
      const sorted = res.data.sort(
        (a, b) => new Date(a.date + " " + a.time) - new Date(b.date + " " + b.time)
      );
      this.setState({ sessions: sorted });
    } catch (err) {
      console.error("Failed to load student sessions:", err);
      // don't interrupt UI
    } finally {
      this.setState({ sessionsLoading: false });
    }
  };

  handleTabClick = (tab) => {
    this.setState({ activeTab: tab });
  };

  toggleDarkMode = () => {
    const newDarkMode = !this.state.darkMode;
    this.setState({ darkMode: newDarkMode });
    localStorage.setItem("darkMode", newDarkMode);
    if (newDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  };

  handleMoodSubmit = (e) => {
    e.preventDefault();
    if (this.state.currentMood && this.state.journalEntry) {
      const newEntry = {
        id: Date.now(),
        mood: this.state.currentMood,
        journal: this.state.journalEntry,
        date: new Date().toISOString()
      };
      const updatedEntries = [newEntry, ...this.state.moodEntries].slice(0, 30);
      this.setState({
        moodEntries: updatedEntries,
        currentMood: "",
        journalEntry: ""
      });
      localStorage.setItem("moodEntries", JSON.stringify(updatedEntries));
    }
  };

  handleSearch = (e) => {
    this.setState({ searchQuery: e.target.value });
  };

  navigateToVideos = () => { window.location.href = '/videos'; };
  navigateToArticles = () => { window.location.href = '/articles'; };
  navigateToGuides = () => { window.location.href = '/guides'; };

  openBookingModal = (therapist) => {
    this.setState({
      showBookingModal: true,
      selectedTherapist: therapist
    });
  };

  closeBookingModal = () => {
    this.setState({
      showBookingModal: false,
      selectedTherapist: null
    });
  };

  // ---------- NEW: session actions ----------
  updateSessionStatus = async (sessionId, status) => {
    if (!sessionId) return;
    if (!window.confirm(`Are you sure you want to ${status} this session?`)) return;

    this.setState({ actionLoadingId: sessionId });
    try {
      await API.post("/sessions/update-status", { sessionId, status });
      // Update local session list
      this.setState(prev => ({
        sessions: prev.sessions.map(s => s._id === sessionId ? { ...s, status } : s),
        actionLoadingId: null
      }));
      // Optionally show message
      if (status === "cancelled") alert("Session cancelled.");
      else if (status === "accepted") alert("Reschedule accepted / session confirmed.");
      else if (status === "completed") alert("Session marked completed.");
    } catch (err) {
      console.error("Failed to update session status:", err);
      alert("Failed to update session status.");
      this.setState({ actionLoadingId: null });
    }
  };

  // Student accepts a reschedule suggested by therapist
  acceptReschedule = async (sessionId) => {
    await this.updateSessionStatus(sessionId, "accepted");
  };

  // Student cancels a session
  cancelSession = async (sessionId) => {
    await this.updateSessionStatus(sessionId, "cancelled");
  };

  // Student "join" action (placeholder — replace with meeting URL logic)
  joinSession = (session) => {
    // If you later store a meetingUrl in session object use that here:
    if (session.meetingUrl) {
      window.open(session.meetingUrl, "_blank");
      return;
    }
    // Placeholder behavior:
    alert(`Joining session on ${session.date} at ${session.time} (placeholder).`);
  };

  renderSessionsSection() {
    const { sessions, sessionsLoading, actionLoadingId } = this.state;

    // Partition sessions
    const pending = sessions.filter(s => s.status === "pending");
    const accepted = sessions.filter(s => s.status === "accepted");
    const rescheduleReq = sessions.filter(s => s.status === "reschedule_requested");
    const cancelled = sessions.filter(s => s.status === "cancelled");
    const history = sessions.filter(s => s.status === "completed" || s.status === "rejected");

    return (
      <div className="section-grid">
        {/* Pending */}
        <div className="subcard">
          <h3>Pending Requests</h3>
          {sessionsLoading ? <p>Loading...</p> : (
            pending.length === 0 ? <p className="coming-soon">No pending session requests.</p> : (
              pending.map(s => (
                <div key={s._id} className="session-row">
                  <div>
                    <strong>{s.therapistId?.name || "Therapist"}</strong>
                    <div style={{ fontSize: "13px", color: "var(--text-light)" }}>{s.date} · {s.time}</div>
                    <div style={{ fontSize: "13px", color: "var(--text-light)" }}>{s.therapistId?.email}</div>
                    {s.reason && <div style={{ marginTop: "6px", fontStyle: "italic" }}>“{s.reason}”</div>}
                  </div>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <button className="btn small" onClick={() => this.joinSession(s)} disabled>Join</button>
                    <button className="btn warn" onClick={() => this.cancelSession(s._id)} disabled={actionLoadingId === s._id}>{actionLoadingId === s._id ? "..." : "Cancel"}</button>
                  </div>
                </div>
              ))
            )
          )}
        </div>

        {/* Upcoming */}
        <div className="subcard">
          <h3>Upcoming Sessions</h3>
          {accepted.length === 0 ? <p className="coming-soon">No upcoming sessions.</p> : (
            accepted.map(s => (
              <div key={s._id} className="session-row">
                <div>
                  <strong>{s.therapistId?.name}</strong>
                  <div style={{ fontSize: "13px", color: "var(--text-light)" }}>{s.date} · {s.time}</div>
                  <div style={{ fontSize: "13px", color: "var(--text-light)" }}>{s.therapistId?.email}</div>
                </div>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <button className="btn" onClick={() => this.joinSession(s)}>Join</button>
                  <button className="btn warn" onClick={() => this.cancelSession(s._id)} disabled={actionLoadingId === s._id}>{actionLoadingId === s._id ? "..." : "Cancel"}</button>
                </div>
              </div>
            ))
          )}

          {/* Reschedule requests */}
          {rescheduleReq.length > 0 && (
            <>
              <h4 style={{ marginTop: "12px" }}>Reschedule Suggestions</h4>
              {rescheduleReq.map(s => (
                <div key={s._id} className="session-row">
                  <div>
                    <strong>{s.therapistId?.name}</strong>
                    <div style={{ fontSize: "13px", color: "var(--text-light)" }}>{s.date} · {s.time}</div>
                    <div style={{ fontSize: "13px", color: "var(--text-light)" }}>{s.therapistId?.email}</div>
                    {s.therapistNote && <div style={{ marginTop: "6px", fontStyle: "italic" }}>Note: {s.therapistNote}</div>}
                  </div>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <button className="btn" onClick={() => this.acceptReschedule(s._id)} disabled={actionLoadingId === s._id}>{actionLoadingId === s._id ? "..." : "Accept"}</button>
                    <button className="btn reject" onClick={() => this.cancelSession(s._id)} disabled={actionLoadingId === s._id}>Decline</button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* History */}
        <div className="subcard" style={{ marginTop: "1rem" }}>
          <h3>Session History</h3>
          {history.length === 0 ? <p className="coming-soon">No session history yet.</p> : history.map(s => (
            <div key={s._id} className="session-row">
              <div>
                <strong>{s.therapistId?.name}</strong>
                <div style={{ fontSize: "13px", color: "var(--text-light)" }}>{s.date} · {s.time}</div>
                <div style={{ fontSize: "13px", color: "var(--text-light)" }}>{s.therapistId?.email}</div>
                <div style={{ marginTop: "6px", fontSize: "13px", color: "var(--text-light)" }}>Status: {s.status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  render() {
    const { activeTab, user } = this.state;

    if (user && user.role === "therapist") {
      return <TherapistHomepage user={user} darkMode={this.state.darkMode} />;
    }

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
                  <span style={{ fontSize: "13px", fontWeight: "normal", opacity: 0.9 }}>{user.email}</span>
                </>
              ) : (
                "Welcome back"
              )}
            </div>
          </div>

          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <div className="search-container">
              <i className="fas fa-search" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", opacity: 0.6 }}></i>
              <input
                type="text"
                placeholder="Search resources, forums..."
                value={this.state.searchQuery}
                onChange={this.handleSearch}
                className="search-input"
              />
            </div>

            <button
              className="dark-mode-toggle"
              onClick={this.toggleDarkMode}
              title={this.state.darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              <i className={this.state.darkMode ? "fas fa-sun" : "fas fa-moon"}></i>
            </button>

            <button className="emergency">Emergency Help</button>
          </div>

          <button
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              window.location.href = "/";
            }}
          >
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
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
            <div className={`tab ${activeTab === "overview" ? "active" : ""}`} onClick={() => this.handleTabClick("overview")}>
              <i className="fas fa-home"></i> Overview
            </div>
            <div className={`tab ${activeTab === "my-sessions" ? "active" : ""}`} onClick={() => this.handleTabClick("my-sessions")}>
              <i className="fas fa-calendar-alt"></i> My Sessions
            </div>
            <div className={`tab ${activeTab === "mood" ? "active" : ""}`} onClick={() => this.handleTabClick("mood")}>
              <i className="fas fa-smile"></i> Mood Tracker
            </div>
            <div className={`tab ${activeTab === "resources" ? "active" : ""}`} onClick={() => this.handleTabClick("resources")}>
              <i className="fas fa-book"></i> Resources
            </div>
            <div className={`tab ${activeTab === "therapy" ? "active" : ""}`} onClick={() => this.handleTabClick("therapy")}>
              <i className="fas fa-user-md"></i> Therapy
            </div>
            <div className={`tab ${activeTab === "forums" ? "active" : ""}`} onClick={() => this.handleTabClick("forums")}>
              <i className="fas fa-comments"></i> Forums
            </div>
            <div className={`tab ${activeTab === "support" ? "active" : ""}`} onClick={() => this.handleTabClick("support")}>
              <i className="fas fa-life-ring"></i> Support
            </div>
          </div>

          {/* Overview */}
          <div id="overview" className={`tab-content ${activeTab === "overview" ? "active" : ""}`}>
            <div className="section-grid">
              <div className="subcard">
                <h3><i className="fas fa-calendar-check"></i> Upcoming Sessions</h3>
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
                <h3><i className="fas fa-star"></i> Recommended for You</h3>
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
              <div className="subcard progress-card">
                <h3><i className="fas fa-chart-line"></i> Your Progress</h3>
                <div className="progress-stats">
                  <div className="progress-item">
                    <span>Weekly Streak</span>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: "75%" }}></div>
                    </div>
                    <span className="progress-value">5/7 days</span>
                  </div>
                  <div className="progress-item">
                    <span>Mood Average</span>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: "68%", background: "linear-gradient(135deg, #48bb78 0%, #38a169 100%)" }}></div>
                    </div>
                    <span className="progress-value">4.1/5</span>
                  </div>
                </div>
                <button>View Detailed Stats</button>
              </div>
            </div>

            <div className="subcard" style={{ marginTop: "1rem" }}>
              <h3><i className="fas fa-comments"></i> Recent Forum Activity</h3>
              <p>
                <strong>Study Stress Support Group</strong>
                <br />
                "Tips for managing finals week stress" — 12 new replies
                <br />
                <em>2 hours ago</em>
              </p>
              <br />
              <p>
                <strong>Mindfulness & Meditation</strong>
                <br />
                "Daily meditation challenge – Week 3" — 8 new replies
                <br />
                <em>5 hours ago</em>
              </p>
              <button>Join Discussions</button>
            </div>
          </div>

          {/* My Sessions - NEW */}
          <div id="my-sessions" className={`tab-content ${activeTab === "my-sessions" ? "active" : ""}`}>
            {this.renderSessionsSection()}
          </div>

          {/* Mood Tracker */}
          <div id="mood" className={`tab-content ${activeTab === "mood" ? "active" : ""}`}>
            <div className="section-grid">
              <div className="subcard mood-tracker-card">
                <h3><i className="fas fa-smile"></i> Track Your Mood</h3>
                <form onSubmit={this.handleMoodSubmit}>
                  <div className="mood-selector">
                    <label>How are you feeling today?</label>
                    <div className="mood-options">
                      {["😢", "😕", "😐", "🙂", "😄"].map((emoji, index) => (
                        <button
                          key={index}
                          type="button"
                          className={`mood-btn ${this.state.currentMood === emoji ? "active" : ""}`}
                          onClick={() => this.setState({ currentMood: emoji })}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="journal-input">
                    <label>Journal Entry (optional)</label>
                    <textarea
                      placeholder="How was your day? What are you grateful for?"
                      value={this.state.journalEntry}
                      onChange={(e) => this.setState({ journalEntry: e.target.value })}
                      rows="4"
                    ></textarea>
                  </div>
                  <button type="submit" disabled={!this.state.currentMood}>
                    Save Entry
                  </button>
                </form>
              </div>

              <div className="subcard mood-history-card">
                <h3><i className="fas fa-history"></i> Recent Entries</h3>
                {this.state.moodEntries.length === 0 ? (
                  <p style={{ color: "var(--text-light)", textAlign: "center", padding: "2rem" }}>
                    No entries yet. Start tracking your mood!
                  </p>
                ) : (
                  <div className="mood-entries">
                    {this.state.moodEntries.slice(0, 5).map((entry) => (
                      <div key={entry.id} className="mood-entry">
                        <div className="mood-entry-header">
                          <span className="mood-emoji">{entry.mood}</span>
                          <span className="mood-date">
                            {new Date(entry.date).toLocaleDateString()}
                          </span>
                        </div>
                        {entry.journal && (
                          <p className="mood-journal">{entry.journal}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {this.state.moodEntries.length > 5 && (
                  <button>View All Entries</button>
                )}
              </div>
            </div>
          </div>

          {/* Resources */}
          <div id="resources" className={`tab-content ${activeTab === "resources" ? "active" : ""}`}>
            <div className="section-grid">
              <div className="subcard">
                <h3><i className="fas fa-video"></i> Videos</h3>
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
                <button onClick={this.navigateToVideos}>
                  <i className="fas fa-play-circle"></i> View All Videos
                </button>
              </div>
              <div className="subcard">
                <h3><i className="fas fa-newspaper"></i> Articles</h3>
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
                <button onClick={this.navigateToArticles}>
                  <i className="fas fa-book-reader"></i> View All Articles
                </button>
              </div>
              <div className="subcard">
                <h3><i className="fas fa-book-open"></i> Self-Help Guides</h3>
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
                <button onClick={this.navigateToGuides}>
                  <i className="fas fa-download"></i> View All Guides
                </button>
              </div>
            </div>
          </div>

          {/* Therapy */}
          <div id="therapy" className={`tab-content ${activeTab === "therapy" ? "active" : ""}`}>
            <div className="section-grid">
              <div className="subcard therapy-card">
                <h3>Your Therapists</h3>

                {this.state.therapists.map((t, i) => (
                  <div key={i} className="therapist-item">
                    <strong>{t.name}</strong>
                    <br />
                    <span style={{ opacity: 0.8, fontSize: "13px" }}>{t.email}</span>
                    <br />

                    {/* Availability Badge */}
                    <span
                      className={`availability-badge ${t.availability ? "open" : "closed"}`}
                    >
                      {t.availability ? "🟢 Available" : "🔴 Not Available"}
                    </span>

                    {/* Book Session Button */}
                    <button className="book-session-btn" onClick={() => this.openBookingModal(t)}>
                      <i className="fas fa-calendar-plus"></i> Book Session
                    </button>
                  </div>
                ))}
              </div>

              <div className="subcard therapy-card">
                <h3>Upcoming Sessions</h3>
                <p><strong>Tomorrow</strong> — 2:00 PM<br/>Session with Dr. Sarah Johnson</p>
                <p><strong>Friday</strong> — 4:00 PM<br/>Group Therapy: Anxiety Support</p>
              </div>
            </div>
          </div>

          {/* Forums */}
          <div id="forums" className={`tab-content ${activeTab === "forums" ? "active" : ""}`}>
            <div className="section-grid">
              <div className="subcard forum-card">
                <h3>Popular Discussions</h3>
                <p><strong>Dealing with Exam Stress</strong><br/>42 replies · Active 1h ago</p>
                <p><strong>Balancing Studies & Social Life</strong><br/>18 replies · Active 3h ago</p>
                <button>Join Discussion</button>
              </div>
              <div className="subcard forum-card">
                <h3>Recent Activity</h3>
                <p><strong>Mindfulness & Meditation</strong><br/>8 new replies · 2h ago</p>
                <p><strong>Sleep & Routine</strong><br/>5 new replies · 5h ago</p>
                <button>Start New Discussion</button>
              </div>
            </div>
          </div>

          {/* Support */}
          <div id="support" className={`tab-content ${activeTab === "support" ? "active" : ""}`}>
            <div className="crisis-card">
              <h2>Need Help Now?</h2>
              <p>You are not alone. If you or someone you know is in crisis, call or chat with 988 for immediate help.</p>
              <button className="crisis-btn pulse">Call 988</button>
              <button className="crisis-btn">Chat Now</button>
            </div>
          </div>

          {this.state.showBookingModal && (
            <BookingModal
              therapist={this.state.selectedTherapist}
              studentId={this.state.user?._id}
              onClose={this.closeBookingModal}
              onSuccess={() => {
                // reload sessions when a new booking is created
                const user = JSON.parse(localStorage.getItem("user"));
                if (user && user._id) this.loadStudentSessions(user._id);
                alert("Session request sent!");
              }}
            />
          )}

        </div>
      </div>
    );
  }
}

export default Homepage;
