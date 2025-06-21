"use client";

import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";

export default function LeaderboardPage() {
    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/leaderboard")
            .then(res => res.json())
            .then(data => {
                setLeaderboard(data.leaderboard || []);
                setLoading(false);
            });
    }, []);

    const getMedal = (rank: number) => {
        if (rank === 1) return "🥇";
        if (rank === 2) return "🥈";
        if (rank === 3) return "🥉";
        return `#${rank}`;
    };

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
                        Leaderboard
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
                        Track the top performers in quizzes and assessments
                    </p>
                </div>
            </div>

            <section className="sp1">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-10">
                            <div className="card shadow-sm border-0 p-4">
                                <h3 className="mb-4 text-center">🏆 Quiz Leaderboard</h3>

                                {loading ? (
                                    <p className="text-center">Loading leaderboard...</p>
                                ) : leaderboard.length === 0 ? (
                                    <p className="text-center">No results found.</p>
                                ) : (
                                    <table className="table table-hover text-center align-middle">
                                        <thead className="table-light">
                                        <tr>
                                            <th>Rank</th>
                                            <th>Name</th>
                                            <th>Score</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {leaderboard.map((user, index) => (
                                            <tr key={index}>
                                                <td>{getMedal(index + 1)}</td>
                                                <td>{user.name}</td>
                                                <td>{user.score} pts</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
