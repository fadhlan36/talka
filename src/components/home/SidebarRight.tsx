import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useSuggested } from "@/hooks/useSuggested";
import { useFollow } from "@/hooks/useFollow";

export const SidebarRight = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { suggested, loading, removeFromSuggested } = useSuggested();
  const { followUser } = useFollow();

  const handleFollow = async (userId: number) => {
    await followUser(userId);
    removeFromSuggested(userId);
  };

  return (
    // Tambah hidden md:block dan sesuaikan lebar responsifnya
    <aside className="hidden lg:block w-[28%] max-w-[360px] sticky top-0 h-screen py-8 px-6 space-y-6 overflow-y-auto shrink-0 border-l border-zinc-900">
      {/* MY PROFILE CARD */}
      <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800 shadow-2xl">
        <h3 className="font-bold mb-4 text-sm text-blue-500 uppercase tracking-widest">
          My Profile
        </h3>
        <div className="h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl mb-[-48px]"></div>
        <div className="px-2 pb-2">
          <div className="w-20 h-20 rounded-full border-4 border-zinc-900 bg-zinc-800 overflow-hidden relative z-10">
            <img
              src={
                user?.photo_profile
                  ? `${import.meta.env.VITE_API_URL}/uploads/${user.photo_profile}`
                  : `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || "default"}`
              }
              alt="me"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="mt-3">
            <h4 className="font-bold text-xl leading-tight text-white italic">
              ✨ {user?.full_name || "Guest User"} ✨
            </h4>
            <p className="text-zinc-500">@{user?.username || "username"}</p>
            <p className="text-sm mt-3 text-zinc-300 truncate">
              {user?.bio || "No bio yet."}
            </p>
            <div className="flex gap-4 mt-4 text-xs font-semibold">
              <span>
                <b className="text-white">{user?.following}</b> Following
              </span>
              <span>
                <b className="text-white">{user?.followers}</b> Followers
              </span>
            </div>
          </div>

          <Button
            onClick={() => navigate("/profile")}
            variant="outline"
            className="w-full mt-5 border-zinc-700 rounded-full h-10 font-bold text-white hover:bg-zinc-800 transition-all"
          >
            Edit Profile
          </Button>
        </div>
      </div>

      {/* SUGGESTED FOR YOU */}
      <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800">
        <h3 className="font-bold mb-5 text-zinc-100 text-sm uppercase">
          Suggested for you
        </h3>

        {loading ? (
          <p className="text-zinc-500 text-sm italic">Loading...</p>
        ) : suggested.length === 0 ? (
          <p className="text-zinc-500 text-sm">Tidak ada saran user.</p>
        ) : (
          <div className="space-y-4">
            {suggested.map((u) => (
              <div
                key={u.id}
                className="flex items-center justify-between gap-3"
              >
                <div
                  className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                  onClick={() => navigate(`/profile/${u.username}`)}
                >
                  <div className="w-9 h-9 rounded-full bg-zinc-800 overflow-hidden shrink-0">
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
                  <div className="min-w-0">
                    <p className="font-semibold text-white text-sm truncate">
                      {u.name || u.username}
                    </p>
                    <p className="text-zinc-500 text-xs truncate">
                      @{u.username}
                    </p>
                  </div>
                </div>

                <Button
                  onClick={() => handleFollow(u.id)}
                  className="rounded-full bg-white text-black hover:bg-zinc-200 text-xs px-4 h-8 shrink-0"
                >
                  Follow
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};
