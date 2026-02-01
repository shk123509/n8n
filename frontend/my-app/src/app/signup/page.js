"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Mail, Lock, UserPlus, ArrowRight, AtSign } from "lucide-react";

export default function Signup() {
  const [formData, setFormData] = useState({ fullName: '', username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/api/v1/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Registration Successful! Now please login.");
        router.push("/login");
      } else {
        alert(data.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Signup error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f4f8] p-4 font-sans">
      <div className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)] border border-white/50 relative overflow-hidden">
        
        {/* Subtle Decorative Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-50 rounded-full blur-3xl opacity-60" />
        
        <div className="text-center mb-8 relative z-10">
          <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-xl shadow-blue-200">
            <UserPlus className="text-white" size={32} />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create Account</h2>
          <p className="text-slate-500 mt-2 font-medium">Join the next generation of AI building</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
              <input
                placeholder="John Doe"
                required
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:bg-white outline-none transition-all placeholder:text-slate-400 font-medium"
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              />
            </div>
          </div>

          {/* Username */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 ml-1">Username</label>
            <div className="relative group">
              <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
              <input
                placeholder="johndoe123"
                required
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:bg-white outline-none transition-all placeholder:text-slate-400 font-medium"
                onChange={(e) => setFormData({...formData, username: e.target.value})}
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
              <input
                type="email"
                placeholder="name@example.com"
                required
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:bg-white outline-none transition-all placeholder:text-slate-400 font-medium"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
              <input
                type="password"
                placeholder="••••••••"
                required
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:bg-white outline-none transition-all placeholder:text-slate-400 font-medium"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            disabled={loading}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-black transition-all active:scale-[0.98] disabled:opacity-70 shadow-lg shadow-slate-200 mt-4"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full" />
                Creating...
              </span>
            ) : (
              <>
                Create Account
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center relative z-10">
          <p className="text-slate-600 font-semibold text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 font-bold hover:underline underline-offset-4 decoration-2">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}