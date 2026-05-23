import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarLeft } from "@/components/home/SidebarLeft";
import { SidebarRight } from "@/components/home/SidebarRight";
import { Button } from "@/components/ui/button";
import { useFollow } from "@/hooks/useFollow";
import { useAuth } from "@/hooks/useAuth";

export default function FollowsPage() {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<"followers" | "following">(
    "followers",
  );
  const { data, loading, fetchFollows, followUser, unfollowUser } = useFollow();

  useEffect(() => {
    fetchFollows(activeTab);
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-black text-white flex">
      <div className="w-full flex">
        <SidebarLeft />

        <main className="flex-1 border-r border-zinc-900 min-w-0">
          {/* HEADER */}
          <div className="px-8 pt-6 pb-4">
            <h2 className="text-2xl font-bold text-white">Follows</h2>
          </div>

          {/* TABS */}
          <div className="flex border-b border-zinc-900">
            <button
              onClick={() => setActiveTab("followers")}
              className={`flex-1 py-3 text-sm font-semibold transition ${
                activeTab === "followers"
                  ? "text-white border-b-2 border-white"
                  : "text-zinc-500 hover:text-white"
              }`}
            >
              Followers
            </button>
            <button
              onClick={() => setActiveTab("following")}
              className={`flex-1 py-3 text-sm font-semibold transition ${
                activeTab === "following"
                  ? "text-white border-b-2 border-white"
                  : "text-zinc-500 hover:text-white"
              }`}
            >
              Following
            </button>
          </div>

          {/* CONTENT */}
          <div>
            {loading ? (
              <p className="px-8 py-6 text-zinc-500 italic text-sm">
                Loading...
              </p>
            ) : data.length === 0 ? (
              <p className="px-8 py-6 text-zinc-500 text-sm">No data</p>
            ) : (
              data.map((u) => (
                <div
                  key={u.id}
                  onClick={() => navigate(`/profile/${u.username}`)}
                  className="flex items-center justify-between px-8 py-4 border-b border-zinc-900 hover:bg-zinc-950/50 cursor-pointer transition"
                >
                  {/* User Info */}
                  <div className="flex items-center gap-4">
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
                    <div>
                      <p className="font-semibold text-white text-sm">
                        {u.name}
                      </p>
                      <p className="text-zinc-500 text-sm">@{u.username}</p>
                    </div>
                  </div>

                  {/* Button — jangan tampilkan untuk diri sendiri */}
                  {u.id !== currentUser?.id &&
                    (u.is_following ? (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          unfollowUser(u.id);
                        }}
                        variant="outline"
                        className="rounded-full border-zinc-700 hover:border-red-400 hover:text-red-400 transition"
                      >
                        Following
                      </Button>
                    ) : (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          followUser(u.id);
                        }}
                        className="rounded-full bg-white text-black hover:bg-zinc-200"
                      >
                        {activeTab === "followers" ? "Follow Back" : "Follow"}
                      </Button>
                    ))}
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
