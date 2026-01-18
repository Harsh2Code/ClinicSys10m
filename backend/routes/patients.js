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
      // Get patients with pending tokens (waiting to be assigned)
      const tokens = await Token.find({ status: 'pending' }).populate('patient');
      const patientIds = tokens.map(t => t.patient._id);
      patients = await Patient.find({ _id: { $in: patientIds } }).populate('currentToken');
    } else {
      // For receptionist: Get all patients, sorted by latest prescription date or creation date
      patients = await Patient.find().populate('currentToken').populate('prescriptions');
      patients.sort((a, b) => {
        const aLatest = a.prescriptions.length > 0 ? Math.max(...a.prescriptions.map(p => new Date(p.createdAt).getTime())) : new Date(a.createdAt).getTime();
        const bLatest = b.prescriptions.length > 0 ? Math.max(...b.prescriptions.map(p => new Date(p.createdAt).getTime())) : new Date(b.createdAt).getTime();
        return bLatest - aLatest;
      });
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

    // Generate token for the new patient
    let tokenNumber;
    do {
      tokenNumber = Math.floor(100 + Math.random() * 900);
    } while (await Token.findOne({ tokenNumber }));

    const token = new Token({ tokenNumber, patient: patient._id });
    await token.save();

    // Update patient's current token
    patient.currentToken = token._id;
    await patient.save();

    // Populate currentToken before returning
    const populatedPatient = await Patient.findById(patient._id).populate('currentToken');
    res.status(201).json(populatedPatient);
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
