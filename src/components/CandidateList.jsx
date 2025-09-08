import React from 'react'
import CandidateCard from './CandidateCard'


export default function CandidateList({ candidates = [] }) {
    if (!candidates.length) return <div className="p-6 bg-white rounded shadow">No candidates yet.</div>
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {candidates.map(c => <CandidateCard key={c._id || c.id} candidate={c} />)}
        </div>
    )
}