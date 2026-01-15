import React, { useState, useRef, useEffect } from 'react';
import { Card, Input, Button, Avatar, Typography, Spin, Badge, Tooltip, Modal } from 'antd';
import { SendOutlined, RobotOutlined, CloseOutlined, MessageOutlined, ExpandOutlined } from '@ant-design/icons';
import { useGetCryptosQuery } from '../services/coinGeckoApi';
import { askCryptoAssistant, isAIEnabled } from '../services/aiService';
import { 
  ChatHeader, 
  MessageContainer, 
  MessageWrapper, 
  MessageBubble,
  FloatingButton,
  FlexContainer,
} from '../styles/components';
import { theme } from '../styles/theme';

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
      <FloatingButton>
        <Tooltip title="Add OpenAI API key to enable">
          <Button 
            type="primary" 
            shape="circle" 
            size="large" 
            icon={<RobotOutlined />}
            style={{ width: 60, height: 60, fontSize: 24, boxShadow: theme.shadows.md, opacity: 0.5 }}
            disabled 
          />
        </Tooltip>
      </FloatingButton>
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
        <ChatHeader>
          <FlexContainer align="center" gap={theme.spacing.md}>
            <Avatar icon={<RobotOutlined />} size={40} style={{ background: theme.gradients.blue, color: theme.colors.primary }} />
            <div>
              <Text strong style={{ color: theme.colors.primary, fontSize: theme.typography.sizes.xl }}>Crypto AI</Text><br />
              <Text style={{ color: theme.colors.muted, fontSize: theme.typography.sizes.sm }}> ● Online</Text>
            </div>
          </FlexContainer>
          <Button 
            type="text" 
            icon={<CloseOutlined />} 
            onClick={() => setIsExpanded(false)} 
            style={{ color: theme.colors.primary, fontSize: theme.typography.sizes['2xl'] }}
          />
        </ChatHeader>

        <div style={{ flex: 1, overflowY: 'auto', padding: theme.spacing.xl, backgroundColor: '#f5f5f5' }}>
          {messages.map((message, index) => (
            <MessageContainer key={index} isUser={message.role === 'user'}>
              <MessageWrapper isUser={message.role === 'user'}>
                {message.role === 'assistant' && (
                  <Avatar icon={<RobotOutlined />} size={40} style={{ backgroundColor: theme.colors.bgSecondary, flexShrink: 0 }} />
                )}
                <MessageBubble isUser={message.role === 'user'}>
                  {message.content}
                </MessageBubble>
              </MessageWrapper>
            </MessageContainer>
          ))}
          {loading && (
            <FlexContainer gap={theme.spacing.md} align="center">
              <Avatar icon={<RobotOutlined />} size={40} style={{ backgroundColor: theme.colors.bgPrimary }} />
              <div style={{ padding: '14px 18px', backgroundColor: theme.colors.primary, borderRadius: theme.borderRadius.xl, boxShadow: theme.shadows.sm }}>
                <Spin size="small" />
              </div>
            </FlexContainer>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div style={{ padding: theme.spacing.lg, backgroundColor: theme.colors.primary, borderTop: `1px solid ${theme.colors.borderLight}` }}>
          <FlexContainer gap={theme.spacing.md}>
            <Input.TextArea value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={handleKeyPress}
              placeholder="Ask me anything..." autoSize={{ minRows: 1, maxRows: 4 }} disabled={loading} style={{ borderRadius: theme.borderRadius.xl, fontSize: theme.typography.sizes.lg }} />
            <Button type="primary" shape="circle" icon={<SendOutlined />} onClick={sendMessage} disabled={loading || !input.trim()}
              style={{ background: theme.colors.bgPrimary, border: 'none', width: 48, height: 48 }} />
          </FlexContainer>
        </div>
      </Modal>

      <FloatingButton>
        {isOpen && !isExpanded && (
          <Card style={{ width: 380, height: 550, borderRadius: theme.borderRadius.xl, boxShadow: theme.shadows.xl, display: 'flex', flexDirection: 'column', overflow: 'hidden', animation: 'slideUp 0.3s ease-out' }}
            bodyStyle={{ padding: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
            
            <ChatHeader>
              <FlexContainer align="center" gap={theme.spacing.md}>
                <Avatar icon={<RobotOutlined />} size={40} style={{ backgroundColor: theme.colors.bgPrimary, color: theme.colors.primary }} />
                <div>
                  <Text strong style={{ color: theme.colors.primary, fontSize: theme.typography.sizes.xl }}>Crypto AI</Text><br />
                  <Text style={{ color: theme.colors.muted, fontSize: theme.typography.sizes.sm }}>● Online</Text>
                </div>
              </FlexContainer>
              <FlexContainer gap={theme.spacing.sm}>
                <Tooltip title="Expand">
                  <Button type="text" icon={<ExpandOutlined />} onClick={() => setIsExpanded(true)} style={{ color: theme.colors.primary }} />
                </Tooltip>
                <Button type="text" icon={<CloseOutlined />} onClick={() => setIsOpen(false)} style={{ color: theme.colors.primary }} />
              </FlexContainer>
            </ChatHeader>

            <div style={{ flex: 1, overflowY: 'auto', padding: theme.spacing.lg, backgroundColor: '#f5f5f5' }}>
              {messages.map((message, index) => (
                <MessageContainer key={index} isUser={message.role === 'user'}>
                  <MessageWrapper isUser={message.role === 'user'}>
                    {message.role === 'assistant' && (
                      <Avatar icon={<RobotOutlined />} size={32} style={{ backgroundColor: theme.colors.bgPrimary, flexShrink: 0 }} />
                    )}
                    <MessageBubble isUser={message.role === 'user'} style={{ fontSize: theme.typography.sizes.md }}>
                      {message.content}
                    </MessageBubble>
                  </MessageWrapper>
                </MessageContainer>
              ))}
              {loading && (
                <FlexContainer gap={theme.spacing.sm} align="center">
                  <Avatar icon={<RobotOutlined />} size={32} style={{ backgroundColor: theme.colors.bgPrimary }} />
                  <div style={{ padding: '10px 14px', backgroundColor: theme.colors.primary, borderRadius: theme.borderRadius.xl, boxShadow: theme.shadows.sm }}>
                    <Spin size="small" />
                  </div>
                </FlexContainer>
              )}
              <div ref={messagesEndRef} />
            </div>

            {messages.length === 1 && (
              <div style={{ padding: `${theme.spacing.sm} ${theme.spacing.lg}`, backgroundColor: theme.colors.primary, borderTop: `1px solid ${theme.colors.borderLight}` }}>
                <Text type="secondary" style={{ fontSize: theme.typography.sizes.sm }}>Try asking:</Text>
                <FlexContainer wrap="wrap" gap={theme.spacing.xs} style={{ marginTop: theme.spacing.xs }}>
                  {quickQuestions.map((q, i) => (
                    <Button key={i} size="small" onClick={() => setInput(q)} style={{ fontSize: theme.typography.sizes.xs, borderRadius: theme.borderRadius.md }}>{q}</Button>
                  ))}
                </FlexContainer>
              </div>
            )}

            <div style={{ padding: theme.spacing.md, backgroundColor: theme.colors.primary, borderTop: `1px solid ${theme.colors.borderLight}` }}>
              <FlexContainer gap={theme.spacing.sm}>
                <Input.TextArea value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={handleKeyPress}
                  placeholder="Ask me anything..." autoSize={{ minRows: 1, maxRows: 3 }} disabled={loading} style={{ borderRadius: theme.borderRadius.xl }} />
                <Button type="primary" shape="circle" icon={<SendOutlined />} onClick={sendMessage} disabled={loading || !input.trim()}
                  style={{ background: theme.colors.bgPrimary, border: 'none' }} />
              </FlexContainer>
            </div>
          </Card>
        )}

        {!isExpanded && (
          <Tooltip title="Chat with Vela">
            <Badge count={messages.length > 1 ? messages.length - 1 : 0} offset={[-5, 5]}>
              <Button type="primary" shape="circle" size="large" icon={isOpen ? <CloseOutlined /> : <MessageOutlined />}
                onClick={() => setIsOpen(!isOpen)}
                style={{ width: 64, height: 64, fontSize: 28, background: theme.gradients.blue, border: 'none', boxShadow: theme.shadows.lg, transition: 'all 0.3s ease' }} />
            </Badge>
          </Tooltip>
        )}
      </FloatingButton>

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