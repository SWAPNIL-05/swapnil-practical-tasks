const mongoose = require('mongoose');
const columnSchema = new mongoose.Schema({
  title: {
    type: String,
    enum : ['To Do', 'In Progress', 'Done'],
    required: true,
  },
  boardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Board',
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Column', columnSchema);