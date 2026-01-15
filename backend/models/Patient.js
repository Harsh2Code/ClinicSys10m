const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String },
  dateOfBirth: { type: Date },
  medicalHistory: { type: String },
  currentToken: { type: mongoose.Schema.Types.ObjectId, ref: 'Token' },
  prescriptions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Prescription' }],
  bills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bill' }],
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);
