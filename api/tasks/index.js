import connectDB from '../../lib/mongodb.js';
import Task from '../../models/Task.js';
import { authenticate } from '../../lib/auth.js';

export default async function handler(req, res) {
  try {
    await connectDB();
    
    // Authenticate user
    const user = await authenticate(req);

    switch (req.method) {
      case 'GET':
        // Get all tasks for the authenticated user
        const tasks = await Task.find({ user: user._id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, tasks });
        break;

      case 'POST':
        // Create a new task
        const { title, description, priority, dueDate } = req.body;
        
        if (!title) {
          return res.status(400).json({ message: 'Task title is required' });
        }

        const task = await Task.create({
          title,
          description,
          priority,
          dueDate: dueDate ? new Date(dueDate) : undefined,
          user: user._id
        });

        res.status(201).json({ success: true, task });
        break;

      default:
        res.status(405).json({ message: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Tasks API error:', error);
    if (error.message === 'Authentication failed') {
      return res.status(401).json({ message: 'Authentication required' });
    }
    res.status(500).json({ message: 'Server error' });
  }
}
