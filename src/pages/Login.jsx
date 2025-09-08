import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const res = await login({ email, password });
            localStorage.setItem("token", res.token);

            // trigger Navbar update by dispatching event
            window.dispatchEvent(new Event("storage"));

            navigate("/"); // redirect to Dashboard
        } catch (err) {
            setError(err.message || "Login failed");
        }
    };

    return (
        <div className="flex items-center justify-center bg-gray-50 p-10">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-4"
            >
                <h2 className="text-2xl font-bold text-center">Login</h2>

                {error && (
                    <div className="bg-red-100 text-red-700 px-3 py-2 rounded">{error}</div>
                )}

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                    required
                />

                <button className="w-full bg-indigo-500 text-white py-2 rounded hover:bg-indigo-600 transition">
                    Login
                </button>

                <p className="text-center text-sm text-gray-600">
                    Don't have an account?{" "}
                    <a href="/signup" className="text-green-500 hover:underline">
                        Signup
                    </a>
                </p>
            </form>
        </div>
    );
}
