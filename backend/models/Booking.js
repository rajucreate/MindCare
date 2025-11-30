const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  therapistId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  // store as ISO timestamp for exact comparison
  start: { type: Date, required: true },
  end: { type: Date, required: true },

  dateString: { type: String, required: true }, // YYYY-MM-DD for quick queries
  timeString: { type: String, required: true }, // HH:MM slot string

  durationMinutes: { type: Number, default: 60 }, // slot length

  mode: { type: String, enum: ["video","chat","in_person"], required: true },
  reason: { type: String },
  status: {
    type: String,
    enum: ["pending","approved","rejected","reschedule_requested","completed"],
    default: "pending"
  },
  therapistNote: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model("Booking", BookingSchema);
