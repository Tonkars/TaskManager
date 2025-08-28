import connectDB from '../../../lib/mongodb.js';
import Task from '../../../models/Task.js';
import { authenticate } from '../../../lib/auth.js';

export default async function handler(req, res) {
  try {
    await connectDB();
    
    // Authenticate user
    const user = await authenticate(req);
    
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ message: 'Task ID is required' });
    }

    switch (req.method) {
      case 'GET':
        // Get specific task
        const task = await Task.findOne({ _id: id, user: user._id });
        if (!task) {
          return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json({ success: true, task });
        break;

      case 'PUT':
        // Update task
        const updateData = req.body;
        const updatedTask = await Task.findOneAndUpdate(
          { _id: id, user: user._id },
          updateData,
          { new: true, runValidators: true }
        );
        
        if (!updatedTask) {
          return res.status(404).json({ message: 'Task not found' });
        }
        
        res.status(200).json({ success: true, task: updatedTask });
        break;

      case 'DELETE':
        // Delete task
        const deletedTask = await Task.findOneAndDelete({ _id: id, user: user._id });
        
        if (!deletedTask) {
          return res.status(404).json({ message: 'Task not found' });
        }
        
        res.status(200).json({ success: true, message: 'Task deleted successfully' });
        break;

      default:
        res.status(405).json({ message: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Task [id] API error:', error);
    if (error.message === 'Authentication failed') {
      return res.status(401).json({ message: 'Authentication required' });
    }
    res.status(500).json({ message: 'Server error' });
  }
}
