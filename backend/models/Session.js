const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  therapistId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  date: { type: String, required: true },
  time: { type: String, required: true },

  mode: {
    type: String,
    enum: ["video", "chat", "in_person"],
    required: true
  },

  reason: { type: String, required: true },

  status: {
    type: String,
    enum: [
      "pending",
      "accepted", 
      "rejected",
      "reschedule_requested",
      "cancelled",
      "completed"
    ],
    default: "pending"
  },

  therapistNote: { type: String, default: "" }

}, { timestamps: true });

module.exports = mongoose.model("Session", SessionSchema);
