import React, { useState, useEffect } from 'react';
import apiService from './services/api';

function App() {
  const [users, setUsers] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '' });
  const [showRegister, setShowRegister] = useState(false);
  const [message, setMessage] = useState('');

  // Check authentication on load
  useEffect(() => {
    if (apiService.isAuthenticated()) {
      const user = apiService.getCurrentUser();
      if (user) {
        setIsLoggedIn(true);
        setCurrentUser(user);
        fetchUsers();
      }
    }
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await apiService.request('/users');
      if (response.success) {
        setUsers(response.users);
      }
    } catch (error) {
      setMessage(`Error fetching users: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const result = await apiService.login(loginData);
      if (result.success) {
        setIsLoggedIn(true);
        setCurrentUser(result.user);
        setMessage('Login successful!');
        fetchUsers();
      }
    } catch (error) {
      setMessage(`Login error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const result = await apiService.register(registerData);
      if (result.success) {
        setIsLoggedIn(true);
        setCurrentUser(result.user);
        setMessage('Registration successful!');
        fetchUsers();
      }
    } catch (error) {
      setMessage(`Registration error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    apiService.logout();
    setIsLoggedIn(false);
    setCurrentUser(null);
    setUsers([]);
    setMessage('Logged out successfully');
  };

  // Login/Register Form
  if (!isLoggedIn) {
    return (
      <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
        <h1>Task Manager</h1>
        
        <div style={{ marginBottom: '20px' }}>
          <button
            onClick={() => setShowRegister(false)}
            style={{
              marginRight: '10px',
              padding: '10px 20px',
              backgroundColor: !showRegister ? '#007bff' : '#f8f9fa',
              color: !showRegister ? 'white' : 'black',
              border: '1px solid #007bff',
              cursor: 'pointer'
            }}
          >
            Login
          </button>
          <button
            onClick={() => setShowRegister(true)}
            style={{
              padding: '10px 20px',
              backgroundColor: showRegister ? '#007bff' : '#f8f9fa',
              color: showRegister ? 'white' : 'black',
              border: '1px solid #007bff',
              cursor: 'pointer'
            }}
          >
            Register
          </button>
        </div>

        {!showRegister ? (
          <form onSubmit={handleLogin}>
            <h2>Login</h2>
            <div style={{ marginBottom: '15px' }}>
              <input
                type="email"
                placeholder="Email"
                value={loginData.email}
                onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                style={{ width: '100%', padding: '10px' }}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <h2>Register</h2>
            <div style={{ marginBottom: '15px' }}>
              <input
                type="text"
                placeholder="Full Name"
                value={registerData.name}
                onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={registerData.email}
                onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
                required
              />
              <input
                type="password"
                placeholder="Password (min 6 chars)"
                value={registerData.password}
                onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                style={{ width: '100%', padding: '10px' }}
                minLength="6"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
        )}

        {message && (
          <div style={{
            marginTop: '20px',
            padding: '10px',
            backgroundColor: message.includes('Error') || message.includes('error') ? '#f8d7da' : '#d4edda',
            color: message.includes('Error') || message.includes('error') ? '#721c24' : '#155724',
            border: '1px solid',
            borderColor: message.includes('Error') || message.includes('error') ? '#f5c6cb' : '#c3e6cb'
          }}>
            {message}
          </div>
        )}
      </div>
    );
  }

  // Main App (Logged in)
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Welcome, {currentUser?.name}!</h1>
        <button
          onClick={handleLogout}
          style={{
            padding: '10px 20px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>

      <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f8f9fa', border: '1px solid #dee2e6' }}>
        <h3>User Info</h3>
        <p><strong>Name:</strong> {currentUser?.name}</p>
        <p><strong>Email:</strong> {currentUser?.email}</p>
        <p><strong>User ID:</strong> {currentUser?.id}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>All Registered Users</h2>
          <button
            onClick={fetchUsers}
            disabled={loading}
            style={{
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Loading...' : 'Refresh Users'}
          </button>
        </div>

        {users.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#f8f9fa' }}>
            <h3>No Users Found</h3>
            <p>Users will appear here once they register through the API.</p>
            {message.includes('Error') && (
              <p style={{ color: '#dc3545' }}>
                This might be because you're in local development mode. Deploy to Vercel to test with real MongoDB.
              </p>
            )}
          </div>
        ) : (
          <div style={{ border: '1px solid #dee2e6' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Name</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Email</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>User ID</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user._id} style={{ borderBottom: '1px solid #dee2e6' }}>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          backgroundColor: '#007bff',
                          color: 'white',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: '10px',
                          fontSize: '14px',
                          fontWeight: 'bold'
                        }}>
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        {user.name}
                      </div>
                    </td>
                    <td style={{ padding: '12px' }}>{user.email}</td>
                    <td style={{ padding: '12px', fontFamily: 'monospace', fontSize: '12px' }}>
                      {user._id.slice(-8)}...
                    </td>
                    <td style={{ padding: '12px' }}>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e7f3ff', border: '1px solid #b8daff' }}>
          <h4>📊 Statistics</h4>
          <p><strong>Total Users:</strong> {users.length}</p>
          <p><strong>New This Week:</strong> {users.filter(u => new Date(u.createdAt) > new Date(Date.now() - 7*24*60*60*1000)).length}</p>
          <p><strong>New Today:</strong> {users.filter(u => new Date(u.createdAt) > new Date(Date.now() - 24*60*60*1000)).length}</p>
        </div>
      </div>

      {message && (
        <div style={{
          marginTop: '20px',
          padding: '10px',
          backgroundColor: message.includes('Error') || message.includes('error') ? '#f8d7da' : '#d4edda',
          color: message.includes('Error') || message.includes('error') ? '#721c24' : '#155724',
          border: '1px solid',
          borderColor: message.includes('Error') || message.includes('error') ? '#f5c6cb' : '#c3e6cb'
        }}>
          {message}
        </div>
      )}
    </div>
  );
}

export default App;
