const express = require('express');
const router = express.Router();
const { auth, roleAuth } = require('../middleware/auth');
const Bill = require('../models/Bill');
const Patient = require('../models/Patient');

// Get bills for a patient
router.get('/patient/:patientId', auth, async (req, res) => {
  try {
    const bills = await Bill.find({ patient: req.params.patientId }).populate('receptionist', 'name');
    res.json(bills);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create bill (receptionist)
router.post('/', auth, roleAuth(['receptionist']), async (req, res) => {
  try {
    const bill = new Bill({ ...req.body, receptionist: req.user._id });
    await bill.save();

    // Add to patient's bills
    await Patient.findByIdAndUpdate(req.body.patient, { $push: { bills: bill._id } });

    res.status(201).json(bill);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update bill status
router.put('/:id', auth, roleAuth(['receptionist']), async (req, res) => {
  try {
    const bill = await Bill.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!bill) return res.status(404).json({ message: 'Bill not found' });
    res.json(bill);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
