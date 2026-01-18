const express = require('express');
const router = express.Router();

// POST /api/tests/preview
router.post('/preview', (req, res) => {
  try {
    // For now, return a simple preview response
    const preview = {
      message: 'Test preview generated successfully',
      tests: [
        { id: 1, name: 'Sample Test 1', status: 'passed' },
        { id: 2, name: 'Sample Test 2', status: 'failed' }
      ]
    };
    res.json(preview);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate test preview' });
  }
});

module.exports = router;
