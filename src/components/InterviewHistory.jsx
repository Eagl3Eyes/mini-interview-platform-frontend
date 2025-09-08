import React, { useState } from 'react'
import API from '../api'


function FeedbackRow({ interview, onSaved }) {
    const [rating, setRating] = useState(interview.feedback?.rating || '')
    const [notes, setNotes] = useState(interview.feedback?.notes || '')
    const save = async () => {
        await API.post(`/interviews/${interview._id}/feedback`, { rating: Number(rating), notes })
        if (onSaved) onSaved()
    }
    return (
        <div className="p-3 border rounded mb-2">
            <div className="flex justify-between text-sm text-slate-600">
                <div>{new Date(interview.date).toLocaleString()}</div>
                <div>{interview.interviewer}</div>
            </div>
            <div className="mt-2 flex gap-2">
                <input value={rating} onChange={e => setRating(e.target.value)} placeholder="Rating" className="p-2 border rounded w-24" />
                <input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Short notes" className="p-2 border rounded flex-1" />
                <button onClick={save} className="px-3 py-1 bg-slate-800 text-white rounded">Save</button>
            </div>
        </div>
    )
}


export default function InterviewHistory({ interviews = [], refresh }) {
    if (!interviews.length) return <div className="text-sm text-slate-600">No interviews yet.</div>
    return (
        <div>
            {interviews.map(iv => <FeedbackRow key={iv._id} interview={iv} onSaved={refresh} />)}
        </div>
    )
}