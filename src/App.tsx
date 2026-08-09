import { useAuth } from "./context/AuthContext";
import { useRole } from "./context/RoleContext";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Analytics from "./pages/Analytics";
import Kanban from "./pages/Kanban";
import Settings from "./pages/Settings";
import Calendar from "./pages/Calendar";
import ExportPage from "./pages/Export";
import LivingWebsite from "./pages/LivingWebsite";
import AdminDashboard from "./pages/AdminDashboard";
import AccessDenied from "./pages/AccessDenied";


function App() {
  const { session } = useAuth();
  const { role, loading } = useRole();

  if (loading) {
    return <h2 style={{ padding: "40px" }}>Loading...</h2>;
  }

  if (session) {
    return (
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route
          path="/admin"
          element={
            role === "admin"
              ? <AdminDashboard />
              : <AccessDenied />
          }
        />
        <Route path="/living" element={<LivingWebsite />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/kanban" element={<Kanban />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/export" element={<ExportPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;