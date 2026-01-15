import React, { useState, useRef, useEffect } from 'react';
import { Card, Input, Button, Avatar, Typography, Spin, Badge, Tooltip, Modal } from 'antd';
import { SendOutlined, RobotOutlined, CloseOutlined, MessageOutlined, ExpandOutlined } from '@ant-design/icons';
import { useGetCryptosQuery } from '../services/coinGeckoApi';
import { askCryptoAssistant, isAIEnabled } from '../services/aiService';

const { Text } = Typography;

const CryptoAI = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi! 👋 I\'m your Vela. Ask me anything about cryptocurrencies!'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { data: cryptosList } = useGetCryptosQuery({ limit: 100 });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const cryptoContext = cryptosList?.slice(0, 10)
        .map(coin => 
          `${coin.name}: $${coin.current_price.toFixed(2)}, 24h: ${coin.price_change_percentage_24h?.toFixed(2)}%`
        ).join('\n');

      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const enhancedQuestion = `Current Top 10:\n${cryptoContext}\n\n${input}`;
      const response = await askCryptoAssistant(enhancedQuestion, conversationHistory);

      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please check your OpenAI API configuration.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickQuestions = ['What is Bitcoin?', 'Explain DeFi', 'Market sentiment?'];

  if (!isAIEnabled()) {
    return (
      <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}>
        <Tooltip title="Add OpenAI API key to enable">
          <Button type="primary" shape="circle" size="large" icon={<RobotOutlined />}
            style={{ width: 60, height: 60, fontSize: 24, boxShadow: '0 4px 12px rgba(0,0,0,0.15)', opacity: 0.5 }}
            disabled />
        </Tooltip>
      </div>
    );
  }

  return (
    <>
      {/* Expanded Modal View */}
      <Modal
        open={isExpanded}
        onCancel={() => setIsExpanded(false)}
        footer={null}
        width={900}
        style={{ top: 20 }}
        bodyStyle={{ padding: 0, height: '80vh', display: 'flex', flexDirection: 'column' }}
        closable={false}
      >
        <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', borderRadius: '20px 20px 0 0', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Avatar icon={<RobotOutlined />} size={40} style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', color: '#fff' }} />
            <div>
              <Text strong style={{ color: '#fff', fontSize: 16 }}>Crypto AI</Text><br />
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}> ● Online</Text>
            </div>
          </div>
          <Button 
            type="text" 
            icon={<CloseOutlined />} 
            onClick={() => setIsExpanded(false)} 
            style={{ color: '#fff', fontSize: 18 }}
          />
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 24, backgroundColor: '#f5f5f5' }}>
          {messages.map((message, index) => (
            <div key={index} style={{ display: 'flex', justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 16 }}>
              <div style={{ display: 'flex', gap: 12, maxWidth: '75%', flexDirection: message.role === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-end' }}>
                {message.role === 'assistant' && (
                  <Avatar icon={<RobotOutlined />} size={40} style={{ backgroundColor: '#2c3e50', flexShrink: 0 }} />
                )}
                <div style={{ padding: '14px 18px', borderRadius: message.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px', backgroundColor: message.role === 'user' ? '#1a1a2e' : '#fff', color: message.role === 'user' ? '#fff' : '#1a1a1a', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: 15, lineHeight: 1.6 }}>
                  {message.content}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <Avatar icon={<RobotOutlined />} size={40} style={{ backgroundColor: '#1a1a2e' }} />
              <div style={{ padding: '14px 18px', backgroundColor: '#fff', borderRadius: '16px 16px 16px 4px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <Spin size="small" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div style={{ padding: 16, backgroundColor: '#fff', borderTop: '1px solid #e8e8e8' }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <Input.TextArea value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={handleKeyPress}
              placeholder="Ask me anything..." autoSize={{ minRows: 1, maxRows: 4 }} disabled={loading} style={{ borderRadius: 20, fontSize: 15 }} />
            <Button type="primary" shape="circle" icon={<SendOutlined />} onClick={sendMessage} disabled={loading || !input.trim()}
              style={{ background: '#1a1a2e', border: 'none', width: 48, height: 48 }} />
          </div>
        </div>
      </Modal>

      <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
        {isOpen && !isExpanded && (
          <Card style={{ width: 380, height: 550, borderRadius: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', overflow: 'hidden', animation: 'slideUp 0.3s ease-out' }}
            bodyStyle={{ padding: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
            
            <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', borderRadius: '20px 20px 0 0', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar icon={<RobotOutlined />} size={40} style={{ backgroundColor: '#1a1a2e', color: '#fff' }} />
                <div>
                  <Text strong style={{ color: '#fff', fontSize: 16 }}>Crypto AI</Text><br />
                  <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>● Online</Text>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Tooltip title="Expand">
                  <Button type="text" icon={<ExpandOutlined />} onClick={() => setIsExpanded(true)} style={{ color: '#fff' }} />
                </Tooltip>
                <Button type="text" icon={<CloseOutlined />} onClick={() => setIsOpen(false)} style={{ color: '#fff' }} />
              </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: 16, backgroundColor: '#f5f5f5' }}>
              {messages.map((message, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 12 }}>
                  <div style={{ display: 'flex', gap: 8, maxWidth: '80%', flexDirection: message.role === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-end' }}>
                    {message.role === 'assistant' && (
                      <Avatar icon={<RobotOutlined />} size={32} style={{ backgroundColor: '#1a1a2e', flexShrink: 0 }} />
                    )}
                    <div style={{ padding: '10px 14px', borderRadius: message.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px', backgroundColor: message.role === 'user' ? '#1a1a2e' : '#fff', color: message.role === 'user' ? '#fff' : '#1a1a1a', boxShadow: '0 2px 4px rgba(0,0,0,0.08)', whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: 14, lineHeight: 1.5 }}>
                      {message.content}
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <Avatar icon={<RobotOutlined />} size={32} style={{ backgroundColor: '#1a1a2e' }} />
                  <div style={{ padding: '10px 14px', backgroundColor: '#fff', borderRadius: '16px 16px 16px 4px', boxShadow: '0 2px 4px rgba(0,0,0,0.08)' }}>
                    <Spin size="small" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {messages.length === 1 && (
              <div style={{ padding: '8px 16px', backgroundColor: '#fff', borderTop: '1px solid #f0f0f0' }}>
                <Text type="secondary" style={{ fontSize: 12 }}>Try asking:</Text>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
                  {quickQuestions.map((q, i) => (
                    <Button key={i} size="small" onClick={() => setInput(q)} style={{ fontSize: 11, borderRadius: 12 }}>{q}</Button>
                  ))}
                </div>
              </div>
            )}

            <div style={{ padding: 12, backgroundColor: '#fff', borderTop: '1px solid #f0f0f0' }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <Input.TextArea value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={handleKeyPress}
                  placeholder="Ask me anything..." autoSize={{ minRows: 1, maxRows: 3 }} disabled={loading} style={{ borderRadius: 20 }} />
                <Button type="primary" shape="circle" icon={<SendOutlined />} onClick={sendMessage} disabled={loading || !input.trim()}
                  style={{ background: '#1a1a2e', border: 'none' }} />
              </div>
            </div>
          </Card>
        )}

        {!isExpanded && (
          <Tooltip title="Chat with Vela">
            <Badge count={messages.length > 1 ? messages.length - 1 : 0} offset={[-5, 5]}>
              <Button type="primary" shape="circle" size="large" icon={isOpen ? <CloseOutlined /> : <MessageOutlined />}
                onClick={() => setIsOpen(!isOpen)}
                style={{ width: 64, height: 64, fontSize: 28, background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', border: 'none', boxShadow: '0 4px 16px rgba(26, 26, 46, 0.4)', transition: 'all 0.3s ease' }} />
            </Badge>
          </Tooltip>
        )}
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
};

export default CryptoAI;