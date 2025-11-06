import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCourses } from '@/contexts/CourseContext';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Search, Clock, Award } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const MyCourses = () => {
  const { user } = useAuth();
  const { getEnrolledCourses, assignments, submissions } = useCourses();
  const navigate = useNavigate();

  const enrolledCourses = getEnrolledCourses(user?.id || '');

  const getCourseProgress = (courseId: string) => {
    const courseAssignments = assignments.filter(a => a.courseId === courseId);
    const courseSubmissions = submissions.filter(s =>
      s.studentId === user?.id &&
      courseAssignments.some(a => a.id === s.assignmentId)
    );
    
    if (courseAssignments.length === 0) return 0;
    return (courseSubmissions.length / courseAssignments.length) * 100;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8 animate-fade-in">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">My Courses</h1>
            <p className="text-muted-foreground">Track your learning progress</p>
          </div>
          <Button
            onClick={() => navigate('/student/browse')}
            className="bg-gradient-secondary hover:opacity-90 gap-2"
          >
            <Search className="h-4 w-4" />
            Browse More
          </Button>
        </div>

        {enrolledCourses.length === 0 ? (
          <Card className="animate-scale-in">
            <CardContent className="text-center py-12">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg mb-4">
                You haven't enrolled in any courses yet
              </p>
              <Button
                onClick={() => navigate('/student/browse')}
                className="bg-gradient-secondary hover:opacity-90"
              >
                <Search className="h-4 w-4 mr-2" />
                Browse Courses
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map((course, index) => {
              const progress = getCourseProgress(course.id);
              return (
                <Card 
                  key={course.id} 
                  className="animate-scale-in hover:shadow-lg transition-all cursor-pointer"
                  style={{ animationDelay: `${index * 0.05}s` }}
                  onClick={() => navigate(`/student/courses/${course.id}`)}
                >
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                    <CardDescription className="line-clamp-3">
                      {course.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Award className="h-4 w-4" />
                        <span>{course.level}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Instructor: {course.educatorName}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;
