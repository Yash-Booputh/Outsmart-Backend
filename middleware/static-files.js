const express = require('express');
const path = require('path');
const fs = require('fs');

const imageMiddleware = function(req, res, next) {
    console.log(`[IMAGE REQUEST] ${req.path}`);

    const imagesDir = path.join(__dirname, '../public/images');
    const imagePath = path.join(imagesDir, req.path);

    fs.access(imagePath, fs.constants.F_OK, function(err) {
        if (err) {
            console.log(`[IMAGE NOT FOUND] ${req.path}`);
            return res.status(404).json({
                error: 'Image not found',
                message: `The image '${req.path}' does not exist`,
                timestamp: new Date().toISOString()
            });
        }

        console.log(`[IMAGE SERVED] ${req.path}`);
        express.static(imagesDir)(req, res, next);
    });
};

module.exports = {
    imageMiddleware
};
