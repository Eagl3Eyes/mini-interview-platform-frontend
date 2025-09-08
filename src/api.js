const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Generic fetch helper
export async function apiFetch(endpoint, options = {}) {
    const token = localStorage.getItem("token");
    const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const res = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: { ...headers, ...(options.headers || {}) },
    });

    const text = await res.text();
    try {
        const data = JSON.parse(text);
        if (!res.ok) throw new Error(data.error || "API error");
        return data;
    } catch (err) {
        if (!res.ok) throw new Error(text || "API error");
        return JSON.parse(text);
    }
}

// --- Auth ---
export async function signup({ name, email, password }) {
    return apiFetch("/auth/signup", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
    });
}

export async function login({ email, password }) {
    return apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
    });
}

// --- Candidates ---
export async function fetchCandidates({ q, role, minExp, page, limit } = {}) {
    const params = new URLSearchParams();
    if (q) params.append("q", q);
    if (role) params.append("role", role);
    if (minExp) params.append("minExp", minExp);

    // Fetch all by default
    params.append("limit", limit || "all");
    if (page) params.append("page", page);

    return apiFetch(`/candidates?${params.toString()}`);
}

export async function createCandidate(payload) {
    return apiFetch("/candidates", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

// --- Interviews ---
export async function scheduleInterview(payload) {
    return apiFetch("/interviews", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export async function fetchInterviews({ candidateId, page, limit } = {}) {
    const params = new URLSearchParams();
    if (candidateId) params.append("candidateId", candidateId);

    // Fetch all by default
    params.append("limit", limit || "all");
    if (page) params.append("page", page);

    return apiFetch(`/interviews?${params.toString()}`);
}

export async function postFeedback(interviewId, { rating, notes }) {
    return apiFetch(`/interviews/${interviewId}/feedback`, {
        method: "POST",
        body: JSON.stringify({ rating, notes }),
    });
}
