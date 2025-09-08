import { Navigate } from "react-router-dom";

export function PrivateRoute({ children }) {
    return localStorage.getItem("token") ? children : <Navigate to="/login" />;
}

// For redirecting logged-in users away from login/signup
export function PublicRoute({ children }) {
    return localStorage.getItem("token") ? <Navigate to="/" /> : children;
}
