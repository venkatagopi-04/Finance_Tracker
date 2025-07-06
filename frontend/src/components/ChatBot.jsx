import React, { useState, useRef } from 'react';
import { FaComments, FaTimes, FaPaperPlane } from 'react-icons/fa';
import './ChatBot.css';
import axios from '../utils/axios';

const ChatBot = ({ summary }) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi! Ask me anything about your finances.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { from: 'user', text: input };
    setMessages(msgs => [...msgs, userMsg]);
    setInput('');
    setLoading(true);
    try {
      // Send user query and summary to Node backend API
      const res = await axios.post('/chat', {
        query: input,
        summary,
      });
      setMessages(msgs => [...msgs, { from: 'bot', text: res.data.response }]);
    } catch (err) {
      setMessages(msgs => [...msgs, { from: 'bot', text: 'Sorry, I could not get a response.' }]);
    }
    setLoading(false);
    setTimeout(() => {
      if (inputRef.current) inputRef.current.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <>
      <button className="chatbot-fab" onClick={() => setOpen(o => !o)} aria-label="Open chat">
        {open ? <FaTimes size={22} /> : <FaComments size={28} />}
      </button>
      {open && (
        <div className="chatbot-popup">
          <div className="chatbot-header">Finance Assistant</div>
          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chatbot-msg chatbot-msg-${msg.from}`}>{msg.text}</div>
            ))}
            {loading && (
              <div className="chatbot-msg chatbot-msg-bot" style={{opacity:0.7}}>
                <span className="chatbot-typing">Thinking...</span>
              </div>
            )}
            <div ref={inputRef} />
          </div>
          <form className="chatbot-input-row" onSubmit={handleSend}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type your question..."
              disabled={loading}
            />
            <button type="submit" disabled={loading || !input.trim()}>
              <FaPaperPlane />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatBot;
