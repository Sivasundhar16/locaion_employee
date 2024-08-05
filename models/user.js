const mongoose = require("mongoose");

// Define the Employee schema
const employeeSchema = new mongoose.Schema({
  // Auto-generated Employee ID
  employeeId: {
    type: Number,
    unique: true,
    required: true,
  },
  // Employee Name
  name: {
    type: String,
    required: true,
  },
  // Address
  address: {
    type: String,
    required: true,
  },
  // Age
  age: {
    type: Number,
    required: true,
  },
  // Department
  department: {
    type: String,
    required: true,
  },
  // Employee Status
  status: {
    type: String,
    enum: ["Remote Location", "Contract Employee", "Full-Time"],
    required: true,
  },
});

module.exports = mongoose.model("User", employeeSchema);
