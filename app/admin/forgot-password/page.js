"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        try {
            const res = await fetch("/api/admin/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage("If an account exists with this email, you will receive a password reset link shortly.");
            } else {
                setError(data.error || "Failed to send reset email");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#0f172a",
            fontFamily: "'Inter', system-ui, sans-serif",
            padding: "20px"
        }}>
            <div style={{
                width: "100%",
                maxWidth: "400px",
                backgroundColor: "#1e293b",
                borderRadius: "16px",
                padding: "40px",
                boxShadow: "0 25px 50px rgba(0,0,0,0.25)"
            }}>
                <div style={{ textAlign: "center", marginBottom: "32px" }}>
                    <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "white", marginBottom: "8px" }}>
                        Reset Password
                    </h1>
                    <p style={{ color: "#94a3b8", fontSize: "14px" }}>
                        Enter your email to receive a reset link
                    </p>
                </div>

                {message && (
                    <div style={{
                        padding: "12px",
                        backgroundColor: "rgba(34, 197, 94, 0.1)",
                        border: "1px solid rgba(34, 197, 94, 0.3)",
                        borderRadius: "8px",
                        color: "#4ade80",
                        fontSize: "14px",
                        marginBottom: "20px",
                        textAlign: "center"
                    }}>
                        {message}
                    </div>
                )}

                {error && (
                    <div style={{
                        padding: "12px",
                        backgroundColor: "rgba(239, 68, 68, 0.1)",
                        border: "1px solid rgba(239, 68, 68, 0.3)",
                        borderRadius: "8px",
                        color: "#f87171",
                        fontSize: "14px",
                        marginBottom: "20px",
                        textAlign: "center"
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: "24px" }}>
                        <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#94a3b8", marginBottom: "8px" }}>
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@chidiyaai.com"
                            required
                            style={{
                                width: "100%",
                                padding: "14px 16px",
                                backgroundColor: "#0f172a",
                                border: "1px solid #334155",
                                borderRadius: "8px",
                                fontSize: "15px",
                                color: "white",
                                outline: "none",
                                boxSizing: "border-box"
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%",
                            padding: "14px",
                            background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            fontSize: "16px",
                            fontWeight: "600",
                            cursor: loading ? "not-allowed" : "pointer",
                            marginBottom: "16px"
                        }}
                    >
                        {loading ? "Sending..." : "Send Reset Link"}
                    </button>

                    <div style={{ textAlign: "center" }}>
                        <Link href="/admin" style={{ fontSize: "14px", color: "#94a3b8", textDecoration: "none" }}>
                            ← Back to Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
