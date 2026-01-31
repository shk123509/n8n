export default function NodeSidebar({ addNode }) {
  return (
    <div style={{ width: 200, padding: 10 }}>
      <h3>Nodes</h3>
      <button onClick={() => addNode("coding")}>Coding</button>
      <button onClick={() => addNode("doctor")}>Doctor</button>
      <button onClick={() => addNode("farmer")}>Farmer</button>
      <button onClick={() => addNode("advice")}>Advice</button>
    </div>
  );
}
