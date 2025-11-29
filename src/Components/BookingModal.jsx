import React, { useEffect, useState } from "react";
import API from "../api";
import "./BookingModal.css"; // (you can style later)

function BookingModal({ therapist, studentId, onClose, onSuccess }) {
  const [date, setDate] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [reason, setReason] = useState("");
  const [mode, setMode] = useState("video"); // default: video call

  // 🔄 fetch availability whenever date changes
  useEffect(() => {
    if (!date) return;

    const fetchSlots = async () => {
      try {
        const res = await API.get(
          `/booking/therapist/${therapist._id}/available?date=${date}`
        );
        setAvailableSlots(res.data.slots || []);
      } catch (err) {
        console.error("Failed to fetch slots:", err);
      }
    };

    fetchSlots();
  }, [date]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!date || !selectedSlot || !mode) {
      alert("Please select date, slot and mode");
      return;
    }

    try {
      await API.post("/booking/create", {
        studentId,
        therapistId: therapist._id,
        date,
        time: selectedSlot,
        mode,
        reason,
        durationMinutes: 60
      });

      alert("Session request sent!");
      onSuccess();
      onClose();
    } catch (err) {
      alert(err.response?.data?.msg || "Booking failed");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>Book Session with {therapist.name}</h2>

        <label>Select Date</label>
        <input
          type="date"
          value={date}
          min={new Date().toISOString().split("T")[0]}
          onChange={(e) => setDate(e.target.value)}
        />

        <label>Select Mode</label>
        <select value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="video">Video Call</option>
          <option value="chat">Chat Session</option>
          <option value="in_person">In Person</option>
        </select>

        <label>Your Reason (optional)</label>
        <textarea
          placeholder="Describe what you want to discuss..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows="3"
        ></textarea>

        <label>Available Time Slots</label>
        <div className="slots-container">
          {date && availableSlots.length === 0 && (
            <p className="no-slots">No available slots for this date</p>
          )}

          {availableSlots.map((slot, i) => (
            <button
              key={i}
              className={`slot-btn ${selectedSlot === slot ? "selected" : ""}`}
              onClick={() => setSelectedSlot(slot)}
            >
              {slot}
            </button>
          ))}
        </div>

        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="confirm-btn" onClick={handleSubmit}>
            Book Session
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookingModal;
