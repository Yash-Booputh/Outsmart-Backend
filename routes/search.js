const express = require('express');
const { getDB } = require('../config/db');

const router = express.Router();

/**
 * GET /api/search
 * Search lessons by query parameter (4%)
 * Example: /api/search?q=math
 */
router.get('/', async function(req, res, next) {
    try {
        const db = getDB();
        const query = req.query.q;
        
        if (!query) {
            return res.status(400).json({
                error: 'Query parameter "q" is required'
            });
        }
        
        // Create case-insensitive regex for searching
        const searchRegex = new RegExp(query, 'i');
        
        // Search across multiple fields
        const lessons = await db.collection('lessons').find({
            $or: [
                { subject: searchRegex },
                { location: searchRegex },
                { price: isNaN(query) ? null : parseInt(query) },
                { spaces: isNaN(query) ? null : parseInt(query) }
            ]
        }).toArray();
        
        res.json(lessons);
    } catch (error) {
        next(error);
    }
});

module.exports = router;