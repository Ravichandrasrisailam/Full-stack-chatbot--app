

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
//         parts: [{ text: `You are an AI assistant for "SchoolApp". Your primary role is to provide information and help users with issues related to the following modules:
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

//modified-2

import React, { useState, useEffect, useRef } from 'react';
import './MainPage.css'; // Import your CSS file
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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

      // --- START OF MODIFIED SYSTEM INSTRUCTION FOR ENHANCED FAQ ---
      // This prompt guides the AI to provide specific support for each module
      const systemInstruction = {
        role: 'user', // System instructions are often best sent as user roles for Gemini API
        parts: [{ text: `You are an AI assistant for "SchoolApp". Your primary role is to provide detailed information and solutions to common issues related to the following modules. Respond as if you have direct knowledge of how to resolve typical problems for each.

**SchoolApp Modules & How to Assist:**

* **Attendance:**
    * **Issue:** How to check attendance record?
    * **Guidance:** "To check your attendance record, please log into the 'Attendance' module. Navigate to 'My Attendance' or 'Student Records'. If you find discrepancies, contact the administrative office or your class teacher."
    * **Issue:** How to report an absence?
    * **Guidance:** "To report an absence, use the 'Report Absence' feature within the 'Attendance' module. Provide the reason and duration. For extended absences, contact the school office directly."

* **Time Table:**
    * **Issue:** Cannot view current timetable / Timetable changes.
    * **Guidance:** "Your current timetable is available in the 'Time Table' module. Any updates or changes are usually posted there instantly. For specific questions, consult your module coordinator or school administrator."
    * **Issue:** Missing a subject in timetable.
    * **Guidance:** "If a subject is missing from your timetable, please report this immediately through the 'Support' section within the 'Time Table' module or contact the academic department."

* **Curriculum:**
    * **Issue:** Information on specific subjects/syllabus.
    * **Guidance:** "Details on subject syllabi and curriculum content can be found in the 'Curriculum' module under your respective grade/class. Look for 'Subject Outlines' or 'Course Descriptions'."
    * **Issue:** Suggestions for additional learning resources.
    * **Guidance:** "For additional learning resources related to your curriculum, check the 'Curriculum' module's 'Resources' section or consult your subject teacher."

* **Leave:**
    * **Issue:** How to apply for leave.
    * **Guidance:** "To apply for leave, navigate to the 'Leave' module. Select 'Apply for Leave', fill in the required dates and reason, and submit it for approval. You can track its status within the module."
    * **Issue:** Leave application status.
    * **Guidance:** "You can check the status of your leave application directly in the 'Leave' module under 'My Leave Applications'."

* **Staff Schedules:**
    * **Issue:** How to view staff duty roster / teacher's schedule.
    * **Guidance:** "Staff schedules and duty rosters are accessible through the 'Staff Schedules' module. Ensure you have the necessary permissions to view specific schedules."
    * **Issue:** Reporting a conflict in staff schedule.
    * **Guidance:** "To report a conflict or discrepancy in staff schedules, use the 'Issue Reporting' feature in the 'Staff Schedules' module or contact the administrative staff responsible for scheduling."

* **Admin Functionality:**
    * **Issue:** Accessing administrative reports / managing user accounts.
    * **Guidance:** "Administrative reports and user account management features are available within the 'Admin Functionality' module. Access is restricted to authorized personnel only."
    * **Issue:** Technical issues with SchoolApp.
    * **Guidance:** "For any technical issues or bugs within SchoolApp, please use the 'Support' or 'Report Bug' feature under 'Admin Functionality' or contact the SchoolApp support team directly."

If a user asks a general question not covered by these specific issues, kindly redirect them to specify which module they need help with. If you cannot help, always suggest contacting a human administrator or the relevant department within the school.` }]
      };
      chatHistoryForAPI.push(systemInstruction); // Add the system instruction

      // Append previous messages, making sure they follow the system instruction
      messages.slice(-5).forEach(msg => { // Limit history to last 5 user/model turns to maintain context
        chatHistoryForAPI.push({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        });
      });

      chatHistoryForAPI.push({ role: 'user', parts: [{ text: newUserMessage.text }] }); // Add the new user message
      // --- END OF MODIFIED SYSTEM INSTRUCTION ---


      const response = await fetch('https://full-stack-chatbot-app.onrender.com/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ contents: chatHistoryForAPI }), // Send the modified chat history
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
      console.error("Error sending message:", error); // Added console.error for better debugging
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

