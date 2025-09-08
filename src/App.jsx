// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import CandidateDetails from "./pages/CandidateDetails";
import ScheduleInterview from "./pages/ScheduleInterview";
import { PrivateRoute, PublicRoute } from "./components/PrivateRoute";

export default function App() {
  return (
    <>
      <Navbar />
      <div className="pt-6">
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/candidates/:id"
            element={
              <PrivateRoute>
                <CandidateDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/schedule"
            element={
              <PrivateRoute>
                <ScheduleInterview />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </>
  );
}
