'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function CourseRecommendationPage() {
    const [interests, setInterests] = useState('');
    const [skillLevel, setSkillLevel] = useState('Beginner');
    const [goal, setGoal] = useState('');
    const [recommendations, setRecommendations] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/get-recommendations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    interests: interests.split(',').map(i => i.trim()),
                    skill_level: skillLevel,
                    goal: goal
                })
            });

            const data = await res.json();
            if (data.recommendations) {
                setRecommendations(data.recommendations);
            } else {
                setError('No recommendations returned.');
            }
        } catch (err) {
            setError('Failed to fetch recommendations.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
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
                        Course Recommendation
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
                        Get personalized suggestions based on your interests & skill level
                    </p>

                </div>
            </div>

            <section className="sp1">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <div className="card shadow-sm border-0 p-4">
                                <h3 className="mb-4 text-center">🎯 Find Best Courses for You</h3>
                                <form onSubmit={handleSubmit} className="row g-3">
                                    <div className="col-md-12">
                                        <label className="form-label fw-semibold">Your Interests</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={interests}
                                            onChange={(e) => setInterests(e.target.value)}
                                            placeholder="e.g., Machine Learning, Web Development"
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">Skill Level</label>
                                        <select
                                            className="form-select"
                                            value={skillLevel}
                                            onChange={(e) => setSkillLevel(e.target.value)}
                                        >
                                            <option>Beginner</option>
                                            <option>Intermediate</option>
                                            <option>Advanced</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">Learning Goal</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={goal}
                                            onChange={(e) => setGoal(e.target.value)}
                                            placeholder="e.g., Career prep, Upskilling"
                                            required
                                        />
                                    </div>
                                    <div className="col-12 text-center mt-3">
                                        <button
                                            type="submit"
                                            className="btn btn-primary px-4"
                                            disabled={loading}
                                        >
                                            {loading ? 'Finding...' : 'Get Recommendations'}
                                        </button>
                                    </div>
                                </form>

                                {error && (
                                    <div className="alert alert-danger mt-4 text-center">{error}</div>
                                )}

                                {recommendations.length > 0 && (
                                    <div className="mt-5">
                                        <h5 className="text-center mb-3">🔍 Recommended Courses</h5>
                                        <div className="list-group">
                                            {recommendations.map((rec, index) => (
                                                <div key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <b>{rec.course_id}</b>

                                                    </div>
                                                    <Link href={`/courses`} className="btn btn-sm btn-outline-primary">
                                                        View Courses
                                                    </Link>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
