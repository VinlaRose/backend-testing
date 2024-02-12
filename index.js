// Import packages
const express = require("express");
const home = require("./routes/home");

const mongoose = require('mongoose');
const fs = require('fs');

// Middlewares
const app = express();
app.use(express.json());

const cors = require('cors'); 

const Event = require('./Models/EventModel');
const Volunteer = require('./Models/VolunteerModel')

app.use(cors());

require('./data/db')



// Routes
app.get('/', (req, res) => {
    res.send('Hello')
  });



//add new event
app.post('/events', async (req, res) => {
    const inputData = req.body;
  
    if (!inputData.eventName || !inputData.location) {
      return res.status(400).json({ error: 'name and location are required.' });
    }
  
    
    try {
      const newEvent = new Event(inputData);
      const savedEvent = await newEvent.save();
  
    
      res.status(201).json({ success: true, data: savedEvent });
    } catch (error) {
      console.error('Error adding entry:', error.message);
  
  
      res.status(500).json({ error: 'Error adding entry' });
    }
  });
  
  //get all events
  app.get('/events', async (req, res) => {
    try {
      const events = await Event.find(); 
  
      res.status(200).json({ success: true, data: events });
    } catch (error) {
      console.error('Error fetching events:', error.message);
      res.status(500).json({ error: 'Error fetching events' });
    }
  });
  
  //delete event by id
  app.delete('/events/:id', async (req, res) => {
    const eventId = req.params.id;
  
    try {
      const event = await Event.findById(eventId);
  
      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }
  
      await Event.findByIdAndRemove(eventId);
  
      res.status(200).json({ success: true, data: event, message: 'Event deleted successfully' });
    } catch (error) {
      console.error('Error deleting event:', error.message);
      res.status(500).json({ error: 'Error deleting event' });
    }
  });
  
  //edit events
  app.post('/events/:id', async (req, res) => {
    const eventId = req.params.id; 
    const eventData = req.body; 
  
    try {
      const event = await Event.findByIdAndUpdate(eventId, eventData, { new: true });
  
      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }
  
      res.status(200).json({ success: true, data: event, message: 'Event updated successfully' });
    } catch (error) {
      console.error('Error updating event:', error.message);
      res.status(500).json({ error: 'Error updating event' });
    }
  });
  
  
  
  // add new volunteer
  
  app.post('/volunteers', async (req, res) => {
    const inputData = req.body;
  
    if (!inputData.name || !inputData.contactInfo || !inputData.contactInfo.email || !inputData.contactInfo.phone) {
      return res.status(400).json({ error: 'Name, email, and phone are required fields.' });
    }
  
    try {
      const event = await Event.findById(inputData.events);
  
      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }
  
      const newVolunteer = new Volunteer({
        name: inputData.name,
        contactInfo: inputData.contactInfo,
        skills: inputData.skills || [],
        availability: inputData.availability || [],
        events: [event._id], 
      });
  
      const savedVolunteer = await newVolunteer.save();
  
      const updatedSavedVolunteer = await savedVolunteer.populate('events')
  
      res.status(201).json({ success: true, data: updatedSavedVolunteer });
    } catch (error) {
      console.error('Error adding volunteer:', error.message);
      res.status(500).json({ error: 'Error adding volunteer' });
    }
  });
  
  
  // Get all volunteers
  app.get('/volunteers', async (req, res) => {
    try {
      const volunteers = await Volunteer.find().populate('events');
  
      res.status(200).json({ success: true, data: volunteers });
    } catch (error) {
      console.error('Error fetching volunteers:', error.message);
      res.status(500).json({ error: 'Error fetching volunteers' });
    }
  });
  
  // Delete a volunteer by ID
  app.delete('/volunteers/:id', async (req, res) => {
    const volunteerId = req.params.id;
  
    try {
      const volunteer = await Volunteer.findById(volunteerId);
  
      if (!volunteer) {
        return res.status(404).json({ error: 'Volunteer not found' });
      }
  
      await Volunteer.findByIdAndRemove(volunteerId);
  
      res.status(200).json({ success: true, data: volunteer, message: 'Volunteer deleted successfully' });
    } catch (error) {
      console.error('Error deleting volunteer:', error.message);
      res.status(500).json({ error: 'Error deleting volunteer' });
    }
  });
  
  // Update a volunteer
  app.post('/volunteers/:id', async (req, res) => {
    const volunteerId = req.params.id;
    const volunteerData = req.body;
  
    try {
      const volunteer = await Volunteer.findByIdAndUpdate(volunteerId, volunteerData, { new: true });
  
      if (!volunteer) {
        return res.status(404).json({ error: 'Volunteer not found' });
      }
  
      res.status(200).json({ success: true, data: volunteer, message: 'Volunteer updated successfully' });
    } catch (error) {
      console.error('Error updating volunteer:', error.message);
      res.status(500).json({ error: 'Error updating volunteer' });
    }
  });
  

// connection
const port = process.env.PORT || 9001;
app.listen(port, () => console.log(`Listening to port ${port}`));