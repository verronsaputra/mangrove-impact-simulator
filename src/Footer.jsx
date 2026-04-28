export default function Footer() {
  return (
    <footer style={{
      width: "100%",
      padding: "32px 24px",
      textAlign: "center",
      borderTop: "1px solid rgba(0,0,0,0.08)",
      marginTop: "48px",
    }}>
      <p style={{
        fontSize: "13px",
        color: "#888",
        margin: "0 0 8px",
        letterSpacing: "0.03em",
      }}>
        Created by
      </p>
      <a
        href="https://instagram.com/tarisharamadhiya"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "14px",
          fontWeight: 600,
          color: "#1d9e75",
          textDecoration: "none",
          letterSpacing: "0.02em",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
          <circle cx="12" cy="12" r="4"/>
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
        </svg>
        @tarisharamadhiya
      </a>
    </footer>
  );
}
