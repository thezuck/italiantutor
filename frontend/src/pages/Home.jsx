import React from "react";
import { Lesson, UserProgress } from "@/api/entities";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { MessageSquare, BookOpen, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import LessonCard from "../components/lessons/LessonCard";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const { user } = useAuth();

  const { data: lessons, isLoading: lessonsLoading } = useQuery({
    queryKey: ["lessons"],
    queryFn: () => Lesson.list("title", 50),
    initialData: []
  });

  const { data: progressData } = useQuery({
    queryKey: ["userProgress", user?.email],
    queryFn: () => UserProgress.filter({ user_email: user?.email }),
    enabled: !!user?.email,
    initialData: []
  });

  const completedCount = progressData?.filter(p => p.completed).length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-coral-50/20">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white border-b border-gray-100"
      >
        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
          <div className="max-w-3xl">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
            >
              Ciao! 👋
              <br />
              <span className="bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                Learn Italian
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-gray-600 mb-8 leading-relaxed"
            >
              Master the beautiful language of Italy with personalized lessons and an AI tutor that adapts to your learning style.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Link to={createPageUrl("Chat")}>
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 h-14 text-base font-medium shadow-lg shadow-green-600/20 hover:shadow-xl transition-all duration-300">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Chat with AI Tutor
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-gray-200 hover:bg-gray-50 px-8 h-14 text-base font-medium"
                onClick={() => document.getElementById('lessons')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Browse Lessons
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-green-100">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">{lessons?.length || 0}</p>
                <p className="text-sm text-gray-600">Total Lessons</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-coral-100">
                <TrendingUp className="w-6 h-6 text-coral-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">{completedCount}</p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-green-100">
                <MessageSquare className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">24/7</p>
                <p className="text-sm text-gray-600">AI Tutor Available</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Lessons Section */}
      <div id="lessons" className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Available Lessons</h2>
          <p className="text-gray-600">Choose a lesson to start your Italian journey</p>
        </motion.div>

        {lessonsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white rounded-2xl p-6 border border-gray-100 h-80" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map((lesson, index) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                progress={progressData?.find(p => p.lesson_id === lesson.id)}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}