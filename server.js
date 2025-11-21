require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectDB } = require('./config/db');
const logger = require('./middleware/logger');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { imageMiddleware } = require('./middleware/static-files');

// Import routes
const lessonsRouter = require('./routes/lessons');
const ordersRouter = require('./routes/orders');
const searchRouter = require('./routes/search');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger middleware (4%)
app.use(logger);

// Static files middleware (4%)
// Serves lesson images from public/images folder
// Returns error message if image doesn't exist
app.use('/images', imageMiddleware);

// Root route
app.get('/', function(req, res) {
    res.json({
        message: 'Welcome to OutSmart API',
        version: '1.0.0',
        endpoints: {
            lessons: '/api/lessons',
            orders: '/api/orders',
            search: '/api/search?q=query'
        }
    });
});

// API Routes
app.use('/api/lessons', lessonsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/search', searchRouter);

// 404 handler
app.use(notFoundHandler);

// Error handler
app.use(errorHandler);

// Connect to MongoDB and start server
connectDB()
    .then(function() {
        app.listen(port, function() {
            console.log('✓ Server running on port ' + port);
            console.log('✓ Environment: ' + (process.env.NODE_ENV || 'development'));
        });
    })
    .catch(function(error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    });

// Graceful shutdown
process.on('SIGINT', function() {
    console.log('\nShutting down gracefully...');
    process.exit(0);
});