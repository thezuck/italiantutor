import React from "react";
import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";

export default function ChatMessageBubble({ message, isUser }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"} mb-6`}
    >
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
        isUser 
          ? "bg-gradient-to-br from-coral-100 to-coral-200" 
          : "bg-gradient-to-br from-green-100 to-green-200"
      }`}>
        {isUser ? (
          <User className="w-5 h-5 text-coral-700" />
        ) : (
          <Bot className="w-5 h-5 text-green-700" />
        )}
      </div>

      <div className={`flex-1 max-w-[75%] ${isUser ? "items-end" : "items-start"} flex flex-col`}>
        <div className={`px-5 py-3 rounded-2xl ${
          isUser
            ? "bg-gradient-to-br from-green-600 to-green-700 text-white rounded-tr-sm"
            : "bg-white border border-gray-100 text-gray-900 rounded-tl-sm shadow-sm"
        }`}>
          <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{message.message}</p>
        </div>
        <span className="text-xs text-gray-400 mt-1 px-2">
          {new Date(message.created_date).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </span>
      </div>
    </motion.div>
  );
}