const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const FundRequest = require('../models/FundRequest');

// Submit fund request
router.post('/request', auth, async (req, res) => {
    try {
        const { amount, screenshot } = req.body;

        const fundRequest = new FundRequest({
            user: req.user.userId,
            amount,
            screenshot
        });

        await fundRequest.save();

        res.status(201).json({
            message: 'Fund request submitted successfully',
            fundRequest
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user's fund requests
router.get('/requests', auth, async (req, res) => {
    try {
        const requests = await FundRequest.find({ user: req.user.userId })
            .sort({ transactionDate: -1 });

        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;