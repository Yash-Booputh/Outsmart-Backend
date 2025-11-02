require('dotenv').config();
const { MongoClient } = require('mongodb');

const lessons = [
    { subject: 'Math', location: 'London', price: 100, spaces: 5, icon: 'fas fa-calculator' },
    { subject: 'Math', location: 'Oxford', price: 100, spaces: 5, icon: 'fas fa-calculator' },
    { subject: 'English', location: 'London', price: 100, spaces: 5, icon: 'fas fa-book' },
    { subject: 'English', location: 'York', price: 90, spaces: 5, icon: 'fas fa-book' },
    { subject: 'Music', location: 'Bristol', price: 90, spaces: 5, icon: 'fas fa-music' },
    { subject: 'Science', location: 'Manchester', price: 95, spaces: 5, icon: 'fas fa-flask' },
    { subject: 'Art', location: 'Liverpool', price: 85, spaces: 5, icon: 'fas fa-palette' },
    { subject: 'History', location: 'Cambridge', price: 80, spaces: 5, icon: 'fas fa-landmark' },
    { subject: 'Geography', location: 'Edinburgh', price: 75, spaces: 5, icon: 'fas fa-globe' },
    { subject: 'PE', location: 'Birmingham', price: 70, spaces: 5, icon: 'fas fa-running' },
    { subject: 'Drama', location: 'Leeds', price: 80, spaces: 5, icon: 'fas fa-theater-masks' },
    { subject: 'IT', location: 'London', price: 110, spaces: 5, icon: 'fas fa-laptop-code' }
];

async function seedDatabase() {
    const client = new MongoClient(process.env.MONGODB_URI);
    
    try {
        await client.connect();
        console.log('✓ Connected to MongoDB');
        
        const db = client.db('outsmart');
        
        // Clear existing data
        await db.collection('lessons').deleteMany({});
        await db.collection('orders').deleteMany({});
        console.log('✓ Cleared existing data');
        
        // Insert lessons
        const result = await db.collection('lessons').insertMany(lessons);
        console.log(`✓ Inserted ${result.insertedCount} lessons`);
        
        console.log('\n✓ Database seeded successfully!');
    } catch (error) {
        console.error('✗ Error seeding database:', error);
    } finally {
        await client.close();
        console.log('✓ Connection closed');
    }
}

seedDatabase();