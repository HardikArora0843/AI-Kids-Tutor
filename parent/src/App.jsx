import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ParentLogin from "./pages/ParentLogin";
import ParentRegister from "./pages/ParentRegister";
import ParentDashboard from "./pages/ParentDashboard";
import ProtectedRoute from "./ProtectedRoute";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<ParentLogin />} />
        <Route path="/register" element={<ParentRegister />} />
        <Route
          path="/parent"
          element={
            <ProtectedRoute>
              <ParentDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
