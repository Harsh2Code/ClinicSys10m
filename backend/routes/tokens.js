const express = require('express');
const router = express.Router();
const { auth, roleAuth } = require('../middleware/auth');
const Token = require('../models/Token');
const Patient = require('../models/Patient');

// Get all tokens
router.get('/', auth, async (req, res) => {
  try {
    let tokens;
    if (req.user.role === 'doctor') {
      tokens = await Token.find({ $or: [{ assignedDoctor: req.user._id }, { status: 'pending' }] }).populate('patient');
    } else {
      tokens = await Token.find().populate('patient');
    }
    res.json(tokens);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Generate token for patient (receptionist)
router.post('/', auth, roleAuth(['receptionist']), async (req, res) => {
  try {
    const { patientId } = req.body;
    const patient = await Patient.findById(patientId);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    // Generate unique token number
    let tokenNumber;
    do {
      tokenNumber = Math.floor(100 + Math.random() * 900);
    } while (await Token.findOne({ tokenNumber }));

    const token = new Token({ tokenNumber, patient: patientId });
    await token.save();

    // Update patient's current token
    patient.currentToken = token._id;
    await patient.save();

    res.status(201).json(token);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Assign token to doctor
router.put('/:id/assign', auth, roleAuth(['doctor']), async (req, res) => {
  try {
    const token = await Token.findById(req.params.id);
    if (!token) return res.status(404).json({ message: 'Token not found' });
    if (token.status !== 'pending') return res.status(400).json({ message: 'Token not available' });

    token.assignedDoctor = req.user._id;
    token.status = 'in-progress';
    await token.save();

    res.json(token);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Complete token
router.put('/:id/complete', auth, roleAuth(['doctor']), async (req, res) => {
  try {
    const token = await Token.findById(req.params.id);
    if (!token) return res.status(404).json({ message: 'Token not found' });
    if (token.assignedDoctor.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not assigned to you' });

    token.status = 'completed';
    await token.save();

    // Clear patient's current token
    await Patient.findByIdAndUpdate(token.patient, { currentToken: null });

    res.json(token);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
