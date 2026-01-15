"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/supplier/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess(true);
            } else {
                setError(data.error || "Failed to send reset email");
            }
        } catch (err) {
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f8fafc",
                fontFamily: "'Inter', system-ui, sans-serif",
                padding: "20px"
            }}>
                <div style={{
                    width: "100%",
                    maxWidth: "420px",
                    backgroundColor: "white",
                    borderRadius: "16px",
                    padding: "40px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    textAlign: "center"
                }}>
                    <div style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "50%",
                        backgroundColor: "#dcfce7",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 24px",
                        fontSize: "36px"
                    }}>📧</div>

                    <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#0f172a", marginBottom: "12px" }}>
                        Check Your Email
                    </h1>
                    <p style={{ color: "#64748b", marginBottom: "24px", lineHeight: "1.6" }}>
                        If an account exists for <strong>{email}</strong>, we've sent a password reset link.
                    </p>
                    <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "32px" }}>
                        The link will expire in 1 hour.
                    </p>

                    <Link
                        href="/supplier/login"
                        style={{
                            display: "inline-block",
                            padding: "14px 32px",
                            backgroundColor: "#0f172a",
                            color: "white",
                            borderRadius: "8px",
                            textDecoration: "none",
                            fontWeight: "500"
                        }}
                    >
                        Back to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f8fafc",
            fontFamily: "'Inter', system-ui, sans-serif",
            padding: "20px"
        }}>
            <div style={{
                width: "100%",
                maxWidth: "420px",
                backgroundColor: "white",
                borderRadius: "16px",
                padding: "40px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
            }}>
                {/* Logo */}
                <div style={{ textAlign: "center", marginBottom: "32px" }}>
                    <Link href="/supplier" style={{ textDecoration: "none" }}>
                        <span style={{ fontSize: "24px", fontWeight: "bold", color: "#0f172a" }}>
                            Chidiya<span style={{ color: "#3b82f6" }}>AI</span>
                        </span>
                    </Link>
                    <p style={{ color: "#64748b", marginTop: "8px", fontSize: "14px" }}>
                        Reset Your Password
                    </p>
                </div>

                <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "24px", textAlign: "center" }}>
                    Enter your email address and we'll send you a link to reset your password.
                </p>

                <form onSubmit={handleSubmit}>
                    {error && (
                        <div style={{
                            padding: "12px 16px",
                            backgroundColor: "#fef2f2",
                            border: "1px solid #fecaca",
                            borderRadius: "8px",
                            color: "#dc2626",
                            marginBottom: "16px",
                            fontSize: "14px"
                        }}>
                            {error}
                        </div>
                    )}

                    <div style={{ marginBottom: "24px" }}>
                        <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#0f172a", marginBottom: "6px" }}>
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="contact@yourcompany.com"
                            required
                            style={{
                                width: "100%",
                                padding: "12px",
                                border: "1px solid #e2e8f0",
                                borderRadius: "8px",
                                fontSize: "14px",
                                outline: "none",
                                boxSizing: "border-box"
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !email}
                        style={{
                            width: "100%",
                            padding: "14px",
                            backgroundColor: loading || !email ? "#94a3b8" : "#0f172a",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            fontSize: "16px",
                            fontWeight: "500",
                            cursor: loading || !email ? "not-allowed" : "pointer"
                        }}
                    >
                        {loading ? "Sending..." : "Send Reset Link"}
                    </button>
                </form>

                <p style={{ textAlign: "center", marginTop: "24px", fontSize: "14px", color: "#64748b" }}>
                    Remember your password?{" "}
                    <Link href="/supplier/login" style={{ color: "#3b82f6", textDecoration: "none", fontWeight: "500" }}>
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
}
