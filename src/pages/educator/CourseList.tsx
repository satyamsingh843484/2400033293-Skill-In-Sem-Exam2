import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCourses } from '@/contexts/CourseContext';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Users, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const CourseList = () => {
  const { user } = useAuth();
  const { getCoursesByEducator, deleteCourse } = useCourses();
  const navigate = useNavigate();

  const myCourses = getCoursesByEducator(user?.id || '');

  const handleDelete = (courseId: string, courseName: string) => {
    deleteCourse(courseId);
    toast.success(`"${courseName}" has been deleted`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8 animate-fade-in">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">My Courses</h1>
            <p className="text-muted-foreground">Manage and view all your courses</p>
          </div>
          <Button
            onClick={() => navigate('/educator/create-course')}
            className="bg-gradient-accent hover:opacity-90 gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Course
          </Button>
        </div>

        {myCourses.length === 0 ? (
          <Card className="animate-scale-in">
            <CardContent className="text-center py-12">
              <Plus className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg mb-4">No courses created yet</p>
              <Button
                onClick={() => navigate('/educator/create-course')}
                className="bg-gradient-primary hover:opacity-90"
              >
                Create Your First Course
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myCourses.map((course, index) => (
              <Card 
                key={course.id} 
                className="animate-scale-in hover:shadow-lg transition-all"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <CardHeader>
                  <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                  <CardDescription className="line-clamp-3">{course.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {course.enrolledStudents.length} students
                      </span>
                      <span className="text-primary font-medium">{course.level}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Category: {course.category}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 gap-1"
                        onClick={() => navigate(`/educator/courses/${course.id}`)}
                      >
                        <Eye className="h-3 w-3" />
                        View
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="destructive" className="gap-1">
                            <Trash2 className="h-3 w-3" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Course</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{course.title}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(course.id, course.title)}
                              className="bg-destructive text-destructive-foreground"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseList;
