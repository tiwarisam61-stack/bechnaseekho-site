import axios from "axios";

const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000").replace(/\/$/, "");
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({ baseURL: API });

export const createResume = (data) => api.post("/resumes", { data }).then((r) => r.data);
export const getResume = (shareId) => api.get(`/resumes/${shareId}`).then((r) => r.data);
export const updateResume = (shareId, data) => api.put(`/resumes/${shareId}`, { data }).then((r) => r.data);

