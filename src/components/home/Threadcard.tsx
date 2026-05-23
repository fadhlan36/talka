import { Heart, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ThreadCardProps {
  id: number;
  avatar?: string;
  username: string;
  name?: string;
  content: string;
  image?: string;
  likes: number;
  replies: number;
  isLiked: boolean;
  onLike: (e: React.MouseEvent) => void;
}

export const Threadcard = ({
  id,
  avatar,
  username,
  name,
  content,
  image,
  likes,
  replies,
  isLiked,
  onLike,
}: ThreadCardProps) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/thread/${id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="border-b border-zinc-900 p-4 md:p-8 hover:bg-zinc-950/50 transition-colors cursor-pointer w-full box-border"
    >
      <div className="flex gap-3 md:gap-4">
        {/* Avatar */}
        <div
          className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-zinc-800 overflow-hidden shrink-0 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/profile/${username}`);
          }}
        >
          <img
            src={
              avatar ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`
            }
            alt="avatar"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2 mb-1">
            <span className="font-bold text-white text-[14px] md:text-[15px] truncate">
              {name || username}
            </span>
            <span className="text-zinc-500 text-xs md:text-sm truncate">
              @{username}
            </span>
          </div>

          <p className="text-zinc-200 leading-relaxed text-[14px] md:text-[15px] mb-3 break-words">
            {content}
          </p>

          {image && (
            <div className="mb-4 mt-2 w-full max-w-[480px] overflow-hidden rounded-xl">
              <img
                src={`${image}`}
                alt="post content"
                className="w-full h-auto max-h-[350px] rounded-xl object-cover bg-zinc-950"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            </div>
          )}

          {/* Buttons */}
          <div className="flex items-center gap-6 text-zinc-500 pt-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onLike(e);
              }}
              className={`flex items-center gap-2 transition-colors hover:text-red-500 ${isLiked ? "text-red-500" : ""}`}
            >
              <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
              <span className="text-xs md:text-sm">{likes}</span>
            </button>

            <button
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 transition-colors hover:text-blue-500"
            >
              <MessageCircle size={18} />
              <span className="text-xs md:text-sm">{replies}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
