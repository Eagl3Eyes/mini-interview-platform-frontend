// src/pages/ScheduleInterview.jsx
import { useState, useEffect } from "react";
import { fetchCandidates, scheduleInterview } from "../api";
import { useNavigate } from "react-router-dom";

export default function ScheduleInterview() {
    const [candidates, setCandidates] = useState([]);
    const [form, setForm] = useState({
        candidate: "",
        date: "",
        interviewer: "",
        mode: "remote",
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchCandidates().then((res) => setCandidates(res.data)).catch(console.error);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await scheduleInterview(form);
            navigate("/"); // redirect to dashboard
        } catch (err) {
            setError(err.message || "Failed to schedule interview");
        }
    };

    return (
        <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md space-y-4">
            <h2 className="text-2xl font-bold text-center">Schedule Interview</h2>

            {error && <p className="bg-red-100 text-red-700 px-3 py-2 rounded">{error}</p>}

            <form className="space-y-4" onSubmit={handleSubmit}>
                <select
                    required
                    value={form.candidate}
                    onChange={(e) => setForm({ ...form, candidate: e.target.value })}
                    className="w-full border px-3 py-2 rounded"
                >
                    <option value="">Select Candidate</option>
                    {candidates.map((c) => (
                        <option key={c._id} value={c._id}>
                            {c.name} ({c.role})
                        </option>
                    ))}
                </select>

                <input
                    type="datetime-local"
                    required
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full border px-3 py-2 rounded"
                />

                <input
                    type="text"
                    placeholder="Interviewer Name"
                    required
                    value={form.interviewer}
                    onChange={(e) => setForm({ ...form, interviewer: e.target.value })}
                    className="w-full border px-3 py-2 rounded"
                />

                <select
                    value={form.mode}
                    onChange={(e) => setForm({ ...form, mode: e.target.value })}
                    className="w-full border px-3 py-2 rounded"
                >
                    <option value="remote">Remote</option>
                    <option value="onsite">Onsite</option>
                </select>

                <button className="w-full bg-indigo-500 text-white py-2 rounded hover:bg-indigo-600 transition">
                    Schedule
                </button>
            </form>
        </div>
    );
}
