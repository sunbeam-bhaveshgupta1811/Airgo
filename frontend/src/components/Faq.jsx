import React, { useState, useRef, useEffect } from 'react';
import { Container, Card, Form, Button, ListGroup, Badge } from 'react-bootstrap';
import { FaRobot, FaPaperPlane, FaTimes, FaSearch } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import '../styles/Faq.css'

const Motion = motion;

const FAQChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const faqData = [
    {
      question: 'How do I book a flight?',
      answer: 'You can book flights by using our search form. Enter your departure and arrival cities, travel dates, and passenger details, then select from available flights.',
      keywords: ['book', 'flight', 'reserve', 'ticket']
    },
    {
      question: 'What is your cancellation policy?',
      answer: 'Cancellation policies vary by airline. You can cancel your booking through "My Trips" section. Refunds depend on the fare rules of your ticket.',
      keywords: ['cancel', 'refund', 'policy', 'change']
    },
    {
      question: 'How do I check in online?',
      answer: 'Online check-in is available 24-48 hours before departure. Visit your airline\'s website or use their mobile app with your booking reference.',
      keywords: ['check-in', 'online', 'boarding pass', 'web check-in']
    },
    {
      question: 'What documents do I need for international travel?',
      answer: 'For international travel, you typically need a valid passport, visa (if required), and any health documents like vaccination certificates.',
      keywords: ['passport', 'visa', 'documents', 'international']
    },
    {
      question: 'Can I change my flight date?',
      answer: 'Flight date changes are subject to airline policies and may incur fees. You can request changes through "My Trips" or by contacting our support.',
      keywords: ['change', 'date', 'reschedule', 'modify']
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      text: inputValue,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot response after a delay
    setTimeout(() => {
      const botResponse = generateResponse(inputValue);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
  };

  const generateResponse = (userInput) => {
    const lowerInput = userInput.toLowerCase();
    
    // Check for exact matches first
    const exactMatch = faqData.find(item => 
      item.question.toLowerCase().includes(lowerInput) || 
      lowerInput.includes(item.question.toLowerCase())
    );

    if (exactMatch) {
      return {
        text: exactMatch.answer,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: exactMatch.question
      };
    }

    // Check for keyword matches
    const keywordMatch = faqData.find(item => 
      item.keywords.some(keyword => lowerInput.includes(keyword))
    );

    if (keywordMatch) {
      return {
        text: `Regarding "${keywordMatch.question}": ${keywordMatch.answer}`,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: keywordMatch.question
      };
    }

    // Default response for no matches
    const defaultResponses = [
      "I'm not sure I understand. Could you rephrase your question?",
      "I don't have information about that. Try asking about flight bookings, cancellations, or check-in.",
      "That's a good question! For specific inquiries, our support team can help. Would you like me to connect you?",
      "I specialize in common travel questions. Try asking about flights, bookings, or travel documents."
    ];

    return {
      text: defaultResponses[Math.floor(Math.random() * defaultResponses.length)],
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: null
    };
  };

  const handleQuickQuestion = (question) => {
    setInputValue(question);
  };

  return (
    <div className="faq-chatbot-container">
      {/* Chatbot toggle button */}
      <motion.div
        className="chatbot-toggle"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {isOpen ? (
          <FaTimes className="chatbot-icon" />
        ) : (
          <FaRobot className="chatbot-icon" />
        )}
      </motion.div>

      {/* Chatbot window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chatbot-window"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', damping: 25 }}
          >
            <Card className="h-100 border-0 shadow-lg">
              <Card.Header className="d-flex justify-content-between align-items-center bg-primary text-white">
                <div className="d-flex align-items-center">
                  <FaRobot className="me-2" />
                  <h5 className="mb-0">Travel Assistant</h5>
                </div>
                <Badge bg="light" text="dark" pill>
                  Beta
                </Badge>
              </Card.Header>

              <Card.Body className="chat-messages">
                {messages.length === 0 ? (
                  <div className="welcome-message">
                    <div className="bot-avatar">
                      <FaRobot />
                    </div>
                    <div className="welcome-text">
                      <TypeAnimation
                        sequence={[
                          'Hi there! 👋',
                          1000,
                          'I\'m your travel assistant.',
                          1000,
                          'Ask me about flights, bookings, or travel policies!',
                          1000
                        ]}
                        wrapper="h6"
                        cursor={true}
                        repeat={0}
                        speed={50}
                      />
                      <div className="quick-questions mt-3">
                        <p className="small text-muted mb-2">Try asking:</p>
                        <div className="d-flex flex-wrap gap-2">
                          {faqData.slice(0, 3).map((item, index) => (
                            <Button
                              key={index}
                              variant="outline-primary"
                              size="sm"
                              className="rounded-pill"
                              onClick={() => handleQuickQuestion(item.question)}
                            >
                              {item.question}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <ListGroup variant="flush">
                    {messages.map((message, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ListGroup.Item
                          className={`message-item ${message.sender}`}
                        >
                          <div className="message-content">
                            {message.sender === 'bot' && (
                              <div className="bot-avatar">
                                <FaRobot />
                              </div>
                            )}
                            <div>
                              <div className="message-text">
                                {message.text}
                                {message.source && (
                                  <div className="source-badge mt-2">
                                    <Badge bg="light" text="dark">
                                      Re: {message.source}
                                    </Badge>
                                  </div>
                                )}
                              </div>
                              <div className="message-time">
                                {message.timestamp}
                              </div>
                            </div>
                          </div>
                        </ListGroup.Item>
                      </motion.div>
                    ))}
                    {isTyping && (
                      <ListGroup.Item className="message-item bot">
                        <div className="message-content">
                          <div className="bot-avatar">
                            <FaRobot />
                          </div>
                          <div className="typing-indicator">
                            <span></span>
                            <span></span>
                            <span></span>
                          </div>
                        </div>
                      </ListGroup.Item>
                    )}
                    <div ref={messagesEndRef} />
                  </ListGroup>
                )}
              </Card.Body>

              <Card.Footer className="bg-light">
                <Form onSubmit={handleSendMessage}>
                  <div className="input-group">
                    <Form.Control
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Ask a travel question..."
                      className="border-0 py-3"
                    />
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={!inputValue.trim()}
                      className="rounded-end"
                    >
                      <FaPaperPlane />
                    </Button>
                  </div>
                </Form>
              </Card.Footer>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FAQChatbot;
