const express = require('express');
const router = express.Router();
const ContactMessage = require('../models/ContactMessage');
const protect = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

// Public route to submit a message
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, email, message } = req.body;
    if (!firstName || !lastName || !email || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const newMessage = new ContactMessage({ firstName, lastName, email, message });
    await newMessage.save();

    res.status(201).json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Admin route to get all messages
router.get('/', protect, admin, async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Admin route to delete a message
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    await ContactMessage.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
