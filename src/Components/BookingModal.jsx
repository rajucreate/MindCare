import React, { useState } from "react";
import API from "../api";
import "./BookingModal.css";

function BookingModal({ therapist, studentId, onClose, onSuccess }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [mode, setMode] = useState("video");
  const [reason, setReason] = useState("");

  const handleBooking = async () => {
    if (!date || !time || !reason) {
      alert("Please fill all details");
      return;
    }

    try {
      const res = await API.post("/sessions/book", {
        studentId,
        therapistId: therapist._id,
        date,
        time,
        mode,
        reason
      });

      alert("Session request sent!");
      onSuccess();
      onClose();
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to book session");
    }
  };

  return (
    <div className="booking-modal-bg">
      <div className="booking-modal">
        <h2>Book Session with {therapist.name}</h2>

        <label>Date</label>
        <input 
          type="date" 
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <label>Time</label>
        <input 
          type="time" 
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />

        <label>Mode</label>
        <select value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="video">Video Call</option>
          <option value="chat">Live Chat</option>
          <option value="in_person">In Person</option>
        </select>

        <label>Reason for Appointment</label>
        <textarea
          placeholder="Describe your concern..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        ></textarea>

        <div className="modal-buttons">
          <button className="cancel" onClick={onClose}>Cancel</button>
          <button className="book" onClick={handleBooking}>Book Session</button>
        </div>
      </div>
    </div>
  );
}

export default BookingModal;
