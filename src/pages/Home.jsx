import React, { useEffect, useState } from 'react'
import API from '../api'
import CandidateList from '../components/CandidateList'
import SearchFilter from '../components/SearchFilter'


export default function Home() {
    const [candidates, setCandidates] = useState([])
    const [loading, setLoading] = useState(false)
    const [q, setQ] = useState('')
    const [role, setRole] = useState('')


    const fetch = async (params = {}) => {
        setLoading(true)
        try {
            const res = await API.get('/candidates', { params })
            setCandidates(res.data.data || res.data)
        } catch (err) { console.error(err) }
        setLoading(false)
    }


    useEffect(() => { fetch({ q, role, limit: 12 }) }, [q, role])


    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h1 className="text-2xl font-semibold">Candidates</h1>
                <SearchFilter q={q} setQ={setQ} role={role} setRole={setRole} />
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-6">
                    <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <CandidateList candidates={candidates} />
            )}

        </div>
    )
}