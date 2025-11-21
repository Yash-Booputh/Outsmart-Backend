require('dotenv').config();
const { MongoClient } = require('mongodb');

const lessons = [
    {
        subject: 'Mathematics',
        location: 'Port Louis',
        price: 1500,
        spaces: 5,
        image: 'math.jpg',
        rating: 4,
        description: 'Master the fundamentals of mathematics! From algebra to calculus, develop strong problem-solving skills and logical thinking in an engaging, supportive environment.',
        includes: [
            'Professional instruction from certified teachers',
            'All learning materials and worksheets',
            'Weekly progress assessments',
            'Certificate upon completion'
        ]
    },
    {
        subject: 'English Literature',
        location: 'Curepipe',
        price: 1200,
        spaces: 5,
        image: 'english.jpg',
        rating: 5,
        description: 'Enhance your language skills through literature, creative writing, and critical analysis. Build confidence in communication and expression.',
        includes: [
            'Professional instruction',
            'Reading materials and novels',
            'Writing portfolio development',
            'Certificate upon completion'
        ]
    },
    {
        subject: 'Music Theory',
        location: 'Quatre Bornes',
        price: 1800,
        spaces: 5,
        image: 'music.jpg',
        rating: 4,
        description: 'Discover the joy of music! Learn to read notation, play instruments, and understand music theory while developing your creative expression.',
        includes: [
            'Professional instruction',
            'Access to musical instruments',
            'Sheet music and theory books',
            'Certificate upon completion'
        ]
    },
    {
        subject: 'Science',
        location: 'Rose Hill',
        price: 1600,
        spaces: 5,
        image: 'science.jpg',
        rating: 5,
        description: 'Explore the wonders of the natural world through hands-on experiments and discovery. Build a foundation in scientific inquiry and critical thinking.',
        includes: [
            'Professional instruction',
            'Lab equipment and materials',
            'Safety gear provided',
            'Certificate upon completion'
        ]
    },
    {
        subject: 'Art & Design',
        location: 'Vacoas',
        price: 1400,
        spaces: 5,
        image: 'art.jpg',
        rating: 4,
        description: 'Unleash your creativity! Learn various artistic techniques, from drawing to painting, and develop your unique artistic voice.',
        includes: [
            'Professional instruction',
            'All art supplies included',
            'Portfolio development',
            'Certificate upon completion'
        ]
    },
    {
        subject: 'History',
        location: 'Beau Bassin',
        price: 1100,
        spaces: 5,
        image: 'history.jpg',
        rating: 3,
        description: 'Journey through time and explore the events that shaped our world. Develop critical thinking through analyzing historical sources and perspectives.',
        includes: [
            'Professional instruction',
            'Historical documents and resources',
            'Field trip to local museums',
            'Certificate upon completion'
        ]
    },
    {
        subject: 'Geography',
        location: 'Mahebourg',
        price: 1000,
        spaces: 5,
        image: 'geography.jpg',
        rating: 4,
        description: 'Discover our world! Learn about landscapes, cultures, and environmental systems while developing spatial awareness and global understanding.',
        includes: [
            'Professional instruction',
            'Maps and atlases',
            'Field trips to geographical sites',
            'Certificate upon completion'
        ]
    },
    {
        subject: 'Physical Education',
        location: 'Flic en Flac',
        price: 900,
        spaces: 5,
        image: 'pe.jpg',
        rating: 5,
        description: 'Get active and healthy! Develop physical fitness, teamwork skills, and sportsmanship through various sports and physical activities.',
        includes: [
            'Professional coaching',
            'Sports equipment provided',
            'Fitness assessments',
            'Certificate upon completion'
        ]
    },
    {
        subject: 'Drama & Theatre',
        location: 'Grand Baie',
        price: 1300,
        spaces: 5,
        image: 'drama.jpg',
        rating: 4,
        description: 'Step into the spotlight! Build confidence, creativity, and communication skills through theatrical performance and improvisation.',
        includes: [
            'Professional instruction',
            'Costumes and props',
            'End-of-term performance',
            'Certificate upon completion'
        ]
    },
    {
        subject: 'Computer Science',
        location: 'Ebene',
        price: 2000,
        spaces: 5,
        image: 'it.jpg',
        rating: 5,
        description: 'Navigate the digital world! Learn programming, digital literacy, and technology skills essential for the modern age.',
        includes: [
            'Professional instruction',
            'Computer access provided',
            'Software licenses included',
            'Certificate upon completion'
        ]
    },
    {
        subject: 'French Language',
        location: 'Port Louis',
        price: 1400,
        spaces: 5,
        image: 'french.jpg',
        rating: 4,
        description: 'Bonjour! Start your journey into the French language and culture. Learn practical conversation skills, vocabulary, and grammar in a lively, interactive setting.',
        includes: [
            'Professional instruction',
            'Textbooks and workbooks',
            'Audio materials',
            'Certificate upon completion'
        ]
    },
    {
        subject: 'Swimming',
        location: 'Pereybere',
        price: 1700,
        spaces: 5,
        image: 'swimming.jpg',
        rating: 5,
        description: 'Learn to swim with confidence! From beginners to advanced, develop proper swimming techniques and water safety skills in a fun environment.',
        includes: [
            'Professional certified instructors',
            'Pool access included',
            'Swimming equipment provided',
            'Certificate upon completion'
        ]
    }
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

        // Create text index for search functionality
        try {
            await db.collection('lessons').createIndex({
                subject: 'text',
                location: 'text',
                description: 'text'
            });
            console.log('✓ Created text index for search');
        } catch (indexError) {
            console.log('Note: Text index may already exist');
        }

        console.log('\n✓ Database seeded successfully!');
        console.log('\nLesson Summary:');
        console.log('- 12 lessons with Mauritius locations');
        console.log('- Prices in Mauritian Rupees (Rs)');
        console.log('- Each lesson has: subject, location, price, spaces, icon, image, rating, description, includes');
    } catch (error) {
        console.error('✗ Error seeding database:', error);
    } finally {
        await client.close();
        console.log('✓ Connection closed');
    }
}

seedDatabase();
