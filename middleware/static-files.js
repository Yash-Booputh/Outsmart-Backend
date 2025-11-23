const express = require('express');
const path = require('path');
const fs = require('fs');

// This middleware checks if the requested image exists and serves it,
// or returns an error message if the image file does not exist
const imageMiddleware = function(req, res, next) {
    // Log the incoming image request
    console.log(`[IMAGE REQUEST] ${req.path}`);

    // Define the directory where images are stored
    const imagesDir = path.join(__dirname, '../public/images');
    // Build the full path to the requested image
    const imagePath = path.join(imagesDir, req.path);

    // Check if the image file exists using fs.access
    fs.access(imagePath, fs.constants.F_OK, function(err) {
        if (err) {
            // Image not found - return 404 error with descriptive message
            console.log(`[IMAGE NOT FOUND] ${req.path}`);
            return res.status(404).json({
                error: 'Image not found',
                message: `The image '${req.path}' does not exist`,
                timestamp: new Date().toISOString()
            });
        }

        // Image exists - serve it using express.static
        console.log(`[IMAGE SERVED] ${req.path}`);
        express.static(imagesDir)(req, res, next);
    });
};

module.exports = {
    imageMiddleware
};
