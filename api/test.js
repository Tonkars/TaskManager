import connectDB from '../lib/mongodb.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();
    res.status(200).json({ 
      success: true,
      message: 'MongoDB connected successfully!',
      database: 'taskmanager',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    res.status(500).json({ 
      success: false,
      error: 'MongoDB connection failed', 
      details: error.message 
    });
  }
}
