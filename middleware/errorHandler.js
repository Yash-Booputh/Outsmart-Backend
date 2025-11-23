// Error Handler Middleware
// Handles errors and sends appropriate responses
function errorHandler(err, req, res, next) {
    console.error('Error:', err.message);
    console.error('Stack:', err.stack);
    
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    
    res.status(statusCode).json({
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
}


// 404 Not Found Handler
function notFoundHandler(req, res, next) {
    res.status(404).json({
        error: 'Route not found',
        path: req.originalUrl
    });
}

module.exports = {
    errorHandler,
    notFoundHandler
};