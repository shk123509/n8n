"use client";
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans text-slate-900">
      
      {/* --- Hero Section --- */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium mb-6 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            New: AI Nodes are now live
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-slate-900 to-slate-600">
            Automate your work <br /> <span className="text-blue-600">without limits.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Connect your favorite apps, create complex workflows, and automate your daily tasks with our powerful node-based builder.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/n8n" className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all hover:shadow-2xl hover:-translate-y-1 w-full sm:w-auto">
              Get Started for Free
            </Link>
            <button className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all w-full sm:w-auto">
              View Documentation
            </button>
          </div>
        </div>
      </section>

      {/* --- Visual Workflow Preview (n8n Style) --- */}
      <section className="px-6 py-12">
        <div className="max-w-5xl mx-auto bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden relative group">
          <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <div className="mx-auto text-xs font-mono text-slate-400">my_automation_workflow.json</div>
          </div>
          
          {/* Mockup of Nodes */}
          <div className="h-[400px] bg-white relative flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
            
            <div className="flex flex-col md:flex-row items-center gap-12 z-10 p-8">
              <Node title="Google Sheets" icon="📊" color="bg-green-100 text-green-700" />
              <Connector />
              <Node title="OpenAI AI" icon="🤖" color="bg-purple-100 text-purple-700" />
              <Connector />
              <Node title="Slack Notify" icon="💬" color="bg-orange-100 text-orange-700" />
            </div>
          </div>
        </div>
      </section>

      {/* --- Features Section --- */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard 
            title="300+ Integrations" 
            desc="Connect to everything from Google Drive to custom Webhooks effortlessly." 
            icon="🔌" 
          />
          <FeatureCard 
            title="Visual Builder" 
            desc="No-code interface to build complex logic with ease and speed." 
            icon="🎨" 
          />
          <FeatureCard 
            title="Self-Hosted" 
            desc="Total control over your data. Deploy on your own servers in minutes." 
            icon="🛡️" 
          />
        </div>
      </section>
    </div>
  );
}

// --- Helper Components ---

function Node({ title, icon, color }) {
  return (
    <div className={`p-6 rounded-2xl shadow-lg border border-white flex flex-col items-center gap-3 min-w-[140px] bg-white transform group-hover:scale-105 transition-transform duration-500`}>
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${color}`}>
        {icon}
      </div>
      <span className="font-bold text-sm text-slate-700">{title}</span>
    </div>
  );
}

function Connector() {
  return (
    <div className="hidden md:flex items-center">
      <div className="h-[2px] w-12 bg-slate-200"></div>
      <div className="w-2 h-2 rounded-full bg-slate-300"></div>
    </div>
  );
}

function FeatureCard({ title, desc, icon }) {
  return (
    <div className="p-8 bg-white rounded-3xl border border-slate-100 hover:border-blue-200 hover:shadow-xl transition-all group">
      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform inline-block">{icon}</div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-slate-500 leading-relaxed">{desc}</p>
    </div>
  );
}