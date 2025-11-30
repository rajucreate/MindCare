import React, { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import "./therapistHomepage.css";

export default function TherapistHomepage({ user, darkMode }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noteMap, setNoteMap] = useState({}); // optional therapist notes per session
  const [actionLoading, setActionLoading] = useState(null); // sessionId being updated
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user._id) {
      setLoading(false);
      return;
    }
    fetchSessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/sessions/therapist/${user._id}`);
      // sort by start time (if date/time strings present). Keep as returned otherwise.
      const sorted = res.data.sort((a, b) => new Date(a.date + " " + a.time) - new Date(b.date + " " + b.time));
      setSessions(sorted);
    } catch (err) {
      console.error("Failed to load sessions", err);
      alert("Failed to load sessions");
    } finally {
      setLoading(false);
    }
  };

  const grouped = {
    pending: sessions.filter(s => s.status === "pending"),
    accepted: sessions.filter(s => s.status === "accepted"),
    rejected: sessions.filter(s => s.status === "rejected"),
    completed: sessions.filter(s => s.status === "completed" || s.status === "finished")
  };

  const handleUpdateStatus = async (sessionId, status) => {
    if (!window.confirm(`Confirm ${status} for this session?`)) return;
    setActionLoading(sessionId);
    try {
      const body = { sessionId, status, therapistNote: noteMap[sessionId] || "" };
      await API.post("/sessions/update-status", body);
      // update locally
      setSessions(prev => prev.map(s => s._id === sessionId ? { ...s, status } : s));
    } catch (err) {
      console.error("Failed to update status:", err);
      alert(err.response?.data?.msg || "Failed to update status");
    } finally {
      setActionLoading(null);
    }
  };

  const handleNoteChange = (sessionId, value) => {
    setNoteMap(prev => ({ ...prev, [sessionId]: value }));
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div className={`therapist-root ${darkMode ? "dark" : ""}`}>
      <header className="therapist-header">
        <div>
          <div className="brand"><span>♥</span> MindCare — Therapist</div>
          <div className="sub">Welcome back, <strong>{user?.name}</strong></div>
        </div>
        <button 
          onClick={() => navigate("/therapist/availability")} 
          className="btn-availability"
        >
          <i className="fas fa-calendar-alt"></i> Manage Availability
        </button>
        <div className="header-actions">
          <button className="btn ghost" onClick={fetchSessions} title="Refresh">⟳ Refresh</button>
          <button className="btn danger" onClick={logout}><i className="fas fa-sign-out-alt"></i> Logout</button>
        </div>
      </header>

      <div className="therapist-container">
        <aside className="left-panel">
          <div className="card stat">
            <h4>Pending</h4>
            <div className="big">{grouped.pending.length}</div>
          </div>
          <div className="card stat">
            <h4>Upcoming</h4>
            <div className="big">{grouped.accepted.length}</div>
          </div>
          <div className="card stat">
            <h4>History</h4>
            <div className="big">{grouped.completed.length + grouped.rejected.length}</div>
          </div>
        </aside>

        <main className="main-panel">
          <section className="section">
            <div className="section-header">
              <h3>Pending Requests</h3>
              <span className="hint">New requests that need your action</span>
            </div>

            {loading ? <p className="loading">Loading...</p> : (
              grouped.pending.length === 0 ? (
                <div className="empty">No pending requests</div>
              ) : (
                grouped.pending.map(session => (
                  <div className="session-card pending" key={session._id}>
                    <div className="session-left">
                      <div className="student-name">{session.studentId?.name || "Student"}</div>
                      <div className="session-meta">{session.date} · {session.time} · {session.mode || "—"}</div>
                      <div className="student-email">{session.studentId?.email}</div>
                      {session.reason && <div className="reason">“{session.reason}”</div>}
                    </div>

                    <div className="session-right">
                      <textarea
                        placeholder="Add a note (optional)"
                        value={noteMap[session._id] || ""}
                        onChange={(e) => handleNoteChange(session._id, e.target.value)}
                        className="note-input"
                      />

                      <div className="actions">
                        <button
                          className="btn accept"
                          onClick={() => handleUpdateStatus(session._id, "accepted")}
                          disabled={actionLoading === session._id}
                        >
                          {actionLoading === session._id ? "..." : "Accept"}
                        </button>

                        <button
                          className="btn warn"
                          onClick={() => handleUpdateStatus(session._id, "reschedule_requested")}
                          disabled={actionLoading === session._id}
                          title="Suggest reschedule (mark as reschedule_requested)"
                        >
                          Suggest New Time
                        </button>

                        <button
                          className="btn reject"
                          onClick={() => handleUpdateStatus(session._id, "rejected")}
                          disabled={actionLoading === session._id}
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )
            )}
          </section>

          <section className="section">
            <div className="section-header">
              <h3>Upcoming Sessions</h3>
              <span className="hint">Confirmed sessions</span>
            </div>

            {grouped.accepted.length === 0 ? (
              <div className="empty">No upcoming sessions</div>
            ) : grouped.accepted.map(session => (
              <div className="session-card accepted" key={session._id}>
                <div className="session-left">
                  <div className="student-name">{session.studentId?.name}</div>
                  <div className="session-meta">{session.date} · {session.time} · {session.mode || "—"}</div>
                  <div className="student-email">{session.studentId?.email}</div>
                </div>

                <div className="session-right">
                  <div className="status-badge green">Accepted</div>
                  <div className="small-actions">
                    <button className="btn small" onClick={() => handleUpdateStatus(session._id, "completed")}>Mark Completed</button>
                  </div>
                </div>
              </div>
            ))}
          </section>

          <section className="section">
            <div className="section-header">
              <h3>Session History</h3>
              <span className="hint">Past and resolved sessions</span>
            </div>

            { (grouped.completed.length + grouped.rejected.length) === 0 ? (
              <div className="empty">No history yet</div>
            ) : (
              [...grouped.completed, ...grouped.rejected].map(session => (
                <div className={`session-card history ${session.status}`} key={session._id}>
                  <div className="session-left">
                    <div className="student-name">{session.studentId?.name}</div>
                    <div className="session-meta">{session.date} · {session.time}</div>
                    <div className="student-email">{session.studentId?.email}</div>
                    {session.therapistNote && <div className="reason">Note: {session.therapistNote}</div>}
                  </div>
                  <div className="session-right">
                    <div className={`status-badge ${session.status === "completed" ? "blue" : "red"}`}>
                      {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
