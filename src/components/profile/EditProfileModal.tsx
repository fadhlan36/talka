import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEditProfile } from "@/hooks/useEditProfile";
import { useAuth } from "@/hooks/useAuth";

interface Props {
  onClose: () => void;
}

export default function EditProfileModal({ onClose }: Props) {
  const { user } = useAuth();

  const {
    fullName,
    setFullName,
    username,
    setUsername,
    bio,
    setBio,
    photo,
    setPhoto,
    isLoading,
    error,
    handleSubmit,
  } = useEditProfile(onClose);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 rounded-2xl w-full max-w-md p-5 md:p-6 border border-zinc-800 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg md:text-xl font-bold">Edit Profile</h3>
          <button
            onClick={onClose}
            className="hover:bg-zinc-800 p-2 rounded-full transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* AVATAR */}
        <div className="flex justify-center mb-6">
          <label className="cursor-pointer group relative">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-zinc-700">
              <img
                src={
                  photo
                    ? URL.createObjectURL(photo)
                    : user?.photo_profile
                      ? `${import.meta.env.VITE_API_URL}/uploads/${user.photo_profile}`
                      : `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`
                }
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
              <span className="text-xs text-white font-bold">Ganti Foto</span>
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setPhoto(e.target.files?.[0] || null)}
            />
          </label>
        </div>

        {/* FORM */}
        <div className="space-y-4">
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full bg-zinc-800 p-3 rounded text-sm text-white border border-transparent focus:border-zinc-700 outline-none"
            placeholder="Full Name"
          />
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-zinc-800 p-3 rounded text-sm text-white border border-transparent focus:border-zinc-700 outline-none"
            placeholder="Username"
          />
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full bg-zinc-800 p-3 rounded text-sm text-white min-h-[80px] border border-transparent focus:border-zinc-700 outline-none"
            placeholder="Bio"
          />

          {error && <p className="text-red-500 text-xs md:text-sm">{error}</p>}

          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full rounded-full font-bold"
          >
            {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </div>
      </div>
    </div>
  );
}
