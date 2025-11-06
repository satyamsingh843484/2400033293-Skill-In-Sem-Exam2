import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCourses } from '@/contexts/CourseContext';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FileText, Award, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

const ReviewSubmissions = () => {
  const { user } = useAuth();
  const { getCoursesByEducator, assignments, submissions, gradeSubmission } = useCourses();
  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null);
  const [grade, setGrade] = useState('');
  const [feedback, setFeedback] = useState('');

  const myCourses = getCoursesByEducator(user?.id || '');
  const myAssignments = assignments.filter(a =>
    myCourses.some(c => c.id === a.courseId)
  );
  const mySubmissions = submissions.filter(s =>
    myAssignments.some(a => a.id === s.assignmentId)
  );

  const handleGrade = () => {
    if (!selectedSubmission || !grade) {
      toast.error('Please provide a grade');
      return;
    }

    const submission = mySubmissions.find(s => s.id === selectedSubmission);
    const assignment = myAssignments.find(a => a.id === submission?.assignmentId);

    const gradeNum = parseInt(grade);
    if (isNaN(gradeNum) || gradeNum < 0 || gradeNum > (assignment?.maxScore || 100)) {
      toast.error(`Grade must be between 0 and ${assignment?.maxScore || 100}`);
      return;
    }

    gradeSubmission(selectedSubmission, gradeNum, feedback);
    toast.success('Submission graded successfully!');
    setSelectedSubmission(null);
    setGrade('');
    setFeedback('');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-foreground mb-2">Review Submissions</h1>
          <p className="text-muted-foreground">Grade and provide feedback on student work</p>
        </div>

        {mySubmissions.length === 0 ? (
          <Card className="animate-scale-in">
            <CardContent className="text-center py-12">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">No submissions to review yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {mySubmissions.map((submission, index) => {
              const assignment = myAssignments.find(a => a.id === submission.assignmentId);
              const course = myCourses.find(c => c.id === assignment?.courseId);
              const isGraded = submission.grade !== undefined;

              return (
                <Card 
                  key={submission.id} 
                  className="animate-scale-in hover:shadow-lg transition-all"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant={isGraded ? 'default' : 'secondary'}>
                        {isGraded ? 'Graded' : 'Pending Review'}
                      </Badge>
                      {isGraded && (
                        <Badge className="bg-gradient-accent">
                          {submission.grade}/{assignment?.maxScore}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="line-clamp-2">{assignment?.title}</CardTitle>
                    <CardDescription>
                      {course?.title} • {submission.studentName}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 bg-muted rounded-md">
                        <p className="text-sm font-medium mb-2">Student Submission:</p>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                          {submission.content}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        Submitted: {format(new Date(submission.submittedAt), 'MMM dd, yyyy')}
                      </div>
                      {isGraded && submission.feedback && (
                        <div className="p-3 bg-primary/10 rounded-md">
                          <p className="text-sm font-medium mb-1">Your Feedback:</p>
                          <p className="text-sm">{submission.feedback}</p>
                        </div>
                      )}
                      {!isGraded && (
                        <Dialog open={selectedSubmission === submission.id} onOpenChange={(open) => {
                          setSelectedSubmission(open ? submission.id : null);
                          if (!open) {
                            setGrade('');
                            setFeedback('');
                          }
                        }}>
                          <DialogTrigger asChild>
                            <Button className="w-full bg-gradient-primary hover:opacity-90 gap-2">
                              <Award className="h-4 w-4" />
                              Grade Submission
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Grade Submission</DialogTitle>
                              <DialogDescription>
                                Provide a grade and feedback for {submission.studentName}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="grade">Grade (Max: {assignment?.maxScore})</Label>
                                <Input
                                  id="grade"
                                  type="number"
                                  placeholder="Enter grade"
                                  value={grade}
                                  onChange={(e) => setGrade(e.target.value)}
                                  min="0"
                                  max={assignment?.maxScore}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="feedback">Feedback</Label>
                                <Textarea
                                  id="feedback"
                                  placeholder="Provide constructive feedback..."
                                  value={feedback}
                                  onChange={(e) => setFeedback(e.target.value)}
                                  rows={4}
                                />
                              </div>
                              <Button
                                onClick={handleGrade}
                                className="w-full bg-gradient-accent hover:opacity-90"
                              >
                                Submit Grade
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

export default ReviewSubmissions;
