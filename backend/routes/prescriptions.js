const express = require('express');
const router = express.Router();
const { auth, roleAuth } = require('../middleware/auth');
const Prescription = require('../models/Prescription');
const Patient = require('../models/Patient');

// Get prescriptions for a patient
router.get('/patient/:patientId', auth, async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ patient: req.params.patientId }).populate('doctor', 'name');
    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create prescription (doctor)
router.post('/', auth, roleAuth(['doctor']), async (req, res) => {
  try {
    const prescription = new Prescription({ ...req.body, doctor: req.user._id });
    await prescription.save();

    // Add to patient's prescriptions
    await Patient.findByIdAndUpdate(req.body.patient, { $push: { prescriptions: prescription._id } });

    res.status(201).json(prescription);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update prescription
router.put('/:id', auth, roleAuth(['doctor']), async (req, res) => {
  try {
    const prescription = await Prescription.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!prescription) return res.status(404).json({ message: 'Prescription not found' });
    res.json(prescription);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
