import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiFetch, fetchInterviews, postFeedback } from "../api";
import FeedbackCard from "../components/FeedbackCard";
import ScheduleCard from "../components/ScheduleCard";

export default function CandidateDetails() {
    const { id } = useParams();
    const [candidate, setCandidate] = useState(null);
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [feedbackForm, setFeedbackForm] = useState({
        interviewId: "",
        rating: "",
        notes: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        setLoading(true);
        apiFetch(`/candidates/${id}`)
            .then((res) => setCandidate(res))
            .catch((err) => console.error(err));

        fetchInterviews({ candidateId: id })
            .then((res) => setInterviews(res.data))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, [id]);

    const handleFeedbackSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        if (!feedbackForm.interviewId) {
            setError("Please select an interview.");
            return;
        }
        try {
            await postFeedback(feedbackForm.interviewId, {
                rating: feedbackForm.rating,
                notes: feedbackForm.notes,
            });
            setSuccess("Feedback submitted successfully.");
            const res = await fetchInterviews({ candidateId: id });
            setInterviews(res.data);
            setFeedbackForm({ interviewId: "", rating: 5, notes: "" });
        } catch (err) {
            setError(err.message || "Failed to submit feedback.");
        }
    };

    if (loading)
        return (
            <div className="flex justify-center items-center py-6">
                <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );

    if (!candidate) return <p className="p-6 text-red-500">Candidate not found.</p>;

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-10">
            {/* Candidate Info Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">{candidate.name}</h1>
                    <p className="text-gray-500 mt-1">{candidate.role}</p>
                    <p className="text-gray-400 mt-1">Experience: {candidate.experience} yrs</p>
                    <p className="text-gray-700 font-semibold mt-1">Rating: {candidate.rating || "N/A"}</p>
                    {candidate.notes && <p className="text-gray-600 mt-2">{candidate.notes}</p>}
                </div>
            </div>

            {/* Upcoming Interviews */}
            <section>
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Upcoming Interviews</h2>
                {interviews.length === 0 ? (
                    <p className="text-gray-500">No interviews scheduled for this candidate.</p>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                        {interviews
                            .slice()
                            .sort((a, b) => new Date(a.date) - new Date(b.date))
                            .map((i) => (
                                <ScheduleCard key={i._id} interview={i} />
                            ))}
                    </div>
                )}
            </section>

            {/* Feedback Section */}
            <section>
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Feedback</h2>
                {interviews.filter((i) => i.feedback).length === 0 ? (
                    <p className="text-gray-500">No feedback yet.</p>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                        {interviews
                            .filter((i) => i.feedback)
                            .map((i) => (
                                <FeedbackCard key={i._id} feedback={i.feedback} />
                            ))}
                    </div>
                )}
            </section>

            {/* Feedback Form */}
            <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 max-w-2xl mx-auto">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Submit Feedback</h2>

                {error && <p className="text-red-600 mb-2">{error}</p>}
                {success && <p className="text-green-600 mb-2">{success}</p>}

                <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                    <select
                        required
                        value={feedbackForm.interviewId}
                        onChange={(e) => setFeedbackForm({ ...feedbackForm, interviewId: e.target.value })}
                        className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    >
                        <option value="">Select Interview</option>
                        {interviews.map((i) => (
                            <option key={i._id} value={i._id}>
                                {i.interviewer} — {new Date(i.date).toLocaleString()}
                            </option>
                        ))}
                    </select>

                    <input
                        type="number"
                        min="1"
                        max="5"
                        value={feedbackForm.rating}
                        onChange={(e) => setFeedbackForm({ ...feedbackForm, rating: e.target.value })}
                        className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        placeholder="Rating (1-5)"
                    />

                    <textarea
                        value={feedbackForm.notes}
                        onChange={(e) => setFeedbackForm({ ...feedbackForm, notes: e.target.value })}
                        className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        placeholder="Feedback notes"
                        rows={4}
                    ></textarea>

                    <button className="w-full bg-indigo-500 text-white py-2 rounded hover:bg-indigo-600 transition">
                        Submit Feedback
                    </button>
                </form>
            </section>
        </div>
    );
}
