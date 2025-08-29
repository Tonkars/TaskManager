const connectDB = require('../lib/mongodb.js');
const User = require('../models/User.js');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();
    
    // Get database stats
    const userCount = await User.countDocuments();
    const users = await User.find({}, '-password').sort({ createdAt: -1 }).limit(10);
    
    // Get database info
    const dbName = User.db.databaseName;
    const collections = await User.db.listCollections().toArray();
    
    res.status(200).json({
      success: true,
      database: {
        name: dbName,
        collections: collections.map(c => c.name)
      },
      userStats: {
        totalUsers: userCount,
        recentUsers: users.map(u => ({
          id: u._id,
          name: u.name,
          email: u.email,
          createdAt: u.createdAt
        }))
      },
      mongooseConnection: {
        readyState: User.db.readyState,
        host: User.db.host,
        name: User.db.name
      }
    });

  } catch (error) {
    console.error('Database stats error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to get database stats',
      error: error.message
    });
  }
}
