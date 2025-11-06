// Sample data generator for development and testing

export const seedSampleData = () => {
  // Only seed if no data exists
  if (localStorage.getItem('hasSeededData')) {
    return;
  }

  // Create sample users
  const sampleUsers = [
    {
      id: 'educator1',
      name: 'Dr. Sarah Johnson',
      email: 'sarah@educonnect.com',
      password: 'educator123',
      role: 'educator',
    },
    {
      id: 'student1',
      name: 'Alex Chen',
      email: 'alex@student.com',
      password: 'student123',
      role: 'student',
    },
  ];

  // Create sample courses
  const sampleCourses = [
    {
      id: 'course1',
      title: 'Introduction to Web Development',
      description: 'Learn the fundamentals of HTML, CSS, and JavaScript. Perfect for beginners looking to start their web development journey.',
      educatorId: 'educator1',
      educatorName: 'Dr. Sarah Johnson',
      duration: '8 weeks',
      level: 'Beginner',
      category: 'Programming',
      thumbnail: '',
      enrolledStudents: [],
      content: [],
      createdAt: new Date().toISOString(),
    },
    {
      id: 'course2',
      title: 'Advanced React Development',
      description: 'Master React with hooks, context API, and advanced patterns. Build production-ready applications.',
      educatorId: 'educator1',
      educatorName: 'Dr. Sarah Johnson',
      duration: '10 weeks',
      level: 'Advanced',
      category: 'Programming',
      thumbnail: '',
      enrolledStudents: [],
      content: [],
      createdAt: new Date().toISOString(),
    },
    {
      id: 'course3',
      title: 'UI/UX Design Fundamentals',
      description: 'Discover the principles of user interface and user experience design. Create beautiful and functional designs.',
      educatorId: 'educator1',
      educatorName: 'Dr. Sarah Johnson',
      duration: '6 weeks',
      level: 'Intermediate',
      category: 'Design',
      thumbnail: '',
      enrolledStudents: [],
      content: [],
      createdAt: new Date().toISOString(),
    },
  ];

  localStorage.setItem('users', JSON.stringify(sampleUsers));
  localStorage.setItem('courses', JSON.stringify(sampleCourses));
  localStorage.setItem('assignments', JSON.stringify([]));
  localStorage.setItem('submissions', JSON.stringify([]));
  localStorage.setItem('hasSeededData', 'true');
};

export const clearAllData = () => {
  localStorage.removeItem('users');
  localStorage.removeItem('courses');
  localStorage.removeItem('assignments');
  localStorage.removeItem('submissions');
  localStorage.removeItem('user');
  localStorage.removeItem('hasSeededData');
};
