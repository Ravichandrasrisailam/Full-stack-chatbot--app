

import React, { useState } from 'react';
import './RegistrationPage.css';

const RegistrationPage = ({ onNavigateToLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch('https://full-stack-chatbot-app.onrender.com/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Registration successful! Please log in.');
        setTimeout(() => {
          onNavigateToLogin();
        }, 1500);
      } else {
        setMessage(data.message || 'Registration failed. Please try a different username.');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setMessage('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registration-container">
      <h2 className="registration-title">Register yourself</h2>
      <p className="registration-description">
        Create an account to meet Mivada's AI.
      </p>
      <form onSubmit={handleRegister} className="registration-form">
        <div className="form-group">
          <label htmlFor="regUsername" className="form-label">Username:</label>
          <input
            type="text"
            id="regUsername"
            className="form-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Choose a username"
          />
        </div>
        <div className="form-group">
          <label htmlFor="regPassword" className="form-label">Password:</label>
          <input
            type="password"
            id="regPassword"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Choose your secret key"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`submit-button ${loading ? 'disabled' : ''}`}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>

        {message && (
          <p className={`form-message ${message.includes('successful') ? 'success' : 'error'}`}>
            {message}
          </p>
        )}

        <p className="login-link-text">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onNavigateToLogin}
            className="login-link-button"
          >
            Login here
          </button>
        </p>
      </form>
    </div>
  );
};

export default RegistrationPage;

    
