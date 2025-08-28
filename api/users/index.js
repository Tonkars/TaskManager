import connectDB from '../../lib/mongodb.js';
import User from '../../models/User.js';
import { authenticate } from '../../lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();
    
    // Authenticate user (optional - remove if you want public access)
    // const user = await authenticate(req);

    // Get all users (excluding passwords)
    const users = await User.find({}, '-password').sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: users.length,
      users
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message 
    });
  }
}
