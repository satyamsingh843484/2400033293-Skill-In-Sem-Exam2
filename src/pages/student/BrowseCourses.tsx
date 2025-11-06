import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCourses } from '@/contexts/CourseContext';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, BookOpen, Users, Clock } from 'lucide-react';
import { toast } from 'sonner';

const BrowseCourses = () => {
  const { user } = useAuth();
  const { courses, enrollInCourse, getEnrolledCourses } = useCourses();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const enrolledCourses = getEnrolledCourses(user?.id || '');
  const enrolledCourseIds = enrolledCourses.map(c => c.id);

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEnroll = (courseId: string) => {
    enrollInCourse(courseId, user?.id || '');
    toast.success('Successfully enrolled in course!');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-foreground mb-2">Browse Courses</h1>
          <p className="text-muted-foreground">Discover new learning opportunities</p>
        </div>

        <div className="mb-8 animate-slide-up">
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search courses by title, description, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">No courses found</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course, index) => {
              const isEnrolled = enrolledCourseIds.includes(course.id);
              return (
                <Card 
                  key={course.id} 
                  className="animate-scale-in hover:shadow-lg transition-all"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="secondary">{course.category}</Badge>
                      <Badge className="bg-gradient-primary">{course.level}</Badge>
                    </div>
                    <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                    <CardDescription className="line-clamp-3">{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{course.enrolledStudents.length} students</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Instructor: {course.educatorName}
                      </div>
                      {isEnrolled ? (
                        <Button 
                          className="w-full" 
                          variant="outline"
                          onClick={() => navigate(`/student/courses/${course.id}`)}
                        >
                          View Course
                        </Button>
                      ) : (
                        <Button 
                          className="w-full bg-gradient-secondary hover:opacity-90"
                          onClick={() => handleEnroll(course.id)}
                        >
                          Enroll Now
                        </Button>
                      )}
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

export default BrowseCourses;
