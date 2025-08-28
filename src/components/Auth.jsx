import { useState } from 'react';
import apiService from '../services/api';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      let result;
      if (isLogin) {
        result = await apiService.login({
          email: formData.email,
          password: formData.password
        });
      } else {
        result = await apiService.register({
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
      }

      if (result.success) {
        setUser(result.user);
        setMessage(`${isLogin ? 'Login' : 'Registration'} successful! Welcome ${result.user.name}!`);
        setFormData({ name: '', email: '', password: '' });
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    apiService.logout();
    setUser(null);
    setMessage('Logged out successfully!');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (user) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-green-600 mb-4">Welcome!</h2>
        <div className="space-y-2">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>User ID:</strong> {user.id}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <div className="flex mb-4">
        <button
          onClick={() => setIsLogin(true)}
          className={`flex-1 py-2 px-4 text-center ${
            isLogin ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Login
        </button>
        <button
          onClick={() => setIsLogin(false)}
          className={`flex-1 py-2 px-4 text-center ${
            !isLogin ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Register
        </button>
      </div>

      <h2 className="text-2xl font-bold mb-4">
        {isLogin ? 'Login' : 'Register'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required={!isLogin}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="6"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
        </button>
      </form>

      {message && (
        <div className={`mt-4 p-3 rounded ${
          message.includes('Error') 
            ? 'bg-red-100 text-red-700' 
            : 'bg-green-100 text-green-700'
        }`}>
          {message}
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600">
        <p><strong>Test MongoDB Connection:</strong></p>
        <p>Once deployed, visit: <code>/api/test</code></p>
      </div>
    </div>
  );
};

export default Auth;
