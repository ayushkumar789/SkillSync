'use client';
import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Layout from '@/components/layout/Layout';
import Link from 'next/link';

type QuizResult = {
    id: string;
    userId: string;
    courseId: string;
    score: number;
    submittedAt: any;
};

export default function QuizHistoryPage() {
    const [userId, setUserId] = useState<string | null>(null);
    const [results, setResults] = useState<QuizResult[]>([]);
    const [courses, setCourses] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userData = sessionStorage.getItem('user');
        if (userData) {
            const parsed = JSON.parse(userData);
            setUserId(parsed.id);
            fetchQuizResults(parsed.id);
        }
    }, []);

    const fetchQuizResults = async (uid: string) => {
        try {
            const q = query(collection(db, 'quizResults'), where('userId', '==', uid));
            const snap = await getDocs(q);
            const resultsData = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as QuizResult[];
            setResults(resultsData);

            const courseMap: Record<string, any> = {};
            for (const res of resultsData) {
                if (!courseMap[res.courseId]) {
                    const courseSnap = await getDoc(doc(db, 'courses', res.courseId));
                    if (courseSnap.exists()) {
                        courseMap[res.courseId] = courseSnap.data();
                    }
                }
            }
            setCourses(courseMap);
        } catch (error) {
            console.error('Failed to load quiz results:', error);
        } finally {
            setLoading(false);
        }
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
                        📊 Quiz History
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
                        Track your past quiz attempts and performance
                    </p>

                </div>
            </div>

            <section className="sp1">
                <div className="container">
                    <div className="card shadow-sm p-4 border-0">
                        <h4 className="mb-4 text-center">📝 Your Quiz Attempts</h4>

                        {loading ? (
                            <p className="text-center">Loading quiz data...</p>
                        ) : results.length === 0 ? (
                            <p className="text-center text-muted">No quiz attempts found.</p>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-bordered text-center align-middle">
                                    <thead className="table-light">
                                    <tr>
                                        <th>Course</th>
                                        <th>Score</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                        <th>Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {results.map((res, i) => {
                                        const course = courses[res.courseId];
                                        const courseTitle = course?.title || 'Unknown Course';
                                        const passingScore = course?.passingScore || 60;
                                        const passed = res.score >= passingScore;

                                        return (
                                            <tr key={i}>
                                                <td>{courseTitle}</td>
                                                <td>{res.score}%</td>
                                                <td>
                            <span className={`badge ${passed ? 'bg-success' : 'bg-danger'}`}>
                              {passed ? 'Passed' : 'Failed'}
                            </span>
                                                </td>
                                                <td>{new Date(res.submittedAt.seconds * 1000).toLocaleString()}</td>
                                                <td>
                                                    <Link href={`/quiz/${res.courseId}`} className="btn btn-sm btn-outline-primary me-2">
                                                        Retake
                                                    </Link>
                                                    <Link href={`/courses/${res.courseId}`} className="btn btn-sm btn-primary">
                                                        Course
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </Layout>
    );
}
