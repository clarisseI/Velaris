import styled from 'styled-components';
import { Card } from 'antd';
import { theme } from './theme';

// Reusable styled components to eliminate inline style repetition

export const FlexContainer = styled.div`
  display: flex;
  justify-content: ${props => props.justify || 'flex-start'};
  align-items: ${props => props.align || 'stretch'};
  gap: ${props => props.gap || '0'};
  flex-direction: ${props => props.direction || 'row'};
  flex-wrap: ${props => props.wrap || 'nowrap'};
`;

export const Text = styled.span`
  font-family: ${theme.typography.fontFamily};
  font-size: ${props => theme.typography.sizes[props.size] || theme.typography.sizes.lg};
  font-weight: ${props => theme.typography.weights[props.weight] || theme.typography.weights.regular};
  color: ${props => theme.colors[props.color] || theme.colors.primary};
  text-transform: ${props => props.uppercase ? 'uppercase' : 'none'};
  display: ${props => props.block ? 'block' : 'inline'};
  margin: ${props => props.margin || '0'};
`;

export const LoadingContainer = styled.div`
  text-align: center;
  padding: ${props => props.padding || theme.spacing['2xl']};
  background: ${props => props.bg || theme.colors.bgSecondary};
  border-radius: ${theme.borderRadius.lg};
  min-height: ${props => props.minHeight || 'auto'};
  display: ${props => props.flex ? 'flex' : 'block'};
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const InfoBox = styled.div`
  padding: ${props => props.padding || theme.spacing.md};
  background: ${props => props.bg || 'rgba(255,255,255,0.05)'};
  border-radius: ${theme.borderRadius.sm};
  text-align: ${props => props.align || 'left'};
  margin-top: ${props => props.mt || '0'};
`;

export const GradientCard = styled.div`
  background: ${props => theme.gradients[props.gradient] || theme.gradients.purple};
  border: 1px solid ${theme.colors.borderLight};
  border-radius: ${theme.borderRadius.lg};
  padding: ${props => props.padding || theme.spacing.lg};
  box-shadow: ${props => theme.shadows[props.shadow] || theme.shadows.md};
`;

export const IconWrapper = styled.div`
  width: ${props => props.size || '48px'};
  height: ${props => props.size || '48px'};
  border-radius: ${theme.borderRadius.md};
  background: ${props => theme.gradients[props.gradient] || theme.gradients.purple};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${props => props.fontSize || '24px'};
  flex-shrink: 0;
`;

export const PageContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 0 ${theme.spacing.xl};
`;

export const StatCard = styled.div`
  padding: ${theme.spacing.xl};
  text-align: center;
  position: relative;
`;

export const InfoIcon = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: ${theme.typography.sizes.xl};
  color: ${theme.colors.muted};
  cursor: pointer;
  transition: color 0.2s;
  
  &:hover {
    color: ${theme.colors.primary};
  }
`;

export const PopoverContent = styled.div`
  max-width: 280px;
  font-family: ${theme.typography.fontFamily};
  font-size: ${theme.typography.sizes.lg};
  line-height: 1.6;
`;

export const PopoverTitle = styled.span`
  font-family: ${theme.typography.fontFamily};
  font-weight: ${theme.typography.weights.semibold};
`;

export const ToggleButton = styled.span`
  cursor: pointer;
  color: ${theme.colors.primary};
  font-size: ${theme.typography.sizes.lg};
  font-weight: ${theme.typography.weights.bold};
  font-family: ${theme.typography.fontFamily};
  transition: all 0.2s ease;
  padding: ${theme.spacing.sm} ${theme.spacing.xl};
  border-radius: ${theme.borderRadius.md};
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid transparent;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: ${theme.colors.primary};
  }
`;

export const GlassCard = styled(Card)`
  background: ${theme.colors.cardBg} !important;
  backdrop-filter: blur(12px);
  border: 1px solid ${theme.colors.borderLight} !important;
  border-radius: ${theme.borderRadius.lg} !important;
  box-shadow: ${theme.shadows.lg} !important;
  transition: all 0.3s ease !important;
  font-family: ${theme.typography.fontFamily};
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${theme.shadows.xl} !important;
    border-color: rgba(255, 255, 255, 0.2) !important;
  }
`;

export const MessageContainer = styled.div`
  display: flex;
  justify-content: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  margin-bottom: ${theme.spacing.lg};
`;

export const MessageWrapper = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  max-width: 75%;
  flex-direction: ${props => props.isUser ? 'row-reverse' : 'row'};
  align-items: flex-end;
`;

export const MessageBubble = styled.div`
  padding: 14px 18px;
  border-radius: ${props => props.isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px'};
  background-color: ${props => props.isUser ? theme.colors.bgSecondary : theme.colors.primary};
  color: ${props => props.isUser ? theme.colors.primary : theme.colors.bgPrimary};
  box-shadow: ${theme.shadows.sm};
  white-space: pre-wrap;
  word-break: break-word;
  font-size: ${theme.typography.sizes.lg};
  line-height: 1.6;
  font-family: ${theme.typography.fontFamily};
`;

export const ChatHeader = styled.div`
  background: ${theme.gradients.blue};
  border-radius: ${theme.borderRadius.xl} ${theme.borderRadius.xl} 0 0;
  padding: ${theme.spacing.lg} ${theme.spacing.xl};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const FloatingButton = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
`;
