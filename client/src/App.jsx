

import React, { useState, useEffect } from 'react';
import './App.css'; // Import the main App CSS
import LoginPage from './LoginPage';
import RegistrationPage from './RegistrationPage';
import MainPage from './MainPage';

const App = () => {
  const [currentPage, setCurrentPage] = useState('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [message, setMessage] = useState(''); // State for messages to pass to login/register

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      setCurrentPage('main');
    } else {
      setIsAuthenticated(false);
      setCurrentPage('login');
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setCurrentPage('main');
  };

  const handleNavigateToRegister = () => {
    setCurrentPage('register');
    setMessage(''); // Clear messages when navigating
  };

  const handleNavigateToLogin = () => {
    setCurrentPage('login');
    setMessage(''); // Clear messages when navigating
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    setCurrentPage('login');
    setMessage(''); // Clear messages on logout
  };

  return (
    <div className="app-container">
      <div className="app-card">
        {currentPage === 'login' && (
          <LoginPage
            onLoginSuccess={handleLoginSuccess}
            onNavigateToRegister={handleNavigateToRegister}
            message={message}
            setMessage={setMessage}
          />
        )}
        {currentPage === 'register' && (
          <RegistrationPage
            onNavigateToLogin={handleNavigateToLogin}
            message={message}
            setMessage={setMessage}
          />
        )}
        {currentPage === 'main' && (
          <MainPage onLogout={handleLogout} />
        )}
      </div>
    </div>
  );
};

export default App;
