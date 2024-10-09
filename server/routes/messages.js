import express from 'express';
import Message from '../models/Message.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all messages for a user
router.get('/', auth, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.user._id }, { recipient: req.user._id }]
    }).populate('sender', 'name').populate('recipient', 'name').sort({ timestamp: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Send a new message
router.post('/', auth, async (req, res) => {
  const message = new Message({
    sender: req.user._id,
    recipient: req.body.recipient,
    content: req.body.content
  });

  try {
    const newMessage = await message.save();
    const populatedMessage = await Message.findById(newMessage._id)
      .populate('sender', 'name')
      .populate('recipient', 'name');

    // Emit socket event for real-time update
    const io = req.app.get('io');
    io.to(req.body.recipient).emit('newMessage', populatedMessage);

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Mark a message as read
router.patch('/:id/read', auth, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    if (message.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to mark this message as read' });
    }
    message.read = true;
    await message.save();
    res.json(message);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;