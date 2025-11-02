const express = require('express');
const { ObjectId } = require('mongodb');
const { getDB } = require('../config/db');

const router = express.Router();

/**
 * POST /api/orders
 * Creates a new order (4%)
 */
router.post('/', async function(req, res, next) {
    try {
        const db = getDB();
        const { name, phone, lessonIDs, spaces } = req.body;
        
        // Validation
        if (!name || !phone || !lessonIDs || !spaces) {
            return res.status(400).json({
                error: 'Missing required fields: name, phone, lessonIDs, spaces'
            });
        }
        
        if (!Array.isArray(lessonIDs) || !Array.isArray(spaces)) {
            return res.status(400).json({
                error: 'lessonIDs and spaces must be arrays'
            });
        }
        
        if (lessonIDs.length !== spaces.length) {
            return res.status(400).json({
                error: 'lessonIDs and spaces arrays must have the same length'
            });
        }
        
        // Convert lesson IDs to ObjectId
        const convertedLessonIDs = lessonIDs.map(function(id) {
            return typeof id === 'string' ? new ObjectId(id) : id;
        });
        
        // Create order object
        const order = {
            name: name,
            phone: phone,
            lessonIDs: convertedLessonIDs,
            spaces: spaces,
            orderDate: new Date(),
            status: 'confirmed'
        };
        
        // Insert order
        const result = await db.collection('orders').insertOne(order);
        
        res.status(201).json({
            message: 'Order created successfully',
            orderId: result.insertedId,
            order: order
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/orders
 * Returns all orders (optional - for testing)
 */
router.get('/', async function(req, res, next) {
    try {
        const db = getDB();
        const orders = await db.collection('orders').find({}).toArray();
        
        res.json(orders);
    } catch (error) {
        next(error);
    }
});

module.exports = router;