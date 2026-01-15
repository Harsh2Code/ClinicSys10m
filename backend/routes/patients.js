const express = require('express');
const router = express.Router();
const { auth, roleAuth } = require('../middleware/auth');
const Patient = require('../models/Patient');
const Token = require('../models/Token');

// Get all patients
router.get('/', auth, async (req, res) => {
  try {
    let patients;
    if (req.user.role === 'doctor') {
      // Get patients with tokens assigned to this doctor
      const tokens = await Token.find({ assignedDoctor: req.user._id }).populate('patient');
      patients = tokens.map(t => t.patient);
    } else {
      patients = await Patient.find(req.query.email ? { email: req.query.email } : {});
    }
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create patient (receptionist)
router.post('/', auth, roleAuth(['receptionist']), async (req, res) => {
  try {
    const patient = new Patient(req.body);
    await patient.save();
    res.status(201).json(patient);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get patient by id
router.get('/:id', auth, async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).populate('currentToken prescriptions bills');
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update patient (doctor)
router.put('/:id', auth, roleAuth(['doctor']), async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
