"use client";
import { Zap, ArrowRight, Github, Code2, Globe2, ShieldCheck, Database, LayoutPanelTop, Terminal, Sparkles, Cpu, Layers, PlayCircle } from 'lucide-react';
import Link from 'next/link';

export default function N8NStyleLanding() {
  return (
    <div className="bg-white min-h-screen font-sans text-slate-900 selection:bg-orange-100 selection:text-orange-900">
      
      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
           <div className="absolute top-[-10%] left-[10%] w-[40%] h-[40%] bg-orange-50 rounded-full blur-[120px] opacity-60"></div>
           <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-50 rounded-full blur-[120px] opacity-60"></div>
        </div>

        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] mb-10 animate-bounce">
            <Zap size={12} fill="currentColor" />
            Next-Gen AI Automation
          </div>
          
          <h1 className="text-6xl md:text-[100px] font-black leading-[0.85] tracking-tighter mb-10 text-slate-900">
            Automate <span className="text-orange-500 italic">faster</span> <br /> 
            than you code.
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto mb-14 leading-relaxed font-medium">
            The technical workflow automation tool that lets you build complex AI agents without hitting a wall. 
            <span className="text-slate-900 font-bold"> No limits. No compromises.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-24">
            <Link href={'/workflows'}>
              <button className="px-10 py-6 bg-orange-500 text-white rounded-2xl font-black text-xl hover:bg-orange-600 transition-all hover:shadow-[0_20px_40px_rgba(249,115,22,0.3)] flex items-center gap-3 active:scale-95 group">
                Build your first flow <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
              </button>
            </Link>
            <button className="px-10 py-6 bg-white text-slate-900 border-2 border-slate-200 rounded-2xl font-black text-xl hover:border-slate-900 transition-all active:scale-95 flex items-center gap-3">
              <PlayCircle size={24} /> Live Demo
            </button>
          </div>

          {/* --- WORKFLOW VISUAL (The Image You Shared) --- */}
          <div className="relative max-w-6xl mx-auto mt-20 group">
            {/* Decorative Glow behind image */}
            <div className="absolute -inset-4 bg-gradient-to-r from-orange-500 to-blue-500 rounded-[3rem] blur-2xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
            
            <div className="relative bg-white p-4 rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden animate-float">
               <img 
                 src="https://n8niostorageaccount.blob.core.windows.net/n8nio-strapi-blobs-prod/assets/Home_ITO_Ps_5a5aac3fda.webp" 
                 alt="n8n Workflow UI" 
                 className="rounded-[1.8rem] w-full h-auto object-cover"
               />
               
               {/* Overlay labels to make it look interactive */}
               <div className="absolute top-1/2 left-10 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white hidden lg:block animate-pulse-slow">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-xs font-black uppercase tracking-widest">Execution Success</span>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- STATS --- */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
          <div className="flex flex-wrap justify-center gap-16 border-t border-slate-100 pt-20">
            <StatBox number="172k+" label="GitHub Stars" />
            <StatBox number="4.9/5" label="G2 Rating" />
            <StatBox number="200k+" label="Community" />
            <StatBox number="500+" label="Integrations" />
          </div>
      </section>

      {/* --- FEATURE BENTO GRID --- */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8 bg-slate-900 rounded-[3.5rem] p-16 text-white relative overflow-hidden group">
            <div className="relative z-10 max-w-md">
                <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mb-8 shadow-xl">
                    <Terminal size={32} />
                </div>
                <h3 className="text-5xl font-black tracking-tight mb-6">Built for Developers.</h3>
                <p className="text-slate-400 text-xl leading-relaxed mb-10 font-medium">
                    The only tool that doesn't hide the complexity. Write custom JS, 
                    import NPM packages, and debug your logic node by node.
                </p>
                <button className="flex items-center gap-4 text-orange-400 font-black text-lg hover:gap-6 transition-all">
                    Read the Docs <ArrowRight size={24}/>
                </button>
            </div>
            {/* Mini Code Mockup */}
            <div className="absolute bottom-[-20px] right-[-20px] w-[60%] h-[70%] bg-[#1a1f2e] rounded-tl-3xl border-t border-l border-white/10 p-8 hidden md:block group-hover:-translate-y-6 transition-transform duration-700">
                <div className="flex gap-2 mb-6">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-orange-400"></div>
                </div>
                <pre className="font-mono text-sm text-blue-300">
                  <code>{`// AI Routing Logic
if (query.includes('code')) {
  return nodes['coding_agent'];
} else {
  return nodes['general_ai'];
}`}</code>
                </pre>
            </div>
          </div>

          <div className="lg:col-span-4 bg-slate-100 rounded-[3.5rem] p-12 text-slate-900 flex flex-col justify-between overflow-hidden relative group border border-slate-200">
            <h3 className="text-4xl font-black tracking-tight leading-tight">Total Data Privacy.</h3>
            <p className="text-slate-500 font-medium my-8 text-lg">Self-host on your own cloud. Your data never leaves your infrastructure.</p>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm font-mono text-sm font-bold flex items-center gap-3">
                <span className="text-orange-500">$</span> npm install -g n8n
            </div>
            <ShieldCheck size={200} className="absolute -bottom-10 -right-10 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000 text-slate-900" />
          </div>

          <FeatureIconCard col="lg:col-span-4" icon={<Cpu size={32} />} title="AI-Native Builder" desc="Orchestrate LLMs, Vector Stores, and Memory in a visual canvas." />
          <FeatureIconCard col="lg:col-span-4" icon={<Database size={32} />} title="No-Code DB" desc="Built-in data persistence to store execution results indefinitely." />
          <FeatureIconCard col="lg:col-span-4" icon={<Globe2 size={32} />} title="API First" desc="Trigger flows via Webhooks, Schedules, or custom API endpoints." />
        </div>
      </section>

      {/* --- FOOTER CTA --- */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto bg-orange-500 rounded-[4rem] p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-orange-200">
            <h2 className="text-5xl md:text-7xl font-black mb-10 tracking-tighter">Ready to break the <br/> limits of automation?</h2>
            <div className="flex flex-wrap justify-center gap-6 relative z-10">
                <button className="px-12 py-6 bg-slate-900 text-white rounded-2xl font-black text-xl hover:scale-105 transition-all">
                    Start Building Free
                </button>
                <button className="px-12 py-6 bg-white text-orange-500 rounded-2xl font-black text-xl hover:bg-slate-50 transition-all">
                    View Templates
                </button>
            </div>
        </div>
      </section>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}

// --- COMPONENTS ---
function StatBox({ number, label }) {
    return (
        <div className="text-center group">
            <div className="text-5xl font-black text-slate-900 mb-2 group-hover:text-orange-500 transition-colors">{number}</div>
            <div className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{label}</div>
        </div>
    )
}

function FeatureIconCard({ col, icon, title, desc }) {
    return (
        <div className={`${col} bg-white border border-slate-200 p-12 rounded-[3.5rem] hover:shadow-3xl hover:-translate-y-2 transition-all group cursor-default`}>
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-900 mb-8 group-hover:bg-orange-500 group-hover:text-white transition-all shadow-sm">
                {icon}
            </div>
            <h3 className="text-2xl font-black mb-4">{title}</h3>
            <p className="text-slate-500 font-medium text-lg leading-relaxed">{desc}</p>
        </div>
    )
}