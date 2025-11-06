import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CourseProvider } from "./contexts/CourseContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Landing from "./pages/Landing";
import EducatorDashboard from "./pages/educator/EducatorDashboard";
import StudentDashboard from "./pages/student/StudentDashboard";
import CreateCourse from "./pages/educator/CreateCourse";
import CourseList from "./pages/educator/CourseList";
import ManageAssignments from "./pages/educator/ManageAssignments";
import ReviewSubmissions from "./pages/educator/ReviewSubmissions";
import BrowseCourses from "./pages/student/BrowseCourses";
import MyCourses from "./pages/student/MyCourses";
import ViewAssignments from "./pages/student/ViewAssignments";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CourseProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              
              {/* Educator Routes */}
              <Route
                path="/educator/dashboard"
                element={
                  <ProtectedRoute requiredRole="educator">
                    <EducatorDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/educator/create-course"
                element={
                  <ProtectedRoute requiredRole="educator">
                    <CreateCourse />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/educator/courses"
                element={
                  <ProtectedRoute requiredRole="educator">
                    <CourseList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/educator/assignments"
                element={
                  <ProtectedRoute requiredRole="educator">
                    <ManageAssignments />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/educator/submissions"
                element={
                  <ProtectedRoute requiredRole="educator">
                    <ReviewSubmissions />
                  </ProtectedRoute>
                }
              />

              {/* Student Routes */}
              <Route
                path="/student/dashboard"
                element={
                  <ProtectedRoute requiredRole="student">
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/browse"
                element={
                  <ProtectedRoute requiredRole="student">
                    <BrowseCourses />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/courses"
                element={
                  <ProtectedRoute requiredRole="student">
                    <MyCourses />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/assignments"
                element={
                  <ProtectedRoute requiredRole="student">
                    <ViewAssignments />
                  </ProtectedRoute>
                }
              />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CourseProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
