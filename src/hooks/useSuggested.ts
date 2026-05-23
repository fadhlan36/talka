import { useState, useEffect } from "react";
import axios from "axios";

export interface SuggestedUser {
    id: number;
    username: string;
    name: string | null;
    avatar: string | null;
    followers: number;
}

export function useSuggested() {
    const [suggested, setSuggested] = useState<SuggestedUser[]>([]);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem("token");

    const fetchSuggested = async () => {
        try {
            setLoading(true);
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/v1/user/suggested`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSuggested(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Hapus dari list setelah follow
    const removeFromSuggested = (userId: number) => {
        setSuggested(prev => prev.filter(u => u.id !== userId));
    };

    useEffect(() => {
        fetchSuggested();
    }, []);

    return { suggested, loading, removeFromSuggested };
}