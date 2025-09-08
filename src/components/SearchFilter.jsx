import React from 'react'


export default function SearchFilter({ q, setQ, role, setRole }) {
    return (
        <div className="flex items-center gap-2">
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search name..." className="p-2 border rounded" />
            <select value={role} onChange={e => setRole(e.target.value)} className="p-2 border rounded">
                <option value="">All roles</option>
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Fullstack">Fullstack</option>
            </select>
        </div>
    )
}