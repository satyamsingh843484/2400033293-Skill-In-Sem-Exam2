import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCourses } from '@/contexts/CourseContext';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Award, FileText, TrendingUp, Search } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const StudentDashboard = () => {
  const { user } = useAuth();
  const { getEnrolledCourses, assignments, submissions } = useCourses();
  const navigate = useNavigate();

  const enrolledCourses = getEnrolledCourses(user?.id || '');
  const myAssignments = assignments.filter(a =>
    enrolledCourses.some(c => c.id === a.courseId)
  );
  const mySubmissions = submissions.filter(s => s.studentId === user?.id);
  const gradedSubmissions = mySubmissions.filter(s => s.grade !== undefined);
  const averageGrade = gradedSubmissions.length > 0
    ? gradedSubmissions.reduce((acc, s) => acc + (s.grade || 0), 0) / gradedSubmissions.length
    : 0;

  const chartData = enrolledCourses.slice(0, 5).map(course => {
    const courseAssignments = assignments.filter(a => a.courseId === course.id);
    const courseSubmissions = mySubmissions.filter(s =>
      courseAssignments.some(a => a.id === s.assignmentId)
    );
    const completed = courseSubmissions.length;
    const total = courseAssignments.length;
    
    return {
      name: course.title.slice(0, 15) + (course.title.length > 15 ? '...' : ''),
      completed,
      total,
    };
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8 animate-fade-in">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-muted-foreground">Continue your learning journey</p>
          </div>
          <Button 
            onClick={() => navigate('/student/browse')}
            className="bg-gradient-secondary hover:opacity-90 transition-opacity gap-2"
          >
            <Search className="h-4 w-4" />
            Browse Courses
          </Button>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="animate-slide-up border-primary/20 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{enrolledCourses.length}</div>
            </CardContent>
          </Card>

          <Card className="animate-slide-up border-secondary/20 shadow-md hover:shadow-lg transition-shadow" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Assignments</CardTitle>
              <FileText className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-secondary">{myAssignments.length}</div>
            </CardContent>
          </Card>

          <Card className="animate-slide-up border-accent/20 shadow-md hover:shadow-lg transition-shadow" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <Award className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">{mySubmissions.length}</div>
            </CardContent>
          </Card>

          <Card className="animate-slide-up border-primary/20 shadow-md hover:shadow-lg transition-shadow" style={{ animationDelay: '0.3s' }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {averageGrade > 0 ? averageGrade.toFixed(1) : '-'}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="animate-scale-in shadow-md">
            <CardHeader>
              <CardTitle>Course Progress</CardTitle>
              <CardDescription>Assignments completed vs total</CardDescription>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="completed" fill="hsl(var(--secondary))" name="Completed" />
                    <Bar dataKey="total" fill="hsl(var(--muted))" name="Total" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  No courses enrolled yet
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="animate-scale-in shadow-md" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Navigate your learning experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={() => navigate('/student/courses')}
                variant="outline"
                className="w-full justify-start gap-2 hover:bg-primary/10"
              >
                <BookOpen className="h-4 w-4" />
                My Courses
              </Button>
              <Button 
                onClick={() => navigate('/student/assignments')}
                variant="outline"
                className="w-full justify-start gap-2 hover:bg-secondary/10"
              >
                <FileText className="h-4 w-4" />
                View Assignments
              </Button>
              <Button 
                onClick={() => navigate('/student/browse')}
                variant="outline"
                className="w-full justify-start gap-2 hover:bg-accent/10"
              >
                <Search className="h-4 w-4" />
                Browse New Courses
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="animate-fade-in shadow-md">
          <CardHeader>
            <CardTitle>My Courses</CardTitle>
            <CardDescription>Continue where you left off</CardDescription>
          </CardHeader>
          <CardContent>
            {enrolledCourses.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">You haven't enrolled in any courses yet</p>
                <Button 
                  onClick={() => navigate('/student/browse')}
                  className="bg-gradient-secondary hover:opacity-90"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Browse Courses
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-4">
                {enrolledCourses.slice(0, 3).map((course) => (
                  <Card 
                    key={course.id} 
                    className="cursor-pointer hover:shadow-lg transition-all hover:scale-105"
                    onClick={() => navigate(`/student/courses/${course.id}`)}
                  >
                    <CardHeader>
                      <CardTitle className="text-lg line-clamp-1">{course.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{course.educatorName}</span>
                        <span className="text-secondary font-medium">{course.level}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;
