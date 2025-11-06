import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Course {
  id: string;
  title: string;
  description: string;
  educatorId: string;
  educatorName: string;
  duration: string;
  level: string;
  category: string;
  thumbnail: string;
  enrolledStudents: string[];
  content: CourseContent[];
  createdAt: string;
}

export interface CourseContent {
  id: string;
  title: string;
  type: 'video' | 'document' | 'quiz';
  content: string;
  order: number;
}

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  dueDate: string;
  maxScore: number;
  createdBy: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  content: string;
  submittedAt: string;
  grade?: number;
  feedback?: string;
}

interface CourseContextType {
  courses: Course[];
  assignments: Assignment[];
  submissions: Submission[];
  createCourse: (course: Omit<Course, 'id' | 'enrolledStudents' | 'createdAt'>) => void;
  updateCourse: (id: string, updates: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  enrollInCourse: (courseId: string, studentId: string) => void;
  createAssignment: (assignment: Omit<Assignment, 'id'>) => void;
  submitAssignment: (submission: Omit<Submission, 'id' | 'submittedAt'>) => void;
  gradeSubmission: (submissionId: string, grade: number, feedback: string) => void;
  getEnrolledCourses: (studentId: string) => Course[];
  getCoursesByEducator: (educatorId: string) => Course[];
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const useCourses = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error('useCourses must be used within a CourseProvider');
  }
  return context;
};

export const CourseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    const storedCourses = localStorage.getItem('courses');
    const storedAssignments = localStorage.getItem('assignments');
    const storedSubmissions = localStorage.getItem('submissions');

    if (storedCourses) setCourses(JSON.parse(storedCourses));
    if (storedAssignments) setAssignments(JSON.parse(storedAssignments));
    if (storedSubmissions) setSubmissions(JSON.parse(storedSubmissions));
  }, []);

  const createCourse = (courseData: Omit<Course, 'id' | 'enrolledStudents' | 'createdAt'>) => {
    const newCourse: Course = {
      ...courseData,
      id: Date.now().toString(),
      enrolledStudents: [],
      createdAt: new Date().toISOString(),
    };
    const updatedCourses = [...courses, newCourse];
    setCourses(updatedCourses);
    localStorage.setItem('courses', JSON.stringify(updatedCourses));
  };

  const updateCourse = (id: string, updates: Partial<Course>) => {
    const updatedCourses = courses.map(course =>
      course.id === id ? { ...course, ...updates } : course
    );
    setCourses(updatedCourses);
    localStorage.setItem('courses', JSON.stringify(updatedCourses));
  };

  const deleteCourse = (id: string) => {
    const updatedCourses = courses.filter(course => course.id !== id);
    setCourses(updatedCourses);
    localStorage.setItem('courses', JSON.stringify(updatedCourses));
  };

  const enrollInCourse = (courseId: string, studentId: string) => {
    const updatedCourses = courses.map(course =>
      course.id === courseId
        ? { ...course, enrolledStudents: [...course.enrolledStudents, studentId] }
        : course
    );
    setCourses(updatedCourses);
    localStorage.setItem('courses', JSON.stringify(updatedCourses));
  };

  const createAssignment = (assignmentData: Omit<Assignment, 'id'>) => {
    const newAssignment: Assignment = {
      ...assignmentData,
      id: Date.now().toString(),
    };
    const updatedAssignments = [...assignments, newAssignment];
    setAssignments(updatedAssignments);
    localStorage.setItem('assignments', JSON.stringify(updatedAssignments));
  };

  const submitAssignment = (submissionData: Omit<Submission, 'id' | 'submittedAt'>) => {
    const newSubmission: Submission = {
      ...submissionData,
      id: Date.now().toString(),
      submittedAt: new Date().toISOString(),
    };
    const updatedSubmissions = [...submissions, newSubmission];
    setSubmissions(updatedSubmissions);
    localStorage.setItem('submissions', JSON.stringify(updatedSubmissions));
  };

  const gradeSubmission = (submissionId: string, grade: number, feedback: string) => {
    const updatedSubmissions = submissions.map(submission =>
      submission.id === submissionId
        ? { ...submission, grade, feedback }
        : submission
    );
    setSubmissions(updatedSubmissions);
    localStorage.setItem('submissions', JSON.stringify(updatedSubmissions));
  };

  const getEnrolledCourses = (studentId: string) => {
    return courses.filter(course => course.enrolledStudents.includes(studentId));
  };

  const getCoursesByEducator = (educatorId: string) => {
    return courses.filter(course => course.educatorId === educatorId);
  };

  return (
    <CourseContext.Provider
      value={{
        courses,
        assignments,
        submissions,
        createCourse,
        updateCourse,
        deleteCourse,
        enrollInCourse,
        createAssignment,
        submitAssignment,
        gradeSubmission,
        getEnrolledCourses,
        getCoursesByEducator,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};
