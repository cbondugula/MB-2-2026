import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  BookOpen,
  GraduationCap,
  Clock,
  Users,
  Star,
  ArrowLeft,
  Play,
  CheckCircle,
  Lock,
  Award,
  Trophy,
  Flame,
  Target,
  Shield,
  Code,
  FileText,
  Stethoscope
} from "lucide-react";

const CATEGORIES = [
  { id: "all", label: "All Courses", icon: BookOpen },
  { id: "hipaa", label: "HIPAA Compliance", icon: Shield },
  { id: "development", label: "Development", icon: Code },
  { id: "clinical", label: "Clinical Systems", icon: Stethoscope },
  { id: "certification", label: "Certification", icon: Award },
];

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: "bg-green-900/50 text-green-400",
  intermediate: "bg-yellow-900/50 text-yellow-400",
  advanced: "bg-red-900/50 text-red-400",
};

export default function AcademyPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showFreeOnly, setShowFreeOnly] = useState(false);

  const { data: coursesData, isLoading } = useQuery({
    queryKey: ["/api/viral/academy/courses", { category: selectedCategory, isFree: showFreeOnly }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedCategory !== "all") params.append("category", selectedCategory);
      if (showFreeOnly) params.append("isFree", "true");
      const response = await fetch(`/api/viral/academy/courses?${params}`);
      if (!response.ok) throw new Error("Failed to fetch courses");
      return response.json();
    },
  });

  const enrollMutation = useMutation({
    mutationFn: async (courseId: number) => {
      return apiRequest("POST", `/api/viral/academy/courses/${courseId}/enroll`);
    },
    onSuccess: (data: any) => {
      toast({
        title: "Enrolled successfully!",
        description: "You can now start learning. Good luck!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/viral/academy/courses"] });
    },
    onError: () => {
      toast({
        title: "Login required",
        description: "Please sign in to enroll in courses",
        variant: "destructive",
      });
    },
  });

  const courses = coursesData || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="text-gray-400 hover:text-white"
            data-testid="btn-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2 text-white" data-testid="text-page-title">
              <GraduationCap className="h-8 w-8 text-blue-500" />
              MedBuilder Academy
            </h1>
            <p className="text-gray-300">
              Master healthcare development with HIPAA certification and hands-on courses
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-900/30 to-gray-800/50 border-blue-500/30 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{courses.length}</p>
                <p className="text-sm text-gray-400">Courses</p>
              </div>
            </div>
          </Card>
          <Card className="bg-gradient-to-br from-emerald-900/30 to-gray-800/50 border-emerald-500/30 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <Shield className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">HIPAA</p>
                <p className="text-sm text-gray-400">Certified</p>
              </div>
            </div>
          </Card>
          <Card className="bg-gradient-to-br from-purple-900/30 to-gray-800/50 border-purple-500/30 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Trophy className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">12</p>
                <p className="text-sm text-gray-400">Certifications</p>
              </div>
            </div>
          </Card>
          <Card className="bg-gradient-to-br from-orange-900/30 to-gray-800/50 border-orange-500/30 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Flame className="h-6 w-6 text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">Free</p>
                <p className="text-sm text-gray-400">Core Courses</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-between mb-8">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(cat.id)}
                className={selectedCategory === cat.id
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "border-gray-600 bg-gray-800 text-gray-200 hover:bg-gray-700 hover:text-white"}
                data-testid={`btn-category-${cat.id}`}
              >
                <cat.icon className="h-4 w-4 mr-2" />
                {cat.label}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="freeOnly"
              checked={showFreeOnly}
              onChange={(e) => setShowFreeOnly(e.target.checked)}
              className="rounded border-gray-600"
            />
            <label htmlFor="freeOnly" className="text-sm text-gray-300">
              Free courses only
            </label>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-emerald-500" />
            Featured Learning Path
          </h2>
          <Card className="bg-gradient-to-r from-emerald-900/20 via-gray-800/50 to-blue-900/20 border-emerald-500/30 p-6">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <Shield className="h-10 w-10 text-emerald-400" />
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <Badge className="bg-emerald-900/50 text-emerald-400 mb-2">Learning Path</Badge>
                <h3 className="text-2xl font-bold text-white mb-2">HIPAA Compliance Certification</h3>
                <p className="text-gray-400 mb-4">
                  Complete this 5-course learning path to earn your HIPAA Compliance Developer certification
                </p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <span className="flex items-center gap-1 text-gray-400">
                    <BookOpen className="h-4 w-4" />
                    5 Courses
                  </span>
                  <span className="flex items-center gap-1 text-gray-400">
                    <Clock className="h-4 w-4" />
                    12 Hours
                  </span>
                  <span className="flex items-center gap-1 text-gray-400">
                    <Users className="h-4 w-4" />
                    2,400+ Enrolled
                  </span>
                </div>
              </div>
              <Button className="bg-emerald-600 hover:bg-emerald-700" data-testid="btn-start-path">
                Start Learning
              </Button>
            </div>
          </Card>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="bg-gray-800/50 border-gray-700">
                <Skeleton className="h-40 w-full bg-gray-700 rounded-t-lg" />
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 bg-gray-700" />
                  <Skeleton className="h-4 w-1/2 bg-gray-700" />
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20">
            <GraduationCap className="h-16 w-16 mx-auto text-gray-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-200 mb-2">No courses found</h3>
            <p className="text-gray-400">
              Check back soon for new learning content
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course: any) => (
              <Card
                key={course.id}
                className="bg-gray-800/50 border-gray-700 hover:border-blue-500/50 transition-all group overflow-hidden"
                data-testid={`card-course-${course.id}`}
              >
                {course.thumbnailUrl && (
                  <div className="aspect-video bg-gray-900 overflow-hidden relative">
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="secondary" size="sm" className="gap-2">
                        <Play className="h-4 w-4" />
                        Preview
                      </Button>
                    </div>
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <CardTitle className="text-white group-hover:text-blue-400 transition-colors">
                        {course.title}
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        by {course.instructorName || "MedBuilder Team"}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Badge className={DIFFICULTY_COLORS[course.difficulty] || DIFFICULTY_COLORS.beginner}>
                        {course.difficulty || "Beginner"}
                      </Badge>
                      {course.isFree && (
                        <Badge className="bg-green-900/50 text-green-400">Free</Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                    {course.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      {course.lessonCount || 0} Lessons
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {course.duration || "2h"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {course.enrollmentCount || 0}
                    </span>
                  </div>
                  {course.enrolledProgress !== undefined && course.enrolledProgress > 0 && (
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Progress</span>
                        <span>{course.enrolledProgress}%</span>
                      </div>
                      <Progress value={course.enrolledProgress} className="h-2" />
                    </div>
                  )}
                </CardContent>
                <CardFooter className="border-t border-gray-700 pt-4">
                  {course.isEnrolled ? (
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => navigate(`/academy/course/${course.slug}`)}
                      data-testid={`btn-continue-${course.id}`}
                    >
                      {course.enrolledProgress > 0 ? (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Continue Learning
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Start Course
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => enrollMutation.mutate(course.id)}
                      disabled={enrollMutation.isPending}
                      data-testid={`btn-enroll-${course.id}`}
                    >
                      <GraduationCap className="h-4 w-4 mr-2" />
                      Enroll Now {!course.isFree && `- $${(course.price / 100).toFixed(2)}`}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-12">
          <Card className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-500/30 p-8 text-center">
            <Award className="h-12 w-12 mx-auto text-yellow-500 mb-4" />
            <h3 className="text-2xl font-bold text-white mb-4">Earn Your HIPAA Certification</h3>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              Complete our comprehensive HIPAA training program and earn a verifiable certificate. 
              Stand out in the healthcare development industry with proof of your compliance expertise.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button className="bg-blue-600 hover:bg-blue-700" data-testid="btn-view-certifications">
                <Trophy className="h-5 w-5 mr-2" />
                View Certifications
              </Button>
              <Button variant="outline" className="border-gray-600" data-testid="btn-my-progress">
                <Target className="h-5 w-5 mr-2" />
                My Learning Progress
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
