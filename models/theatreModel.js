const mongoose = require("mongoose");
const theatreSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    adderess: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    capacity: {
      type: Number,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("theatres", theatreSchema);
