import React, { useState } from 'react'
import API from '../api'


export default function ScheduleForm({ candidateId, onSuccess }) {
    const [date, setDate] = useState('')
    const [time, setTime] = useState('09:00')
    const [interviewer, setInterviewer] = useState('')
    const [mode, setMode] = useState('remote')
    const [error, setError] = useState(null)


    const submit = async e => {
        e.preventDefault()
        try {
            const iso = new Date(date + 'T' + time).toISOString()
            await API.post('/interviews', { candidate: candidateId, date: iso, interviewer, mode })
            setDate(''); setTime('09:00'); setInterviewer(''); setMode('remote')
            if (onSuccess) onSuccess()
        } catch (err) { setError(err?.response?.data?.error || 'Failed') }
    }


    return (
        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="p-2 border rounded md:col-span-1" required />
            <input type="time" value={time} onChange={e => setTime(e.target.value)} className="p-2 border rounded md:col-span-1" required />
            <input value={interviewer} onChange={e => setInterviewer(e.target.value)} placeholder="Interviewer" className="p-2 border rounded md:col-span-1" required />
            <div className="flex items-center gap-2">
                <select value={mode} onChange={e => setMode(e.target.value)} className="p-2 border rounded">
                    <option value="remote">Remote</option>
                    <option value="onsite">Onsite</option>
                </select>
                <button className="px-3 py-2 bg-slate-800 text-white rounded">Schedule</button>
            </div>
            {error && <div className="text-red-600 md:col-span-4">{error}</div>}
        </form>
    )
}