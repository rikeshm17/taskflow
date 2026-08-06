function AccessDenied() {
  return (
    <div
      style={{
        padding: "60px 40px",
        textAlign: "center",
        fontFamily: "sans-serif",
      }}
    >
      <h1>🚫 Access Denied</h1>
      <p>You do not have permission to view this page.</p>
      <p>
        <a href="/">Go back to Dashboard</a>
      </p>
    </div>
  );
}

export default AccessDenied;