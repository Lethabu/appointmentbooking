'use client';

import { useState } from 'react';
import AgentSelector from '../components/AgentSelector';
import ChatWindow from '../components/ChatWindow';
import { AgentType } from '../lib/types';

export default function HomePage() {
  const [currentAgent, setCurrentAgent] = useState<AgentType>(AgentType.NIA);

  return (
    <div style={{
      fontFamily: 'system-ui, -apple-system, sans-serif',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
    }}>
      {/* Header */}
      <header style={{
        background: 'white',
        padding: '20px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: '40px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <h1 style={{
              fontSize: '2rem',
              color: '#2d2d2d',
              margin: 0
            }}>
              InStyle Hair Boutique
            </h1>
            <p style={{
              color: '#666',
              margin: '5px 0 0 0'
            }}>
              Your AI-Powered Concierge
            </p>
          </div>
          <a
            href="/book"
            style={{
              padding: '12px 30px',
              background: '#d4af37',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '25px',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              transition: 'transform 0.2s',
              display: 'inline-block'
            }}
            onMouseOver={(e) => (e.target as HTMLElement).style.transform = 'scale(1.05)'}
            onMouseOut={(e) => (e.target as HTMLElement).style.transform = 'scale(1)'}
          >
            📅 Book Appointment
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '0 20px 40px'
      }}>
        {/* Welcome Section */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px'
        }}>
          <h2 style={{
            fontSize: '2rem',
            color: '#2d2d2d',
            marginBottom: '15px'
          }}>
            Welcome to InStyle&apos;s Smart Assistant
          </h2>
          <p style={{
            fontSize: '1.2rem',
            color: '#666',
            maxWidth: '700px',
            margin: '0 auto'
          }}>
            Chat with our AI agents for bookings, marketing ideas, or business advice
          </p>
        </div>

        {/* Agent Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          {[
            {
              name: AgentType.NIA,
              icon: '💇‍♀️',
              title: 'Salon Assistant',
              description: 'Book appointments, ask about services, get personalized recommendations'
            },
            {
              name: AgentType.BLAZE,
              icon: '🔥',
              title: 'Marketing Agent',
              description: 'Get marketing ideas, social media content, and promotional strategies'
            },
            {
              name: AgentType.AURA,
              icon: '📈',
              title: 'Business Strategist',
              description: 'Pricing advice, client retention, growth strategies for salon owners'
            }
          ].map((agent, idx) => (
            <div
              key={idx}
              onClick={() => setCurrentAgent(agent.name)}
              style={{
                padding: '25px',
                background: currentAgent === agent.name ? '#d4af37' : 'white',
                color: currentAgent === agent.name ? 'white' : '#2d2d2d',
                borderRadius: '15px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'all 0.3s',
                border: currentAgent === agent.name ? '2px solid #b8941f' : '2px solid transparent'
              }}
              onMouseOver={(e) => {
                if (currentAgent !== agent.name) {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)';
                }
              }}
              onMouseOut={(e) => {
                if (currentAgent !== agent.name) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                }
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '15px', textAlign: 'center' }}>
                {agent.icon}
              </div>
              <h3 style={{
                fontSize: '1.3rem',
                marginBottom: '10px',
                textAlign: 'center'
              }}>
                {agent.title}
              </h3>
              <p style={{
                fontSize: '0.95rem',
                opacity: 0.9,
                lineHeight: '1.5',
                textAlign: 'center'
              }}>
                {agent.description}
              </p>
            </div>
          ))}
        </div>

        {/* Chat Interface */}
        <div style={{
          background: 'white',
          borderRadius: '15px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '20px',
            background: '#d4af37',
            color: 'white'
          }}>
            <AgentSelector
              id="agent-selector"
              label="Select Agent"
              agents={[
                { type: AgentType.NIA, name: 'Nia' },
                { type: AgentType.BLAZE, name: 'Blaze' },
                { type: AgentType.AURA, name: 'Aura' },
              ]}
              selectedAgent={currentAgent}
              onSelectAgent={setCurrentAgent}
            />
          </div>
          <ChatWindow tenantId="instylehairboutique" />
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        background: '#2d2d2d',
        color: 'white',
        padding: '30px 20px',
        marginTop: '60px',
        textAlign: 'center'
      }}>
        <p style={{ margin: '0 0 10px 0' }}>
          © 2025 InStyle Hair Boutique. All rights reserved.
        </p>
        <p style={{ margin: '10px 0 0 0', fontSize: '0.9rem', opacity: 0.8 }}>
          Powered by AI • Built with ❤️
        </p>
      </footer>
    </div>
  );
}
