"use client"

import Layout from "@/components/layout/Layout"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { db } from "@/lib/firebase"
import {
    doc, getDoc, setDoc, collection, query, where, getDocs
} from "firebase/firestore"

export default function QuizPage() {
    const { courseId } = useParams()
    const router = useRouter()

    const [user, setUser] = useState<any>(null)
    const [questions, setQuestions] = useState<any[]>([])
    const [answers, setAnswers] = useState<{ [key: number]: string }>({})
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(true)

    // Step 1: Load user
    useEffect(() => {
        const storedUser = sessionStorage.getItem("user")
        console.log("📦 sessionStorage.getItem('user') =", storedUser)

        if (!storedUser) {
            console.warn("🔒 No user found in sessionStorage. Redirecting to login.")
            router.push("/login")
            return
        }

        const parsed = JSON.parse(storedUser)
        setUser(parsed)
    }, [])

    // Step 2: Load quiz after both user and id are ready
    useEffect(() => {
        console.log("🧭 useParams().courseId =", courseId)
        if (courseId && user) {
            console.log("🚀 Calling loadQuiz with:", courseId, user.id)
            loadQuiz(courseId as string, user.id)
        }
    }, [courseId, user])

    const loadQuiz = async (courseId: string, userId: string) => {
        setLoading(true)
        try {
            const enrollQuery = query(
                collection(db, "enrollments"),
                where("userId", "==", userId),
                where("courseId", "==", courseId)
            )
            const enrollSnap = await getDocs(enrollQuery)
            console.log("✅ Enrollment check:", !enrollSnap.empty)

            if (enrollSnap.empty) {
                console.warn("❌ User not enrolled. Redirecting to course page.")
                router.push(`/courses/${courseId}`)
                return
            }

            const quizSnap = await getDoc(doc(db, "quizzes", courseId))
            if (!quizSnap.exists()) {
                console.warn("❌ No quiz document found.")
                setError("Quiz not available.")
                return
            }

            const data = quizSnap.data()
            console.log("📘 Quiz Firestore raw data:", data)

            let fetchedQuestions = data.questions

            if (!Array.isArray(fetchedQuestions)) {
                console.warn("⚠️ Questions not an array, attempting Object.values fallback")
                fetchedQuestions = Object.values(fetchedQuestions)
            }

            if (fetchedQuestions.length > 0) {
                console.log("✅ Parsed questions:", fetchedQuestions)
                setQuestions(fetchedQuestions)
            } else {
                console.warn("⚠️ Questions array is empty.")
                setError("No valid questions found.")
            }
        } catch (err) {
            console.error("🔥 Error in loadQuiz():", err)
            setError("Failed to load quiz.")
        }
        setLoading(false)
    }

    const handleChange = (qIndex: number, option: string) => {
        setAnswers({ ...answers, [qIndex]: option })
    }

    const handleSubmit = async () => {
        if (Object.keys(answers).length < questions.length) {
            setError("Please answer all questions before submitting.")
            return
        }

        setSubmitting(true)
        setError("")

        let correct = 0
        questions.forEach((q, i) => {
            if (answers[i] === q.answer) correct++
        })

        const score = Math.round((correct / questions.length) * 100)

        try {
            await setDoc(doc(db, "quizResults", `${user.id}_${courseId}`), {
                userId: user.id,
                courseId: courseId,
                score,
                total: questions.length,
                correct,
                submittedAt: new Date()
            })

            await setDoc(doc(db, "moduleProgress", `${user.id}_${courseId}_quiz`), {
                userId: user.id,
                courseId: courseId,
                quizCompleted: true,
                timestamp: new Date()
            })

            router.push(`/courses/${courseId}`)
        } catch (err) {
            console.error("❌ Quiz submission failed:", err)
            setError("Failed to submit quiz. Please try again.")
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <Layout headerStyle={5} footerStyle={1}>
                <div className="text-center py-5">
                    <span>Loading quiz...</span>
                </div>
            </Layout>
        )
    }

    if (error) {
        return (
            <Layout headerStyle={5} footerStyle={1}>
                <div className="text-center py-5 text-danger">{error}</div>
            </Layout>
        )
    }

    return (
        <Layout headerStyle={5} footerStyle={1}>
            <div className="inner-page-header" style={{ backgroundImage: 'url(/assets/img/bg/header-bg6.png)' }}>
                <div className="container text-center">
                    <h1 className="mb-1">Course Quiz</h1>
                    <p className="lead">Answer all questions to unlock full course access</p>
                </div>
            </div>

            <section className="sp1 container">
                <div className="row justify-content-center">
                    <div className="col-lg-10">
                        {questions.map((q, index) => (
                            <div key={index} className="border rounded p-4 mb-4 shadow-sm">
                                <h5 className="mb-3">{index + 1}. {q.question}</h5>
                                <div className="ms-3">
                                    {q.options.map((opt: string, i: number) => {
                                        const optLabel = String.fromCharCode(65 + i)
                                        return (
                                            <div className="form-check mb-2" key={i}>
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name={`q-${index}`}
                                                    id={`q-${index}-${i}`}
                                                    value={optLabel}
                                                    checked={answers[index] === optLabel}
                                                    onChange={() => handleChange(index, optLabel)}
                                                />
                                                <label className="form-check-label" htmlFor={`q-${index}-${i}`}>
                                                    {optLabel}. {opt}
                                                </label>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}

                        {error && <div className="alert alert-danger">{error}</div>}

                        <div className="text-end">
                            <button
                                onClick={handleSubmit}
                                className="vl-btn1"
                                disabled={submitting}
                            >
                                {submitting ? "Submitting..." : "Submit Quiz"}
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    )
}
