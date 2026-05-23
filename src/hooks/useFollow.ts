import { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "@/features/auth/authSlice";
import type { RootState } from "@/store";

export function useFollow() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followLoading, setFollowLoading] = useState(false);

    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth.user);
    const token = localStorage.getItem("token");

    // 🔥 FIX UTAMA DI SINI
    const fetchFollows = async (type: "followers" | "following", userId?: number) => {
        try {
            setLoading(true);

            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/follows`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    type,
                    userId
                }
            });

            console.log("API RESPONSE:", res.data); // 🔥 LIHAT INI

            const followers = res.data?.data?.followers ?? [];
            const following = res.data?.data?.following ?? [];

            if (type === "followers") {
                setData(followers);
            } else {
                setData(following);
            }

        } catch (err) {
            console.error("Fetch follows error:", err);
        } finally {
            setLoading(false);
        }
    };

    const checkIsFollowing = async (targetUserId: number) => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/v1/follows`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { type: "following" }
                }
            );

            const followingList = res.data.data.following;
            const found = followingList.some((u: any) => u.id === targetUserId);
            setIsFollowing(found);

        } catch (err) {
            console.error(err);
        }
    };

    const followUser = async (userId: number) => {
        try {
            setFollowLoading(true);

            await axios.post(
                `${import.meta.env.VITE_API_URL}/api/v1/follows`,
                { followed_user_id: userId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setData(prev =>
                prev.map(u =>
                    u.id === userId ? { ...u, is_following: true } : u
                )
            );

            setIsFollowing(true);

            dispatch(updateUser({
                following: (user?.following || 0) + 1
            }));

        } catch (err) {
            console.error(err);
        } finally {
            setFollowLoading(false);
        }
    };

    const unfollowUser = async (userId: number) => {
        try {
            setFollowLoading(true);

            await axios.delete(
                `${import.meta.env.VITE_API_URL}/api/v1/follows`,
                {
                    data: { followed_id: userId },
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setData(prev =>
                prev.map(u =>
                    u.id === userId ? { ...u, is_following: false } : u
                )
            );

            setIsFollowing(false);

            dispatch(updateUser({
                following: Math.max((user?.following || 1) - 1, 0)
            }));

        } catch (err) {
            console.error(err);
        } finally {
            setFollowLoading(false);
        }
    };

    return {
        data,
        loading,
        fetchFollows,
        followUser,
        unfollowUser,
        isFollowing,
        followLoading,
        checkIsFollowing,
    };
}