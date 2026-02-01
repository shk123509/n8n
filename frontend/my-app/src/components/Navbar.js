"use client";
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { Zap, LogOut, LayoutDashboard, User, ChevronRight } from 'lucide-react';

const Navbar = () => {
  const { isLoggedIn, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    // LocalStorage se dono possible keys check karein
    const token = localStorage.getItem("accessToken") || localStorage.getItem("accesstoken");
    
    try {
      const res = await fetch("http://localhost:4000/api/v1/users/logout", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}` // ✅ Backend verifyJWT ke liye zaroori hai
        }
      });

      // Agar logout successful ho ya token expire bhi ho gaya ho (401), tab bhi frontend clear karein
      if (res.ok || res.status === 401) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("accesstoken");
        logout(); // Auth Context update
        router.push("/login");
      }
    } catch (err) {
      console.error("Logout failed", err);
      // Fallback: Kuch bhi error ho, local state clear karein
      logout();
      router.push("/login");
    }
  };

  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-[100] transition-all">
      {/* --- Brand Logo --- */}
      <Link href="/" className="flex items-center gap-2.5 group">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 group-hover:rotate-6 transition-transform">
          <Zap className="text-white fill-white" size={20} />
        </div>
        <span className="text-xl font-black tracking-tighter text-slate-800 uppercase">
          FlowAI
        </span>
      </Link>
      
      {/* --- Navigation Links --- */}
      <div className="flex gap-2 items-center">
        {isLoggedIn ? (
          <div className="flex items-center gap-3">
            {/* Dashboard Link (Show only if not on builder/dashboard) */}
            {pathname !== "/workflows" && (
              <Link 
                href="/workflows" 
                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors"
              >
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
            )}

            {/* Profile/User Icon (Mockup) */}
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
              <User size={16} className="text-slate-500" />
            </div>

            {/* Logout Button */}
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-red-500 transition-all shadow-lg active:scale-95"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-all"
            >
              Login
            </Link>
            <Link 
              href="/signup" 
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95"
            >
              Get Started
              <ChevronRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;