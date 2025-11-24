import React from "react";
import { Lesson, UserProgress } from "@/api/entities";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle2, Clock, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

export default function LessonDetail() {
  const { user } = useAuth();
  const urlParams = new URLSearchParams(window.location.search);
  const lessonId = urlParams.get("id");
  const queryClient = useQueryClient();

  const { data: lessons } = useQuery({
    queryKey: ["lessons"],
    queryFn: () => Lesson.list(),
    initialData: []
  });

  const lesson = lessons.find(l => l.id === lessonId);

  const { data: progressData } = useQuery({
    queryKey: ["userProgress", user?.email, lessonId],
    queryFn: () => UserProgress.filter({ 
      user_email: user?.email, 
      lesson_id: lessonId 
    }),
    enabled: !!user?.email && !!lessonId,
    initialData: []
  });

  const progress = progressData?.[0];

  const markCompleteMutation = useMutation({
    mutationFn: async () => {
      if (progress) {
        return UserProgress.update(progress.id, { completed: true, progress_percentage: 100 });
      } else {
        return UserProgress.create({
          user_email: user.email,
          lesson_id: lessonId,
          completed: true,
          progress_percentage: 100
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProgress"] });
    }
  });

  const levelColors = {
    beginner: "bg-green-100 text-green-700 border-green-200",
    intermediate: "bg-amber-100 text-amber-700 border-amber-200",
    advanced: "bg-red-100 text-red-700 border-red-200"
  };

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-coral-50/20 flex items-center justify-center">
        <p className="text-gray-600">Lesson not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-coral-50/20">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to={createPageUrl("Home")}>
            <Button variant="ghost" className="mb-6 -ml-2 hover:bg-green-50">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Lessons
            </Button>
          </Link>

          <Card className="overflow-hidden border-gray-100 shadow-lg">
            <div className="h-2 bg-gradient-to-r from-green-500 to-green-600" />
            
            <CardHeader className="bg-white p-8 border-b border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-green-50 to-green-100">
                  <BookOpen className="w-8 h-8 text-green-600" />
                </div>
                {progress?.completed && (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border border-green-200">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-green-700">Completed</span>
                  </div>
                )}
              </div>

              <CardTitle className="text-3xl font-bold text-gray-900 mb-4">
                {lesson.title}
              </CardTitle>

              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                {lesson.description}
              </p>

              <div className="flex flex-wrap gap-3">
                <Badge className={`${levelColors[lesson.level]} border font-medium px-3 py-1`}>
                  {lesson.level}
                </Badge>
                {lesson.duration && (
                  <Badge variant="outline" className="flex items-center gap-1 bg-gray-50 px-3 py-1">
                    <Clock className="w-3 h-3" />
                    {lesson.duration}
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-8 bg-white">
              {lesson.topics && lesson.topics.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Topics Covered</h3>
                  <div className="flex flex-wrap gap-2">
                    {lesson.topics.map((topic, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 rounded-full bg-coral-50 text-coral-700 border border-coral-100 text-sm font-medium"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {lesson.content && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Lesson Content</h3>
                  <div className="prose prose-green max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {lesson.content}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-6 border-t border-gray-100">
                {!progress?.completed && (
                  <Button
                    onClick={() => markCompleteMutation.mutate()}
                    disabled={markCompleteMutation.isPending}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium px-6"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Mark as Complete
                  </Button>
                )}
                <Link to={createPageUrl("Chat")}>
                  <Button variant="outline" className="border-gray-200 hover:bg-gray-50 font-medium px-6">
                    Practice with Tutor
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}