'use client'

import { useEffect, useState } from "react"
import { db } from "@/lib/firebase"
import { useSearchParams, useRouter } from "next/navigation"
import { collection, query, where, getDocs, addDoc } from "firebase/firestore"
import Layout from "@/components/layout/Layout"
import Link from "next/link"

interface Question {
    id: string
    courseId: string
    question: string
    options: string[]
    answer: string
}

export default function QuizStart() {
    const searchParams = useSearchParams()
    const courseId = searchParams.get("courseId") || ""
    const router = useRouter()

    const [questions, setQuestions] = useState<Question[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [selected, setSelected] = useState<string | null>(null)
    const [score, setScore] = useState(0)
    const [submitted, setSubmitted] = useState(false)

    const current = questions[currentIndex]

    useEffect(() => {
        async function loadQuestions() {
            const q = query(collection(db, "quiz"), where("courseId", "==", courseId))
            const snap = await getDocs(q)
            const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Question))
            setQuestions(list)
        }

        loadQuestions()
    }, [courseId])

    const handleNext = () => {
        if (!selected) return alert("Please select an option.")
        if (selected === current.answer) setScore(s => s + 1)
        setSelected(null)
        setCurrentIndex(i => i + 1)
    }

    const handleSubmit = async () => {
        if (!selected) return alert("Please select an option.")
        if (selected === current.answer) setScore(s => s + 1)

        const finalScore = selected === current.answer ? score + 1 : score
        const percentage = (finalScore / questions.length) * 100
        const passed = percentage >= 65

        // Get userId (assume stored in session or from context)
        const userId = sessionStorage.getItem("userId") // OR use from context

        // Prevent unauthenticated submissions
        if (!userId) return alert("User not authenticated.")

        try {
            // Check if quiz attempt already exists
            const existingQuery = query(
                collection(db, "quizAttempts"),
                where("userId", "==", userId),
                where("courseId", "==", courseId)
            )
            const existingSnap = await getDocs(existingQuery)
            if (!existingSnap.empty) {
                alert("You've already attempted this quiz.")
                setSubmitted(true)
                return
            }

            // Save result to Firestore
            await addDoc(collection(db, "quizAttempts"), {
                userId,
                courseId,
                score: finalScore,
                total: questions.length,
                percentage,
                passed,
                timestamp: new Date()
            })

            alert("Quiz submitted successfully!")
        } catch (err) {
            console.error("Quiz submission failed:", err)
            alert("Something went wrong during submission.")
        }

        setSubmitted(true)
    }


    return (
        <Layout headerStyle={5} footerStyle={1}>
            <div className="inner-page-header" style={{ backgroundImage: 'url(/assets/img/bg/header-bg13.png)' }}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 m-auto text-center">
                            <div className="heading1">
                                <h1>Course Quiz</h1>
                                <Link href="/">Home</Link> <i className="fa-solid fa-angle-right mx-2" />
                                <Link href="/courses">Courses</Link> <i className="fa-solid fa-angle-right mx-2" />
                                <span>Quiz</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <section className="contact-form-section sp1">
                <div className="container">
                    {!submitted ? (
                        <>
                            <div className="row justify-content-center">
                                <div className="col-lg-8">
                                    {current && (
                                        <div className="quiz-box p-4 border rounded shadow-sm bg-white">
                                            <h4 className="mb-4">Q{currentIndex + 1}: {current.question}</h4>
                                            <div className="quiz-options">
                                                {current.options.map((opt, i) => (
                                                    <div
                                                        key={i}
                                                        className={`form-check mb-3 px-3 py-2 rounded border ${selected === opt ? 'bg-primary text-white' : ''}`}
                                                        style={{ cursor: "pointer" }}
                                                        onClick={() => setSelected(opt)}
                                                    >
                                                        <input className="form-check-input me-2" type="radio" checked={selected === opt} readOnly />
                                                        {opt}
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="text-end mt-4">
                                                {currentIndex === questions.length - 1 ? (
                                                    <button className="vl-btn1" onClick={handleSubmit}>Submit</button>
                                                ) : (
                                                    <button className="vl-btn1" onClick={handleNext}>Next</button>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="row justify-content-center">
                            <div className="col-lg-6 text-center">
                                <div className="result-box p-5 rounded bg-light shadow">
                                    <h2 className="mb-3">Quiz Completed!</h2>
                                    <p>You scored <strong>{score} out of {questions.length}</strong></p>
                                    <p>{(score / questions.length) * 100 >= 65 ? '🎉 You passed! Modules unlocked.' : '❌ You did not pass. Try again.'}</p>
                                    <div className="space20" />
                                    <Link href={`/courses/${courseId}`} className="vl-btn1">Back to Course</Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </Layout>
    )
}
