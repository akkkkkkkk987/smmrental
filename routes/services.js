const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Service = require('../models/Service');
const Order = require('../models/Order');
const User = require('../models/User');

// Get all service categories
router.get('/categories', auth, async (req, res) => {
    try {
        const categories = await Service.distinct('category');
        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get services by category
router.get('/category/:category', auth, async (req, res) => {
    try {
        console.log('Fetching services for category:', req.params.category);
        const services = await Service.find({ 
            category: req.params.category,
            active: true 
        });
        console.log('Found services:', services);
        res.json(services);
    } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get service details
router.get('/service/:id', auth, async (req, res) => {
    try {
        console.log('Fetching service with ID:', req.params.id);
        const service = await Service.findById(req.params.id);
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }
        console.log('Found service:', service);
        res.json(service);
    } catch (error) {
        console.error('Error fetching service details:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;