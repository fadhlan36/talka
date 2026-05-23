import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { SidebarLeft } from "@/components/home/SidebarLeft";
import { SidebarRight } from "@/components/home/SidebarRight";
import { useSearch } from "@/hooks/useSearch";

export default function SearchPage() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const { results, loading, searched, searchUsers, clearResults } = useSearch();

  const handleSearch = () => {
    searchUsers(keyword);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleClear = () => {
    setKeyword("");
    clearResults();
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      <div className="w-full flex">
        <SidebarLeft />

        <main className="flex-1 py-8 border-r border-zinc-900 min-w-0">
          <h2 className="text-2xl font-bold mb-6 px-8">Search</h2>

          {/* SEARCH BAR */}
          <div className="px-8 mb-6">
            <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-full px-5 py-3 focus-within:border-zinc-600 transition">
              <Search size={18} className="text-zinc-500 shrink-0" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Cari username atau nama..."
                className="flex-1 bg-transparent outline-none text-white placeholder:text-zinc-600 text-sm"
              />
              {keyword && (
                <button onClick={handleClear}>
                  <X
                    size={16}
                    className="text-zinc-500 hover:text-white transition"
                  />
                </button>
              )}
              <button
                onClick={handleSearch}
                disabled={!keyword.trim() || loading}
                className="ml-1 text-sm font-semibold text-blue-500 hover:text-blue-400 disabled:opacity-40 transition"
              >
                {loading ? "..." : "Cari"}
              </button>
            </div>
          </div>

          {/* RESULTS */}
          <div>
            {loading ? (
              <div className="px-8 text-zinc-500 italic text-sm">
                Mencari...
              </div>
            ) : searched && results.length === 0 ? (
              <div className="px-8 text-zinc-500 text-sm">
                Tidak ada user yang cocok dengan "
                <span className="text-white">{keyword}</span>"
              </div>
            ) : (
              results.map((u) => (
                <div
                  key={u.id}
                  onClick={() => navigate(`/profile/${u.username}`)}
                  className="flex items-center justify-between px-8 py-4 border-b border-zinc-900 hover:bg-zinc-950/50 cursor-pointer transition"
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-11 h-11 rounded-full bg-zinc-800 overflow-hidden shrink-0">
                      <img
                        src={
                          u.avatar
                            ? `${import.meta.env.VITE_API_URL}/uploads/${u.avatar}`
                            : `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`
                        }
                        alt={u.username}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div>
                      <p className="font-semibold text-white text-sm">
                        {u.name || u.username}
                      </p>
                      <p className="text-zinc-500 text-sm">@{u.username}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>

        <SidebarRight />
      </div>
    </div>
  );
}
