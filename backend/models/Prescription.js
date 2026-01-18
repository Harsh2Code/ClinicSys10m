const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  medications: [{ name: String, timeOfDay: [String], duration: Number }],
  notes: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Prescription', prescriptionSchema);
