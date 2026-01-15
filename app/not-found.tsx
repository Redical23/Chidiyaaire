import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description: "The page you're looking for doesn't exist",
}

export default function NotFound() {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: "16px",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      fontFamily: "'Inter', system-ui, sans-serif",
      backgroundColor: "#f8fafc"
    }}>
      <h1 style={{ fontSize: "72px", fontWeight: "bold", color: "#3b82f6", margin: 0 }}>404</h1>
      <h2 style={{ fontSize: "24px", fontWeight: "600", color: "#0f172a", margin: 0 }}>Page not found</h2>
      <p style={{ fontSize: "16px", color: "#64748b", margin: 0 }}>
        The page you tried to access does not exist.
      </p>
      <Link
        href="/"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          backgroundColor: "#0f172a",
          color: "white",
          padding: "12px 24px",
          borderRadius: "8px",
          textDecoration: "none",
          fontWeight: "500",
          marginTop: "16px"
        }}
      >
        ← Go to Homepage
      </Link>
    </div>
  )
}
