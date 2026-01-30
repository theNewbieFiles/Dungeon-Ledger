export function BackendDown() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0f0f0f",
        color: "#e5e5e5",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div style={{ maxWidth: 480, textAlign: "center" }}>
        <h1 style={{ fontSize: "1.75rem", marginBottom: "1rem" }}>
          Service Unavailable
        </h1>

        <p style={{ opacity: 0.85, lineHeight: 1.5 }}>
          We can’t reach the server right now.
          <br />
          This is likely temporary.
        </p>

        <p style={{ marginTop: "1rem", opacity: 0.65 }}>
          Please check your connection or try again shortly.
        </p>
      </div>
    </div>
  );
}