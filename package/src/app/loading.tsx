export default function Loading() {
  return (
    <div style={{
      display: "flex", justifyContent: "center", alignItems: "center",
      width: "100%", height: "100vh", background: "#000",
    }}>
      <div style={{
        width: "36px", height: "36px", borderRadius: "50%",
        border: "3px solid rgba(255,255,255,0.1)",
        borderTopColor: "#fe2c55",
        animation: "spin 0.8s linear infinite",
      }} />
    </div>
  );
}
