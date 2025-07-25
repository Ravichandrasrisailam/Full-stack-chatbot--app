

import React, { useState } from 'react';
import './RegistrationPage.css'; // Import page-specific CSS

const RegistrationPage = ({ onNavigateToLogin, message, setMessage }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage(''); // Clear previous messages

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
        }, 1500); // Short delay before navigating
      } else {
        setMessage(data.message || 'Registration failed. Please try a different username.');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setMessage('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="register-page-container">
      <h2 className="register-page-title">
        Join Us!
      </h2>
      <p className="register-page-description">
        Create an account to start chatting with Mida.
      </p>
      <form onSubmit={handleRegister} className="register-form">
        <div className="register-form-group">
          <label htmlFor="regUsername" className="register-form-label">
            Username:
          </label>
          <input
            type="text"
            id="regUsername"
            className="register-form-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Choose a username"
          />
        </div>
        <div className="register-form-group">
          <label htmlFor="regPassword" className="register-form-label">
            Password:
          </label>
          <input
            type="password"
            id="regPassword"
            className="register-form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Create a password"
          />
        </div>
        <button type="submit" className="register-form-button">
          Register
        </button>
        {message && (
          <p className={`register-message-text ${message.includes('successful') ? 'success' : 'error'}`}>
            {message}
          </p>
        )}
      </form>
      <p className="register-navigation-link-text">
        Already have an account?{' '}
        <button
          onClick={onNavigateToLogin}
          className="register-navigation-link-button"
        >
          Login here.
        </button>
      </p>
    </div>
  );
};

export default RegistrationPage;
