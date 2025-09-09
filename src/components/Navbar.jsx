import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navbar() {
    const [user, setUser] = useState(localStorage.getItem("token"));
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        setUser(null);
        navigate("/login");
    };

    // Listen to storage events (for multiple tabs)
    useEffect(() => {
        const handleStorage = () => setUser(localStorage.getItem("token"));
        window.addEventListener("storage", handleStorage);
        return () => window.removeEventListener("storage", handleStorage);
    }, []);

    return (
        <nav className="bg-white shadow sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-indigo-600 uppercase">
                    Mini Interview Platform
                </Link>

                <div className="space-x-4">
                    {user ? (
                        <>
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition uppercase cursor-pointer"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition uppercase cursor-pointer"
                            >
                                Login
                            </Link>
                            <Link
                                to="/signup"
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition uppercase cursor-pointer"
                            >
                                Signup
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
