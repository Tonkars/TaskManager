import { useState, useEffect } from 'react';
import apiService from '../services/api';

const ConnectionStatus = () => {
  const [status, setStatus] = useState('checking'); // checking, connected, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await apiService.request('/test');
        if (response.success) {
          setStatus('connected');
          setMessage('Connected to MongoDB');
        } else {
          setStatus('error');
          setMessage('Connection failed');
        }
      } catch (error) {
        setStatus('error');
        setMessage(error.message.includes('Network error') 
          ? 'Local development - Deploy to Vercel to test API' 
          : error.message
        );
      }
    };

    checkConnection();
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'error':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'connected':
        return '✅';
      case 'error':
        return '⚠️';
      default:
        return '🔄';
    }
  };

  return (
    <div className={`px-3 py-2 rounded-lg border text-sm ${getStatusColor()}`}>
      <div className="flex items-center space-x-2">
        <span>{getStatusIcon()}</span>
        <span className="font-medium">
          {status === 'checking' ? 'Checking connection...' : message}
        </span>
      </div>
    </div>
  );
};

export default ConnectionStatus;
