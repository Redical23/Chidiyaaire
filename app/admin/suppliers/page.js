"use client";

import { useState, useEffect } from "react";

const badgeTypes = [
    { id: "gst", label: "GST ✓", color: "#22c55e" },
    { id: "premium", label: "Premium ★", color: "#3b82f6" },
    { id: "verified", label: "Verified ✓", color: "#8b5cf6" },
];

const tabs = ["pending", "approved", "suspended", "banned"];

export default function SuppliersPage() {
    const [activeTab, setActiveTab] = useState("pending");
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const fetchSuppliers = async () => {
        try {
            const res = await fetch("/api/admin/suppliers");
            const data = await res.json();
            if (res.ok) setSuppliers(data);
        } catch (error) {
            console.error("Failed to fetch suppliers", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredSuppliers = suppliers.filter(s => s.status === activeTab);

    const handleAction = async (id, action) => {
        try {
            const res = await fetch("/api/admin/suppliers", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, action }),
            });

            if (res.ok) {
                const updated = await res.json();
                setSuppliers(suppliers.map(s => s.id === id ? updated : s));
            }
        } catch (error) {
            console.error("Action failed", error);
        }
    };

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    if (loading) {
        return (
            <div style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>
                Loading suppliers...
            </div>
        );
    }

    return (
        <div>
            <style dangerouslySetInnerHTML={{
                __html: `
                .sup-page { padding: 0; }
                .sup-title { font-size: 24px; font-weight: bold; color: white; margin-bottom: 4px; }
                .sup-tabs { display: flex; gap: 8px; margin-bottom: 20px; overflow-x: auto; padding-bottom: 8px; }
                .sup-tab { padding: 10px 16px; border-radius: 8px; font-size: 14px; white-space: nowrap; cursor: pointer; border: 1px solid #334155; background: #1e293b; color: #94a3b8; transition: all 0.2s; }
                .sup-tab:hover { background: #334155; }
                .sup-tab.active { background: #3b82f6; border-color: #3b82f6; color: white; }
                .sup-card { background: #1e293b; border-radius: 12px; border: 1px solid #334155; margin-bottom: 16px; overflow: hidden; transition: all 0.2s; }
                .sup-card:hover { border-color: #475569; }
                .sup-card-header { padding: 20px; border-bottom: 1px solid #334155; cursor: pointer; }
                .sup-card-name { font-size: 18px; font-weight: 600; color: white; margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between; }
                .sup-card-meta { font-size: 13px; color: #94a3b8; margin-bottom: 12px; }
                .sup-card-badges { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px; }
                .sup-card-actions { display: flex; gap: 8px; flex-wrap: wrap; }
                .sup-card-details { padding: 20px; background: #0f172a; border-top: 1px solid #334155; }
                .sup-detail-section { margin-bottom: 20px; }
                .sup-detail-section:last-child { margin-bottom: 0; }
                .sup-detail-title { font-size: 14px; font-weight: 600; color: #3b82f6; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
                .sup-detail-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
                .sup-detail-item { }
                .sup-detail-label { font-size: 11px; color: #64748b; text-transform: uppercase; margin-bottom: 4px; }
                .sup-detail-value { font-size: 14px; color: white; word-break: break-all; }
                .sup-btn { padding: 10px 20px; border-radius: 8px; font-size: 13px; cursor: pointer; border: none; font-weight: 500; transition: all 0.2s; }
                .sup-btn-approve { background: #22c55e; color: white; }
                .sup-btn-approve:hover { background: #16a34a; }
                .sup-btn-reject { background: transparent; color: #ef4444; border: 1px solid #ef4444; }
                .sup-btn-reject:hover { background: #ef444420; }
                .sup-btn-restore { background: #22c55e20; color: #22c55e; border: 1px solid #22c55e; }
                .sup-btn-restore:hover { background: #22c55e30; }
                .sup-empty { background: #1e293b; border-radius: 12px; padding: 60px 40px; text-align: center; color: #64748b; }
                .sup-expand-icon { transition: transform 0.2s; font-size: 12px; color: #64748b; }
                .sup-expand-icon.expanded { transform: rotate(180deg); }
                .sup-doc-list { display: flex; flex-wrap: wrap; gap: 8px; }
                .sup-doc-item { padding: 6px 12px; background: #334155; border-radius: 6px; font-size: 12px; color: #e2e8f0; display: flex; align-items: center; gap: 6px; }
                .sup-doc-status { width: 8px; height: 8px; border-radius: 50%; }
                .sup-doc-status.pending { background: #f59e0b; }
                .sup-doc-status.verified { background: #22c55e; }
                .sup-doc-status.rejected { background: #ef4444; }
                .sup-categories { display: flex; flex-wrap: wrap; gap: 6px; }
                .sup-category { padding: 4px 10px; background: #334155; border-radius: 12px; font-size: 11px; color: #94a3b8; }
                
                @media (min-width: 768px) {
                    .sup-title { font-size: 28px; }
                    .sup-detail-grid { grid-template-columns: repeat(3, 1fr); }
                }
            `}} />

            {/* Header */}
            <div style={{ marginBottom: "24px" }}>
                <h1 className="sup-title">Supplier Management</h1>
                <p style={{ color: "#64748b", fontSize: "14px" }}>Review applications, approve suppliers, and manage badges</p>
            </div>

            {/* Tabs */}
            <div className="sup-tabs">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`sup-tab ${activeTab === tab ? "active" : ""}`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)} ({suppliers.filter(s => s.status === tab).length})
                    </button>
                ))}
            </div>

            {/* Supplier Cards */}
            {filteredSuppliers.length === 0 ? (
                <div className="sup-empty">
                    <div style={{ fontSize: "48px", marginBottom: "16px" }}>📭</div>
                    <div style={{ fontSize: "18px", fontWeight: "500", color: "#94a3b8", marginBottom: "8px" }}>
                        No suppliers in this category
                    </div>
                    <div style={{ fontSize: "14px" }}>
                        {activeTab === "pending" && "New supplier applications will appear here"}
                        {activeTab === "approved" && "Approved suppliers will appear here"}
                        {activeTab === "suspended" && "Suspended suppliers will appear here"}
                        {activeTab === "banned" && "Banned suppliers will appear here"}
                    </div>
                </div>
            ) : (
                filteredSuppliers.map((supplier) => (
                    <div key={supplier.id} className="sup-card">
                        <div className="sup-card-header" onClick={() => toggleExpand(supplier.id)}>
                            <div className="sup-card-name">
                                <span>{supplier.companyName}</span>
                                <span className={`sup-expand-icon ${expandedId === supplier.id ? 'expanded' : ''}`}>▼</span>
                            </div>

                            {supplier.badges && supplier.badges.length > 0 && (
                                <div className="sup-card-badges">
                                    {supplier.badges.map((badgeId) => {
                                        const badge = badgeTypes.find(b => b.id === badgeId);
                                        return badge ? (
                                            <span key={badgeId} style={{ padding: "4px 12px", backgroundColor: `${badge.color}20`, color: badge.color, borderRadius: "12px", fontSize: "12px", fontWeight: "500" }}>
                                                {badge.label}
                                            </span>
                                        ) : null;
                                    })}
                                </div>
                            )}

                            <div className="sup-card-meta">
                                📧 {supplier.email} • 📱 {supplier.phone || "N/A"}
                            </div>

                            <div className="sup-card-actions" onClick={(e) => e.stopPropagation()}>
                                {supplier.status === "pending" && (
                                    <>
                                        <button onClick={() => handleAction(supplier.id, "approve")} className="sup-btn sup-btn-approve">
                                            ✓ Approve
                                        </button>
                                        <button onClick={() => handleAction(supplier.id, "suspend")} className="sup-btn sup-btn-reject">
                                            ✗ Reject
                                        </button>
                                    </>
                                )}
                                {supplier.status === "approved" && (
                                    <button onClick={() => handleAction(supplier.id, "suspend")} className="sup-btn sup-btn-reject">
                                        Suspend
                                    </button>
                                )}
                                {(supplier.status === "suspended" || supplier.status === "banned") && (
                                    <button onClick={() => handleAction(supplier.id, "restore")} className="sup-btn sup-btn-restore">
                                        ↩ Restore
                                    </button>
                                )}
                            </div>
                        </div>

                        {expandedId === supplier.id && (
                            <div className="sup-card-details">
                                {/* Registration Details */}
                                <div className="sup-detail-section">
                                    <div className="sup-detail-title">📋 Registration Details</div>
                                    <div className="sup-detail-grid">
                                        <div className="sup-detail-item">
                                            <div className="sup-detail-label">Company Name</div>
                                            <div className="sup-detail-value">{supplier.companyName}</div>
                                        </div>
                                        <div className="sup-detail-item">
                                            <div className="sup-detail-label">Email</div>
                                            <div className="sup-detail-value">{supplier.email}</div>
                                        </div>
                                        <div className="sup-detail-item">
                                            <div className="sup-detail-label">Phone</div>
                                            <div className="sup-detail-value">{supplier.phone || "Not provided"}</div>
                                        </div>
                                        <div className="sup-detail-item">
                                            <div className="sup-detail-label">Capacity</div>
                                            <div className="sup-detail-value">{supplier.capacity || "Not specified"}</div>
                                        </div>
                                        <div className="sup-detail-item">
                                            <div className="sup-detail-label">MOQ</div>
                                            <div className="sup-detail-value">{supplier.moq || "Not specified"}</div>
                                        </div>
                                        <div className="sup-detail-item">
                                            <div className="sup-detail-label">Service Locations</div>
                                            <div className="sup-detail-value">{supplier.serviceLocations || "Not specified"}</div>
                                        </div>
                                    </div>

                                    {supplier.productCategories && supplier.productCategories.length > 0 && (
                                        <div style={{ marginTop: "16px" }}>
                                            <div className="sup-detail-label">Product Categories</div>
                                            <div className="sup-categories" style={{ marginTop: "8px" }}>
                                                {supplier.productCategories.map((cat, i) => (
                                                    <span key={i} className="sup-category">{cat}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* KYC Details */}
                                <div className="sup-detail-section">
                                    <div className="sup-detail-title">🔐 KYC Details</div>
                                    <div className="sup-detail-grid">
                                        <div className="sup-detail-item">
                                            <div className="sup-detail-label">GST Number</div>
                                            <div className="sup-detail-value">{supplier.gstNumber || "Not submitted"}</div>
                                        </div>
                                        <div className="sup-detail-item">
                                            <div className="sup-detail-label">PAN Number</div>
                                            <div className="sup-detail-value">{supplier.panNumber || "Not submitted"}</div>
                                        </div>
                                        <div className="sup-detail-item">
                                            <div className="sup-detail-label">Registered On</div>
                                            <div className="sup-detail-value">
                                                {supplier.createdAt ? new Date(supplier.createdAt).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                }) : "N/A"}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Documents */}
                                <div className="sup-detail-section">
                                    <div className="sup-detail-title">📄 Submitted Documents</div>
                                    {supplier.documents && supplier.documents.length > 0 ? (
                                        <div className="sup-doc-list">
                                            {supplier.documents.map((doc, i) => (
                                                <div key={i} className="sup-doc-item">
                                                    <span className={`sup-doc-status ${doc.status}`}></span>
                                                    <span>{doc.fileName || doc.docType}</span>
                                                    <span style={{ color: "#64748b", fontSize: "10px", textTransform: "uppercase" }}>
                                                        ({doc.status})
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div style={{ color: "#64748b", fontSize: "14px" }}>No documents submitted</div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}
