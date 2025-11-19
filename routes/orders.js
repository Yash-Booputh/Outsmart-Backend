const express = require('express');
const { ObjectId } = require('mongodb');
const { getDB } = require('../config/db');

const router = express.Router();

/**
 * POST /api/orders
 * Creates a new order with complete lesson details (4%)
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
        const convertedLessonIDs = lessonIDs.map(function(id) {
            if (!ObjectId.isValid(id)) {
                throw new Error('Invalid lesson ID format: ' + id);
            }
            return new ObjectId(id);
        });
        
        // Fetch complete lesson details from database
        const lessonsFromDB = await db.collection('lessons')
            .find({ _id: { $in: convertedLessonIDs } })
            .toArray();
        
        // Build detailed lessons array with order information
        const detailedLessons = lessonsFromDB.map(function(lesson, index) {
            // Find the corresponding space count for this lesson
            const lessonIndex = convertedLessonIDs.findIndex(function(id) {
                return id.equals(lesson._id);
            });
            
            return {
                lessonID: lesson._id,
                subject: lesson.subject,
                location: lesson.location,
                price: lesson.price,
                spacesOrdered: spaces[lessonIndex]
            };
        });
        
        // Create order object with full details
        const order = {
            name: name,
            phone: phone,
            lessons: detailedLessons,
            orderDate: new Date(),
            status: 'confirmed'
        };
        
        // Insert order
        const result = await db.collection('orders').insertOne(order);
        
        console.log(`Order created successfully: ${result.insertedId}`);
        console.log(`Customer: ${name}, Phone: ${phone}`);
        console.log(`Lessons: ${detailedLessons.map(l => l.subject).join(', ')}`);
        
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
 * Returns all orders (optional - for testing and demonstration)
 */
router.get('/', async function(req, res, next) {
    try {
        const db = getDB();
        const orders = await db.collection('orders')
            .find({})
            .sort({ orderDate: -1 })
            .toArray();
        
        console.log(`Retrieved ${orders.length} orders from database`);
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        next(error);
    }
});

/**
 * GET /api/orders/:id
 * Returns a single order by ID (optional - for testing)
 */
router.get('/:id', async function(req, res, next) {
    try {
        const db = getDB();
        const orderId = req.params.id;
        
        if (!ObjectId.isValid(orderId)) {
            return res.status(400).json({ error: 'Invalid order ID' });
        }
        
        const order = await db.collection('orders').findOne({
            _id: new ObjectId(orderId)
        });
        
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        
        res.json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        next(error);
    }
});

module.exports = router;