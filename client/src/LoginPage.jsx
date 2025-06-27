


import React, { useState } from 'react';
import './LoginPage.css'; // Import page-specific CSS

const LoginPage = ({ onLoginSuccess, onNavigateToRegister, message, setMessage }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');


  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage(''); // Clear previous messages

    try {
      const response = await fetch('https://full-stack-chatbot-app.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token); // Store JWT token
        setMessage('Login successful!');
        setTimeout(() => {
          onLoginSuccess(); // Navigate to main page
        }, 1000); // Short delay for message to show
      } else {
        setMessage(data.message || 'Login failed.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setMessage('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="login-page-container">
      <h2 className="login-page-title">
        Welcome Back!
      </h2>
      <p className="login-page-description">
        Log in to chat with Mida, your Mivada assistant.
      </p>
      <form onSubmit={handleLogin} className="login-form">
        <div className="login-form-group">
          <label htmlFor="loginUsername" className="login-form-label">
            Username:
          </label>
          <input
            type="text"
            id="loginUsername"
            className="login-form-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Enter your username"
          />
        </div>
        <div className="login-form-group">
          <label htmlFor="loginPassword" className="login-form-label">
            Password:
          </label>
          <input
            type="password"
            id="loginPassword"
            className="login-form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
          />
        </div>
        <button type="submit" className="login-form-button">
          Login
        </button>
        {message && (
          <p className={`login-message-text ${message.includes('successful') ? 'success' : 'error'}`}>
            {message}
          </p>
        )}
      </form>
      <p className="login-navigation-link-text">
        Don't have an account?{' '}
        <button
          onClick={onNavigateToRegister}
          className="login-navigation-link-button"
        >
          Register here.
        </button>
      </p>
    </div>
  );
};

export default LoginPage;
