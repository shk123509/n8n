"use client";

import { useState, useCallback } from "react";
import ReactFlow, {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Background,
  Controls,
  Handle,
  Position,
  Panel,
} from "reactflow";
import "reactflow/dist/style.css";
import axios from "axios";
import { 
  Save, Send, Terminal, Cpu, Zap, Play, Plus, Menu, 
  Activity, Loader2, Search, Globe, Code2, Stethoscope, 
  Sprout, Scale, BrainCircuit, FileText, Share2, 
  Database, SaveAll, HardDrive, Train, MapPin, Youtube,
  Briefcase, ExternalLink, Plane, CloudSun,TrendingUp
} from "lucide-react";

// --- FIXED URL Detection Helper ---
const renderMessageWithLinks = (text) => {
  // Check if text is valid string to prevent .match error
  if (!text || typeof text !== 'string') {
    return <p className="whitespace-pre-wrap">{JSON.stringify(text)}</p>;
  }

  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const urls = text.match(urlRegex);
  const cleanText = text.replace(urlRegex, '').trim();

  return (
    <div className="flex flex-col gap-3">
      {cleanText && <p className="whitespace-pre-wrap">{cleanText}</p>}
      {urls && urls.map((url, index) => (
        <a 
          key={index}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-2 rounded-lg transition-all group w-fit no-underline"
        >
          <span className="text-[10px] truncate max-w-[180px] text-blue-300">Open Resource</span>
          <ExternalLink size={12} className="text-white group-hover:scale-110 transition-transform" />
        </a>
      ))}
    </div>
  );
};

const NODE_TYPES_CONFIG = [
  { id: "coding", label: "Coding Assistant", color: "bg-blue-500", icon: <Code2 size={18}/> },
  { id: "doctor", label: "Medical AI", color: "bg-red-500", icon: <Stethoscope size={18}/> },
  { id: "farmer", label: "Agri Expert", color: "bg-green-500", icon: <Sprout size={18}/> },
  { id: "advice", label: "Legal Advice", color: "bg-purple-500", icon: <Scale size={18}/> },
  { id: "classifier", label: "Classifier / Router", color: "bg-orange-500", icon: <BrainCircuit size={18}/> },
  { id: "general", label: "General AI", color: "bg-gray-500", icon: <Cpu size={18}/> },
  { id: "google_search", label: "Google Search", color: "bg-amber-500", special: true, icon: <Search size={18}/> },
  { id: "blogs", label: "Blog Writer", color: "bg-indigo-500", special: true, icon: <FileText size={18}/> },
  { id: "published", label: "Blog Publisher", color: "bg-emerald-500", special: true, icon: <Share2 size={18}/> },
  { id: "mongoose", label: "Connect Mongoose", color: "bg-emerald-600", special: true, icon: <Database size={18}/> },
  { id: "insert", label: "Insert Mongoose", color: "bg-emerald-500", special: true, icon: <SaveAll size={18}/> },
  { id: "read_node", label: "Read Mongoose", color: "bg-teal-500", special: true, icon: <HardDrive size={18}/> },
  { id: "get_live_train_status", label: "Live Train Status", color: "bg-cyan-500", special: true, icon: <Train size={18}/> },
  { id: "summerize_videos", label: "Summerize Videos", color: "bg-red-600", special: true, icon: <Youtube size={18}/> },
  { id: "job", label: "Realtime Job Search", color: "bg-indigo-600", special: true, icon: <Briefcase size={18}/> },
  { id: "flight", label: "Realtime Flight Search", color: "bg-sky-500", special: true, icon: <Plane size={18}/> },
  { id: "weather_node", label: "Realtime Weather", color: "bg-cyan-400", special: true, icon: <CloudSun size={18}/> },
  { id: "prices", label: "Stock Price Node", color: "bg-cyan-400", special: true, icon: <TrendingUp size={18}/> },
];

const API_URL = "http://localhost:4000/api/v1";

const CustomNodeUI = ({ data, selected }) => {
  const label = data.label.toLowerCase();
  const isMaster = data.label.includes("Master");
  const isSearch = data.label.includes("Google Search");
  const isTrain = label.includes("train");
  const isVideo = label.includes("summerize") || label.includes("video");
  const isJob = label.includes("job");
  const isFlight = label.includes("flight");
  const isWeather = label.includes("weather");
  const isDB = label.includes("mongoose") || label.includes("read");
  const isExecuting = data.status === "executing";

  const getContainerStyles = () => {
    if (isMaster) return 'bg-slate-900 text-white border-slate-800';
    if (isSearch) return 'bg-amber-50 text-slate-900 border-amber-200';
    if (isVideo) return 'bg-rose-50 text-rose-900 border-rose-200 shadow-rose-100';
    if (isJob) return 'bg-indigo-50 text-indigo-900 border-indigo-200 shadow-indigo-100';
    if (isFlight) return 'bg-sky-50 text-sky-900 border-sky-200 shadow-sky-100';
    if (isWeather) return 'bg-cyan-50 text-cyan-900 border-cyan-200 shadow-cyan-100';
    if (isTrain) return 'bg-cyan-50 text-cyan-900 border-cyan-200 shadow-cyan-100';
    if (isDB) return 'bg-emerald-50 text-emerald-900 border-emerald-200 shadow-emerald-100';
    return 'bg-white text-slate-800 border-slate-200';
  };

  const getIconStyles = () => {
    if (isExecuting) return 'bg-yellow-500 text-white animate-pulse';
    if (isMaster) return 'bg-blue-600 text-white';
    if (isWeather) return 'bg-white text-cyan-600 border border-cyan-100';
    if (isFlight) return 'bg-white text-sky-600 border border-sky-100';
    return 'bg-slate-100 text-slate-600';
  };

  return (
    <div className={`relative px-4 py-4 rounded-2xl border-2 transition-all duration-500 shadow-2xl 
      w-[240px] h-auto min-h-[90px] flex flex-col justify-center
      ${selected ? 'border-blue-500 ring-4 ring-blue-500/10' : ''} 
      ${isExecuting ? 'border-yellow-400 shadow-[0_0_25px_rgba(250,204,21,0.5)] scale-105' : ''}
      ${getContainerStyles()}`}>
      
      <Handle type="target" position={Position.Left} id="main-in" className="!w-3 !h-3 !bg-blue-500 border-2 border-white" />
      
      <div className="flex items-start gap-3 w-full">
        <div className={`p-2.5 rounded-xl shrink-0 shadow-sm transition-colors ${getIconStyles()}`}>
          {isExecuting ? <Loader2 size={18} className="animate-spin" /> : 
           isMaster ? <Zap size={18} fill="white" /> : 
           data.icon ? data.icon : <Cpu size={18} />}
        </div>
        
        <div className="flex flex-col min-w-0 flex-1">
          <p className={`text-[9px] font-black uppercase tracking-widest mb-1 flex justify-between 
            ${isWeather ? 'text-cyan-600' : isFlight ? 'text-sky-600' : 'opacity-40'}`}>
            {isMaster ? 'Kernel' : isWeather ? 'Atmosphere' : 'Module'}
            {isExecuting && <span className="text-yellow-500 animate-pulse font-black italic">PROCESSING</span>}
          </p>
          <p className="text-[13px] font-bold leading-snug break-words whitespace-normal">
            {data.label}
          </p>
        </div>
      </div>

      <Handle type="source" position={Position.Right} id="main-out" className="!w-3 !h-3 !bg-blue-500 border-2 border-white" />
    </div>
  );
};

const nodeTypes = { default: CustomNodeUI };

export default function BuilderPage() {
  const [nodes, setNodes] = useState([{ id: "master", type: "default", data: { label: "🤖 AI Agent (Master)", status: "idle" }, position: { x: 450, y: 200 } }]);
  const [edges, setEdges] = useState([]);
  const [workflowId, setWorkflowId] = useState(null);
  const [chatInput, setChatInput] = useState("");
  const [logs, setLogs] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const onNodesChange = useCallback((chs) => setNodes((nds) => applyNodeChanges(chs, nds)), []);
  const onEdgesChange = useCallback((chs) => setEdges((eds) => applyEdgeChanges(chs, eds)), []);
  
  const onConnect = useCallback((params) => {
    setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#cbd5e1', strokeWidth: 2 } }, eds));
  }, []);

  const addNode = (nodeConfig) => {
    const newNode = { 
      id: `node-${Date.now()}`, 
      type: "default", 
      position: { x: 100, y: 100 }, 
      data: { label: nodeConfig.label, status: "idle", icon: nodeConfig.icon } 
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const runWorkflow = async () => {
    const token = localStorage.getItem("accessToken") || localStorage.getItem("accesstoken");
    if (!workflowId) return alert("Deploy workflow first!");
    if (!chatInput.trim()) return;

    const query = chatInput;
    setChatInput("");
    setLogs(p => [...p, `[SYS]: Processing request...`]);
    setChatHistory(p => [...p, { role: "user", text: query }]);
    
    setNodes(nds => nds.map(n => n.id === "master" ? { ...n, data: { ...n.data, status: "executing" } } : n));

    try {
      const res = await axios.post(`${API_URL}/execution`, { workflowId, input: { query } }, { headers: { Authorization: `Bearer ${token}` } });
      
      const route = res.data.output?.route || res.data.route;
      const aiResult = res.data.output?.result || res.data.output || "Done.";

      const routeMap = { 
        "is_coding_question": "Coding Assistant", "coding": "Coding Assistant", 
        "doctor": "Medical AI", "farmer": "Agri Expert", 
        "advice": "Legal Advice", "general": "General AI",
        "google_search": "Google Search", "search": "Google Search",
        "blogs" : "Blog Writer", "published" : "Blog Publisher",
        "mongoose" : "Connect Mongoose", "insert" : "Insert Mongoose", "read_node" : "Read Mongoose",
        "get_live_train_status": "Live Train Status",
        "summerize_videos": "Summerize Videos",
        "job": "Realtime Job Search",
        "realtime_job_search": "Realtime Job Search",
        "flight": "Realtime Flight Search",
        "weather": "Realtime Weather",
        "weather_node": "Realtime Weather",
        "prices" : "Stock Price Node"
      };

      const targetLabel = routeMap[route];

      setEdges(eds => eds.map(e => {
        const targetNode = nodes.find(n => n.id === e.target);
        if (targetNode?.data?.label === targetLabel) {
          const color = targetLabel === "Realtime Weather" ? '#22d3ee' : '#0ea5e9';
          return { ...e, animated: true, style: { stroke: color, strokeWidth: 5, filter: `drop-shadow(0 0 12px ${color})` } };
        }
        return { ...e, animated: false, style: { stroke: '#e2e8f0', strokeWidth: 1 } };
      }));

      setNodes(nds => nds.map(n => {
        if (n.data.label === targetLabel) return { ...n, data: { ...n.data, status: "executing" } };
        return { ...n, data: { ...n.data, status: "idle" } };
      }));

      setLogs(p => [...p, `[EXEC]: Handled by ${targetLabel || 'Default'}`]);
      setChatHistory(p => [...p, { role: "ai", text: aiResult }]);

      setTimeout(() => {
        setNodes(nds => nds.map(n => ({ ...n, data: { ...n.data, status: "idle" } })));
      }, 4000);

    } catch (e) {
      setLogs(p => [...p, `[ERR]: Connection failed`]);
      setNodes(nds => nds.map(n => ({ ...n, data: { ...n.data, status: "idle" } })));
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#f8fafc] overflow-hidden text-slate-900">
      <aside className={`${isSidebarOpen ? 'w-72' : 'w-0'} bg-white border-r flex flex-col z-20 transition-all duration-500 shadow-2xl overflow-hidden`}>
        <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-900 text-white">
          <h1 className="font-black text-xl italic flex items-center gap-2 tracking-tighter"><Activity size={20} className="text-cyan-400"/> NEXUS_CORE</h1>
          <button onClick={() => setIsSidebarOpen(false)}><Menu size={18}/></button>
        </div>
        <div className="p-6 space-y-3 flex-grow overflow-y-auto bg-slate-50/50">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Module Library</p>
          {NODE_TYPES_CONFIG.map((node) => (
            <button key={node.id} onClick={() => addNode(node)} className={`w-full flex items-center gap-3 p-4 border rounded-2xl transition-all active:scale-95 group shadow-sm bg-white border-slate-200 hover:border-cyan-500 text-left`}>
              <div className={`w-2 h-6 rounded-full shrink-0 ${node.color}`} />
              <span className="text-[11px] font-black text-slate-700 truncate">{node.label}</span>
              <div className="ml-auto text-slate-400 group-hover:text-cyan-600">
                {node.icon}
              </div>
            </button>
          ))}
        </div>
        <div className="p-6 border-t bg-white">
          <button onClick={async () => {
             const token = localStorage.getItem("accessToken") || localStorage.getItem("accesstoken");
             if (!token) return alert("Login First!");
             try {
               const res = await axios.post(`${API_URL}/workflow`, { name: "Agent_V8_Final", nodes, edges, isActive: true }, { headers: { Authorization: `Bearer ${token}` } });
               setWorkflowId(res.data._id);
               alert("Workflow Live!");
             } catch(e) { alert("Save failed."); }
          }} className="w-full bg-slate-900 text-white p-4 rounded-xl font-black text-xs hover:bg-cyan-600 transition-all shadow-xl flex items-center justify-center gap-2 uppercase tracking-widest">
            <Save size={16} /> Save Workflow
          </button>
        </div>
      </aside>

      <main className="flex-grow relative bg-[#F1F5F9]">
        {!isSidebarOpen && (
          <button onClick={() => setIsSidebarOpen(true)} className="absolute top-6 left-6 z-50 bg-white p-3 rounded-2xl shadow-xl border border-slate-200"><Menu size={20} /></button>
        )}
        <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} nodeTypes={nodeTypes} fitView>
          <Background variant="dots" gap={30} color="#cbd5e1" size={1} />
          <Controls className="!bg-white !shadow-2xl !border-none !rounded-2xl" />
          <Panel position="top-right" className="p-2">
             <div className="bg-white/90 backdrop-blur-md p-2 rounded-2xl border border-white shadow-2xl flex gap-2">
                <button onClick={runWorkflow} className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black hover:bg-cyan-600 transition-all uppercase tracking-widest">
                   <Play size={12} fill="currentColor" /> Run Engine
                </button>
             </div>
          </Panel>
        </ReactFlow>
      </main>

      <section className="w-80 bg-[#0f172a] flex flex-col z-20 shadow-2xl border-l border-slate-800">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-2 text-white">
            <Terminal size={18} className="text-cyan-400" />
            <h2 className="font-black text-xs uppercase tracking-widest">System Console</h2>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {chatHistory.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[95%] p-4 rounded-2xl text-[12px] font-bold shadow-sm break-words whitespace-pre-wrap leading-relaxed
                ${msg.role === "user" ? "bg-cyan-600 text-white rounded-br-none" : "bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700"}`}>
                {msg.role === "ai" ? renderMessageWithLinks(msg.text) : msg.text}
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 bg-slate-900/80 border-t border-slate-800">
          <div className="flex items-center gap-2 bg-slate-800 p-2 rounded-2xl border border-slate-700 mb-4 focus-within:border-cyan-500 transition-all">
            <input className="flex-grow bg-transparent border-none outline-none p-2 text-xs font-bold text-white placeholder:text-slate-600" placeholder="Type here..." value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && runWorkflow()} />
            <button onClick={runWorkflow} className="bg-cyan-600 text-white p-2.5 rounded-xl hover:scale-105 transition-all"><Send size={16} /></button>
          </div>
          <div className="bg-black/40 rounded-xl p-4 h-32 overflow-y-auto font-mono text-[9px] border border-slate-800 custom-scrollbar">
            {logs.map((log, i) => (
              <div key={i} className="mb-2 opacity-80 flex gap-2">
                <span className="text-slate-700">{i+1}</span>
                <span className={`break-all ${log.includes('ERR') ? 'text-red-400' : 'text-cyan-400'}`}>{log}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #22d3ee; border-radius: 10px; }
      `}</style>
    </div>
  );
}