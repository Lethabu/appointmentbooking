import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Calendar, User, Settings, Sparkles, Phone, Clock, DollarSign } from 'lucide-react';

const KaraboBookingAgent = ({ 
  salonName = "Your Salon", 
  salonColor = "#6366f1", 
  salonLogo = null,
  agentPersonality = "professional" 
}) => {
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: `Hello! I'm Karabo, your smart booking assistant for ${salonName}. I can help you book appointments, answer questions about our services, and provide personalized recommendations. How can I assist you today? ✨`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [clientPersona, setClientPersona] = useState('Default_Client');
  const [showPersonaDebug, setShowPersonaDebug] = useState(false);
  const chatRef = useRef(null);

  // Persona detection keywords
  const personaKeywords = {
    TUT_Achiever: ['student', 'tut', 'class', 'exam', 'res', 'discount', 'budget', 'affordable', 'university', 'college', 'study'],
    Young_Professional: ['work', 'meeting', 'office', 'professional', 'after 5', 'weekend', 'corporate', 'business', 'career'],
    Side_Hustle_Queen: ['business', 'content', 'shoot', 'collab', 'partnership', 'feature', 'urgent', 'influencer', 'brand', 'entrepreneur'],
    Loyal_Regular: ['usual', 'regular', 'same as last time', 'monthly', 'appointment', 'touch up', 'maintenance'],
    Special_Occasion: ['wedding', 'event', 'party', 'special', 'celebration', 'birthday', 'graduation', 'important']
  };

  // Agent responses based on persona
  const personaResponses = {
    TUT_Achiever: {
      greeting: "Perfect! As a student, I can help you find budget-friendly options and flexible scheduling around your classes. We have special student discounts available! 📚✨",
      booking: "I understand you need something that fits your budget and schedule. Let me show you our student-friendly options and times that work around your class schedule.",
      urgency: "low"
    },
    Young_Professional: {
      greeting: "Great! I know how busy your work schedule can be. I can help you find convenient appointment times and professional styles that work for your career. 💼✨",
      booking: "Let's find a time that works with your professional schedule. I can suggest styles that are office-appropriate and low-maintenance for your busy lifestyle.",
      urgency: "medium"
    },
    Side_Hustle_Queen: {
      greeting: "Amazing! I love working with entrepreneurs and content creators. I can help you get camera-ready looks and discuss potential collaboration opportunities! 🌟✨",
      booking: "Let's create a stunning look for your content! I can prioritize appointments and suggest styles that photograph beautifully.",
      urgency: "high"
    },
    Loyal_Regular: {
      greeting: "Welcome back! It's always wonderful to see our regular clients. I can quickly book your usual appointment or suggest something new if you're feeling adventurous! 💕✨",
      booking: "I have your preferences on file. Would you like your usual service, or shall we try something new this time?",
      urgency: "medium"
    },
    Special_Occasion: {
      greeting: "How exciting! Special occasions deserve special treatment. I can help you create the perfect look for your important day! 🎉✨",
      booking: "Let's make sure you look absolutely stunning for your special occasion. I'll prioritize your booking and suggest our premium services.",
      urgency: "high"
    },
    Default_Client: {
      greeting: "I'm here to help you find the perfect service and time that works for you. What can I assist you with today? ✨",
      booking: "Let me help you find the right service and schedule an appointment that works perfectly for you.",
      urgency: "medium"
    }
  };

  // Detect client persona from message
  const detectPersona = (message) => {
    const lowerMessage = message.toLowerCase();
    let maxMatches = 0;
    let detectedPersona = 'Default_Client';

    Object.entries(personaKeywords).forEach(([persona, keywords]) => {
      const matches = keywords.filter(keyword => lowerMessage.includes(keyword)).length;
      if (matches > maxMatches) {
        maxMatches = matches;
        detectedPersona = persona;
      }
    });

    return detectedPersona;
  };

  // Simulate AI agent routing
  const routeToAgent = (message, persona) => {
    const lowerMessage = message.toLowerCase();
    
    // Booking Agent triggers
    if (/\b(book|appointment|schedule|available|when can|cancel|reschedule|free time)\b/i.test(message)) {
      return 'Booking_Agent';
    }
    
    // Value & Loyalty Agent triggers
    if (/\b(discount|loyalty|offer|deal|special|promotion|member)\b/i.test(message)) {
      return 'Value_Loyalty_Agent';
    }
    
    // Collaboration Agent triggers
    if (/\b(collab|partner|feature|ambassador|influencer|brand)\b/i.test(message)) {
      return 'Collaboration_Agent';
    }
    
    // Client Services Agent triggers
    if (/\b(price|cost|how much|location|hours|services|payment)\b/i.test(message)) {
      return 'Client_Services_Agent';
    }
    
    // Default to general conversation
    return 'General_Conversation';
  };

  // Generate contextual response based on agent and persona
  const generateResponse = (message, agent, persona) => {
    const personaData = personaResponses[persona] || personaResponses.Default_Client;
    
    switch (agent) {
      case 'Booking_Agent':
        return `${personaData.booking} I can see available slots for this week. Would you prefer morning or afternoon appointments? What service are you interested in?`;
      
      case 'Value_Loyalty_Agent':
        if (persona === 'TUT_Achiever') {
          return "Excellent! We have a 15% student discount available. You'll also earn loyalty points with each visit. Would you like me to sign you up for our student rewards program?";
        }
        return "Great news! You qualify for our loyalty rewards program. I can apply available discounts to your booking and show you how to earn points for future visits.";
      
      case 'Collaboration_Agent':
        if (persona === 'Side_Hustle_Queen') {
          return "I love your entrepreneurial spirit! We're always interested in working with content creators and business owners. Let me connect you with our partnership team to discuss collaboration opportunities.";
        }
        return "Thank you for your interest in partnering with us! I'll connect you with our collaboration team to explore opportunities that align with your brand.";
      
      case 'Client_Services_Agent':
        return `Here's what you need to know about ${salonName}: Our services range from R150-R800, we're open Monday-Saturday 9AM-6PM, and we accept cash, card, and mobile payments. What specific service were you asking about?`;
      
      default:
        return `${personaData.greeting} I'm here to make your salon experience perfect. Whether you need booking assistance, service information, or recommendations, I've got you covered!`;
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Simulate processing delay
    setTimeout(() => {
      const detectedPersona = detectPersona(input);
      setClientPersona(detectedPersona);
      
      const agent = routeToAgent(input, detectedPersona);
      const response = generateResponse(input, agent, detectedPersona);
      
      const assistantMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        agent: agent,
        persona: detectedPersona
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setLoading(false);
    }, 1500);
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getPersonaColor = (persona) => {
    const colors = {
      TUT_Achiever: '#10b981', // green
      Young_Professional: '#6366f1', // indigo
      Side_Hustle_Queen: '#f59e0b', // amber
      Loyal_Regular: '#8b5cf6', // violet
      Special_Occasion: '#ec4899', // pink
      Default_Client: '#6b7280' // gray
    };
    return colors[persona] || colors.Default_Client;
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div 
        className="p-4 text-white flex items-center justify-between"
        style={{ backgroundColor: salonColor }}
      >
        <div className="flex items-center space-x-3">
          {salonLogo ? (
            <img src={salonLogo} alt={salonName} className="w-8 h-8 rounded-full" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          )}
          <div>
            <h2 className="font-semibold">Karabo</h2>
            <p className="text-xs opacity-90">Smart Booking Assistant</p>
          </div>
        </div>
        <button 
          onClick={() => setShowPersonaDebug(!showPersonaDebug)}
          className="p-1 rounded hover:bg-white hover:bg-opacity-20"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Persona Debug Panel */}
      {showPersonaDebug && (
        <div className="p-3 bg-gray-50 text-xs">
          <div className="flex items-center space-x-2 mb-2">
            <User className="w-3 h-3" />
            <span className="font-medium">Client Persona:</span>
            <span 
              className="px-2 py-1 rounded text-white text-xs font-medium"
              style={{ backgroundColor: getPersonaColor(clientPersona) }}
            >
              {clientPersona.replace('_', ' ')}
            </span>
          </div>
          <p className="text-gray-600">
            Karabo adapts responses based on detected client type for personalized service.
          </p>
        </div>
      )}

      {/* Chat Messages */}
      <div 
        ref={chatRef}
        className="h-96 overflow-y-auto p-4 space-y-3 bg-gray-50"
      >
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`max-w-xs px-3 py-2 rounded-lg ${
                msg.role === 'user' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white text-gray-800 shadow-sm'
              }`}
            >
              <p className="text-sm">{msg.content}</p>
              <div className="flex items-center justify-between mt-1">
                <span className={`text-xs ${msg.role === 'user' ? 'text-blue-200' : 'text-gray-400'}`}>
                  {formatTime(msg.timestamp)}
                </span>
                {msg.agent && showPersonaDebug && (
                  <span className="text-xs bg-gray-100 px-1 rounded text-gray-600">
                    {msg.agent}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white px-3 py-2 rounded-lg shadow-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="p-3 bg-white border-t border-gray-200">
        <div className="flex space-x-2 mb-3">
          <button 
            onClick={() => setInput("I'd like to book an appointment")}
            className="flex-1 flex items-center justify-center space-x-1 py-2 px-3 bg-gray-100 rounded-md text-sm hover:bg-gray-200"
          >
            <Calendar className="w-3 h-3" />
            <span>Book</span>
          </button>
          <button 
            onClick={() => setInput("What services do you offer?")}
            className="flex-1 flex items-center justify-center space-x-1 py-2 px-3 bg-gray-100 rounded-md text-sm hover:bg-gray-200"
          >
            <Sparkles className="w-3 h-3" />
            <span>Services</span>
          </button>
          <button 
            onClick={() => setInput("What are your prices?")}
            className="flex-1 flex items-center justify-center space-x-1 py-2 px-3 bg-gray-100 rounded-md text-sm hover:bg-gray-200"
          >
            <DollarSign className="w-3 h-3" />
            <span>Prices</span>
          </button>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={sendMessage} className="p-4 bg-white border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-4 py-2 text-white rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: salonColor }}
          >
            <MessageCircle className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default KaraboBookingAgent;
