"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

export default function Workflows() {
  const [workflows, setWorkflows] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token"); // JWT or session token
    axios.get("http://localhost:8000/api/workflows", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setWorkflows(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>My Workflows</h1>
      <Link href="/builder/new">
        <button>Create New Workflow</button>
      </Link>
      <ul>
        {workflows.map(w => (
          <li key={w._id}>
            {w.name} - {new Date(w.updatedAt).toLocaleString()} 
            <Link href={`/builder/${w._id}`}> Edit</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
