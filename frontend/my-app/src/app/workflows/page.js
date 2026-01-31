"use client";

import { useState, useCallback } from "react";
import ReactFlow, {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Background,
  Controls,
} from "reactflow";
import "reactflow/dist/style.css";
import axios from "axios";
import { Save, Send, Terminal, Cpu, MessageSquare, Menu } from "lucide-react";

const NODE_TYPES = [
  { id: "coding", label: "Coding Assistant", color: "bg-blue-500" },
  { id: "doctor", label: "Medical AI", color: "bg-red-500" },
  { id: "farmer", label: "Agri Expert", color: "bg-green-500" },
  { id: "advice", label: "Legal Advice", color: "bg-purple-500" },
  { id: "classifier", label: "Classifier / Router", color: "bg-orange-500" },
  { id: "general", label: "General AI", color: "bg-gray-500" },
];

const API_URL = "http://localhost:4000/api/v1";

export default function BuilderPage() {
  const [nodes, setNodes] = useState([
    {
      id: "ai-agent-main",
      type: "default",
      data: { label: "🤖 AI Agent (Master)" },
      position: { x: 400, y: 200 },
      style: { background: "#2563eb", color: "#fff", fontWeight: "bold", borderRadius: "10px", width: 150 }
    }
  ]);
  const [edges, setEdges] = useState([]);
  const [workflowName, setWorkflowName] = useState("My New Workflow");
  const [workflowId, setWorkflowId] = useState(null);
  const [chatInput, setChatInput] = useState("");
  const [logs, setLogs] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const onNodesChange = useCallback((chs) => setNodes((nds) => applyNodeChanges(chs, nds)), []);
  const onEdgesChange = useCallback((chs) => setEdges((eds) => applyEdgeChanges(chs, eds)), []);
  const onConnect = useCallback((params) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)), []);

  const addNode = (typeLabel) => {
    const newNode = {
      id: `node-${Date.now()}`,
      type: "default",
      position: { x: 100, y: 100 },
      data: { label: typeLabel },
      className: "shadow-md border-2 border-slate-200 rounded-lg p-2 bg-white"
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const saveWorkflow = async () => {
    // Check both keys to be safe
    const token = localStorage.getItem("accessToken") || localStorage.getItem("accesstoken");
    if (!token) return alert("Please Login again.");

    try {
      const res = await axios.post(`${API_URL}/workflow`,
        {
          name: workflowName,
          nodes,
          edges,
          isActive: true
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWorkflowId(res.data._id);
      alert("Workflow Saved & Activated!");
      setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Workflow Saved: ${res.data._id}`]);
    } catch (err) {
      console.error("Save Error:", err.response?.data);
      alert(err.response?.data?.message || "Save failed");
    }
  };

  const runWorkflow = async () => {
    const token = localStorage.getItem("accessToken") || localStorage.getItem("accesstoken");
    if (!token) return alert("Please Login again.");
    if (!workflowId) return alert("Please save workflow first to activate it.");
    if (!chatInput.trim()) return;

    const currentInput = chatInput;
    setChatInput("");
    setChatHistory((prev) => [...prev, { role: "user", text: currentInput }]);
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] Calling AI Engine...`]);

    try {
      // ✅ URL FIXED: Match backend router.post("/")
      const res = await axios.post(`${API_URL}/execution`,
        {
          workflowId: workflowId,
          input: { query: currentInput }
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const aiResult = res.data.output?.result || res.data.output || "No response from AI Engine";
      const route = res.data.output?.route;

      // Map route to Node Label
      const routeToLabel = {
        "is_coding_question": "Coding Assistant",
        "is_doctor_question": "Medical AI",
        "is_farmer_question": "Agri Expert",
        "is_advice_question": "Legal Advice",
        "is_general_question": "General AI",
        "coding": "Coding Assistant",
        "doctor": "Medical AI",
        "farmer": "Agri Expert",
        "advice": "Legal Advice",
        "general": "General AI"
      };

      // Animate Edge if Layout Found
      if (route) {
        const targetLabel = routeToLabel[route];

        setEdges((eds) => eds.map(e => {
          // Find target node that has this label
          const targetNode = nodes.find(n => n.id === e.target);
          const isTarget = targetNode?.data?.label === targetLabel;

          // Highlight ONLY the edge connected to the target node
          if (isTarget) {
            return { ...e, animated: true, style: { stroke: '#2563eb', strokeWidth: 3 } };
          }
          // Reset others
          return { ...e, animated: false, style: { stroke: '#b1b1b7', strokeWidth: 1 } };
        }));

        // Highlight the classified node path
        setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] 🔀 Routed to: ${targetLabel || route}`]);
      }

      setChatHistory((prev) => [...prev, { role: "ai", text: aiResult }]);
      setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] Execution Successful`]);

    } catch (err) {
      console.error("Execution Error:", err.response?.data);
      const errMsg = err.response?.data?.message || "Execution Failed";

      setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] Error: ${JSON.stringify(err.response?.data || err.message)}`]);
      setChatHistory((prev) => [...prev, { role: "ai", text: `Error: ${errMsg}` }]);
      alert(`Execution Error Detail: ${JSON.stringify(err.response?.data || err.message)}`);
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden text-slate-900">

      {/* SIDEBAR */}
      <aside className={`${isSidebarOpen ? 'w-72 p-6' : 'w-0 p-0 overflow-hidden'} bg-white border-r flex flex-col z-20 shadow-sm transition-all duration-300`}>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Cpu className="text-blue-600" size={28} />
            <h1 className="text-xl font-bold tracking-tight whitespace-nowrap">AI Builder</h1>
          </div>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <Menu size={20} className="text-slate-600" />
          </button>
        </div>

        <p className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-widest">Available Nodes</p>
        <div className="space-y-3 flex-grow overflow-y-auto pr-2">
          {NODE_TYPES.map((node) => (
            <button
              key={node.id}
              onClick={() => addNode(node.label)}
              className="w-full flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-all text-sm font-semibold group"
            >
              <div className={`w-3 h-3 rounded-full ${node.color} group-hover:scale-110 transition-transform`}></div>
              {node.label}
            </button>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-slate-100">
          <input
            className="w-full p-3 bg-slate-100 rounded-xl text-sm mb-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="Workflow Name"
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
          />
          <button
            onClick={saveWorkflow}
            className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white p-3 rounded-xl font-bold hover:bg-slate-800 active:scale-95 transition-all shadow-lg shadow-slate-200"
          >
            <Save size={18} /> Save Workflow
          </button>
        </div>
      </aside>

      {/* CANVAS AREA */}
      <main className="flex-grow relative bg-[#F8FAFC]">
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="absolute top-4 left-4 z-50 bg-white p-2 rounded-lg shadow-md border hover:bg-slate-50 transition-all"
          >
            <Menu size={20} className="text-slate-600" />
          </button>
        )}
        <div className="w-full h-full"> {/* Parent container fix */}
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
          >
            <Background variant="dots" gap={20} color="#cbd5e1" />
            <Controls />
          </ReactFlow>
        </div>
      </main>

      {/* CHAT PANEL */}
      <section className="w-96 bg-white border-l flex flex-col z-20 shadow-xl">
        <div className="p-5 border-b flex justify-between items-center bg-slate-50">
          <h2 className="font-bold text-slate-700 flex items-center gap-2"><Terminal size={18} className="text-blue-600" /> Test Console</h2>
          {workflowId && <span className="text-[10px] font-mono bg-blue-100 text-blue-700 px-2 py-1 rounded">ID: {workflowId.slice(-4)}</span>}
        </div>

        <div className="flex-grow overflow-y-auto p-5 space-y-4">
          {chatHistory.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-40">
              <MessageSquare size={48} />
              <p className="text-xs mt-2 italic font-medium">No messages yet</p>
            </div>
          )}
          {chatHistory.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${msg.role === "user"
                ? "bg-blue-600 text-white rounded-br-none"
                : "bg-slate-100 text-slate-800 border rounded-bl-none"
                }`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        <div className="p-5 border-t bg-white">
          <div className="flex items-center gap-2 bg-slate-100 p-2 rounded-2xl focus-within:ring-2 focus-within:ring-blue-400 transition-all shadow-inner">
            <input
              className="flex-grow bg-transparent border-none outline-none p-2 text-sm text-slate-700"
              placeholder="Type your prompt..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && runWorkflow()}
            />
            <button
              onClick={runWorkflow}
              className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 active:scale-90 transition-all shadow-md shadow-blue-100"
            >
              <Send size={18} />
            </button>
          </div>
          <div className="mt-4 bg-slate-900 rounded-lg p-3 h-24 overflow-y-auto font-mono text-[10px] text-green-400 shadow-inner custom-scrollbar">
            {logs.map((log, i) => <div key={i} className="mb-1 opacity-80">{log}</div>)}
          </div>
        </div>
      </section>
    </div>
  );
}