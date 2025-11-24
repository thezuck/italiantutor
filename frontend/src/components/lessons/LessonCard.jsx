import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, CheckCircle2 } from "lucide-react";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";

export default function LessonCard({ lesson, progress, index }) {
  const levelColors = {
    beginner: "bg-green-100 text-green-700 border-green-200",
    intermediate: "bg-amber-100 text-amber-700 border-amber-200",
    advanced: "bg-red-100 text-red-700 border-red-200"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className="group hover:shadow-xl transition-all duration-300 border-gray-100 bg-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <CardHeader className="relative pb-4">
          <div className="flex items-start justify-between mb-2">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-50 to-green-100 group-hover:from-green-100 group-hover:to-green-200 transition-all duration-300">
              <BookOpen className="w-6 h-6 text-green-600" />
            </div>
            {progress?.completed && (
              <div className="flex items-center gap-1 text-green-600">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm font-medium">Completed</span>
              </div>
            )}
          </div>
          
          <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-green-700 transition-colors">
            {lesson.title}
          </CardTitle>
          
          <CardDescription className="text-gray-600 mt-2 line-clamp-2">
            {lesson.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="relative space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge className={`${levelColors[lesson.level]} border font-medium`}>
              {lesson.level}
            </Badge>
            {lesson.duration && (
              <Badge variant="outline" className="flex items-center gap-1 bg-gray-50">
                <Clock className="w-3 h-3" />
                {lesson.duration}
              </Badge>
            )}
          </div>

          {lesson.topics && lesson.topics.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {lesson.topics.map((topic, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2 py-1 rounded-full bg-coral-50 text-coral-700 border border-coral-100"
                >
                  {topic}
                </span>
              ))}
            </div>
          )}

          <Link to={createPageUrl(`LessonDetail?id=${lesson.id}`)}>
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium transition-all duration-300 group-hover:shadow-md">
              Start Lesson
            </Button>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
}