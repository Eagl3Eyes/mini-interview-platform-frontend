export default function FeedbackCard({ feedback }) {
    const rating = Number(feedback.rating);
    let bgColor = "bg-gray-50"; // default

    if (!isNaN(rating)) {
        if (rating >= 4.5) bgColor = "bg-green-100"; // excellent
        else if (rating >= 3) bgColor = "bg-blue-100"; // good
        else bgColor = "bg-red-50"; // needs improvement
    }

    return (
        <div className={`${bgColor} rounded-xl shadow-sm p-5 border border-gray-200 hover:shadow-md transition-all`}>
            <p className="text-gray-700 font-semibold">Rating: {feedback.rating}</p>
            <p className="text-gray-500 mt-1">{feedback.notes}</p>
        </div>
    );
}
