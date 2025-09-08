export default function ScheduleCard({ interview }) {
    const date = new Date(interview.date);
    const formattedDate = date.toLocaleString();

    // Badge color based on mode
    const modeColor = interview.mode === "onsite" ? "bg-indigo-100 text-indigo-800" : "bg-blue-100 text-blue-800";

    return (
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200 hover:shadow-md transition-all">
            {/* <h3 className="text-gray-800 font-semibold text-lg">{interview.candidate?.name || "Unknown"}</h3> */}
            <p className="text-gray-500 mt-1">Interviewer: {interview.interviewer}</p>
            <p className="text-gray-400 mt-1">{formattedDate}</p>
            <span className={`inline-block mt-2 px-3 py-1 text-sm font-medium rounded-full ${modeColor}`}>
                {interview.mode}
            </span>
        </div>
    );
}
