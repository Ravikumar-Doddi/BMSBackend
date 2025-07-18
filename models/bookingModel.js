const mongoose = require("mongoose");

const bookingSchema = mongoose.Schema(
  {
    show: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "shows", // Reference to the Show model
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users", // Reference to the User model
    },
    seats: {
      type: Array,
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("bookings", bookingSchema);
