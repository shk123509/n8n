import { useState } from "react";
// import { authFetch } from "@/utils/api";

export default function ChatBot({ execution }) {
  const [msg, setMsg] = useState("");
  const [reply, setReply] = useState("");

  const send = async () => {
    const res = await fetch("http://127.0.0.1:8000/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: msg })
    });

    const data = await res.json();
    setReply(data.result);
  };

  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0 }}>
      <input value={msg} onChange={(e) => setMsg(e.target.value)} />
      <button onClick={send}>Send</button>
      <div>{reply}</div>
    </div>
  );
}
