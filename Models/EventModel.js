const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
   
  },
  location: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    
  },
  requiredVolunteerRoles: {
    type: [String],
    
  },
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
