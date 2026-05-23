import { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
// import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import toast from "react-hot-toast";

// 🔌 1. Bikin koneksi socket ke backend (sekali saja, di luar hook)
// Kenapa di luar? → supaya tidak bikin koneksi baru tiap render
// const socket = io(`${import.meta.env.VITE_API_URL}`);

export function useThreadDetail(id?: string) {
  // 🧑 2. Ambil data user dari Redux (global state)
  const { user } = useSelector((state: RootState) => state.auth);

  // 🧠 3. useRef untuk simpan username terbaru TANPA trigger re-render
  // Ini penting untuk socket supaya selalu pakai data terbaru
  const usernameRef = useRef(user?.username);

  useEffect(() => {
    // Update ref setiap user berubah
    usernameRef.current = user?.username;
  }, [user?.username]);

  // 📦 4. State lokal (khusus halaman ini)
  const [thread, setThread] = useState<any>(null); // data thread utama
  const [replies, setReplies] = useState<any[]>([]); // list balasan
  const [loading, setLoading] = useState(true); // loading fetch
  const [replyContent, setReplyContent] = useState(""); // input user
  const [isSubmitting, setIsSubmitting] = useState(false); // loading kirim

  // 🔐 5. Header auth untuk API
  const headers = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  // 🔥 6. REALTIME LISTENER (Socket.io)
  // useEffect(() => {
  //   if (!id) return;
  //   // Jangan jalan kalau belum ada id thread

  //   const event = `newReply-${id}`;
  //   // Nama event unik per thread (biar gak ketukar antar thread)

  //   const handler = (newReply: any) => {
  //     setReplies((prev) => {
  //       // ❌ 6.1 Cegah duplikat (misalnya buka 2 tab)
  //       if (prev.some((r) => r.id === newReply.id)) return prev;

  //       // 🧹 6.2 Hapus data "optimistic" milik kita sendiri
  //       // (biar nanti diganti data asli dari server)
  //       const clean = prev.filter(
  //         (r) =>
  //           !(
  //             r.isPending && // hanya data palsu
  //             r.username === usernameRef.current && // milik kita
  //             r.content === newReply.content // isi sama
  //           ),
  //       );

  //       // ➕ 6.3 Masukkan data asli dari server ke paling atas
  //       return [newReply, ...clean];
  //     });

  //     // 🔢 6.4 Update jumlah reply di thread
  //     setThread((p: any) => (p ? { ...p, replies: p.replies + 1 } : p));
  //   };

  //   // 🎧 Mulai dengerin event dari server
  //   socket.on(event, handler);

  //   // 🧹 Cleanup → WAJIB biar gak dobel listener
  //   return () => {
  //     socket.off(event, handler);
  //   };
  // }, [id]);

  // 📡 7. Fetch data awal (thread + replies)
  const fetchData = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);

      // 🚀 Ambil 2 API sekaligus (lebih cepat)
      const [t, r] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/v1/thread/${id}`, { headers }),
        axios.get(`${import.meta.env.VITE_API_URL}/api/v1/reply?thread_id=${id}`, {
          headers,
        }),
      ]);

      setThread(t.data);
      setReplies(r.data);
    } catch (e) {
      console.error("Gagal memuat detail thread", e);
    } finally {
      setLoading(false);
    }
  }, [id]);

  // 🔁 Jalankan fetch saat pertama load / id berubah
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 💬 8. Handle kirim reply
  const handleReply = async () => {
    // ❌ Jangan kirim kalau kosong atau id tidak ada
    if (!replyContent.trim() || !id) return;

    const tempId = Date.now(); // ID sementara
    const text = replyContent;

    // 👻 8.1 Optimistic UI (data palsu)
    // Tujuan: biar user langsung lihat hasil tanpa nunggu server
    const optimistic = {
      id: tempId,
      content: text,
      username: user?.username || "You",
      name: user?.full_name || "You",
      avatar: user?.photo_profile || null,
      created_at: new Date().toISOString(),
      isPending: true, // PENANDA penting
    };

    try {
      setIsSubmitting(true);

      // ⚡ 8.2 Tampilkan langsung ke UI
      setReplies((p) => [optimistic, ...p]);
      setReplyContent("");

      // 📡 8.3 Kirim ke backend
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/reply`,
        { content: text, thread_id: Number(id) },
        { headers },
      );

      toast.success("Berhasil berkomentar")

      // ❗ TIDAK perlu setReplies lagi di sini
      // karena socket akan kirim data asli nanti
    } catch {
      // ❌ 8.4 Kalau gagal → rollback
      setReplies((p) => p.filter((r) => r.id !== tempId));
      setReplyContent(text);
      alert("Gagal mengirim balasan!");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🎁 9. Return data & function ke component
  return {
    thread,
    replies,
    loading,
    replyContent,
    setReplyContent,
    isSubmitting,
    handleReply,
    user,
  };
}
