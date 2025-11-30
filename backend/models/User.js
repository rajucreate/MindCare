const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "therapist"], default: "student" },


  // add inside your User schema definition
    weeklyAvailability: {
    // array of objects: { day: 0..6 (Sun..Sat), slots: ["09:00","10:00","11:00"] }
    type: [
        {
        day: { type: Number }, // 0 (Sunday) to 6 (Saturday)
        slots: [String]
        }
    ],
    default: []
    },

  // new fields you will use later
  availability: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },

});

module.exports = mongoose.model("User", UserSchema);
