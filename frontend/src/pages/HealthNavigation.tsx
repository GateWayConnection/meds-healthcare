
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Send, Bot, User, Heart, AlertTriangle, CheckCircle } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

const HealthNavigation = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hello! I\'m your AI health assistant. I can help you with basic health questions, symptom guidance, and direct you to the right medical specialists. How can I assist you today?',
      timestamp: new Date(),
      suggestions: [
        'I have a headache',
        'Chest pain symptoms',
        'Need a specialist',
        'Emergency symptoms'
      ]
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getHealthResponse = (userMessage: string): { content: string; suggestions?: string[] } => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('headache') || message.includes('head pain')) {
      return {
        content: 'I understand you\'re experiencing headaches. Here are some general suggestions:\n\n• Stay hydrated (drink water)\n• Get adequate rest\n• Avoid bright lights\n• Try gentle neck stretches\n\n⚠️ **Seek immediate medical attention if you experience:**\n• Sudden severe headache\n• Headache with fever and stiff neck\n• Headache with vision changes\n• Headache after head injury\n\nWould you like me to help you find a neurologist or book an appointment?',
        suggestions: ['Find neurologist', 'Book appointment', 'Emergency symptoms', 'Other symptoms']
      };
    }
    
    if (message.includes('chest pain') || message.includes('heart')) {
      return {
        content: '🚨 **IMPORTANT: Chest pain can be serious.**\n\n**Seek immediate emergency care if you have:**\n• Crushing chest pain\n• Pain radiating to arm, jaw, or back\n• Shortness of breath\n• Sweating or nausea with chest pain\n• Dizziness or fainting\n\n**Call emergency services: +249 911 123 456**\n\nFor non-emergency chest discomfort, consider consulting a cardiologist. Would you like help finding one?',
        suggestions: ['Find cardiologist', 'Call emergency', 'Book appointment', 'Other symptoms']
      };
    }
    
    if (message.includes('specialist') || message.includes('doctor')) {
      return {
        content: 'I can help you find the right specialist! Here are our available specialties:\n\n• **Cardiology** - Heart conditions\n• **Pediatrics** - Children\'s health\n• **Dermatology** - Skin conditions\n• **Neurology** - Brain and nervous system\n• **Orthopedics** - Bones and joints\n• **Gynecology** - Women\'s health\n• **Internal Medicine** - General adult care\n• **Surgery** - Surgical procedures\n\nWhich specialty are you interested in?',
        suggestions: ['Cardiology', 'Pediatrics', 'Dermatology', 'Find all doctors']
      };
    }
    
    if (message.includes('emergency') || message.includes('urgent')) {
      return {
        content: '🚨 **For Medical Emergencies:**\n\n**Call immediately: +249 911 123 456**\n\n**Emergency symptoms include:**\n• Chest pain or pressure\n• Difficulty breathing\n• Severe bleeding\n• Loss of consciousness\n• Severe burns\n• Suspected stroke (face drooping, arm weakness, speech difficulty)\n• Severe allergic reactions\n\n**Our emergency department is open 24/7**\nLocation: MEDS Healthcare, Khartoum\n\nIs this an emergency situation?',
        suggestions: ['Call emergency now', 'Find nearest hospital', 'Non-emergency help', 'Back to main menu']
      };
    }
    
    if (message.includes('fever') || message.includes('temperature')) {
      return {
        content: 'For fever management:\n\n**General care:**\n• Rest and stay hydrated\n• Monitor temperature regularly\n• Light clothing and cool environment\n• Paracetamol or ibuprofen (follow dosage)\n\n**Seek medical attention if:**\n• Temperature over 39°C (102°F)\n• Fever lasts more than 3 days\n• Difficulty breathing\n• Severe headache or stiff neck\n• Persistent vomiting\n\nWould you like to book an appointment with a general practitioner?',
        suggestions: ['Book GP appointment', 'Emergency symptoms', 'Child fever', 'Other symptoms']
      };
    }
    
    // Default response
    return {
      content: 'I understand you\'re looking for health guidance. While I can provide general information, it\'s important to consult with healthcare professionals for proper diagnosis and treatment.\n\nHere are some ways I can help:\n• Answer general health questions\n• Help you find the right specialist\n• Guide you through booking appointments\n• Provide emergency contact information\n\nWhat specific health concern can I help you with today?',
      suggestions: ['Find a doctor', 'Book appointment', 'Emergency info', 'Symptom guidance']
    };
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: currentMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const response = getHealthResponse(currentMessage);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response.content,
        timestamp: new Date(),
        suggestions: response.suggestions
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setCurrentMessage(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-teal-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="flex justify-center mb-4">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0] 
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-16 h-16 bg-gradient-to-r from-rose-500 to-teal-500 rounded-full flex items-center justify-center"
              >
                <MessageSquare className="w-8 h-8 text-white" />
              </motion.div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Health Navigation Assistant
            </h1>
            <p className="text-gray-600">
              Get instant health guidance and connect with the right specialists
            </p>
          </motion.div>

          {/* Chat Interface */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="border-b bg-gradient-to-r from-rose-500 to-teal-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center">
                  <Bot className="w-5 h-5 mr-2" />
                  AI Health Assistant
                  <Badge variant="secondary" className="ml-auto bg-white/20 text-white">
                    Online
                  </Badge>
                </CardTitle>
              </CardHeader>

              <CardContent className="p-0">
                {/* Messages Container */}
                <div className="h-96 overflow-y-auto p-4 space-y-4">
                  <AnimatePresence>
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${
                          message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                        }`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            message.type === 'user' 
                              ? 'bg-rose-500 text-white' 
                              : 'bg-teal-500 text-white'
                          }`}>
                            {message.type === 'user' ? (
                              <User className="w-4 h-4" />
                            ) : (
                              <Bot className="w-4 h-4" />
                            )}
                          </div>
                          <div className={`rounded-lg px-4 py-2 shadow-md ${
                            message.type === 'user'
                              ? 'bg-rose-500 text-white'
                              : 'bg-white border text-gray-900'
                          }`}>
                            <div className="text-sm whitespace-pre-line">
                              {message.content}
                            </div>
                            <div className={`text-xs mt-1 opacity-70 ${
                              message.type === 'user' ? 'text-rose-100' : 'text-gray-500'
                            }`}>
                              {message.timestamp.toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Typing Indicator */}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="flex items-start space-x-2">
                        <div className="w-8 h-8 rounded-full bg-teal-500 text-white flex items-center justify-center">
                          <Bot className="w-4 h-4" />
                        </div>
                        <div className="bg-white border rounded-lg px-4 py-2 shadow-md">
                          <div className="flex space-x-1">
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                              className="w-2 h-2 bg-teal-500 rounded-full"
                            />
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                              className="w-2 h-2 bg-teal-500 rounded-full"
                            />
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                              className="w-2 h-2 bg-teal-500 rounded-full"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Suggestions */}
                {messages.length > 0 && messages[messages.length - 1].suggestions && (
                  <div className="px-4 py-2 border-t bg-gray-50">
                    <p className="text-xs text-gray-600 mb-2">Quick suggestions:</p>
                    <div className="flex flex-wrap gap-2">
                      {messages[messages.length - 1].suggestions?.map((suggestion, index) => (
                        <motion.button
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="px-3 py-1 text-xs bg-white border border-gray-200 rounded-full hover:bg-rose-50 hover:border-rose-300 transition-colors"
                        >
                          {suggestion}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input Area */}
                <div className="p-4 border-t">
                  <div className="flex space-x-2">
                    <Input
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your health question..."
                      className="flex-1"
                      disabled={isTyping}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!currentMessage.trim() || isTyping}
                      className="bg-rose-600 hover:bg-rose-700"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Disclaimer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
          >
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-800">
                <strong>Medical Disclaimer:</strong> This AI assistant provides general health information only and should not replace professional medical advice. Always consult with qualified healthcare providers for diagnosis, treatment, and medical decisions. In case of emergency, call +249 911 123 456 immediately.
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default HealthNavigation;
