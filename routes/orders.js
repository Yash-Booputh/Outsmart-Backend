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
        
        if (lessonIDs.length === 0) {
            return res.status(400).json({
                error: 'Order must contain at least one lesson'
            });
        }
        
        // Convert lesson IDs to ObjectId
        const { ObjectId } = require('mongodb');
        const convertedLessonIDs = lessonIDs.map(function(id) {
            if (!ObjectId.isValid(id)) {
                throw new Error('Invalid lesson ID format: ' + id);
            }
            return new ObjectId(id);
        });
        
        // **NEW: Fetch lesson names from database**
        const lessons = await db.collection('lessons')
            .find({ _id: { $in: convertedLessonIDs } })
            .toArray();
        
        // Extract lesson subjects (names)
        const lessonNames = lessons.map(function(lesson) {
            return lesson.subject;
        });
        
        // Create order object
        const order = {
            name: name,
            phone: phone,
            lessonIDs: convertedLessonIDs,
            lessonNames: lessonNames,        // **NEW: Added lesson names**
            spaces: spaces,
            orderDate: new Date(),
            status: 'confirmed'
        };
        
        // Insert order
        const result = await db.collection('orders').insertOne(order);
        
        console.log(`Order created successfully: ${result.insertedId}`);
        console.log(`Customer: ${name}, Phone: ${phone}, Lessons: ${lessonNames.join(', ')}`);
        
        res.status(201).json({
            message: 'Order created successfully',
            orderId: result.insertedId,
            order: order
        });
    } catch (error) {
        console.error('Error creating order:', error);
        if (error.message.includes('Invalid lesson ID')) {
            return res.status(400).json({ error: error.message });
        }
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