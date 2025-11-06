import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCourses } from '@/contexts/CourseContext';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, BookOpen, Users, FileText, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const EducatorDashboard = () => {
  const { user } = useAuth();
  const { getCoursesByEducator, courses, assignments, submissions } = useCourses();
  const navigate = useNavigate();

  const myCourses = getCoursesByEducator(user?.id || '');
  const totalStudents = myCourses.reduce((acc, course) => acc + course.enrolledStudents.length, 0);
  const myAssignments = assignments.filter(a => 
    myCourses.some(c => c.id === a.courseId)
  );
  const pendingSubmissions = submissions.filter(s => 
    myAssignments.some(a => a.id === s.assignmentId) && !s.grade
  );

  const chartData = [
    { name: 'Courses', value: myCourses.length, color: 'hsl(var(--primary))' },
    { name: 'Students', value: totalStudents, color: 'hsl(var(--secondary))' },
    { name: 'Assignments', value: myAssignments.length, color: 'hsl(var(--accent))' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8 animate-fade-in">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-muted-foreground">Manage your courses and track student progress</p>
          </div>
          <Button 
            onClick={() => navigate('/educator/create-course')}
            className="bg-gradient-accent hover:opacity-90 transition-opacity gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Course
          </Button>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="animate-slide-up border-primary/20 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{myCourses.length}</div>
            </CardContent>
          </Card>

          <Card className="animate-slide-up border-secondary/20 shadow-md hover:shadow-lg transition-shadow" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-secondary">{totalStudents}</div>
            </CardContent>
          </Card>

          <Card className="animate-slide-up border-accent/20 shadow-md hover:shadow-lg transition-shadow" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Assignments</CardTitle>
              <FileText className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">{myAssignments.length}</div>
            </CardContent>
          </Card>

          <Card className="animate-slide-up border-destructive/20 shadow-md hover:shadow-lg transition-shadow" style={{ animationDelay: '0.3s' }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
              <TrendingUp className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">{pendingSubmissions.length}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="animate-scale-in shadow-md">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
              <CardDescription>Your teaching statistics at a glance</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="animate-scale-in shadow-md" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your courses efficiently</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={() => navigate('/educator/courses')}
                variant="outline"
                className="w-full justify-start gap-2 hover:bg-primary/10"
              >
                <BookOpen className="h-4 w-4" />
                View All Courses
              </Button>
              <Button 
                onClick={() => navigate('/educator/assignments')}
                variant="outline"
                className="w-full justify-start gap-2 hover:bg-secondary/10"
              >
                <FileText className="h-4 w-4" />
                Manage Assignments
              </Button>
              <Button 
                onClick={() => navigate('/educator/submissions')}
                variant="outline"
                className="w-full justify-start gap-2 hover:bg-accent/10"
              >
                <TrendingUp className="h-4 w-4" />
                Review Submissions
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="animate-fade-in shadow-md">
          <CardHeader>
            <CardTitle>Recent Courses</CardTitle>
            <CardDescription>Your latest created courses</CardDescription>
          </CardHeader>
          <CardContent>
            {myCourses.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No courses yet. Create your first course!</p>
                <Button 
                  onClick={() => navigate('/educator/create-course')}
                  className="bg-gradient-primary hover:opacity-90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Course
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-4">
                {myCourses.slice(0, 3).map((course) => (
                  <Card 
                    key={course.id} 
                    className="cursor-pointer hover:shadow-lg transition-all hover:scale-105"
                    onClick={() => navigate(`/educator/courses/${course.id}`)}
                  >
                    <CardHeader>
                      <CardTitle className="text-lg line-clamp-1">{course.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {course.enrolledStudents.length} students
                        </span>
                        <span className="text-primary font-medium">{course.level}</span>
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

export default EducatorDashboard;
