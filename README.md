# Outsmart - After-School Lessons Booking Platform (BACKEND)

This is the backend REST API for my lesson booking platform coursework.
It provides lesson data, handles orders, updates available lesson spaces, and supports full-text search as required by the coursework.

## Features

### Lessons API
- **GET /api/lessons** - Fetch all lessons
- **PUT /api/lessons/:id** - Update any lesson attribute (used after checkout to update spaces)

### Orders API
- **POST /api/orders** - Save new order
  - Order object contains: name, phone, lessonIDs, spaces

### Search API
- **GET /api/search?q=query** - Full-text search across lessons
  - Searches subject, location, price, and availability
  - Supports "search as you type" functionality

### Middleware
- **Logger** - Outputs all requests to the server console with timestamp, method, URL, and response time
- **Static Files** - Serves lesson images from public/images folder, returns error message if image doesn't exist

## Integration With Frontend
After checkout:
1. Frontend sends POST /api/orders to save the order
2. Frontend sends PUT /api/lessons/:id to update available lesson spaces

## MongoDB Collections

### lessons
- _id
- subject
- location
- price
- spaces
- description
- image (array)

### orders
- _id
- name
- phone
- lessonIDs (array)
- spaces
- orderDate

## Technologies Used
- Node.js
- Express.js
- MongoDB (Atlas) with native Node.js driver
- CORS
- dotenv

## Project Structure
```
backend/
├── server.js
├── config/
│   └── db.js
├── routes/
│   ├── lessons.js
│   ├── orders.js
│   └── search.js
├── middleware/
│   ├── logger.js
│   ├── errorHandler.js
│   └── static-files.js
└── public/
    └── images/
```

## Links
- **GitHub Repository:** https://github.com/Yash-Booputh/Outsmart-Backend.git
- **Render.com API (All Lessons):** https://outsmart-backend-osm4.onrender.com/api/lessons
- **Frontend (GitHub Pages):** https://yash-booputh.github.io/Outsmart-Frontend/
