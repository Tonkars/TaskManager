import { useState, useEffect } from 'react';
import apiService from '../services/api';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await apiService.request('/users');
      if (response.success) {
        setUsers(response.users);
      } else {
        setError('Failed to fetch users');
      }
    } catch (error) {
      setError(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">All Users</h2>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2">Loading users...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">All Users</h2>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <button 
          onClick={fetchUsers}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">All Users</h2>
        <div className="flex items-center space-x-4">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
            {users.length} total users
          </span>
          <button 
            onClick={fetchUsers}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-sm"
          >
            Refresh
          </button>
        </div>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-xl font-semibold mb-2">No Users Yet</h3>
          <p>Users will appear here once they register through the app.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">User ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user, index) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 font-mono">
                      {user._id.slice(-8)}...
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {formatDate(user.createdAt)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary Stats */}
      {users.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{users.length}</div>
              <div className="text-sm text-blue-800">Total Users</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {users.filter(u => new Date(u.createdAt) > new Date(Date.now() - 7*24*60*60*1000)).length}
              </div>
              <div className="text-sm text-green-800">New This Week</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {users.filter(u => new Date(u.createdAt) > new Date(Date.now() - 24*60*60*1000)).length}
              </div>
              <div className="text-sm text-purple-800">New Today</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
