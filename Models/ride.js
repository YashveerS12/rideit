const mongoose = require("mongoose");
const { Schema } = mongoose;

const rideSchema = new Schema({
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  number: {
    type: Number,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  date:{
    type: String,
    required: true,
  },
  passengers: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: { type: String, default: "pending" },

  bookings: [
    {
      name: { type: String, required: true },
      gender: { type: String, required: true },
      bookedAt: { type: Date, default: Date.now }
    }
  ]
});

const Ride = mongoose.model("Ride", rideSchema);
module.exports = Ride;
