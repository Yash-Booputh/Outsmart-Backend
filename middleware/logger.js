function logger(req, res, next) {
    // Get current timestamp in ISO format
    const timestamp = new Date().toISOString();
    // Get HTTP method (GET, POST, PUT, DELETE, etc.)
    const method = req.method;
    // Get the requested URL path
    const url = req.url;
    // Get client IP address
    const ip = req.ip || req.connection.remoteAddress;

    // Log request details to console
    console.log(`[${timestamp}] ${method} ${url} - IP: ${ip}`);

    // Call next() to pass control to the next middleware
    next();
}

module.exports = logger;