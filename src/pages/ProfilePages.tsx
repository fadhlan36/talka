import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { SidebarLeft } from "@/components/home/SidebarLeft";
import { SidebarRight } from "@/components/home/SidebarRight";
import { useAuth } from "@/hooks/useAuth";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileInfo from "@/components/profile/ProfileInfo";
import FollowModal from "@/components/profile/FollowModal";
import EditProfileModal from "@/components/profile/EditProfileModal";

export default function ProfilePage() {
  const { username } = useParams();
  const { user: currentUser } = useAuth();

  const [profileUser, setProfileUser] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [followTab, setFollowTab] = useState<"followers" | "following" | null>(
    null,
  );

  //  cek apakah ini profile sendiri
  const isOwnProfile = useMemo(() => {
    if (!username) return true;
    if (!currentUser) return false;
    return username === currentUser.username;
  }, [username, currentUser]);

  useEffect(() => {
    if (!currentUser) return;

    //  kalau profile sendiri, langsung pakai data user login
    if (isOwnProfile) {
      setProfileUser(currentUser);
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoadingProfile(true);
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/user/${username}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        setProfileUser(res.data);
      } catch (err) {
        console.error("Gagal fetch profile:", err);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [username, isOwnProfile, currentUser]);

  return (
    <div className="min-h-screen bg-black text-white flex">
      <div className="w-full flex">
        <SidebarLeft />

        <main className="flex-1 border-r border-zinc-900 min-w-0">
          <div className="px-8 pt-6 pb-4">
            <ProfileHeader />
          </div>

          <div className="border-b border-zinc-900" />

          <div className="px-8 py-6">
            {loadingProfile || !profileUser ? (
              <div className="text-zinc-500 italic">Memuat profil...</div>
            ) : (
              <ProfileInfo
                user={profileUser}
                isOwnProfile={isOwnProfile}
                onEdit={() => setIsEditOpen(true)}
                onOpenFollowers={() => setFollowTab("followers")}
                onOpenFollowing={() => setFollowTab("following")}
              />
            )}
          </div>
        </main>

        <SidebarRight />
      </div>

      {/* Edit Profile */}
      {isOwnProfile && isEditOpen && (
        <EditProfileModal onClose={() => setIsEditOpen(false)} />
      )}

      {/* Follow Modal */}
      {followTab && profileUser && currentUser && (
        <FollowModal
          type={followTab}
          userId={profileUser.id} //  user yang sedang dilihat
          currentUserId={currentUser.id} //  user login (WAJIB)
          onClose={() => setFollowTab(null)}
        />
      )}
    </div>
  );
}
