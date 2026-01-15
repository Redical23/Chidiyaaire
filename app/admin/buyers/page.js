"use client";

import { useState, useEffect } from "react";

const tabs = ["all", "flagged", "warned", "restricted"];

export default function BuyersPage() {
    const [activeTab, setActiveTab] = useState("all");
    const [buyers, setBuyers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBuyers();
    }, []);

    const fetchBuyers = async () => {
        try {
            const res = await fetch("/api/admin/buyers");
            const data = await res.json();
            if (res.ok) setBuyers(data);
        } catch (error) {
            console.error("Failed to fetch buyers", error);
        } finally {
            setLoading(false);
        }
    };

    const getFilteredBuyers = () => {
        if (activeTab === "all") return buyers.filter(b => b.status !== "restricted");
        if (activeTab === "flagged") return buyers.filter(b => b.flagged && b.status !== "warned" && b.status !== "restricted");
        if (activeTab === "warned") return buyers.filter(b => b.status === "warned");
        if (activeTab === "restricted") return buyers.filter(b => b.status === "restricted");
        return buyers;
    };

    const handleAction = async (id, action) => {
        try {
            const res = await fetch("/api/admin/buyers", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, action }),
            });

            if (res.ok) {
                const updated = await res.json();
                setBuyers(buyers.map(b => b.id === id ? updated : b));
            }
        } catch (error) {
            console.error("Action failed", error);
        }
    };

    const stats = [
        { label: "Total", value: buyers.filter(b => b.status !== "restricted").length, color: "#3b82f6" },
        { label: "Flagged", value: buyers.filter(b => b.flagged).length, color: "#ef4444" },
        { label: "Warned", value: buyers.filter(b => b.status === "warned").length, color: "#f59e0b" },
        { label: "Restricted", value: buyers.filter(b => b.status === "restricted").length, color: "#94a3b8" },
    ];

    return (
        <div>
            <style dangerouslySetInnerHTML={{
                __html: `
                .buy-title { font-size: 24px; font-weight: bold; color: white; margin-bottom: 4px; }
                .buy-stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 20px; }
                .buy-stat { background: #1e293b; padding: 16px; border-radius: 10px; border: 1px solid #334155; text-align: center; }
                .buy-stat-value { font-size: 28px; font-weight: bold; }
                .buy-stat-label { font-size: 12px; color: #94a3b8; margin-top: 4px; }
                .buy-tabs { display: flex; gap: 8px; margin-bottom: 20px; overflow-x: auto; padding-bottom: 8px; }
                .buy-tab { padding: 10px 16px; border-radius: 8px; font-size: 14px; white-space: nowrap; cursor: pointer; border: 1px solid #334155; background: #1e293b; color: #94a3b8; text-transform: capitalize; }
                .buy-tab.active { background: #3b82f6; border-color: #3b82f6; color: white; }
                .buy-card { background: #1e293b; border-radius: 12px; border: 1px solid #334155; padding: 16px; margin-bottom: 12px; }
                .buy-card-header { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 8px; }
                .buy-card-name { font-size: 16px; font-weight: 600; color: white; }
                .buy-card-badge { padding: 2px 8px; border-radius: 10px; font-size: 11px; }
                .buy-card-meta { font-size: 13px; color: #94a3b8; margin-bottom: 12px; }
                .buy-card-flag { background: #0f172a; padding: 10px; border-radius: 6px; margin-bottom: 12px; font-size: 13px; color: #94a3b8; border-left: 3px solid #ef4444; }
                .buy-card-actions { display: flex; gap: 8px; flex-wrap: wrap; }
                .buy-btn { padding: 8px 14px; border-radius: 6px; font-size: 13px; cursor: pointer; border: none; }
                .buy-empty { background: #1e293b; border-radius: 12px; padding: 40px; text-align: center; color: #64748b; }
                
                @media (min-width: 768px) {
                    .buy-title { font-size: 28px; }
                    .buy-stats { grid-template-columns: repeat(4, 1fr); }
                }
            `}} />

            {/* Header */}
            <div style={{ marginBottom: "20px" }}>
                <h1 className="buy-title">Buyer Monitoring</h1>
                <p style={{ color: "#64748b", fontSize: "14px" }}>Monitor and manage buyer accounts</p>
            </div>

            {/* Stats - 2 columns on mobile, 4 on desktop */}
            <div className="buy-stats">
                {stats.map((stat, i) => (
                    <div key={i} className="buy-stat">
                        <div className="buy-stat-value" style={{ color: stat.color }}>{stat.value}</div>
                        <div className="buy-stat-label">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className="buy-tabs">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`buy-tab ${activeTab === tab ? "active" : ""}`}
                    >
                        {tab === "all" ? "All Buyers" : tab}
                    </button>
                ))}
            </div>

            {/* Buyer Cards */}
            {getFilteredBuyers().length === 0 ? (
                <div className="buy-empty">No buyers in this category</div>
            ) : (
                getFilteredBuyers().map((buyer) => (
                    <div key={buyer.id} className="buy-card">
                        <div className="buy-card-header">
                            <span className="buy-card-name">{buyer.name}</span>
                            {buyer.flagged && (
                                <span className="buy-card-badge" style={{ background: "#ef444420", color: "#ef4444" }}>
                                    🚩 {buyer.severity?.toUpperCase() || "FLAGGED"}
                                </span>
                            )}
                            {buyer.status === "warned" && (
                                <span className="buy-card-badge" style={{ background: "#f59e0b20", color: "#f59e0b" }}>⚠️ Warned</span>
                            )}
                            {buyer.status === "restricted" && (
                                <span className="buy-card-badge" style={{ background: "#ef444420", color: "#ef4444" }}>⛔ Restricted</span>
                            )}
                        </div>

                        <div className="buy-card-meta">
                            {buyer.email} • {buyer.inquiries} inquiries • {buyer.lastActive}
                        </div>

                        {buyer.flagReason && (
                            <div className="buy-card-flag">
                                <strong style={{ color: "white" }}>AI Flag:</strong> {buyer.flagReason}
                            </div>
                        )}

                        <div className="buy-card-actions">
                            {buyer.status === "active" && buyer.flagged && (
                                <>
                                    <button onClick={() => handleAction(buyer.id, "dismiss")} className="buy-btn" style={{ background: "#334155", color: "#94a3b8" }}>Dismiss</button>
                                    <button onClick={() => handleAction(buyer.id, "warn")} className="buy-btn" style={{ background: "#f59e0b20", color: "#f59e0b", border: "1px solid #f59e0b" }}>Warn</button>
                                    <button onClick={() => handleAction(buyer.id, "restrict")} className="buy-btn" style={{ background: "#ef444420", color: "#ef4444", border: "1px solid #ef4444" }}>Restrict</button>
                                </>
                            )}
                            {buyer.status === "warned" && (
                                <>
                                    <button onClick={() => handleAction(buyer.id, "restore")} className="buy-btn" style={{ background: "#22c55e20", color: "#22c55e", border: "1px solid #22c55e" }}>Remove Warning</button>
                                    <button onClick={() => handleAction(buyer.id, "restrict")} className="buy-btn" style={{ background: "#ef444420", color: "#ef4444", border: "1px solid #ef4444" }}>Restrict</button>
                                </>
                            )}
                            {buyer.status === "restricted" && (
                                <button onClick={() => handleAction(buyer.id, "restore")} className="buy-btn" style={{ background: "#22c55e20", color: "#22c55e", border: "1px solid #22c55e" }}>Restore</button>
                            )}
                            <button className="buy-btn" style={{ background: "transparent", color: "#3b82f6", border: "1px solid #334155" }}>View</button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
