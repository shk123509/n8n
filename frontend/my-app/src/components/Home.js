"use client";
import Link from 'next/link';
import { Sparkles, ArrowRight, Zap, Layers, Shield, Play, MousePointer2 } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="bg-[#ffffff] min-h-screen font-sans text-slate-900 overflow-x-hidden">
      
      {/* --- Simple Nav --- */}
      {/* <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200">
            <Zap className="text-white fill-white" size={20} />
          </div>
          <span className="text-xl font-black tracking-tighter">FlowAI</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-semibold text-slate-600">
          <Link href="#" className="hover:text-orange-500 transition-colors">Integrations</Link>
          <Link href="#" className="hover:text-orange-500 transition-colors">Pricing</Link>
          <Link href="#" className="hover:text-orange-500 transition-colors">Cloud</Link>
        </div>
        <Link href="/login" className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-md">
          Sign In
        </Link>
      </nav> */}

      {/* --- Hero Section --- */}
      <section className="relative pt-16 pb-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-[13px] font-bold mb-8 uppercase tracking-wider">
            <Sparkles size={14} className="animate-pulse" />
            Next-Gen Workflow Automation
          </div>
          
          <h1 className="text-6xl md:text-[84px] font-black tracking-tight mb-8 leading-[0.9] text-slate-900">
            Automate without <br /> 
            <span className="text-orange-500 italic">coding.</span>
          </h1>
          
          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
            The fair-code workflow automation tool. Connect 400+ apps, build complex logic, and run it anywhere.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <Link href="/workflows" className="group px-10 py-5 bg-orange-500 text-white rounded-2xl font-black text-xl hover:bg-orange-600 transition-all shadow-xl shadow-orange-200 flex items-center gap-2">
              Get Started Free <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="px-10 py-5 bg-white text-slate-900 border-2 border-slate-100 rounded-2xl font-bold text-xl hover:border-orange-200 transition-all">
              Try Demo
            </button>
          </div>
        </div>
      </section>

      {/* --- The n8n Style Canvas Preview --- */}
      <section className="px-6 py-12 relative">
        <div className="max-w-6xl mx-auto bg-[#F9FAFB] rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden relative min-h-[550px]">
          
          {/* Grid Background */}
          <div className="absolute inset-0 opacity-[0.4]" 
               style={{ backgroundImage: 'radial-gradient(#d1d5db 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          </div>

          {/* Floating UI Elements */}
          <div className="absolute top-6 left-6 p-3 bg-white shadow-sm border rounded-xl flex items-center gap-3 z-20">
            <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center text-white"><Play size={14} fill="white" /></div>
            <span className="text-xs font-bold text-slate-600 uppercase tracking-tighter">Execute Workflow</span>
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 p-2 bg-white/80 backdrop-blur-md shadow-lg border rounded-2xl flex items-center gap-1 z-20">
             <div className="w-10 h-10 rounded-xl bg-slate-100" />
             <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white"><Zap size={16}/></div>
             <div className="w-10 h-10 rounded-xl bg-slate-100" />
          </div>

          {/* --- Animated Nodes Canvas --- */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col md:flex-row items-center gap-16 md:gap-24 relative">
              
              {/* Node 1 */}
              <div className="relative group">
                <NodeMock title="Typeform" icon="📋" color="bg-slate-900" />
                <div className="absolute -top-3 -right-3 bg-green-500 w-6 h-6 rounded-full border-4 border-white"></div>
              </div>

              {/* Connection Line 1 */}
              <div className="hidden md:block absolute left-[150px] top-1/2 w-[100px] h-[2px] bg-slate-200">
                 <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-transparent w-full h-full animate-flow-line"></div>
              </div>

              {/* Node 2 (AI) */}
              <div className="relative scale-110">
                <div className="absolute -inset-4 bg-orange-100 rounded-[2.5rem] blur-2xl opacity-40 animate-pulse"></div>
                <NodeMock title="OpenAI" icon="🧠" color="bg-orange-500" />
              </div>

              {/* Connection Line 2 */}
              <div className="hidden md:block absolute left-[400px] top-1/2 w-[100px] h-[2px] bg-slate-200"></div>

              {/* Node 3 */}
              <NodeMock title="Discord" icon="👾" color="bg-indigo-500" />

              {/* Mouse Cursor Mockup */}
              <div className="absolute top-[80%] left-[20%] animate-bounce pointer-events-none">
                <MousePointer2 className="text-orange-500 fill-orange-500" size={32} />
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* --- Features Section --- */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-3 gap-12">
          <Feature 
            title="Visual Logic" 
            desc="Branch, merge, and loop through data with an intuitive canvas." 
            icon={<Layers className="text-orange-500" />} 
          />
          <Feature 
            title="400+ Nodes" 
            desc="Deep integrations with all the tools you use daily." 
            icon={<Zap className="text-orange-500" />} 
          />
          <Feature 
            title="Secure by Default" 
            desc="Self-host on your own infrastructure for total data privacy." 
            icon={<Shield className="text-orange-500" />} 
          />
        </div>
      </section>

      {/* Custom Styles for Animation */}
      <style jsx>{`
        @keyframes flow {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-flow-line {
          animation: flow 2s linear infinite;
        }
      `}</style>
    </div>
  );
}

// --- Helper Components ---

function NodeMock({ title, icon, color }) {
  return (
    <div className="w-36 h-36 bg-white rounded-[2rem] shadow-[0_15px_30px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col items-center justify-center gap-3 relative z-10 hover:border-orange-300 transition-all cursor-grab active:cursor-grabbing group">
      <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center text-2xl shadow-lg`}>
        {icon}
      </div>
      <span className="font-bold text-xs uppercase tracking-widest text-slate-500 group-hover:text-slate-900 transition-colors">{title}</span>
    </div>
  );
}

function Feature({ title, desc, icon }) {
  return (
    <div className="space-y-4">
      <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-black tracking-tight">{title}</h3>
      <p className="text-slate-500 font-medium leading-relaxed">{desc}</p>
    </div>
  );
}