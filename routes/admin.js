const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const Service = require('../models/Service');

// Add new service
router.post('/services', adminAuth, async (req, res) => {
    try {
        const { category, name, description, price, minQuantity, maxQuantity } = req.body;

        const service = new Service({
            category,
            name,
            description,
            price,
            minQuantity: minQuantity || 1,
            maxQuantity: maxQuantity || 1,
            active: true
        });

        await service.save();
        res.status(201).json(service);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all services (including inactive ones)
router.get('/services', adminAuth, async (req, res) => {
    try {
        const services = await Service.find({});
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update service
router.put('/services/:id', adminAuth, async (req, res) => {
    try {
        const service = await Service.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(service);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete service (or deactivate)
router.delete('/services/:id', adminAuth, async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        service.active = false;
        await service.save();
        res.json({ message: 'Service deactivated' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;