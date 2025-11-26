import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, Sparkles } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const selectedModel = 'us.anthropic.claude-sonnet-4-5-20250929-v1:0';
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: input,
          modelId: selectedModel
        })
      });

      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = { role: 'assistant' as const, content: '' };

      setMessages(prev => [...prev, assistantMessage]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        assistantMessage.content += chunk;

        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { ...assistantMessage };
          return newMessages;
        });
      }

    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error: Failed to get response.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--color-paper)',
      padding: 'clamp(1rem, 3vw, 2rem)',
      gap: 'clamp(1rem, 2vw, 1.5rem)'
    }}>
      {/* Header - Bold and Asymmetric */}
      <header style={{
        position: 'relative',
        background: 'var(--color-charcoal)',
        padding: 'clamp(1.5rem, 3vw, 2.5rem)',
        border: 'var(--border-thick) solid var(--color-charcoal)',
        boxShadow: 'var(--shadow-brutalist) var(--color-terracotta)',
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
        flexWrap: 'wrap'
      }}>
        {/* Bot Badge */}
        <div style={{
          background: 'var(--color-terracotta)',
          width: 'clamp(3rem, 8vw, 4rem)',
          height: 'clamp(3rem, 8vw, 4rem)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: 'var(--border-chunky) solid var(--color-charcoal)',
          transform: 'rotate(-3deg)',
          flexShrink: 0,
          animation: 'float 3s ease-in-out infinite'
        }}>
          <Bot
            size={window.innerWidth > 768 ? 32 : 24}
            style={{ color: 'var(--color-cream)' }}
          />
        </div>

        {/* Title */}
        <div style={{ flex: 1, minWidth: '200px' }}>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            fontWeight: 800,
            color: 'var(--color-cream)',
            margin: 0,
            lineHeight: 1.1,
            letterSpacing: '-0.02em'
          }}>
            Analog AI
          </h1>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'clamp(0.7rem, 1.5vw, 0.875rem)',
            color: 'var(--color-accent)',
            margin: '0.25rem 0 0 0',
            letterSpacing: '0.05em'
          }}>
            BEDROCK / CLAUDE 4.5
          </p>
        </div>

        {/* Decorative Element */}
        <div style={{
          position: 'absolute',
          top: '-12px',
          right: 'clamp(1rem, 5vw, 3rem)',
          background: 'var(--color-sage)',
          width: 'clamp(40px, 6vw, 60px)',
          height: 'clamp(40px, 6vw, 60px)',
          border: 'var(--border-chunky) solid var(--color-charcoal)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: 'rotate(12deg)'
        }}>
          <Sparkles size={window.innerWidth > 768 ? 24 : 18} style={{ color: 'var(--color-charcoal)' }} />
        </div>
      </header>

      {/* Messages Container */}
      <main style={{
        flex: 1,
        overflowY: 'auto',
        padding: 'clamp(1rem, 2vw, 2rem)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'clamp(1.5rem, 3vw, 2.5rem)',
        background: 'var(--color-cream)',
        border: 'var(--border-chunky) solid var(--color-charcoal)',
        minHeight: '300px'
      }}>
        {/* Empty State */}
        {messages.length === 0 && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            gap: '1.5rem',
            textAlign: 'center',
            padding: '2rem'
          }}>
            <div style={{
              background: 'var(--color-sage)',
              width: 'clamp(80px, 15vw, 120px)',
              height: 'clamp(80px, 15vw, 120px)',
              border: 'var(--border-chunky) solid var(--color-charcoal)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: 'rotate(-5deg)',
              boxShadow: 'var(--shadow-brutalist) var(--color-charcoal)'
            }}>
              <Bot size={window.innerWidth > 768 ? 48 : 36} style={{ color: 'var(--color-charcoal)' }} />
            </div>
            <div>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
                fontWeight: 800,
                color: 'var(--color-charcoal)',
                marginBottom: '0.5rem'
              }}>
                Ready to chat?
              </h2>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
                color: 'var(--color-charcoal)',
                opacity: 0.7,
                maxWidth: '400px',
                margin: '0 auto'
              }}>
                Ask me anything. I'm powered by AWS Bedrock's latest AI models.
              </p>
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              animation: 'slideInRotate 0.4s ease-out',
              animationDelay: `${idx * 0.05}s`,
              animationFillMode: 'both'
            }}
          >
            <div style={{
              maxWidth: 'min(600px, 85%)',
              background: msg.role === 'user' ? 'var(--color-terracotta)' : 'var(--color-paper)',
              border: 'var(--border-chunky) solid var(--color-charcoal)',
              padding: 'clamp(1rem, 2.5vw, 1.5rem)',
              boxShadow: msg.role === 'user'
                ? 'var(--shadow-brutalist) var(--color-charcoal)'
                : 'var(--shadow-brutalist) var(--color-sage)',
              transform: msg.role === 'user' ? 'rotate(0.5deg)' : 'rotate(-0.5deg)',
              position: 'relative'
            }}>
              {/* Role Badge */}
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'clamp(0.65rem, 1.3vw, 0.75rem)',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: msg.role === 'user' ? 'var(--color-cream)' : 'var(--color-terracotta)',
                marginBottom: '0.75rem',
                opacity: 0.9,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                {msg.role === 'user' ? '→ You' : '← Bedrock AI'}
              </div>

              {/* Message Content */}
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(0.95rem, 2vw, 1.05rem)',
                lineHeight: 1.7,
                color: msg.role === 'user' ? 'var(--color-cream)' : 'var(--color-charcoal)',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}>
                {msg.content || (
                  <span style={{
                    opacity: 0.6,
                    fontStyle: 'italic',
                    animation: 'pulse 1.5s ease-in-out infinite'
                  }}>
                    Thinking...
                  </span>
                )}
              </div>

              {/* Decorative corner */}
              <div style={{
                position: 'absolute',
                bottom: '-8px',
                [msg.role === 'user' ? 'right' : 'left']: '-8px',
                width: '16px',
                height: '16px',
                background: msg.role === 'user' ? 'var(--color-terracotta-dark)' : 'var(--color-sage)',
                border: 'var(--border-chunky) solid var(--color-charcoal)',
                transform: 'rotate(45deg)'
              }} />
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </main>

      {/* Input Area - Bold & Chunky */}
      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        gap: 'clamp(0.75rem, 2vw, 1rem)',
        alignItems: 'stretch',
        flexWrap: window.innerWidth < 640 ? 'wrap' : 'nowrap'
      }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message here..."
          disabled={isLoading}
          style={{
            flex: 1,
            minWidth: window.innerWidth < 640 ? '100%' : '200px',
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(0.95rem, 2vw, 1.05rem)',
            padding: 'clamp(1rem, 2.5vw, 1.25rem)',
            border: 'var(--border-chunky) solid var(--color-charcoal)',
            background: 'white',
            color: 'var(--color-charcoal)',
            outline: 'none',
            transition: 'all 0.2s ease',
            opacity: isLoading ? 0.6 : 1
          }}
          onFocus={(e) => {
            e.target.style.boxShadow = 'var(--shadow-brutalist) var(--color-sage)';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onBlur={(e) => {
            e.target.style.boxShadow = 'none';
            e.target.style.transform = 'translateY(0)';
          }}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(0.9rem, 2vw, 1rem)',
            fontWeight: 800,
            padding: window.innerWidth < 640 ? '1rem' : 'clamp(1rem, 2.5vw, 1.25rem) clamp(1.5rem, 4vw, 2.5rem)',
            background: isLoading || !input.trim() ? 'var(--color-sage)' : 'var(--color-terracotta)',
            color: 'var(--color-cream)',
            border: 'var(--border-chunky) solid var(--color-charcoal)',
            cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            transition: 'all 0.2s ease',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            opacity: isLoading || !input.trim() ? 0.5 : 1,
            width: window.innerWidth < 640 ? '100%' : 'auto',
            justifyContent: 'center'
          }}
          onMouseEnter={(e) => {
            if (!isLoading && input.trim()) {
              e.currentTarget.style.boxShadow = 'var(--shadow-brutalist) var(--color-charcoal)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <Send size={window.innerWidth > 768 ? 20 : 18} />
          {window.innerWidth >= 640 && <span>{isLoading ? 'Sending...' : 'Send'}</span>}
        </button>
      </form>
    </div>
  );
};
