import React, { Component } from "react";
import './therapistHomepage.css';

class TherapistHomepage extends Component {
  constructor(props) {
    super(props);

    // initial data: try localStorage, otherwise seed with sample
    const clients = JSON.parse(localStorage.getItem("therapistClients")) || [
      { id: "c1", name: "Raju Kumar", email: "raju@example.com", lastSession: "2025-11-20", notes: [] },
      { id: "c2", name: "Asha Patel", email: "asha@example.com", lastSession: "2025-11-24", notes: [] }
    ];

    const appointments = JSON.parse(localStorage.getItem("therapistAppointments")) || [
      { id: "a1", clientId: "c1", clientName: "Raju Kumar", datetime: "2025-12-02T14:00:00", status: "pending" },
      { id: "a2", clientId: "c2", clientName: "Asha Patel", datetime: "2025-12-03T16:00:00", status: "confirmed" }
    ];

    this.state = {
      clients,
      appointments,
      searchQuery: "",
      selectedClient: null,
      noteText: "",
      availabilityOpen: JSON.parse(localStorage.getItem("therapistAvailability")) ?? true
    };
  }

  componentDidMount() {
    // ensure document dark mode follows parent prop
    if (this.props.darkMode) {
      document.body.classList.add("dark-mode");
    }

    const user = JSON.parse(localStorage.getItem("user"));
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const therapist = users.find(u => u.email === user.email);
    this.setState({
        availabilityOpen: therapist?.availability ?? false
    });
  }

  saveClientsToStorage = (clients) => {
    localStorage.setItem("therapistClients", JSON.stringify(clients));
  };

  saveAppointmentsToStorage = (appointments) => {
    localStorage.setItem("therapistAppointments", JSON.stringify(appointments));
  };

  handleSearch = (e) => {
    this.setState({ searchQuery: e.target.value });
  };

  selectClient = (client) => {
    this.setState({ selectedClient: client, noteText: "" });
  };

  addNote = () => {
    const { selectedClient, noteText, clients } = this.state;
    if (!selectedClient || !noteText.trim()) return;
    const updatedClients = clients.map(c => {
      if (c.id === selectedClient.id) {
        const newNote = { id: Date.now(), text: noteText.trim(), date: new Date().toISOString() };
        return { ...c, notes: [newNote, ...(c.notes || [])] };
      }
      return c;
    });
    this.setState({ clients: updatedClients, noteText: "" }, () => {
      this.saveClientsToStorage(this.state.clients);
      // refresh selected client object reference
      this.setState({ selectedClient: updatedClients.find(c => c.id === selectedClient.id) });
    });
  };

    toggleAvailability = () => {
        const newStatus = !this.state.availabilityOpen;

        this.setState({ availabilityOpen: newStatus });

        // Get all users
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const user = JSON.parse(localStorage.getItem("user"));

        // Update this therapist's availability
        const updated = users.map(u => {
            if (u.email === user.email) {
            return { ...u, availability: newStatus };
            }
            return u;
        });

        localStorage.setItem("users", JSON.stringify(updated));
    };

  handleAppointmentAction = (id, action) => {
    const appointments = this.state.appointments.map(a => {
      if (a.id === id) {
        if (action === "confirm") return { ...a, status: "confirmed" };
        if (action === "cancel") return { ...a, status: "cancelled" };
        if (action === "reschedule") return { ...a, status: "reschedule_requested" };
      }
      return a;
    });
    this.setState({ appointments }, () => this.saveAppointmentsToStorage(appointments));
  };

  handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";   // redirect to login page
  };


  render() {
    const { clients, appointments, searchQuery, selectedClient, noteText, availabilityOpen } = this.state;
    const filteredClients = clients.filter(c =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.email || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    const upcoming = appointments.filter(a => a.status === "pending" || a.status === "confirmed")
                                 .sort((a,b) => new Date(a.datetime) - new Date(b.datetime));

    return (
      <div className="therapist-portal">
        <header>
          <div>
            <div className="brand"><span>♥</span> MindCare - Therapist</div>
            <div className="greeting">
              Welcome, {this.props.user?.name}
              <br />
              <span style={{ fontSize: "13px", opacity: 0.9 }}>{this.props.user?.email}</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <div className="search-container">
              <input
                type="text"
                placeholder="Search clients by name or email..."
                value={this.state.searchQuery}
                onChange={this.handleSearch}
                className="search-input"
              />
            </div>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <button className={`availability-btn ${availabilityOpen ? "open" : "closed"}`} onClick={this.toggleAvailability}>
                {availabilityOpen ? "Accepting Sessions" : "Not Accepting"}
              </button>
            </div>
            <button className="logout-btn" onClick={this.handleLogout}>
                <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>
        </header>

        <div className="dashboard therapist-grid">
          <div className="left-col">
            <div className="card">
              <h3>Upcoming Appointments</h3>
              {upcoming.length === 0 ? <p>No upcoming appointments.</p> : (
                upcoming.slice(0, 6).map(a => (
                  <div key={a.id} className="appointment-item">
                    <div>
                      <strong>{a.clientName}</strong><br />
                      <small>{new Date(a.datetime).toLocaleString()}</small>
                      <div className="appt-status">Status: {a.status}</div>
                    </div>
                    <div className="appt-actions">
                      {a.status === "pending" && (
                        <>
                          <button onClick={() => this.handleAppointmentAction(a.id, "confirm")}>Confirm</button>
                          <button onClick={() => this.handleAppointmentAction(a.id, "reschedule")}>Reschedule</button>
                        </>
                      )}
                      {a.status === "confirmed" && <button onClick={() => this.handleAppointmentAction(a.id, "cancel")}>Cancel</button>}
                    </div>
                  </div>
                ))
              )}
              <button>View All Appointments</button>
            </div>

            <div className="card" style={{ marginTop: "1rem" }}>
              <h3>Clients ({clients.length})</h3>
              {filteredClients.length === 0 ? <p>No clients found.</p> : (
                <ul className="client-list">
                  {filteredClients.slice(0, 20).map(client => (
                    <li key={client.id} onClick={() => this.selectClient(client)} className={selectedClient?.id === client.id ? "selected" : ""}>
                      <div>
                        <strong>{client.name}</strong>
                        <div style={{ fontSize: "12px", opacity: 0.85 }}>{client.email}</div>
                      </div>
                      <div style={{ fontSize: "12px" }}>Last: {client.lastSession || "—"}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="right-col">
            <div className="card">
              <h3>Selected Client</h3>
              {!selectedClient ? (
                <p style={{ color: "var(--text-light)" }}>Select a client to see notes and session history.</p>
              ) : (
                <>
                  <div className="client-header">
                    <strong>{selectedClient.name}</strong>
                    <div style={{ fontSize: "13px", opacity: 0.8 }}>{selectedClient.email}</div>
                  </div>

                  <div className="notes-section">
                    <h4>Session Notes</h4>
                    <textarea
                      placeholder="Write a short note after a session..."
                      value={noteText}
                      onChange={(e) => this.setState({ noteText: e.target.value })}
                      rows={4}
                    />
                    <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem" }}>
                      <button onClick={this.addNote} disabled={!noteText.trim()}>Add Note</button>
                      <button onClick={() => this.setState({ noteText: "" })}>Clear</button>
                    </div>

                    <div style={{ marginTop: "1rem" }}>
                      <h5>Recent Notes</h5>
                      {(!selectedClient.notes || selectedClient.notes.length === 0) ? (
                        <p style={{ color: "var(--text-light)" }}>No notes yet.</p>
                      ) : (
                        <ul className="notes-list">
                          {selectedClient.notes.slice(0, 8).map(n => (
                            <li key={n.id}>
                              <div style={{ fontSize: "12px", opacity: 0.8 }}>{new Date(n.date).toLocaleString()}</div>
                              <div>{n.text}</div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="card" style={{ marginTop: "1rem" }}>
              <h3>Quick Actions</h3>
              <button onClick={() => alert("Open messaging (placeholder)")}>Message Selected Client</button>
              <button onClick={() => alert("Open session resources (placeholder)")}>Share Resource</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default TherapistHomepage;
