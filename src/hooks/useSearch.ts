import { useState } from "react";
import axios from "axios";

export interface SearchUser {
    id: number;
    username: string;
    name: string | null;
    avatar: string | null;
    followers: number;
}

export function useSearch() {
    const [results, setResults] = useState<SearchUser[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false); // ← sudah pernah search belum

    const token = localStorage.getItem("token");

    const searchUsers = async (keyword: string) => {
        if (!keyword.trim()) return;

        try {
            setLoading(true);
            setSearched(true);
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/v1/search?keyword=${encodeURIComponent(keyword)}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setResults(res.data.data.users);
        } catch (err) {
            console.error(err);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const clearResults = () => {
        setResults([]);
        setSearched(false);
    };

    return {
        results,
        loading,
        searched,
        searchUsers,
        clearResults,
    };
}