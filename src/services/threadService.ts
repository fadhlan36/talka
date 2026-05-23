import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api/v1/thread`;

export const getThreadsAPI = async (limit: number = 25) => {
    // Ambil token dari localStorage karena Backend kita pakai "Gembok" (Middleware)
    const token = localStorage.getItem('token');

    const response = await axios.get(`${API_URL}?limit=${limit}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data; // Mengembalikan array of threads
};