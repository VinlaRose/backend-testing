const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  contactInfo: {
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
  },
  skills: {
    type: [String], // An array of strings representing skills
  },
  availability: {
    type: [String], // An array of strings representing availability
  },
  events: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  }]
  
}, { strictPopulate: false });

const Volunteer = mongoose.model('Volunteer', volunteerSchema);

module.exports = Volunteer;
