    import React, { useState, useEffect } from 'react';
    import LoginPage from "./Loginpage.jsx";
    import RegistrationPage from "./Registrationpage.jsx";
    import MainPage from "./mainpage.jsx";


    const App = () => {
      // State for current page: 'login', 'register', or 'main'
      const [currentPage, setCurrentPage] = useState('login');
      // State to track if user is authenticated (checked via token)
      const [isAuthenticated, setIsAuthenticated] = useState(false);
      // State to indicate if initial authentication check is done
      const [isAuthCheckComplete, setIsAuthCheckComplete] = useState(false);

      // Effect to check for existing token on component mount
      useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
          // In a real app, you'd send this token to the backend to verify its validity
          // For now, we'll assume a token means authenticated
          setIsAuthenticated(true);
          setCurrentPage('main');
        }
        setIsAuthCheckComplete(true); // Mark auth check as complete
      }, []);

      // Function to handle successful login
      const handleLoginSuccess = () => {
        setIsAuthenticated(true);
        setCurrentPage('main');
      };

      // Function to handle logout
      const handleLogout = () => {
        localStorage.removeItem('token'); // Remove JWT token
        setIsAuthenticated(false);
        setCurrentPage('login');
      };

      if (!isAuthCheckComplete) {
        return (
          <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="ml-4 text-lg text-gray-700">Loading...</p>
          </div>
        );
      }

      let content;
      switch (currentPage) {
        case 'login':
          content = <LoginPage onLoginSuccess={handleLoginSuccess} onNavigateToRegister={() => setCurrentPage('register')} />;
          break;
        case 'register':
          content = <RegistrationPage onNavigateToLogin={() => setCurrentPage('login')} />;
          break;
        case 'main':
          content = <MainPage onLogout={handleLogout} />;
          break;
        default:
          content = <LoginPage onLoginSuccess={handleLoginSuccess} onNavigateToRegister={() => setCurrentPage('register')} />;
      }

      return (
        // Main container with full viewport height and flexible centering
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans antialiased">
          {/* Card-like container for the app content */}
          <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl h-[90vh] flex flex-col md:flex-row overflow-hidden">
            {content}
          </div>
        </div>
      );
    };

    export default App;
    