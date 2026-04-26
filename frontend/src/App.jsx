import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ChildDashboard from "./pages/ChildDashboard";
import AlphabetWorld from "./pages/worlds/AlphabetWorld";
import NumberWorld from "./pages/worlds/NumberWorld";
import ColorShapeWorld from "./pages/worlds/ColorShapeWorld";
import StoryWorld from "./pages/worlds/StoryWorld";
import QuizWorld from "./pages/worlds/QuizWorld";
import DrawingWorld from "./pages/worlds/DrawingWorld";
import TestAttempt from "./pages/TestAttempt";
import ProtectedRoute from "./components/ProtectedRoute";

const AppRoutes = () => {
  const location = useLocation();

  return (
    <div className="page-shell" key={location.pathname}>
      <Routes location={location}>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected child routes */}
        <Route
          path="/child"
          element={
            <ProtectedRoute allowedRoles={["child"]}>
              <ChildDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/child/alphabet"
          element={
            <ProtectedRoute allowedRoles={["child"]}>
              <AlphabetWorld />
            </ProtectedRoute>
          }
        />
        <Route
          path="/child/numbers"
          element={
            <ProtectedRoute allowedRoles={["child"]}>
              <NumberWorld />
            </ProtectedRoute>
          }
        />
        <Route
          path="/child/colors"
          element={
            <ProtectedRoute allowedRoles={["child"]}>
              <ColorShapeWorld />
            </ProtectedRoute>
          }
        />
        <Route
          path="/child/stories"
          element={
            <ProtectedRoute allowedRoles={["child"]}>
              <StoryWorld />
            </ProtectedRoute>
          }
        />
        <Route
          path="/child/quiz"
          element={
            <ProtectedRoute allowedRoles={["child"]}>
              <QuizWorld />
            </ProtectedRoute>
          }
        />
        <Route
          path="/child/drawing"
          element={
            <ProtectedRoute allowedRoles={["child"]}>
              <DrawingWorld />
            </ProtectedRoute>
          }
        />
        <Route
          path="/child/test/:testId"
          element={
            <ProtectedRoute allowedRoles={["child"]}>
              <TestAttempt />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};

const App = () => (
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>
);

export default App;
