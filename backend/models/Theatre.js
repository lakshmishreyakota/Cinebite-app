const mongoose = require('mongoose');

const theatreSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  screens: [{
    number: { type: String, required: true },
    rows: { type: Number, required: true },
    cols: { type: Number, required: true }
  }],
  image: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Theatre', theatreSchema);
