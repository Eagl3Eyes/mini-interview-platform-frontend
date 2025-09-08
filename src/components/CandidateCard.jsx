export default function CandidateCard({ candidate }) {
    return (
        <div className="bg-white shadow p-4 rounded-xl">
            <h3 className="font-bold">{candidate.name}</h3>
            <p>{candidate.role}</p>
            <p>{candidate.experience} yrs exp</p>
            <p>⭐ {candidate.rating}</p>
        </div>
    );
}
