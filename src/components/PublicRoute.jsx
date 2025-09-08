import { Navigate } from "react-router-dom";

export default function PublicRoute({ children }) {
    return localStorage.getItem("token") ? <Navigate to="/" /> : children;
}
