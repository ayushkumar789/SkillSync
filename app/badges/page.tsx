"use client";

import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";

export default function BadgesPage() {
    const [badges, setBadges] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userId = "demo-user-123"; // Replace with actual logged-in user ID
        fetch(`/api/badges?userId=${userId}`)
            .then(res => res.json())
            .then(data => {
                setBadges(data.badges || []);
                setLoading(false);
            });
    }, []);

    return (
        <Layout headerStyle={5} footerStyle={1}>
            <div className="inner-page-header" style={{ backgroundImage: 'url(/assets/img/bg/header-bg7.png)' }}>
                <div className="container text-center">
                    <h1 style={{
                        color: "var(--ztc-text-text-1)",
                        fontFamily: "var(--grotesk)",
                        fontSize: "var(--ztc-font-size-font-s70)",
                        fontStyle: "normal",
                        fontWeight: "var(--ztc-weight-medium)",
                        lineHeight: "80px",
                        textTransform: "uppercase"
                    }}>
                        Your Badges
                    </h1>

                    <p style={{
                        color: "var(--ztc-text-text-1)",
                        fontFamily: "var(--grotesk)",
                        fontSize: "var(--ztc-font-size-font-s20)",
                        fontStyle: "normal",
                        fontWeight: "var(--ztc-weight-regular)",
                        lineHeight: "20px",
                        marginTop: "14px",
                        opacity: 0.7
                    }}>
                        Track your learning achievements and unlock progress milestones
                    </p>
                </div>
            </div>

            <section className="sp1">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-10">
                            <div className="card shadow-sm border-0 p-4">
                                <h3 className="mb-4 text-center">🎖️ Earned Badges</h3>

                                {loading ? (
                                    <p className="text-center">Loading badges...</p>
                                ) : badges.length === 0 ? (
                                    <p className="text-center">No badges earned yet.</p>
                                ) : (
                                    <div className="row g-3">
                                        {badges.map((badge, i) => (
                                            <div key={i} className="col-md-4">
                                                <div className="border rounded shadow-sm text-center p-4 h-100">
                                                    <h5 style={{
                                                        fontFamily: "var(--grotesk)",
                                                        fontSize: "var(--ztc-font-size-font-s20)",
                                                        color: "var(--ztc-text-text-1)",
                                                        fontWeight: "var(--ztc-weight-medium)",
                                                        textTransform: "capitalize"
                                                    }}>
                                                        🏅 {badge}
                                                    </h5>
                                                    <p style={{
                                                        fontSize: "var(--ztc-font-size-font-s14)",
                                                        fontFamily: "var(--grotesk)",
                                                        color: "var(--ztc-text-text-1)",
                                                        opacity: 0.8
                                                    }}>
                                                        You've unlocked this badge based on your quiz performance!
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
