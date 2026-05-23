import { useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFollow } from "@/hooks/useFollow";

interface Props {
  type: "followers" | "following";
  onClose: () => void;
  userId?: number;
  currentUserId: number;
}

export default function FollowModal({
  type,
  onClose,
  userId,
  currentUserId,
}: Props) {
  const { data, fetchFollows, followUser, unfollowUser, loading } = useFollow();

  useEffect(() => {
    fetchFollows(type, userId);
  }, [type, userId]);

  const isOwnProfile = currentUserId === userId;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 w-full max-w-md p-5 md:p-6 rounded-2xl border border-zinc-800 max-h-[80vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="capitalize font-bold text-lg">{type}</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-zinc-800 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <p className="text-center text-zinc-400 py-4 text-sm">Loading...</p>
        ) : data.length === 0 ? (
          <p className="text-center text-zinc-500 py-4 text-sm">No data</p>
        ) : (
          <div className="space-y-1">
            {data.map((u) => (
              <div
                key={u.id}
                className="flex justify-between items-center py-3 border-b border-zinc-800/50 last:border-0"
              >
                {/* User Info */}
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={
                      u.avatar
                        ? `${import.meta.env.VITE_API_URL}/uploads/${u.avatar}`
                        : `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`
                    }
                    className="w-10 h-10 rounded-full object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-white truncate">
                      {u.name}
                    </p>
                    <p className="text-xs text-zinc-500 truncate">
                      @{u.username}
                    </p>
                  </div>
                </div>

                {/* Button */}
                {u.id !== currentUserId &&
                  (u.is_following ? (
                    <Button
                      onClick={() => unfollowUser(u.id)}
                      variant="outline"
                      className="rounded-full h-8 text-xs px-3 border-zinc-700"
                    >
                      Unfollow
                    </Button>
                  ) : (
                    <Button
                      onClick={() => followUser(u.id)}
                      className="rounded-full h-8 text-xs px-3 bg-white text-black hover:bg-zinc-200"
                    >
                      {isOwnProfile && type === "followers"
                        ? "Follow Back"
                        : "Follow"}
                    </Button>
                  ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
