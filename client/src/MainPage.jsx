


// import React, { useState, useEffect, useRef } from 'react';
// import './MainPage.css'; // Import your CSS file


// const MainPage = ({ onLogout }) => {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   const handleSendMessage = async () => {
//     if (input.trim() === '') return;

//     const newUserMessage = {
//       text: input,
//       sender: 'user',
//       timestamp: new Date().toLocaleTimeString(),
//     };
//     setMessages((prev) => [...prev, newUserMessage]);
//     setInput('');
//     setIsLoading(true);

//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         onLogout();
//         return;
//       }

//       const chatHistory = messages.slice(-5).map((msg) => ({
//         role: msg.sender === 'user' ? 'user' : 'model',
//         parts: [{ text: msg.text }],
//       }));
//       chatHistory.push({ role: 'user', parts: [{ text: newUserMessage.text }] });

//       const response = await fetch('https://full-stack-chatbot-app.onrender.com/api/chat', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ contents: chatHistory }),
//       });

//       const data = await response.json();
//       if (response.ok) {
//         const botResponse = {
//           text: data.message,
//           sender: 'bot',
//           timestamp: new Date().toLocaleTimeString(),
//         };
//         setMessages((prev) => [...prev, botResponse]);
//       } else {
//         const errorBot = {
//           text: `Error: ${data.message || 'Could not get response.'}`,
//           sender: 'bot',
//           timestamp: new Date().toLocaleTimeString(),
//         };
//         setMessages((prev) => [...prev, errorBot]);
//         if (response.status === 401 || response.status === 403) onLogout();
//       }
//     } catch (error) {
//       const errorBot = {
//         text: 'An error occurred. Please try again later.',
//         sender: 'bot',
//         timestamp: new Date().toLocaleTimeString(),
//       };
//       setMessages((prev) => [...prev, errorBot]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   return (
//     <div className="main-container">
//       {/* Header */}
//       <div className="chat-header">
//         <h1 className="chat-title">Mivada's Chatbot</h1>
//         <button onClick={onLogout} className="logout-button">Logout</button>
//       </div>

//       {/* Chat Messages */}
//       <div className="chat-messages-area">
//         {messages.map((msg, index) => (
//           <div key={index} className={`message-wrapper ${msg.sender}`}>
//             <div className={`message-box ${msg.sender}`}>
//               <p>{msg.text}</p>
//               <span className="timestamp">{msg.timestamp}</span>
//             </div>
//           </div>
//         ))}
//         {isLoading && (
//           <div className="loading-indicator">
//             <div className="spinner"></div>
//             <span>Thinking...</span>
//           </div>
//         )}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* Input Box */}
//       <div className="input-area">
//         <textarea
//           placeholder="What's on your mind..."
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyPress={handleKeyPress}
//           rows="1"
//           className="message-input"
//         />
//         <button onClick={handleSendMessage} className="send-button">
//           <svg xmlns="http://www.w3.org/2000/svg" className="send-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
//           </svg>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default MainPage;

// import React, { useState, useEffect, useRef } from 'react';
// import './MainPage.css'; // Make sure this file exists and its name is EXACTLY 'MainPage.css'
// import ReactMarkdown from 'react-markdown'; // <-- NEW: Import ReactMarkdown
// import remarkGfm from 'remark-gfm';       // <-- NEW: Import remarkGfm for GitHub Flavored Markdown

// const MainPage = ({ onLogout }) => {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const handleSendMessage = async () => {
//     if (input.trim() === '') return;

//     const newUserMessage = { text: input, sender: 'user', timestamp: new Date().toLocaleTimeString() };
//     setMessages((prevMessages) => [...prevMessages, newUserMessage]);
//     setInput('');
//     setIsLoading(true);

//     try {
//       // Use your Render backend URL here. Make sure it's correct.
//       const backendUrl = 'https://full-stack-chatbot-app.onrender.com'; // !!! IMPORTANT: REPLACE with YOUR ACTUAL Render URL if different!

//       const token = localStorage.getItem('token');
//       if (!token) {
//         console.error("No authentication token found.");
//         onLogout();
//         return;
//       }

//       const chatHistoryForAPI = messages.slice(-5).map(msg => ({
//           role: msg.sender === 'user' ? 'user' : 'model',
//           parts: [{ text: msg.text }]
//       }));
//       chatHistoryForAPI.push({ role: 'user', parts: [{ text: newUserMessage.text }] });

//       const payload = { contents: chatHistoryForAPI };

//       const response = await fetch(`${backendUrl}/api/chat`, { // Correctly appending API path
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify(payload)
//       });

//       const data = await response.json();

//       if (response.ok) {
//         const botResponse = { text: data.message, sender: 'bot', timestamp: new Date().toLocaleTimeString() };
//         setMessages((prevMessages) => [...prevMessages, botResponse]);
//       } else {
//         console.error("Backend error:", data.message);
//         const errorBotResponse = { text: `Error: ${data.message || 'Could not get response from AI.'}`, sender: 'bot', timestamp: new Date().toLocaleTimeString() };
//         setMessages((prevMessages) => [...prevMessages, errorBotResponse]);
//         if (response.status === 401 || response.status === 403) {
//           onLogout();
//         }
//       }
//     } catch (error) {
//       console.error("Error communicating with backend:", error);
//       const errorBotResponse = { text: "An error occurred. Please check your network or try again.", sender: 'bot', timestamp: new Date().toLocaleTimeString() };
//       setMessages((prevMessages) => [...prevMessages, errorBotResponse]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   return (
//     <div className="main-page-container">
//       {/* Header */}
//       <div className="chat-header">
//         <h1 className="chat-header-title">
//           Awesome Chatbot
//         </h1>
//         <button
//           onClick={onLogout}
//           className="logout-button"
//         >
//           Logout
//         </button>
//       </div>

//       {/* Chat Messages Area */}
//       <div className="chat-messages-area custom-scrollbar">
//         {messages.map((msg, index) => (
//           <div
//             key={index}
//             className={`message-bubble ${msg.sender === 'user' ? 'user-message-bubble' : 'bot-message-bubble'}`}
//           >
//             <div
//               className={`message-content ${msg.sender === 'user' ? 'user-message-content' : 'bot-message-content'}`}
//             >
//               {/* This is the NEW part: Conditionally render based on sender */}
//               {msg.sender === 'bot' ? (
//                 // If it's a bot message, use ReactMarkdown to render it
//                 <ReactMarkdown remarkPlugins={[remarkGfm]}>
//                   {msg.text}
//                 </ReactMarkdown>
//               ) : (
//                 // If it's a user message, render as plain paragraph text
//                 <p className="message-text-content">{msg.text}</p>
//               )}
//               <span className="message-timestamp">
//                 {msg.timestamp}
//               </span>
//             </div>
//           </div>
//         ))}
//         {/* Loading indicator */}
//         {isLoading && (
//           <div className="bot-typing-indicator">
//             <div className="spinner"></div>
//             <span className="typing-text">Bot is typing...</span>
//           </div>
//         )}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* Message Input Area */}
//       <div className="chat-input-area">
//         <div className="input-flex-container">
//           <textarea
//             className="message-input custom-scrollbar"
//             placeholder="Type your message..."
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyPress={handleKeyPress}
//             rows="1"
//           />
//           <button
//             onClick={handleSendMessage}
//             className="send-button"
//           >
//             {/* Send Icon SVG */}
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="send-icon"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M14 5l7 7m0 0l-7 7m7-7H3"
//               />
//             </svg>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MainPage;

import React, { useState, useEffect, useRef } from 'react';
import './MainPage.css'; // Import your CSS file
import ReactMarkdown from 'react-markdown'; // <-- NEW: Import ReactMarkdown library
import remarkGfm from 'remark-gfm';       // <-- NEW: Import remarkGfm plugin for GitHub Flavored Markdown


const MainPage = ({ onLogout }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    const newUserMessage = {
      text: input,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, newUserMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        onLogout();
        return;
      }

      const chatHistory = messages.slice(-5).map((msg) => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }],
      }));
      chatHistory.push({ role: 'user', parts: [{ text: newUserMessage.text }] });

      // Using your specified URL from your old code
      const response = await fetch('https://full-stack-chatbot-app.onrender.com/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ contents: chatHistory }),
      });

      const data = await response.json();
      if (response.ok) {
        const botResponse = {
          text: data.message,
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString(),
        };
        setMessages((prev) => [...prev, botResponse]);
      } else {
        const errorBot = {
          text: `Error: ${data.message || 'Could not get response.'}`,
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString(),
        };
        setMessages((prev) => [...prev, errorBot]);
        if (response.status === 401 || response.status === 403) onLogout();
      }
    } catch (error) {
      const errorBot = {
        text: 'An error occurred. Please try again later.',
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, errorBot]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="main-container">
      {/* Header */}
      <div className="chat-header">
        <h1 className="chat-title">Mivada's Chatbot</h1>
        <button onClick={onLogout} className="logout-button">Logout</button>
      </div>

      {/* Chat Messages */}
      <div className="chat-messages-area">
        {messages.map((msg, index) => (
          <div key={index} className={`message-wrapper ${msg.sender}`}>
            <div className={`message-box ${msg.sender}`}>
              {/* Conditional rendering based on sender for Markdown */}
              {msg.sender === 'bot' ? (
                // Use ReactMarkdown for bot messages to render formatting
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {msg.text}
                </ReactMarkdown>
              ) : (
                // Keep original <p> tag for user messages
                <p>{msg.text}</p>
              )}
              <span className="timestamp">{msg.timestamp}</span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="loading-indicator">
            <div className="spinner"></div>
            <span>Thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="input-area">
        <textarea
          placeholder="What's on your mind..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          rows="1"
          className="message-input"
        />
        <button onClick={handleSendMessage} className="send-button">
          <svg xmlns="http://www.w3.org/2000/svg" className="send-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default MainPage;
