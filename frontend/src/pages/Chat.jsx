import React, { useState, useEffect, useRef } from "react";
import { ChatMessage } from "@/api/entities";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ChatMessageBubble from "../components/chat/ChatMessageBubble";
import ChatInput from "../components/chat/ChatInput";
import { motion } from "framer-motion";
import { Bot, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function Chat() {
  const { user } = useAuth();
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const queryClient = useQueryClient();

  console.log('[DEBUG] Chat component rendered, user:', user?.email);

  const { data: messages, isLoading, error: queryError } = useQuery({
    queryKey: ["chatMessages", user?.email],
    queryFn: () => {
      console.log('[DEBUG] Fetching chat messages for user:', user?.email);
      return ChatMessage.filter({ user_email: user?.email }, "created_date", 100);
    },
    enabled: !!user?.email,
    initialData: [],
    onSuccess: (data) => {
      console.log('[DEBUG] Chat messages fetched successfully, count:', data?.length || 0);
    },
    onError: (error) => {
      console.error('[DEBUG] Error fetching chat messages:', error);
    }
  });

  console.log('[DEBUG] Query state:', { 
    isLoading, 
    messagesCount: messages?.length || 0, 
    hasError: !!queryError,
    userEmail: user?.email 
  });

  const createMessageMutation = useMutation({
    mutationFn: (messageData) => {
      console.log('[DEBUG] Creating message:', messageData);
      return ChatMessage.create(messageData);
    },
    onSuccess: (data) => {
      console.log('[DEBUG] Message created successfully:', data);
      console.log('[DEBUG] Invalidating chat messages query...');
      queryClient.invalidateQueries({ queryKey: ["chatMessages"] });
    },
    onError: (error) => {
      console.error('[DEBUG] Error creating message:', error);
    }
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (message) => {
    console.log('[DEBUG] handleSendMessage called with:', message);
    
    if (!user) {
      console.warn('[DEBUG] No user found, cannot send message');
      return;
    }

    console.log('[DEBUG] Setting typing indicator to true');
    // Show typing indicator
    setIsTyping(true);

    try {
      console.log('[DEBUG] Sending message to backend...');
      // Create user message - backend will automatically generate AI response
      const response = await createMessageMutation.mutateAsync({
        user_email: user.email,
        message: message,
        role: "user"
      });

      console.log('[DEBUG] Backend response received:', response);
      console.log('[DEBUG] Response has userMessage:', !!response.userMessage);
      console.log('[DEBUG] Response has tutorMessage:', !!response.tutorMessage);
      console.log('[DEBUG] Response has error:', !!response.error);

      // Response may contain both userMessage and tutorMessage
      // or just userMessage if AI response failed
      // The mutation will automatically invalidate queries and refetch
    } catch (error) {
      console.error('[DEBUG] Error sending message:', error);
      console.error('[DEBUG] Error details:', {
        message: error.message,
        stack: error.stack,
        response: error.response
      });
    } finally {
      console.log('[DEBUG] Setting typing indicator to false');
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-50 via-green-50/30 to-coral-50/20 flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-shrink-0 bg-white border-b border-gray-100 px-6 py-5 shadow-sm"
      >
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
            <Bot className="w-6 h-6 text-green-700" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Italian AI Tutor</h1>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Always here to help you learn
            </p>
          </div>
        </div>
      </motion.div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {!messages || messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center mx-auto mb-6">
                <Bot className="w-10 h-10 text-green-700" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Start Your Italian Journey</h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Ask me anything about Italian! Grammar, vocabulary, pronunciation, or just practice conversation.
              </p>
            </motion.div>
          ) : (
            <div>
              {messages.map((msg) => (
                <ChatMessageBubble
                  key={msg.id}
                  message={msg}
                  isUser={msg.role === "user"}
                />
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 mb-6"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-green-700" />
                  </div>
                  <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-5 py-3 shadow-sm">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 bg-white border-t border-gray-100 px-6 py-6 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <ChatInput onSend={handleSendMessage} isLoading={isTyping} />
        </div>
      </div>
    </div>
  );
}