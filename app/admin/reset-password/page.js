"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/admin/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess(true);
                setTimeout(() => {
                    router.push("/admin");
                }, 3000);
            } else {
                setError(data.error || "Failed to reset password");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div style={{ color: "#f87171", textAlign: "center" }}>
                Invalid or missing reset token.
            </div>
        );
    }

    if (success) {
        return (
            <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>✅</div>
                <h2 style={{ color: "white", marginBottom: "8px", fontSize: "20px", fontWeight: "bold" }}>Password Reset Successfully!</h2>
                <p style={{ color: "#94a3b8", marginBottom: "24px" }}>Redirecting to login...</p>
                <Link href="/admin" style={{ color: "#3b82f6", textDecoration: "none" }}>
                    Click here if not redirected
                </Link>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#94a3b8", marginBottom: "8px" }}>
                    New Password
                </label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••"
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

            <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#94a3b8", marginBottom: "8px" }}>
                    Confirm New Password
                </label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••"
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
                    cursor: loading ? "not-allowed" : "pointer"
                }}
            >
                {loading ? "Resetting..." : "Set New Password"}
            </button>
        </form>
    );
}

export default function ResetPassword() {
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
                </div>

                <Suspense fallback={<div style={{ color: "#94a3b8", textAlign: "center" }}>Loading...</div>}>
                    <ResetPasswordForm />
                </Suspense>
            </div>
        </div>
    );
}
