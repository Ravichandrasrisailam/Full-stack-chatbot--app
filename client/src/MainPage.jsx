

//old-1
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

//used-1

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

//modifed-1

// import React, { useState, useEffect, useRef } from 'react';
// import './MainPage.css'; // Import your CSS file
// import ReactMarkdown from 'react-markdown'; // <-- NEW: Import ReactMarkdown library
// import remarkGfm from 'remark-gfm';       // <-- NEW: Import remarkGfm plugin for GitHub Flavored Markdown


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

//       // Using your specified URL from your old code
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
//               {/* Conditional rendering based on sender for Markdown */}
//               {msg.sender === 'bot' ? (
//                 // Use ReactMarkdown for bot messages to render formatting
//                 <ReactMarkdown remarkPlugins={[remarkGfm]}>
//                   {msg.text}
//                 </ReactMarkdown>
//               ) : (
//                 // Keep original <p> tag for user messages
//                 <p>{msg.text}</p>
//               )}
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
// import './MainPage.css'; // Import your CSS file
// import ReactMarkdown from 'react-markdown';
// import remarkGfm from 'remark-gfm';

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

//       // --- START OF NEW/MODIFIED CODE FOR FAQ ---
//       const chatHistoryForAPI = [];

//       // Add a system instruction (initial prompt) to set the context for the AI
//       // This tells the AI to act as an FAQ bot for your SchoolApp modules
//       const systemInstruction = {
//         role: 'user', // System instructions are often best sent as user roles for Gemini API
//         parts: [{ text: `You are an AI assistant for "Mivada's School". Your primary role is to provide information and help users with issues related to the following modules:
// - Attendance
// - Time Table
// - Curriculum
// - Leave
// - Staff schedules
// - Admin functionality

// Please provide clear and concise answers. If a user asks about an issue, guide them on where to find information or whom to contact within these modules. Do not answer questions outside of SchoolApp modules. If you cannot help, suggest contacting an administrator.` }]
//       };
//       chatHistoryForAPI.push(systemInstruction); // Add the system instruction

//       // Append previous messages, making sure they follow the system instruction
//       messages.slice(-5).forEach(msg => { // Limit history to last 5 user/model turns to maintain context
//         chatHistoryForAPI.push({
//           role: msg.sender === 'user' ? 'user' : 'model',
//           parts: [{ text: msg.text }]
//         });
//       });

//       chatHistoryForAPI.push({ role: 'user', parts: [{ text: newUserMessage.text }] }); // Add the new user message
//       // --- END OF NEW/MODIFIED CODE FOR FAQ ---


//       const response = await fetch('https://full-stack-chatbot-app.onrender.com/api/chat', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ contents: chatHistoryForAPI }), // Send the modified chat history
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
//       console.error("Error sending message:", error); // Added console.error for better debugging
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
//               {/* Conditional rendering based on sender for Markdown */}
//               {msg.sender === 'bot' ? (
//                 // Use ReactMarkdown for bot messages to render formatting
//                 <ReactMarkdown remarkPlugins={[remarkGfm]}>
//                   {msg.text}
//                 </ReactMarkdown>
//               ) : (
//                 // Keep original <p> tag for user messages
//                 <p>{msg.text}</p>
//               )}
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


import React, { useState, useEffect, useRef } from 'react';
import './MainPage.css'; // Import your CSS file
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const MainPage = ({ onLogout }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const [botInitialMessageSent, setBotInitialMessageSent] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

    // Send initial greeting from Mida when component mounts
    if (!botInitialMessageSent) {
      const initialGreeting = {
        text: `Hi there! I'm Mida, your AI assistant for Mivada.com. How can I help you today?
We offer services and solutions across various domains. Here's a quick overview:

**Company Information:**
* [Home](https://www.mivada.com/)
* [About Us](https://www.mivada.com/about)
* [Services](https://www.mivada.com/services)
* [RPA (Robotic Process Automation)](https://www.mivada.com/services/rpa)
* [Careers](https://www.mivada.com/careers)

**Utility Links:**
* [Contact Us](https://www.mivada.com/contact)
* [Privacy Policy](https://www.mivada.com/privacy-policy)
* [Recruitment Privacy Policy](https://www.mivada.com/recruitment-privacy-policy)

What specific information are you looking for, or which area of Mivada.com do you have questions about?`,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages([initialGreeting]);
      setBotInitialMessageSent(true);
    }
  }, [messages, botInitialMessageSent]); // Dependencies for useEffect

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

      
      const chatHistoryForAPI = [];

      // --- MIVADA.COM FAQ SYSTEM INSTRUCTION ---
      // This prompt guides the AI to provide detailed, helpful information and guide users to relevant sections of Mivada.com.
      // It emphasizes dynamic and context-aware responses before redirection.
      const systemInstruction = {
        role: 'user', // System instructions are often best sent as user roles for Gemini API
        parts: [{ text: `You are Mida, an AI assistant for the Mivada.com website. Your primary role is to provide detailed, helpful information and guide users to relevant sections of Mivada.com.

**Mivada.com Key Areas for Assistance:**
* **Company:** Home, About Us, Services, RPA (Robotic Process Automation), Careers
* **Utility:** Contact Us, Privacy Policy, Recruitment Privacy Policy

**Behavior for Query Analysis:**
1.  **Deep Dive & Clarification:** When a user asks a question about a module/section (e.g., "careers", "RPA", "services"), do NOT immediately redirect them. Instead, first engage with them to understand their specific need within that module. Ask clarifying questions like "What specifically about [module name] are you interested in?", or "Are you looking for information on how our [module name] works, or specific job roles/offerings?"
2.  **Explain "How Mivada Works":** For queries related to "Services" or "RPA", explain *how Mivada operates* in that specific area based on the website's likely content. For example, for RPA, describe Mivada's approach to automation. For services, talk about the range of solutions.
3.  **Contextual Redirection:** After providing a concise explanation or asking a clarifying question, only then redirect them to the most relevant page on Mivada.com. Provide the direct URL.
4.  **Conciseness and Accuracy:** Keep answers concise and strictly based on what's available on a corporate website. Do NOT invent information (e.g., specific pricing unless the website clearly states it).
5.  **Handling Out-of-Scope Queries:** If a user asks a question genuinely outside the scope of Mivada.com's public information (e.g., "What is the CEO's home address?"), politely state that you can only assist with information available on Mivada.com and suggest they use the "Contact Us" page for direct assistance if their query is sensitive or requires human interaction.

**Example URLs for guidance (always provide direct links when redirecting):**
* Home: https://www.mivada.com/
* About Us: https://www.mivada.com/about
* Services: https://www.mivada.com/services
* RPA (Robotic Process Automation): https://www.mivada.com/services/rpa
* Careers: https://www.mivada.com/careers
* Contact Us: https://www.mivada.com/contact
* Privacy Policy: https://www.mivada.com/privacy-policy
* Recruitment Privacy Policy: https://www.mivada.com/recruitment-privacy-policy

Prioritize a helpful, conversational flow over immediate redirection. Ensure all responses are formatted using Markdown for readability.` }]
      };
      chatHistoryForAPI.push(systemInstruction);

      // Append previous messages (excluding initial bot message if present)
      // and new user message, making sure they follow the system instruction
      messages.filter(msg => msg.sender !== 'bot' || msg.text !== messages[0]?.text).slice(-5).forEach(msg => {
        chatHistoryForAPI.push({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        });
      });

      chatHistoryForAPI.push({ role: 'user', parts: [{ text: newUserMessage.text }] });


      const response = await fetch('https://full-stack-chatbot-app.onrender.com/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ contents: chatHistoryForAPI }),
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
      console.error("Error sending message:", error);
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
        <h1 className="chat-title">Mida - Mivada Assistant</h1>
        <button onClick={onLogout} className="logout-button">Logout</button>
      </div>

      {/* Chat Messages */}
      <div className="chat-messages-area">
        {messages.map((msg, index) => (
          <div key={index} className={`message-wrapper ${msg.sender}`}>
            <div className={`message-box ${msg.sender}`}>
              {msg.sender === 'bot' ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {msg.text}
                </ReactMarkdown>
              ) : (
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



