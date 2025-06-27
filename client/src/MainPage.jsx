

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

