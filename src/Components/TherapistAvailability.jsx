import React, { useEffect, useState } from "react";
import API from "../api";
import "./TherapistAvailability.css";
import { useNavigate } from "react-router-dom";

const HOURS = [
  "08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30",
  "12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30",
  "16:00","16:30","17:00","17:30","18:00"
];

const WeekDays = [
  { label: "Sun", value: 0 },
  { label: "Mon", value: 1 },
  { label: "Tue", value: 2 },
  { label: "Wed", value: 3 },
  { label: "Thu", value: 4 },
  { label: "Fri", value: 5 },
  { label: "Sat", value: 6 },
];

export default function TherapistAvailability() {
  const [weekly, setWeekly] = useState(() =>
    WeekDays.map(d => ({ day: d.value, slots: [] }))
  );
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // load current therapist availability
    const fetch = async () => {
      try {
        const res = await API.get("/therapist/me/weekly-availability");
        // res.data.weeklyAvailability expected or fallback to []:
        const server = res.data?.weeklyAvailability || [];
        // normalize to full-week array
        const normalized = WeekDays.map(d => {
          const found = server.find(x => x.day === d.value);
          return { day: d.value, slots: found?.slots || [] };
        });
        setWeekly(normalized);
      } catch (err) {
        console.error("Load availability error", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const toggleSlot = (day, slot) => {
    setWeekly(prev =>
      prev.map(w =>
        w.day === day
          ? {
              ...w,
              slots: w.slots.includes(slot)
                ? w.slots.filter(s => s !== slot)
                : [...w.slots, slot].sort()
            }
          : w
      )
    );
  };

  const setWholeDay = (day, enable) => {
    setWeekly(prev =>
      prev.map(w =>
        w.day === day
          ? { ...w, slots: enable ? [...HOURS] : [] }
          : w
      )
    );
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const payload = { weeklyAvailability: weekly };
      await API.patch("/therapist/weekly-availability", payload);
      alert("Saved weekly availability");
      navigate("/therapist"); // go back to therapist homepage
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Save failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="availability-page">
      <h2>Set Weekly Availability</h2>
      <p className="muted">Select time slots for each day. Click a slot to toggle. Use "All" to set whole day.</p>

      <div className="week-grid">
        {weekly.map(day => (
          <div className="day-card" key={day.day}>
            <div className="day-header">
              <strong>{WeekDays.find(w => w.value === day.day).label}</strong>
              <div className="header-actions">
                <button
                  className="small-btn"
                  onClick={() => setWholeDay(day.day, day.slots.length !== HOURS.length)}
                  title="Toggle all slots"
                >
                  {day.slots.length === HOURS.length ? "Clear" : "All"}
                </button>
                <span className="count">{day.slots.length}</span>
              </div>
            </div>

            <div className="slots-list">
              {HOURS.map(h => (
                <button
                  key={h}
                  onClick={() => toggleSlot(day.day, h)}
                  className={`slot-pill ${day.slots.includes(h) ? "selected" : ""}`}
                  type="button"
                >
                  {h}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="availability-actions">
        <button className="btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
        <button className="btn-primary" onClick={handleSave} disabled={loading}>
          {loading ? "Saving..." : "Save Availability"}
        </button>
      </div>
    </div>
  );
}
