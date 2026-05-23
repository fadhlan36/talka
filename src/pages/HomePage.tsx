import { Image as ImageIcon, X } from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "../hooks/useAuth";
import { useThreads } from "../hooks/useThreads";
import { Threadcard } from "@/components/home/Threadcard";
import { SidebarLeft } from "@/components/home/SidebarLeft";
import { SidebarRight } from "@/components/home/SidebarRight";

export default function HomePage() {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    threads,
    loading,
    content,
    setContent,
    image,
    setImage,
    isPosting,
    handlePost,
    handleLike,
  } = useThreads();

  return (
    <div className="min-h-screen bg-black text-white flex">
      <div className="w-full flex">
        {/* Sidebar Kiri */}
        <SidebarLeft />

        <main className="flex-1 py-8 border-r border-zinc-900 min-w-0">
          <h2 className="text-2xl font-bold mb-8 px-8 text-white">Home</h2>

          {/* Input Postingan Baru */}
          <div className="flex gap-4 px-8 mb-10">
            {/* Avatar diambil dari Redux — kalau ada foto profil pakai itu, kalau tidak pakai dicebear */}
            <div className="w-12 h-12 rounded-full bg-zinc-800 overflow-hidden shrink-0">
              <img
                src={
                  user?.photo_profile
                    ? `${import.meta.env.VITE_API_URL}/uploads/${user.photo_profile}`
                    : `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || "user"}`
                }
                alt="avatar"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 space-y-4">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What is happening?!"
                className="w-full bg-transparent border-none text-xl outline-none placeholder:text-zinc-600 resize-none min-h-[60px] text-white"
              />

              {/* Preview Gambar Sebelum Post */}
              {image && (
                <div className="relative w-fit">
                  <img
                    src={URL.createObjectURL(image)}
                    alt="preview"
                    className="max-h-60 rounded-xl border border-zinc-800"
                  />
                  <button
                    onClick={() => setImage(null)}
                    className="absolute top-2 right-2 bg-black/60 p-1 rounded-full hover:bg-black text-white"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between border-t border-zinc-900 pt-4">
                <div className="flex gap-6 text-blue-500">
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files?.[0] || null)}
                  />
                  <ImageIcon
                    size={22}
                    className="cursor-pointer hover:text-blue-400"
                    onClick={() => fileInputRef.current?.click()}
                  />
                </div>
                <Button
                  onClick={handlePost}
                  disabled={isPosting || (!content.trim() && !image)}
                  className="bg-blue-500 hover:bg-blue-600 px-8 rounded-full h-10 font-bold border-none text-white"
                >
                  {isPosting ? "Posting..." : "Post"}
                </Button>
              </div>
            </div>
          </div>

          {/* Feed Thread */}
          <div className="space-y-0">
            {loading ? (
              <div className="px-8 text-zinc-500 italic">
                Memuat postingan...
              </div>
            ) : (
              threads.map((thread) => (
                <Threadcard
                  key={thread.id}
                  id={thread.id}
                  avatar={thread.avatar}
                  username={thread.username}
                  name={thread.name}
                  content={thread.content}
                  image={thread.image}
                  likes={thread.likes}
                  replies={thread.replies}
                  isLiked={thread.isLiked}
                  onLike={(e) => {
                    e.stopPropagation();
                    handleLike(thread.id);
                  }}
                />
              ))
            )}
          </div>
        </main>

        {/* Sidebar Kanan */}
        <SidebarRight />
      </div>
    </div>
  );
}
