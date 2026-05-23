import { useState, useEffect } from "react";
import axios from "axios";

export function useUserThreads(userId?: number) {
    const [threads, setThreads] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!userId) return;

        const fetchUserThreads = async () => {
            try {
                setLoading(true);
                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/v1/thread/user/${userId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setThreads(res.data);
            } catch (err) {
                console.error("Gagal fetch user threads:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserThreads();
    }, [userId]);

    return { threads, loading };
}