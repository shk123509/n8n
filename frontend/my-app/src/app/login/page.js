"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { Mail, Lock, User, ArrowRight, Sparkles } from "lucide-react";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:4000/api/v1/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Invalid credentials");
        return;
      }

      login(data);
      router.push("/");
    } catch (err) {
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f4f8] p-4 font-sans">
      <div className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)] border border-white/50 relative overflow-hidden">
        
        {/* Subtle Background Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-50 rounded-full blur-3xl opacity-50" />
        
        <div className="text-center mb-10 relative z-10">
          <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-xl shadow-blue-200">
            <Sparkles className="text-white" size={32} />
          </div>
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h2>
          <p className="text-slate-600 mt-3 text-base font-medium">
            Log in to manage your <span className="text-blue-600">AI workflows</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          {/* Username */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Username</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
              <input
                placeholder="johndoe_ai"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:bg-white outline-none transition-all placeholder:text-slate-400 font-medium"
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
              <input
                type="email"
                placeholder="name@company.com"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:bg-white outline-none transition-all placeholder:text-slate-400 font-medium"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-sm font-bold text-slate-700">Password</label>
              <Link href="#" className="text-xs font-bold text-blue-600 hover:text-blue-700">Forgot?</Link>
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:bg-white outline-none transition-all placeholder:text-slate-400 font-medium"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-black transition-all active:scale-[0.98] disabled:opacity-70 shadow-lg shadow-slate-200 mt-2"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Verifying...
              </span>
            ) : (
              <>
                Sign In
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 pt-6 border-t border-slate-100 text-center relative z-10">
          <p className="text-slate-600 font-semibold text-sm">
            Don't have an account?{" "}
            <Link href="/signup" className="text-blue-600 font-bold hover:underline underline-offset-4 decoration-2">
              Create free account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}