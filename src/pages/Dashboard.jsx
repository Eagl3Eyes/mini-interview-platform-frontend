import { useEffect, useState, useRef } from "react";
import { fetchCandidates, fetchInterviews, createCandidate, scheduleInterview } from "../api";
import { Link } from "react-router-dom";

// Candidate card
function CandidateCard({ candidate }) {
    const rating = Number(candidate.rating);
    let bgColor = "bg-white";
    if (!isNaN(rating)) {
        if (rating >= 4.5) bgColor = "bg-green-100";
        else if (rating >= 3) bgColor = "bg-blue-100";
        else bgColor = "bg-gray-100";
    }

    return (
        <div className={`${bgColor} rounded-xl shadow-sm p-5 hover:shadow-md transition-all border border-gray-200`}>
            <h3 className="font-bold text-lg text-gray-800">{candidate.name}</h3>
            <p className="text-gray-500">{candidate.role}</p>
            <p className="text-gray-400">Experience: {candidate.experience} yrs</p>
            <p className="text-gray-700 font-semibold">Rating: {candidate.rating || "N/A"}</p>
        </div>
    );
}

// Interview card
function ScheduleCard({ interview }) {
    const interviewDate = new Date(interview.date);
    const now = new Date();
    let bgColor = "bg-white";
    if (interview.mode === "remote") bgColor = "bg-green-100";
    else if (interview.mode === "onsite") bgColor = "bg-blue-100";

    const isToday = interviewDate.toDateString() === now.toDateString();
    if (isToday) bgColor = "bg-yellow-100";

    return (
        <div className={`${bgColor} rounded-xl shadow-sm p-5 hover:shadow-md transition-all border border-gray-200`}>
            <h3 className="font-bold text-gray-800">{interview.candidate?.name || "Unknown"}</h3>
            <p className="text-gray-500">{interview.interviewer}</p>
            <p className="text-gray-400">{interviewDate.toLocaleString()}</p>
            <span className={`inline-block px-2 py-1 text-sm rounded-full ${interview.mode === "remote" ? "bg-green-200 text-green-800" : "bg-blue-200 text-blue-800"}`}>
                {interview.mode}
            </span>
        </div>
    );
}

// Feedback card
function FeedbackCard({ feedback }) {
    return (
        <div className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-all border border-gray-200">
            <p className="text-gray-700 font-semibold">Rating: {feedback.rating}</p>
            <p className="text-gray-500">{feedback.notes}</p>
        </div>
    );
}

export default function Dashboard() {
    const [candidates, setCandidates] = useState([]);
    const [interviews, setInterviews] = useState([]);
    const [query, setQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [minExpFilter, setMinExpFilter] = useState("");
    const [loading, setLoading] = useState(true);

    const [newCandidate, setNewCandidate] = useState({ name: "", role: "", experience: "", rating: "" });
    const [showCandidateForm, setShowCandidateForm] = useState(false);

    const [newInterview, setNewInterview] = useState({ candidate: "", candidateName: "", date: "", interviewer: "", mode: "remote" });
    const [showInterviewForm, setShowInterviewForm] = useState(false);

    const [activeTab, setActiveTab] = useState("candidates");
    const itemsPerPage = 12;
    const [currentPage, setCurrentPage] = useState(1);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const roles = [
        "Frontend Developer",
        "Backend Developer",
        "Fullstack Developer",
        "UI/UX Designer",
        "Web Designer",
        "Web Developer",
        "DevOps Engineer",
        "QA Engineer"
    ];

    useEffect(() => {
        loadData();
    }, [query, roleFilter, minExpFilter]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const cRes = await fetchCandidates({ q: query, role: roleFilter, minExp: minExpFilter });
            const iRes = await fetchInterviews();
            setCandidates(cRes.data || []);
            setInterviews(iRes.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddCandidate = async (e) => {
        e.preventDefault();
        try {
            await createCandidate({
                ...newCandidate,
                experience: Number(newCandidate.experience),
                rating: Number(newCandidate.rating),
            });
            setNewCandidate({ name: "", role: "", experience: "", rating: "" });
            setShowCandidateForm(false);
            await loadData();
        } catch (err) {
            console.error(err);
            alert("Failed to add candidate");
        }
    };

    const handleScheduleInterview = async (e) => {
        e.preventDefault();
        try {
            await scheduleInterview({
                ...newInterview,
                candidate: newInterview.candidate,
            });
            setNewInterview({ candidate: "", candidateName: "", date: "", interviewer: "", mode: "remote" });
            setShowInterviewForm(false);
            setIsDropdownOpen(false);
            await loadData();
        } catch (err) {
            console.error(err);
            alert("Failed to schedule interview");
        }
    };

    const paginate = (data) => {
        const start = (currentPage - 1) * itemsPerPage;
        return data.slice(start, start + itemsPerPage);
    };

    const totalPages = (data) => Math.ceil(data.length / itemsPerPage);

    return (
        <div className="p-6 space-y-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
            {/* Header & Filters */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Search candidates..."
                        className="border px-3 py-2 rounded w-full md:w-60"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <select
                        className="border px-3 py-2 rounded w-full md:w-40"
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                    >
                        <option value="">All Roles</option>
                        {roles.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                    <input
                        type="number"
                        placeholder="Min Experience"
                        className="border px-3 py-2 rounded w-full md:w-40"
                        value={minExpFilter}
                        onChange={(e) => setMinExpFilter(e.target.value)}
                    />
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    onClick={() => setShowCandidateForm(!showCandidateForm)}
                >
                    Add New Candidate
                </button>
                <button
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
                    onClick={() => setShowInterviewForm(!showInterviewForm)}
                >
                    Schedule Interview
                </button>
            </div>

            {/* Candidate Form */}
            {showCandidateForm && (
                <form onSubmit={handleAddCandidate} className="bg-white p-5 rounded shadow space-y-3 border border-gray-200">
                    <div className="grid gap-3 md:grid-cols-2">
                        <input
                            required
                            type="text"
                            placeholder="Name"
                            className="border px-3 py-2 rounded w-full"
                            value={newCandidate.name}
                            onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })}
                        />
                        <select
                            required
                            className="border px-3 py-2 rounded w-full"
                            value={newCandidate.role}
                            onChange={(e) => setNewCandidate({ ...newCandidate, role: e.target.value })}
                        >
                            <option value="">Select Role</option>
                            {roles.map((r) => <option key={r} value={r}>{r}</option>)}
                        </select>
                        <input
                            required
                            type="number"
                            placeholder="Experience (yrs)"
                            className="border px-3 py-2 rounded w-full"
                            value={newCandidate.experience}
                            onChange={(e) => setNewCandidate({ ...newCandidate, experience: e.target.value })}
                        />
                        <input
                            type="number"
                            placeholder="Rating (optional)"
                            className="border px-3 py-2 rounded w-full"
                            value={newCandidate.rating}
                            onChange={(e) => setNewCandidate({ ...newCandidate, rating: e.target.value })}
                        />
                    </div>
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                        Save Candidate
                    </button>
                </form>
            )}

            {/* Interview Form */}
            {showInterviewForm && (
                <form onSubmit={handleScheduleInterview} className="bg-white p-5 rounded shadow space-y-3 border border-gray-200">
                    <div className="grid gap-3 md:grid-cols-2">
                        {/* Candidate Search + Dropdown */}
                        <div className="relative w-full" ref={dropdownRef}>
                            <input
                                type="text"
                                placeholder="Select Candidate..."
                                className="border px-3 py-2 rounded w-full"
                                value={newInterview.candidateName}
                                onFocus={() => setIsDropdownOpen(true)}
                                onChange={(e) => {
                                    setNewInterview({ ...newInterview, candidateName: e.target.value, candidate: "" });
                                    setIsDropdownOpen(true);
                                }}
                            />
                            {isDropdownOpen && newInterview.candidateName && (
                                <ul className="absolute z-10 w-full max-h-40 overflow-y-auto bg-white border border-gray-300 rounded mt-1 shadow-lg">
                                    {candidates.filter((c) =>
                                        c.name.toLowerCase().includes(newInterview.candidateName.toLowerCase())
                                    ).map((c) => (
                                        <li
                                            key={c._id}
                                            className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
                                            onClick={() => {
                                                setNewInterview({ ...newInterview, candidate: c._id, candidateName: c.name });
                                                setIsDropdownOpen(false);
                                            }}
                                        >
                                            {c.name} - {c.role}
                                        </li>
                                    ))}
                                    {candidates.filter((c) =>
                                        c.name.toLowerCase().includes(newInterview.candidateName.toLowerCase())
                                    ).length === 0 && (
                                            <li className="px-3 py-2 text-gray-500">No candidates found</li>
                                        )}
                                </ul>
                            )}
                        </div>

                        <input
                            required
                            type="datetime-local"
                            className="border px-3 py-2 rounded w-full"
                            value={newInterview.date}
                            onChange={(e) => setNewInterview({ ...newInterview, date: e.target.value })}
                        />
                        <input
                            required
                            type="text"
                            placeholder="Interviewer Name"
                            className="border px-3 py-2 rounded w-full"
                            value={newInterview.interviewer}
                            onChange={(e) => setNewInterview({ ...newInterview, interviewer: e.target.value })}
                        />
                        <select
                            className="border px-3 py-2 rounded w-full"
                            value={newInterview.mode}
                            onChange={(e) => setNewInterview({ ...newInterview, mode: e.target.value })}
                        >
                            <option value="remote">Remote</option>
                            <option value="onsite">Onsite</option>
                        </select>
                    </div>
                    <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition">
                        Schedule Interview
                    </button>
                </form>
            )}

            {loading && (
                <div className="flex justify-center items-center py-6">
                    <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            {/* Tabs */}
            <div className="flex gap-4 border-b border-gray-300 mb-4">
                <button
                    className={`px-4 py-2 ${activeTab === "candidates" ? "border-b-2 border-blue-600 font-semibold" : ""}`}
                    onClick={() => { setActiveTab("candidates"); setCurrentPage(1); }}
                >
                    Candidates
                </button>
                <button
                    className={`px-4 py-2 ${activeTab === "interviews" ? "border-b-2 border-blue-600 font-semibold" : ""}`}
                    onClick={() => { setActiveTab("interviews"); setCurrentPage(1); }}
                >
                    Upcoming Interviews
                </button>
            </div>

            {/* Tab Content */}
            {activeTab === "candidates" && (
                <section>
                    {candidates.length === 0 ? (
                        <p className="text-gray-500">No candidates found.</p>
                    ) : (
                        <>
                            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                {paginate(candidates).map((c) => (
                                    <Link key={c._id} to={`/candidates/${c._id}`}>
                                        <CandidateCard candidate={c} />
                                    </Link>
                                ))}
                            </div>
                            <Pagination total={totalPages(candidates)} current={currentPage} onChange={setCurrentPage} />
                        </>
                    )}
                </section>
            )}

            {activeTab === "interviews" && (
                <section>
                    {interviews.length === 0 ? (
                        <p className="text-gray-500">No interviews scheduled.</p>
                    ) : (
                        <>
                            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                                {paginate(interviews)
                                    .sort((a, b) => new Date(a.date) - new Date(b.date))
                                    .map((i) => (
                                        <ScheduleCard key={i._id} interview={i} />
                                    ))}
                            </div>
                            <Pagination total={totalPages(interviews)} current={currentPage} onChange={setCurrentPage} />
                        </>
                    )}
                </section>
            )}

            {/* Feedback */}
            <section>
                <h2 className="text-2xl font-semibold mb-3 text-gray-800">Recent Feedback</h2>
                {interviews.filter((i) => i.feedback).length === 0 ? (
                    <p className="text-gray-500">No feedback yet.</p>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                        {interviews.filter((i) => i.feedback).map((i) => (
                            <FeedbackCard key={i._id} feedback={i.feedback} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

// Pagination Component
function Pagination({ total, current, onChange }) {
    if (total <= 1) return null;
    const pages = Array.from({ length: total }, (_, i) => i + 1);
    return (
        <div className="flex gap-2 justify-center mt-4">
            {pages.map((p) => (
                <button
                    key={p}
                    className={`px-3 py-1 border rounded ${p === current ? "bg-blue-600 text-white" : "bg-white"}`}
                    onClick={() => onChange(p)}
                >
                    {p}
                </button>
            ))}
        </div>
    );
}