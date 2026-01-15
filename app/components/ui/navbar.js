"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Navbar({ menus }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Show desktop layout until mounted (prevents hydration issues)
    // After mounted, use actual isMobile value
    const showMobileNav = mounted && isMobile;

    return (
        <header style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            backgroundColor: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(10px)",
            borderBottom: "1px solid #e2e8f0"
        }}>
            <div style={{
                maxWidth: "1200px",
                margin: "0 auto",
                padding: "0 16px",
                height: "64px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
            }}>
                {/* Logo */}
                <Link href="/" style={{ fontWeight: "bold", fontSize: "20px", color: "#0f172a", textDecoration: "none" }}>
                    Chidiya<span style={{ color: "#3b82f6" }}>AI</span>
                </Link>

                {/* Desktop Navigation */}
                <nav style={{
                    display: showMobileNav ? "none" : "flex",
                    alignItems: "center",
                    gap: "8px"
                }}>
                    {menus?.map((item) => (
                        <Link
                            key={item.id}
                            href={item.url}
                            style={{
                                padding: "8px 16px",
                                fontSize: "14px",
                                fontWeight: item.highlight ? "500" : "400",
                                color: item.highlight ? "#3b82f6" : "#64748b",
                                textDecoration: "none",
                                borderRadius: "6px"
                            }}
                        >
                            {item.title}
                        </Link>
                    ))}
                </nav>

                {/* Desktop Buttons */}
                <div style={{
                    display: showMobileNav ? "none" : "flex",
                    alignItems: "center",
                    gap: "12px"
                }}>
                    <Link
                        href="/account"
                        style={{
                            padding: "8px 16px",
                            fontSize: "14px",
                            fontWeight: "500",
                            color: "#3b82f6",
                            backgroundColor: "#eff6ff",
                            border: "1px solid #bfdbfe",
                            borderRadius: "8px",
                            textDecoration: "none"
                        }}
                    >
                        Sign in
                    </Link>
                    <Link
                        href="/onboarding"
                        style={{
                            padding: "10px 20px",
                            fontSize: "14px",
                            fontWeight: "500",
                            backgroundColor: "#0f172a",
                            color: "white",
                            borderRadius: "8px",
                            textDecoration: "none"
                        }}
                    >
                        Try for free
                    </Link>
                </div>

                {/* Mobile: Sign in + Hamburger */}
                <div style={{
                    display: showMobileNav ? "flex" : "none",
                    alignItems: "center",
                    gap: "8px"
                }}>
                    <Link
                        href="modules\account\components\login"
                        style={{
                            padding: "6px 12px",
                            fontSize: "13px",
                            fontWeight: "500",
                            color: "#3b82f6",
                            backgroundColor: "#eff6ff",
                            border: "1px solid #bfdbfe",
                            borderRadius: "6px",
                            textDecoration: "none"
                        }}
                    >
                        Sign in
                    </Link>
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        style={{
                            padding: "8px",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                        aria-label="Toggle menu"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2">
                            {mobileMenuOpen ? (
                                <path d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {showMobileNav && mobileMenuOpen && (
                <div style={{
                    backgroundColor: "white",
                    borderTop: "1px solid #e2e8f0",
                    padding: "16px"
                }}>
                    {menus?.map((item) => (
                        <Link
                            key={item.id}
                            href={item.url}
                            onClick={() => setMobileMenuOpen(false)}
                            style={{
                                display: "block",
                                padding: "12px 16px",
                                fontSize: "16px",
                                fontWeight: item.highlight ? "500" : "400",
                                color: item.highlight ? "#3b82f6" : "#0f172a",
                                textDecoration: "none",
                                borderRadius: "8px"
                            }}
                        >
                            {item.title}
                        </Link>
                    ))}
                    <div style={{ borderTop: "1px solid #e2e8f0", marginTop: "12px", paddingTop: "12px" }}>
                        <Link
                            href="/onboarding"
                            onClick={() => setMobileMenuOpen(false)}
                            style={{
                                display: "block",
                                padding: "12px 16px",
                                fontSize: "16px",
                                fontWeight: "500",
                                backgroundColor: "#0f172a",
                                color: "white",
                                borderRadius: "8px",
                                textDecoration: "none",
                                textAlign: "center"
                            }}
                        >
                            Try for free
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}
