const express = require('express');
const { getDB } = require('../config/db');

const router = express.Router();


 // GET /api/search?q=query
 // Search lessons across multiple fields
router.get('/', async function(req, res, next) {
    try {
        const db = getDB();
        const query = req.query.q;
        
        // Validate query parameter
        if (!query || query.trim() === '') {
            return res.status(400).json({
                error: 'Query parameter "q" is required'
            });
        }
        
        const searchTerm = query.trim();
        console.log(`Searching for: "${searchTerm}"`);
        
        // Create case-insensitive regex for text searching
        const searchRegex = new RegExp(searchTerm, 'i');
        
        // Parse as number if possible
        const numericValue = parseInt(searchTerm);
        const isNumeric = !isNaN(numericValue);
        
        // Build search query across multiple fields
        const searchQuery = {
            $or: [
                { subject: searchRegex },
                { location: searchRegex }
            ]
        };
        
        // Add numeric searches if query is a number
        if (isNumeric) {
            searchQuery.$or.push(
                { price: numericValue },
                { spaces: numericValue }
            );
        }
        
        // Execute search
        const lessons = await db.collection('lessons')
            .find(searchQuery)
            .toArray();
        
        console.log(`Found ${lessons.length} lessons matching "${searchTerm}"`);
        
        res.json(lessons);
    } catch (error) {
        console.error('Error searching lessons:', error);
        next(error);
    }
});

module.exports = router;