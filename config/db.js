const { MongoClient } = require('mongodb');

let db;
let client;

async function connectDB() {
    try {
        const uri = process.env.MONGODB_URI;
        
        if (!uri) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }

        client = new MongoClient(uri);
        await client.connect();
        
        db = client.db('outsmart');
        
        console.log('✓ Connected to MongoDB Atlas');
        return db;
    } catch (error) {
        console.error('✗ MongoDB connection error:', error.message);
        process.exit(1);
    }
}

function getDB() {
    if (!db) {
        throw new Error('Database not initialized. Call connectDB first.');
    }
    return db;
}

async function closeDB() {
    if (client) {
        await client.close();
        console.log('✓ MongoDB connection closed');
    }
}

module.exports = {
    connectDB,
    getDB,
    closeDB
};