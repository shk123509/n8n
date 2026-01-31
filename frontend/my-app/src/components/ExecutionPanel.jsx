export default function ExecutionPanel({ execution }) {
  if (!execution) return <div style={{ width: 300 }}>No execution</div>;

  return (
    <div style={{ width: 300, borderLeft: "1px solid #ccc", padding: 10 }}>
      <h3>Status: {execution.status}</h3>

      <pre>{execution.output}</pre>

      <h4>Logs</h4>
      {execution.logs?.map((l, i) => (
        <div key={i}>
          [{l.nodeId}] {l.message}
        </div>
      ))}
    </div>
  );
}
