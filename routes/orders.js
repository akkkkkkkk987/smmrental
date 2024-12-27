const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Order = require('../models/Order');
const User = require('../models/User');
const Service = require('../models/Service');

// In your create order route
router.post('/create', auth, async (req, res) => {
    try {
        const { serviceId, quantity, link } = req.body;
        
        const service = await Service.findById(serviceId);
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const totalCost = service.price * quantity;
        
        if (user.balance < totalCost) {
            return res.status(400).json({ message: 'Insufficient balance' });
        }

        // Create new order with default message and login details
        const order = new Order({
            user: user._id,
            service: serviceId,
            quantity,
            link,
            totalCost,
            status: 'pending',
            message: 'Pending',
            loginDetails: 'Pending',
            orderDate: new Date()
        });

        await order.save();
        
        // Update user balance
        user.balance -= totalCost;
        await user.save();

        res.status(201).json({
            message: 'Order placed successfully',
            order,
            newBalance: user.balance
        });

    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({ message: 'Error creating order' });
    }
});

// Get user's orders
router.get('/my-orders', auth, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('service')
            .sort({ orderDate: -1 });

        console.log('Found orders:', orders);
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Error fetching orders' });
    }
});
module.exports = router;