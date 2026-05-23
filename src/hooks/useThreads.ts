    import { useState, useEffect } from "react";
    import axios from "axios";
    import { useNavigate } from "react-router-dom";
    // import { io } from "socket.io-client";
    import { useAppDispatch, useAppSelector } from "../store/hooks";
    import { initializeLikes, toggleLike, revertLike } from "../features/likes/likeSlice";
    import toast from "react-hot-toast";

    // Membuat koneksi realtime ke backend via WebSocket
    // const socket = io(`${import.meta.env.VITE_API_URL}`);

    export function useThreads() {
        const navigate = useNavigate();
        const dispatch = useAppDispatch(); // untuk mengirim action ke Redux

        const [threads, setThreads] = useState<any[]>([]);
        const [loading, setLoading] = useState(true);
        const [content, setContent] = useState("");
        const [image, setImage] = useState<File | null>(null);
        const [isPosting, setIsPosting] = useState(false);

        const token = localStorage.getItem("token");

        // Checkpoint 2: Ambil data likes dari Redux store
        // likedThreads → { threadId: isLiked }, likeCounts → { threadId: count }
        const likedThreads = useAppSelector((state) => state.likes.likedThreads);
        const likeCounts = useAppSelector((state) => state.likes.likeCounts);

        // useEffect(() => {
        //     // Mendengarkan event "newThread" dari server (realtime via socket)
        //     socket.on("newThread", (newThreadFromSocket) => {
        //         setThreads((prevThreads) => {
        //             // Cek duplikat sebelum menambahkan thread baru
        //             const exists = prevThreads.find(t => t.id === newThreadFromSocket.id);
        //             if (exists) return prevThreads;
        //             return [newThreadFromSocket, ...prevThreads]; // thread baru di paling atas
        //         });

        //         // Checkpoint 1: Simpan data like thread baru ke Redux
        //         dispatch(initializeLikes([{
        //             threadId: newThreadFromSocket.id,
        //             isLiked: newThreadFromSocket.isLiked ?? false,
        //             likeCount: newThreadFromSocket.likes ?? 0,
        //         }]));
        //     });

        //     // Cleanup: hentikan listener saat komponen unmount
        //     return () => { socket.off("newThread"); };
        // }, [dispatch]);

        const fetchThreads = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/thread?limit=25`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                console.log(response.data);

                const fetchedThreads = response.data;
                setThreads(fetchedThreads); // simpan threads ke local state

                // Checkpoint 1: Store semua data like dari hasil fetch ke Redux
                // agar UI bisa membaca status like dari satu sumber (Redux)
                dispatch(initializeLikes(
                    fetchedThreads.map((t: any) => ({
                        threadId: t.id,
                        isLiked: t.isLiked ?? false,
                        likeCount: t.likes ?? 0,
                    }))
                ));
            } catch (err: any) {
                if (err.response?.status === 401) navigate("/login"); // token expired → redirect login
            } finally {
                setLoading(false);
            }
        };

        const handlePost = async () => {
            if (!content.trim() && !image) return; // jangan kirim jika kosong

            try {
                setIsPosting(true);

                // Pakai FormData karena perlu mengirim file gambar (JSON tidak bisa)
                const formData = new FormData();
                formData.append("content", content);
                if (image) formData.append("image", image);

                await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/thread`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                });

                // Reset form setelah berhasil post
                setContent("");
                setImage(null);

                toast.success("Posting berhasil")
            } catch (err) {
                alert("Gagal mengirim postingan!");
            } finally {
                setIsPosting(false);
            }
        };

        const handleLike = async (threadId: number) => {
            // Simpan state like saat ini sebelum diubah, untuk keperluan revert jika API gagal
            const previousIsLiked = likedThreads[threadId] ?? false;
            const previousCount = likeCounts[threadId] ?? 0;

            // Checkpoint 3: Optimistic update — update Redux lebih dulu agar UI instan
            // User langsung melihat perubahan tanpa menunggu respons server
            dispatch(toggleLike(threadId)); // kalau user like/unlike update dulu di redux biar ui-nya langsung berubah lalu kirim ke backend

            try {
                // Checkpoint 4 (like) & Checkpoint 5 (unlike):
                // Hit API ke database — backend menentukan apakah ini create atau delete like
                // berdasarkan status like user saat ini di database
                await axios.post(
                    `${import.meta.env.VITE_API_URL}/api/v1/thread/like`,
                    { threadId },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } catch (err) {
                console.error("Gagal memproses like:", err);

                // Jika API gagal, kembalikan Redux ke state sebelumnya (rollback)
                // agar UI tidak menampilkan data yang salah
                dispatch(revertLike({ threadId, previousIsLiked, previousCount }));
            }
        };

        // Jalankan fetchThreads sekali saat komponen pertama kali mount
        useEffect(() => {
            fetchThreads();
        }, []);

        // Checkpoint 2: Gabungkan data thread dengan data likes dari Redux
        // Redux adalah sumber yang benar untuk status like & jumlah like
        const threadsWithLikes = threads.map((t) => ({
            ...t,
            isLiked: likedThreads[t.id] ?? t.isLiked ?? false, // prioritaskan data dari Redux
            likes: likeCounts[t.id] ?? t.likes ?? 0,           // prioritaskan data dari Redux
        }));

        return {
            threads: threadsWithLikes, // UI selalu membaca dari data yang sudah di-merge dengan Redux
            loading,
            content,
            setContent,
            image,
            setImage,
            isPosting,
            handlePost,
            handleLike,
        };
    }