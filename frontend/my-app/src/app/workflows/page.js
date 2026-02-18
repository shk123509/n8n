"use client";

import { useState, useCallback, useEffect } from "react";
import ReactFlow, {
  addEdge, applyNodeChanges, applyEdgeChanges, Background, Controls, Handle, Position, Panel,
} from "reactflow";
import "reactflow/dist/style.css";
import axios from "axios";
import { 
  Save, Send, Terminal, Cpu, Zap, Play, Plus, Menu, 
  Activity, Loader2, Search, Globe, Code2, Stethoscope, 
  Sprout, Scale, BrainCircuit, FileText, Share2, 
  Database, SaveAll, HardDrive, Train, MapPin, Youtube,
  Briefcase, ExternalLink, Plane, CloudSun, TrendingUp, Building2, BookOpenText,
  Factory, Car, Key, Lock, RefreshCcw, Landmark
} from "lucide-react";

// --- URL Detection Helper ---
const renderMessageWithLinks = (text) => {
  if (!text || typeof text !== 'string') return <p className="whitespace-pre-wrap">{JSON.stringify(text)}</p>;
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const urls = text.match(urlRegex);
  const cleanText = text.replace(urlRegex, '').trim();
  return (
    <div className="flex flex-col gap-3">
      {cleanText && <p className="whitespace-pre-wrap">{cleanText}</p>}
      {urls && urls.map((url, index) => (
        <a key={index} href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-2 rounded-lg transition-all group w-fit no-underline">
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
  { id: "prices", label: "Stock Price Node", color: "bg-lime-500", special: true, icon: <TrendingUp size={18}/> },
  { id: "company_info", label: "Company Info Node", color: "bg-indigo-500", special: true, icon: <Building2 size={18}/> },
  { id: "course_find", label: "Course Finder Node", color: "bg-yellow-500", special: true, icon: <BookOpenText size={18}/> },
  { id: "product_price", label: "Product Prices", color: "bg-yellow-500", special: true, icon: <Factory size={18}/> },
  { id: "vehicle_info", label: "Vehicle Details", color: "bg-yellow-500", special: true, icon: <Car size={18}/> },
  { id: "expesive_track", label: "EXPENSE TRACKER", color: "bg-yellow-500", special: true, icon: <Scale size={18}/> },
  { id: "courier", label: "Courier TRACKER", color: "bg-yellow-500", special: true, icon: <Scale size={18}/> },
  { id: "bank", label: "🏦 IFSC / BANK BRANCH LOOKUP", color: "bg-gray-500", special: true, icon: <Landmark size={18}/> },
];

const API_URL = "http://localhost:4000/api/v1";

const CustomNodeUI = ({ data, selected }) => {
  const isMaster = data.label.includes("Master");
  const isExecuting = data.status === "executing";
  const isRouted = data.status === "routed"; // 👈 Orange highlight logic

  return (
    <div className={`relative px-4 py-4 rounded-2xl border-2 transition-all duration-500 shadow-2xl w-[240px] h-auto min-h-[90px] flex flex-col justify-center
      ${selected ? 'border-blue-500 ring-4 ring-blue-500/10' : 'border-slate-200'} 
      ${isExecuting ? 'border-yellow-400 shadow-[0_0_25px_rgba(250,204,21,0.5)] scale-105' : ''}
      ${isRouted ? 'border-orange-500 shadow-[0_0_25px_rgba(249,115,22,0.6)] scale-110' : ''}
      ${isMaster ? 'bg-slate-900 text-white' : 'bg-white text-slate-800'}`}>
      <Handle type="target" position={Position.Left} id="main-in" className="!w-3 !h-3 !bg-blue-500 border-2 border-white" />
      <div className="flex items-start gap-3 w-full">
        <div className={`p-2.5 rounded-xl shrink-0 transition-colors 
          ${isExecuting ? 'bg-yellow-500 text-white animate-pulse' : 
            isRouted ? 'bg-orange-500 text-white animate-bounce' :
            (isMaster ? 'bg-blue-600' : 'bg-slate-100')}`}>
          {isExecuting ? <Loader2 size={18} className="animate-spin" /> : (isMaster ? <Zap size={18} fill="white" /> : data.icon || <Cpu size={18} />)}
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <p className="text-[9px] font-black uppercase tracking-widest mb-1 opacity-40">
            {isRouted ? 'Routed' : (isMaster ? 'Kernel' : 'Module')}
          </p>
          <p className="text-[13px] font-bold leading-snug break-words">{data.label}</p>
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
  const [userKey, setUserKey] = useState("");
  const [isLocked, setIsLocked] = useState(true);

  // 📍 TERA MAP ROUTES
  const routeMap = {
    "is_coding_question": "Coding Assistant", "coding": "Coding Assistant",
    "doctor": "Medical AI", "farmer": "Agri Expert",
    "advice": "Legal Advice", "general": "General AI",
    "classifier": "Classifier / Router", "google_search": "Google Search",
    "search": "Google Search", "blogs": "Blog Writer", "published": "Blog Publisher",
    "mongoose": "Connect Mongoose", "insert": "Insert Mongoose", "read_node": "Read Mongoose",
    "get_live_train_status": "Live Train Status", "summerize_videos": "Summerize Videos",
    "job": "Realtime Job Search", "realtime_job_search": "Realtime Job Search",
    "flight": "Realtime Flight Search", "weather": "Realtime Weather",
    "weather_node": "Realtime Weather", "prices": "Stock Price Node",
    "company_info": "Company Info Node", "course_find": "Course Finder Node",
    "product_price": "Product Prices", "vehicle_info": "Vehicle Details",
    "expesive_track": "EXPENSE TRACKER", "courier": "Courier TRACKER",
    "bank" : "🏦 IFSC / BANK BRANCH LOOKUP"
  };

  useEffect(() => {
    const saved = localStorage.getItem("user_gemini_key");
    if (saved) setIsLocked(false);
  }, []);

  const handleUnlock = () => {
    if (userKey.trim().length > 10) {
      localStorage.setItem("user_gemini_key", userKey.trim());
      setIsLocked(false);
      setUserKey("");
    } else { alert("Invalid Key!"); }
  };

  const resetKey = () => { localStorage.removeItem("user_gemini_key"); setIsLocked(true); };
  const onNodesChange = useCallback((chs) => setNodes((nds) => applyNodeChanges(chs, nds)), []);
  const onEdgesChange = useCallback((chs) => setEdges((eds) => applyEdgeChanges(chs, eds)), []);
  const onConnect = useCallback((p) => setEdges((eds) => addEdge({ ...p, animated: true }, eds)), []);

  const addNode = (nodeConfig) => {
    setNodes((nds) => [...nds, { id: `node-${Date.now()}`, type: "default", position: { x: 100, y: 100 }, data: { ...nodeConfig, status: "idle" } }]);
  };

  const saveWorkflow = async () => {
    const token = localStorage.getItem("accessToken") || localStorage.getItem("accesstoken");
    if (!token) return alert("Session expired. Please login again.");
    const payload = { name: "Nexus_Agent_V10", nodes, edges, isActive: true };
    try {
      let res;
      if (workflowId) {
        res = await axios.put(`${API_URL}/workflow/${workflowId}`, payload, { headers: { Authorization: `Bearer ${token}` } });
        setLogs(p => [...p, `[SYS]: Workflow updated`]);
        alert("Workflow Updated!");
      } else {
        res = await axios.post(`${API_URL}/workflow`, payload, { headers: { Authorization: `Bearer ${token}` } });
        setWorkflowId(res.data._id);
        setLogs(p => [...p, `[SYS]: Workflow created`]);
        alert("Workflow Saved!");
      }
    } catch (e) { setLogs(p => [...p, `[ERR]: Save failed`]); }
  };

  const runWorkflow = async () => {
    const token = localStorage.getItem("accessToken") || localStorage.getItem("accesstoken");
    const savedApiKey = localStorage.getItem("user_gemini_key");
    if (!workflowId) return alert("Pehle 'Save Workflow' click karein!");
    if (!chatInput.trim()) return;

    const query = chatInput;
    setChatInput("");
    setLogs(p => [...p, `[SYS]: Engine running...`]);
    setChatHistory(p => [...p, { role: "user", text: query }]);

    // Step 1: Set Master to Executing
    setNodes(nds => nds.map(n => n.id === "master" ? { ...n, data: { ...n.data, status: "executing" } } : { ...n, data: { ...n.data, status: "idle" } }));

    try {
      const res = await axios.post(`${API_URL}/execution`, { 
        workflowId, 
        input: { query }, 
        user_api_key: savedApiKey
      }, { headers: { Authorization: `Bearer ${token}` } });
      
      const aiResponse = res.data.output?.result || "No response.";
      const backendRoute = res.data.output?.route; // "doctor", "coding" etc.
      const targetLabel = routeMap[backendRoute]; // "Medical AI", "Coding Assistant" etc.

      setLogs(p => [...p, `[SUCCESS]: Routed to ${targetLabel || 'General'}`]);
      setChatHistory(p => [...p, { role: "ai", text: aiResponse }]);

      // Step 2: Highlight Routed Node
      setNodes(nds => nds.map(n => {
        if (n.data.label === targetLabel) return { ...n, data: { ...n.data, status: "routed" } };
        return { ...n, data: { ...n.data, status: "idle" } };
      }));

    } catch (e) {
        setLogs(p => [...p, `[ERR]: Execution failed`]);
    } finally {
      // Step 3: Master idle and keep route highlight for 3 seconds
      setTimeout(() => {
        setNodes(nds => nds.map(n => ({ ...n, data: { ...n.data, status: "idle" } })));
      }, 3000);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#f8fafc] overflow-hidden text-slate-900 relative">
      {isLocked && (
        <div className="fixed inset-0 z-[999] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full border border-slate-200 text-center">
            <div className="w-12 h-12 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4"><Lock size={24}/></div>
            <h2 className="text-xl font-black mb-2">Unlock Nexus Engine</h2>
            <input type="password" placeholder="AIza..." className="w-full bg-slate-100 border-2 border-slate-200 rounded-xl p-4 text-sm font-bold mb-4 outline-none focus:border-cyan-500 transition-all" value={userKey} onChange={(e) => setUserKey(e.target.value)} />
            <button onClick={handleUnlock} className="w-full bg-slate-900 text-white font-black py-4 rounded-xl hover:bg-cyan-600 transition-all shadow-lg">Unlock System</button>
          </div>
        </div>
      )}

      <aside className={`${isSidebarOpen ? 'w-72' : 'w-0'} bg-white border-r flex flex-col z-20 transition-all duration-500 overflow-hidden shadow-2xl`}>
        <div className="p-6 border-b bg-slate-900 text-white flex items-center justify-between">
          <h1 className="font-black text-xl italic flex items-center gap-2 tracking-tighter"><Activity size={20} className="text-cyan-400"/> NEXUS_CORE</h1>
          <button onClick={() => setIsSidebarOpen(false)}><Menu size={18}/></button>
        </div>
        <div className="p-6 space-y-3 flex-grow overflow-y-auto bg-slate-50/50">
          {NODE_TYPES_CONFIG.map((node) => (
            <button key={node.id} onClick={() => addNode(node)} className={`w-full flex items-center gap-3 p-4 border rounded-2xl transition-all bg-white hover:border-cyan-500 text-left`}>
              <div className={`w-2 h-6 rounded-full shrink-0 ${node.color}`} />
              <span className="text-[11px] font-black text-slate-700">{node.label}</span>
              <div className="ml-auto text-slate-400">{node.icon}</div>
            </button>
          ))}
        </div>
        <div className="p-6 border-t bg-slate-50 space-y-2">
            <button onClick={resetKey} className="w-full bg-white border border-red-200 text-red-500 p-3 rounded-xl font-black text-[9px] uppercase tracking-widest shadow-sm hover:bg-red-50 flex items-center justify-center gap-2"><RefreshCcw size={14} /> Update API Key</button>
            <button onClick={saveWorkflow} className="w-full bg-slate-900 text-white p-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-2"><Save size={16} /> Save Workflow</button>
        </div>
      </aside>

      <main className="flex-grow relative bg-[#F1F5F9]">
        {!isSidebarOpen && <button onClick={() => setIsSidebarOpen(true)} className="absolute top-6 left-6 z-50 bg-white p-3 rounded-2xl shadow-xl border border-slate-200"><Menu size={20} /></button>}
        <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} nodeTypes={nodeTypes} fitView>
          <Background variant="dots" gap={30} color="#cbd5e1" size={1} />
          <Controls className="!bg-white !shadow-2xl !border-none !rounded-2xl" />
          <Panel position="top-right" className="p-2">
             <button onClick={runWorkflow} className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-2xl"><Play size={12} fill="currentColor" /> Run Engine</button>
          </Panel>
        </ReactFlow>
      </main>

      <section className="w-80 bg-[#0f172a] flex flex-col z-20 shadow-2xl border-l border-slate-800">
        <div className="p-6 border-b border-slate-800 flex items-center gap-2 text-white bg-slate-900/50">
          <Terminal size={18} className="text-cyan-400" />
          <h2 className="font-black text-xs uppercase tracking-widest">System Console</h2>
        </div>
        <div className="flex-grow overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {chatHistory.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[95%] p-4 rounded-2xl text-[12px] font-bold ${msg.role === "user" ? "bg-cyan-600 text-white rounded-br-none" : "bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700"}`}>
                {msg.role === "ai" ? renderMessageWithLinks(msg.text) : msg.text}
              </div>
            </div>
          ))}
        </div>
        <div className="p-6 bg-slate-900/80 border-t border-slate-800">
          <div className="flex items-center gap-2 bg-slate-800 p-2 rounded-2xl border border-slate-700 mb-4 focus-within:border-cyan-500 transition-all">
            <input className="flex-grow bg-transparent border-none outline-none p-2 text-xs font-bold text-white" placeholder="Ask Nexus..." value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && runWorkflow()} />
            <button onClick={runWorkflow} className="bg-cyan-600 text-white p-2.5 rounded-xl"><Send size={16} /></button>
          </div>
          <div className="bg-black/40 rounded-xl p-4 h-32 overflow-y-auto font-mono text-[9px] border border-slate-800 custom-scrollbar">
            {logs.map((log, i) => (
              <div key={i} className="mb-2 opacity-80 flex gap-2"><span className="text-slate-700">{i+1}</span><span className={`break-all ${log.includes('ERR') ? 'text-red-400' : 'text-cyan-400'}`}>{log}</span></div>
            ))}
          </div>
        </div>
      </section>
      <style jsx global>{`.custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #22d3ee; border-radius: 10px; }`}</style>
    </div>
  );
}