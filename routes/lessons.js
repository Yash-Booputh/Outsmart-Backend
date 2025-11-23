const express = require('express');
const { ObjectId } = require('mongodb');
const { getDB } = require('../config/db');

const router = express.Router();


 // GET /api/lessons
router.get('/', async function(req, res, next) {
    try {
        const db = getDB();
        const lessons = await db.collection('lessons').find({}).toArray();
        
        res.json(lessons);
    } catch (error) {
        next(error);
    }
});

 // PUT /api/lessons/:id
 // Can update any attribute, not just increment/decrement spaces
router.put('/:id', async function(req, res, next) {
    try {
        const db = getDB();
        const lessonId = req.params.id;
        const updates = req.body;
        
        // Validate ObjectId
        if (!ObjectId.isValid(lessonId)) {
            return res.status(400).json({ error: 'Invalid lesson ID' });
        }
        
        // Remove _id from updates if present
        delete updates._id;
        
        const result = await db.collection('lessons').updateOne(
            { _id: new ObjectId(lessonId) },
            { $set: updates }
        );
        
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Lesson not found' });
        }
        
        res.json({
            message: 'Lesson updated successfully',
            modifiedCount: result.modifiedCount
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;