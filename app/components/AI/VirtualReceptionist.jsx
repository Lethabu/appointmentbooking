
'use client';

import { useState, useRef, useEffect } from 'react';

export default function VirtualReceptionist({ salonData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: `Hi! I'm Sarah, InStyle Hair Boutique's virtual assistant. I'm here 24/7 to help you book appointments, answer questions about our services, or provide hair care tips! How can I help you today?`,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const commonQuestions = [
    "What services do you offer?",
    "How do I book an appointment?",
    "What are your hours?",
    "Do you do hair extensions?",
    "What hair treatments do you have?"
  ];

  const generateResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('service') || message.includes('what do you')) {
      return `We offer a range of professional hair services including:
      
      • Hair Wash & Blow Dry (R180)
      • Deep Hair Treatments (R350)
      • Hair Styling & Updos (R280)
      • Color Touch-ups (R450)
      • Full Hair Color (R650)
      • Highlights & Lowlights (R750)
      • Hair Extensions (R800)
      • Bridal Hair Packages (R1200)
      
      Would you like to book any of these services?`;
    }
    
    if (message.includes('book') || message.includes('appointment')) {
      return `I'd love to help you book an appointment! You can:
      
      1. Click the "Book Now" button below to use our online booking system
      2. Call us at our salon number
      3. Message us on WhatsApp
      
      Our booking system is available 24/7, and I can help you find the perfect time slot. What service are you interested in?`;
    }
    
    if (message.includes('hours') || message.includes('open')) {
      return `Our salon hours are:
      
      Monday - Friday: 9:00 AM - 5:00 PM
      Saturday: 8:00 AM - 4:00 PM
      Sunday: Closed
      
      But don't worry - you can book appointments online anytime through our booking system!`;
    }
    
    if (message.includes('extension')) {
      return `Yes! We specialize in hair extensions. Our professional extension service includes:
      
      • Consultation to match your hair perfectly
      • High-quality extension application
      • Styling and blending
      • Aftercare instructions
      
      Our hair extension service is R800 and takes about 3 hours. Would you like to book a consultation?`;
    }
    
    if (message.includes('treatment')) {
      return `We offer amazing hair treatments! Our most popular treatments are:
      
      • Deep Conditioning Treatment (R350) - Perfect for damaged or dry hair
      • Hair Oil Treatment (R200) - Nourishing argan oil for shine and softness
      
      These treatments will leave your hair feeling silky, healthy, and beautiful. Which treatment interests you?`;
    }
    
    if (message.includes('price') || message.includes('cost')) {
      return `Our service prices range from R140 to R1200:
      
      • Basic styling starts at R180
      • Treatments from R350
      • Color services from R450
      • Extensions from R800
      • Bridal packages from R1200
      
      All prices include professional products and styling. Would you like details about a specific service?`;
    }
    
    return `Thank you for your question! I'm here to help with information about our services, booking appointments, and hair care tips. 

    For specific questions I can't answer, I can connect you with our team during business hours (Mon-Fri 9-5, Sat 8-4).
    
    Is there anything specific about our hair services you'd like to know?`;
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      type: 'user',
      content: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const botResponse = {
        type: 'bot',
        content: generateResponse(inputText),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickQuestion = (question) => {
    setInputText(question);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
        <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-lg p-3 max-w-xs animate-bounce">
          <p className="text-sm text-gray-700">Hi! I'm Sarah, your AI assistant. Click to chat! 💬</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[600px] bg-white rounded-lg shadow-2xl border border-gray-200 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4 rounded-t-lg flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-pink-500 font-bold mr-3">
            AI
          </div>
          <div>
            <h3 className="font-bold">Sarah - Virtual Assistant</h3>
            <p className="text-sm opacity-90">Online • Instant replies</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white hover:bg-white hover:bg-opacity-20 rounded p-1"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Quick Questions */}
      <div className="p-3 border-b border-gray-200">
        <p className="text-xs text-gray-600 mb-2">Quick questions:</p>
        <div className="flex flex-wrap gap-1">
          {commonQuestions.slice(0, 3).map((question, index) => (
            <button
              key={index}
              onClick={() => handleQuickQuestion(question)}
              className="text-xs bg-gray-100 hover:bg-gray-200 rounded-full px-2 py-1 text-gray-700"
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg whitespace-pre-line ${
                message.type === 'user'
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg px-4 py-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask me anything about our services..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
            className="bg-pink-500 text-white rounded-lg px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-pink-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
