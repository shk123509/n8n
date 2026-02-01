"use client";

import { useState, useCallback, useEffect } from "react";
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
import { Save, Send, Terminal, Cpu, Zap, Play, Plus, Menu, Activity, Loader2 } from "lucide-react";

const NODE_TYPES_CONFIG = [
  { id: "coding", label: "Coding Assistant", color: "bg-blue-500" },
  { id: "doctor", label: "Medical AI", color: "bg-red-500" },
  { id: "farmer", label: "Agri Expert", color: "bg-green-500" },
  { id: "advice", label: "Legal Advice", color: "bg-purple-500" },
  { id: "classifier", label: "Classifier / Router", color: "bg-orange-500" },
  { id: "general", label: "General AI", color: "bg-gray-500" },
];

const API_URL = "http://localhost:4000/api/v1";

// --- CUSTOM NODE WITH EXECUTION STATES ---
const CustomNodeUI = ({ data, selected }) => {
  const isMaster = data.label.includes("Master");
  const isExecuting = data.status === "executing";

  return (
    <div className={`relative px-4 py-4 rounded-2xl border-2 transition-all duration-500 shadow-2xl 
      w-[240px] h-auto min-h-[90px] flex flex-col justify-center
      ${selected ? 'border-blue-500 ring-4 ring-blue-500/10' : 'border-slate-200'} 
      ${isExecuting ? 'border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.4)] scale-105' : ''}
      ${isMaster ? 'bg-slate-900 text-white' : 'bg-white text-slate-800'}`}>
      
      <Handle type="target" position={Position.Left} id="main-in" className="!w-3 !h-3 !bg-blue-500 border-2 border-white" />
      
      <div className="flex items-start gap-3 w-full overflow-hidden">
        <div className={`p-2.5 rounded-xl shrink-0 ${isMaster ? 'bg-blue-600 shadow-lg' : 'bg-slate-100'}`}>
          {isExecuting ? <Loader2 size={18} className="animate-spin text-yellow-500" /> : 
           isMaster ? <Zap size={18} fill="white" /> : <Cpu size={18} className="text-slate-600" />}
        </div>
        
        <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
          <p className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-1 flex justify-between">
            {isMaster ? 'System Core' : 'Module'}
            {isExecuting && <span className="text-yellow-500 animate-pulse font-black">RUNNING...</span>}
          </p>
          <p className="text-[13px] font-bold leading-snug break-words whitespace-normal">
            {data.label}
          </p>
        </div>
      </div>

      {isMaster && (
        <div className="absolute -bottom-5 left-0 right-0 flex justify-between px-6 pointer-events-none">
          <Handle type="source" position={Position.Bottom} id="model" className="!bg-purple-500 !static !translate-x-0" />
          <Handle type="source" position={Position.Bottom} id="memory" className="!bg-emerald-500 !static !translate-x-0" />
          <Handle type="source" position={Position.Bottom} id="tool" className="!bg-orange-500 !static !translate-x-0" />
        </div>
      )}

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

  const addNode = (label) => {
    const newNode = { id: `node-${Date.now()}`, type: "default", position: { x: 100, y: 400 }, data: { label, status: "idle" } };
    setNodes((nds) => [...nds, newNode]);
  };

  const runWorkflow = async () => {
    const token = localStorage.getItem("accessToken") || localStorage.getItem("accesstoken");
    if (!workflowId) return alert("Save workflow first!");
    
    setLogs(p => [...p, `[INIT]: Kernel Start...`]);
    setChatHistory(p => [...p, { role: "user", text: chatInput }]);
    
    // 1. Highlight Master Node
    setNodes(nds => nds.map(n => n.id === "master" ? { ...n, data: { ...n.data, status: "executing" } } : n));

    try {
      const res = await axios.post(`${API_URL}/execution`, { workflowId, input: { query: chatInput } }, { headers: { Authorization: `Bearer ${token}` } });
      
      const route = res.data.output?.route || res.data.route;
      const aiResult = res.data.output?.result || res.data.output;

      // Mapping for Flow Animation
      const routeMap = { "is_coding_question": "Coding Assistant", "coding": "Coding Assistant", "doctor": "Medical AI", "farmer": "Agri Expert", "advice": "Legal Advice", "general": "General AI" };
      const targetLabel = routeMap[route];

      // 2. Animate the Specific Flow Path
      setEdges(eds => eds.map(e => {
        const targetNode = nodes.find(n => n.id === e.target);
        if (targetNode?.data?.label === targetLabel) {
          return { ...e, animated: true, style: { stroke: '#2563eb', strokeWidth: 5, filter: 'drop-shadow(0 0 8px rgba(37,99,235,0.6))' } };
        }
        return { ...e, animated: false, style: { stroke: '#e2e8f0', strokeWidth: 1 } };
      }));

      // 3. Highlight Target Node
      setNodes(nds => nds.map(n => {
        if (n.data.label === targetLabel) return { ...n, data: { ...n.data, status: "executing" } };
        return { ...n, data: { ...n.data, status: "idle" } };
      }));

      setLogs(p => [...p, `[ROUTING]: ${route} -> Active Node: ${targetLabel}`]);
      setChatHistory(p => [...p, { role: "ai", text: aiResult }]);

      // Reset after 3 seconds
      setTimeout(() => {
        setNodes(nds => nds.map(n => ({ ...n, data: { ...n.data, status: "idle" } })));
      }, 3000);

    } catch (e) {
      setLogs(p => [...p, `[CRITICAL]: Execution Error`]);
      setNodes(nds => nds.map(n => ({ ...n, data: { ...n.data, status: "idle" } })));
    }
    setChatInput("");
  };

  return (
    <div className="flex h-screen w-full bg-[#f8fafc] overflow-hidden">
      <aside className={`${isSidebarOpen ? 'w-72' : 'w-0'} bg-white border-r flex flex-col z-20 transition-all duration-500 shadow-2xl overflow-hidden`}>
        <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-900 text-white">
          <h1 className="font-black text-xl italic flex items-center gap-2"><Activity size={20} className="text-blue-400"/> ENGINE</h1>
          <button onClick={() => setIsSidebarOpen(false)}><Menu size={18}/></button>
        </div>
        <div className="p-6 space-y-3 flex-grow overflow-y-auto bg-slate-50/50">
          {NODE_TYPES_CONFIG.map((node) => (
            <button key={node.id} onClick={() => addNode(node.label)} className="w-full flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-2xl hover:border-blue-500 hover:shadow-lg transition-all active:scale-95 group">
              <div className={`w-1.5 h-6 rounded-full ${node.color}`} />
              <span className="text-xs font-black text-slate-600">{node.label}</span>
              <Plus size={14} className="ml-auto opacity-0 group-hover:opacity-100 text-blue-500" />
            </button>
          ))}
        </div>
        <div className="p-6 border-t bg-white">
          <button onClick={async () => {
             const token = localStorage.getItem("accessToken") || localStorage.getItem("accesstoken");
             const res = await axios.post(`${API_URL}/workflow`, { name: "Live_Flow", nodes, edges, isActive: true }, { headers: { Authorization: `Bearer ${token}` } });
             setWorkflowId(res.data._id);
             alert("System Deployed!");
          }} className="w-full bg-slate-900 text-white p-4 rounded-xl font-black text-xs hover:bg-blue-600 transition-all shadow-xl flex items-center justify-center gap-2 uppercase tracking-widest">
            <Save size={16} /> Deploy & Active
          </button>
        </div>
      </aside>

      <main className="flex-grow relative bg-[#F1F5F9]">
        {!isSidebarOpen && (
          <button onClick={() => setIsSidebarOpen(true)} className="absolute top-6 left-6 z-50 bg-white p-3 rounded-2xl shadow-xl border border-slate-200 hover:scale-110 transition-all"><Menu size={20} /></button>
        )}
        <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} nodeTypes={nodeTypes} fitView>
          <Background variant="dots" gap={30} color="#cbd5e1" size={1} />
          <Controls className="!bg-white !shadow-2xl !border-none !rounded-2xl" />
          <Panel position="top-right" className="p-2">
             <div className="bg-white/80 backdrop-blur-md p-2 rounded-2xl border border-white shadow-2xl flex gap-2">
                <div className="flex items-center gap-2 px-4 border-r border-slate-200"><div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div><span className="text-[10px] font-black text-slate-500 uppercase">System Ready</span></div>
                <button onClick={runWorkflow} className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black hover:bg-blue-600 transition-all uppercase tracking-widest">
                   <Play size={12} fill="currentColor" /> Execute
                </button>
             </div>
          </Panel>
        </ReactFlow>
      </main>

      <section className="w-80 bg-[#0f172a] flex flex-col z-20 shadow-2xl border-l border-slate-800">
        <div className="p-6 border-b border-slate-800 flex items-center gap-2 bg-slate-900/50">
          <Terminal size={18} className="text-blue-400" />
          <h2 className="font-black text-xs uppercase tracking-widest text-white">Live Execution</h2>
        </div>
        <div className="flex-grow overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {chatHistory.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[90%] p-4 rounded-2xl text-[12px] font-bold ${
                msg.role === "user" ? "bg-blue-600 text-white rounded-br-none shadow-lg shadow-blue-500/20" : "bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700"
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>
        <div className="p-6 bg-slate-900/80 border-t border-slate-800">
          <div className="flex items-center gap-2 bg-slate-800 p-2 rounded-2xl border border-slate-700 focus-within:border-blue-500 transition-all mb-4">
            <input className="flex-grow bg-transparent border-none outline-none p-2 text-xs font-bold text-white" placeholder="Type prompt..." value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && runWorkflow()} />
            <button onClick={runWorkflow} className="bg-blue-600 text-white p-2.5 rounded-xl hover:scale-105 transition-all"><Send size={16} /></button>
          </div>
          <div className="bg-black/40 rounded-xl p-4 h-32 overflow-y-auto font-mono text-[9px] text-emerald-400 border border-slate-800">
            {logs.map((log, i) => <div key={i} className="mb-1.5 opacity-80 leading-relaxed font-medium tracking-tight whitespace-pre-wrap flex gap-2">
                <span className="text-slate-600 shrink-0">{i+1}</span>
                <span>{log}</span>
            </div>)}
          </div>
        </div>
      </section>
    </div>
  );
}