import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCourses } from '@/contexts/CourseContext';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FileText, Calendar, Award, Send } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

const ViewAssignments = () => {
  const { user } = useAuth();
  const { getEnrolledCourses, assignments, submissions, submitAssignment } = useCourses();
  const [selectedAssignment, setSelectedAssignment] = useState<string | null>(null);
  const [submissionContent, setSubmissionContent] = useState('');

  const enrolledCourses = getEnrolledCourses(user?.id || '');
  const myAssignments = assignments.filter(a =>
    enrolledCourses.some(c => c.id === a.courseId)
  );

  const handleSubmit = () => {
    if (!selectedAssignment || !submissionContent.trim()) {
      toast.error('Please enter your submission');
      return;
    }

    const assignment = myAssignments.find(a => a.id === selectedAssignment);
    submitAssignment({
      assignmentId: selectedAssignment,
      studentId: user?.id || '',
      studentName: user?.name || '',
      content: submissionContent,
    });

    toast.success(`Submitted ${assignment?.title}!`);
    setSelectedAssignment(null);
    setSubmissionContent('');
  };

  const getSubmissionStatus = (assignmentId: string) => {
    const submission = submissions.find(
      s => s.assignmentId === assignmentId && s.studentId === user?.id
    );
    return submission;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-foreground mb-2">My Assignments</h1>
          <p className="text-muted-foreground">Complete and submit your coursework</p>
        </div>

        {myAssignments.length === 0 ? (
          <Card className="animate-scale-in">
            <CardContent className="text-center py-12">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">No assignments available yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myAssignments.map((assignment, index) => {
              const course = enrolledCourses.find(c => c.id === assignment.courseId);
              const submission = getSubmissionStatus(assignment.id);
              const isSubmitted = !!submission;
              const isGraded = submission?.grade !== undefined;

              return (
                <Card 
                  key={assignment.id} 
                  className="animate-scale-in hover:shadow-lg transition-all"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant={isGraded ? 'default' : isSubmitted ? 'secondary' : 'outline'}>
                        {isGraded ? 'Graded' : isSubmitted ? 'Submitted' : 'Pending'}
                      </Badge>
                      {isGraded && submission && (
                        <Badge className="bg-gradient-accent">
                          {submission.grade}/{assignment.maxScore}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="line-clamp-2">{assignment.title}</CardTitle>
                    <CardDescription className="line-clamp-1">{course?.title}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {assignment.description}
                      </p>
                      {assignment.dueDate && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          Due: {format(new Date(assignment.dueDate), 'MMM dd, yyyy')}
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Award className="h-4 w-4" />
                        Max Score: {assignment.maxScore}
                      </div>
                      {isGraded && submission?.feedback && (
                        <div className="p-3 bg-muted rounded-md">
                          <p className="text-sm font-medium mb-1">Feedback:</p>
                          <p className="text-sm text-muted-foreground">{submission.feedback}</p>
                        </div>
                      )}
                      {!isSubmitted && (
                        <Dialog open={selectedAssignment === assignment.id} onOpenChange={(open) => {
                          setSelectedAssignment(open ? assignment.id : null);
                          if (!open) setSubmissionContent('');
                        }}>
                          <DialogTrigger asChild>
                            <Button className="w-full bg-gradient-secondary hover:opacity-90">
                              Submit Assignment
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>{assignment.title}</DialogTitle>
                              <DialogDescription>
                                Submit your work for this assignment
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <Textarea
                                placeholder="Enter your submission here..."
                                value={submissionContent}
                                onChange={(e) => setSubmissionContent(e.target.value)}
                                rows={8}
                              />
                              <Button
                                onClick={handleSubmit}
                                className="w-full bg-gradient-primary hover:opacity-90 gap-2"
                              >
                                <Send className="h-4 w-4" />
                                Submit
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
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

export default ViewAssignments;
