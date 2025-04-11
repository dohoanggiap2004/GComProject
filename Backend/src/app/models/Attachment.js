const mongoose = require('mongoose');

const attachmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  mimeType: {
    type: String,
    required: true
  },
  size: {
    type: Number
  },
  driveFileId: {
    type: String,
    required: true
  },
  webViewLink: {
    type: String,
    required: true
  },
  webContentLink: {
    type: String,
    required: true
  },
  cardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Card',
    required: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Attachment = mongoose.model('Attachment', attachmentSchema);

module.exports = Attachment;
