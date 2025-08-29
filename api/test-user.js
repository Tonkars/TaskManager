const connectDB = require('../lib/mongodb.js');
const User = require('../models/User.js');

module.exports = async function handler(req, res) {
  // Allow both GET and POST for testing
  if (!['GET', 'POST'].includes(req.method)) {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();
    
    // Create a test user
    const testUser = new User({
      name: 'Test User',
      email: `test-${Date.now()}@example.com`,
      password: 'testpass123'
    });
    
    const savedUser = await testUser.save();
    
    // Get all users to verify
    const allUsers = await User.find({}, '-password');
    
    res.status(200).json({
      success: true,
      message: 'Test user created successfully!',
      testUser: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        createdAt: savedUser.createdAt
      },
      totalUsers: allUsers.length,
      allUsers: allUsers.map(u => ({
        id: u._id,
        name: u.name,
        email: u.email,
        createdAt: u.createdAt
      }))
    });

  } catch (error) {
    console.error('Test user creation error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Test failed',
      error: error.message,
      stack: error.stack
    });
  }
}
