"use client";
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const { isLoggedIn, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/v1/users/logout", {
        method: "POST",
      });
      if (res.ok) {
        logout();
        router.push("/login");
      }
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <nav className="flex justify-between items-center px-10 py-4 bg-white shadow-md">
      <Link href="/" className="text-xl font-bold text-blue-600">MY N8N APP</Link>
      
      <div className="flex gap-6 items-center">
        {/* <Link href="/">Home</Link> */}
        
        {isLoggedIn ? (
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
            Logout
          </button>
        ) : (
          <>
            <Link href="/login" className="text-gray-700">Login</Link>
            <Link href="/signup" className="bg-blue-600 text-white px-4 py-2 rounded">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;