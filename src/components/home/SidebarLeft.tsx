import { Home, Search, Heart, User, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "@/features/auth/authSlice";
import { NavItem } from "./NavItems";

export const SidebarLeft = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <>
      {/* DESKTOP SIDEBAR (Tampil mulai layar md) */}
      <aside className="hidden md:flex w-[20%] max-w-[280px] min-w-[200px] sticky top-0 h-screen flex-col py-8 px-6 border-r border-zinc-900 shrink-0">
        <h1
          className="text-4xl font-bold text-blue-500 mb-10 tracking-tighter cursor-pointer"
          onClick={() => navigate("/home")}
        >
          Talka
        </h1>
        <nav className="space-y-6 flex-1">
          <NavItem
            icon={<Home size={28} />}
            label="Home"
            active={location.pathname === "/home"}
            onClick={() => navigate("/home")}
          />
          <NavItem
            icon={<Search size={28} />}
            label="Search"
            active={location.pathname === "/search"}
            onClick={() => navigate("/search")}
          />
          <NavItem
            icon={<Heart size={28} />}
            label="Follows"
            active={location.pathname === "/follows"}
            onClick={() => navigate("/follows")}
          />
          <NavItem
            icon={<User size={28} />}
            label="Profile"
            active={location.pathname.startsWith("/profile")}
            onClick={() => navigate("/profile")}
          />
        </nav>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-zinc-500 hover:text-red-500 transition-colors mt-auto pb-4 group"
        >
          <LogOut
            size={24}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="font-semibold text-lg">Logout</span>
        </button>
      </aside>

      {/* MOBILE BOTTOM NAVIGATION (Hanya tampil di layar bawah md) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-black/90 backdrop-blur-md border-t border-zinc-900 flex items-center justify-around px-4 z-40">
        <button
          onClick={() => navigate("/home")}
          className={`p-2 transition-colors ${location.pathname === "/home" ? "text-blue-500" : "text-zinc-500"}`}
        >
          <Home size={26} />
        </button>
        <button
          onClick={() => navigate("/search")}
          className={`p-2 transition-colors ${location.pathname === "/search" ? "text-blue-500" : "text-zinc-500"}`}
        >
          <Search size={26} />
        </button>
        <button
          onClick={() => navigate("/follows")}
          className={`p-2 transition-colors ${location.pathname === "/follows" ? "text-blue-500" : "text-zinc-500"}`}
        >
          <Heart size={26} />
        </button>
        <button
          onClick={() => navigate("/profile")}
          className={`p-2 transition-colors ${location.pathname.startsWith("/profile") ? "text-blue-500" : "text-zinc-500"}`}
        >
          <User size={26} />
        </button>
        <button
          onClick={handleLogout}
          className="p-2 text-zinc-500 hover:text-red-500 transition-colors"
        >
          <LogOut size={24} />
        </button>
      </nav>
    </>
  );
};
