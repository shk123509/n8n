import { Handle, Position } from 'reactflow';
import { Bot, Cpu, Zap, HeartPulse, Sprout, Scale, Fingerprint } from 'lucide-react';

const icons = {
  "Coding Assistant": <Cpu size={18} className="text-blue-400" />,
  "Medical AI": <HeartPulse size={18} className="text-rose-400" />,
  "Agri Expert": <Sprout size={18} className="text-emerald-400" />,
  "Legal Advice": <Scale size={18} className="text-amber-400" />,
  "Classifier / Router": <Fingerprint size={18} className="text-indigo-400" />,
  "General AI": <Bot size={18} className="text-slate-400" />,
  "🤖 AI Agent (Master)": <Zap size={20} className="text-blue-500 fill-blue-500" />
};

export default function AIAgentNode({ data, selected }) {
  const isMaster = data.label.includes("Master");

  return (
    <div className={`relative group transition-all duration-300 ${selected ? 'scale-105' : 'scale-100'}`}>
      {/* Background Glow */}
      <div className={`absolute -inset-0.5 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 ${isMaster ? 'bg-blue-600' : 'bg-slate-400'}`}></div>
      
      <div className={`relative px-5 py-4 bg-white/90 backdrop-blur-xl border-2 rounded-2xl shadow-2xl min-w-[200px] ${selected ? 'border-blue-500' : 'border-slate-100'}`}>
        
        <Handle type="target" position={Position.Left} className="w-3 h-3 !bg-blue-500 border-2 border-white shadow-sm" />
        
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl flex items-center justify-center ${isMaster ? 'bg-blue-50 shadow-inner' : 'bg-slate-50'}`}>
            {icons[data.label] || <Bot size={18} />}
          </div>
          
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] leading-none mb-1">
              {isMaster ? 'Neural Core' : 'Worker Node'}
            </span>
            <span className="text-sm font-black text-slate-800 tracking-tight leading-none">
              {data.label}
            </span>
          </div>
        </div>

        {/* Status Light */}
        <div className="absolute top-3 right-3 flex h-2 w-2">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isMaster ? 'bg-blue-400' : 'bg-green-400'}`}></span>
          <span className={`relative inline-flex rounded-full h-2 w-2 ${isMaster ? 'bg-blue-500' : 'bg-green-500'}`}></span>
        </div>

        <Handle type="source" position={Position.Right} className="w-3 h-3 !bg-blue-500 border-2 border-white shadow-sm" />
      </div>
    </div>
  );
}