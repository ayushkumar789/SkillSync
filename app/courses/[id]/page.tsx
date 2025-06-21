"use client"

import Layout from "@/components/layout/Layout"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { db } from "@/lib/firebase"
import {
    doc, getDoc, collection, query, where, getDocs, addDoc, setDoc
} from "firebase/firestore"
import Link from "next/link"
import CommentBox from "@/components/CommentBox"

type Course = {
    title: string
    description: string
    thumbnail: string
    passingScore?: number
}

type Module = {
    id: string
    title: string
    description: string
    videoUrl: string
    order: number
    type?: string
}

export default function CourseDetailPage() {
    const { id } = useParams()
    const router = useRouter()

    const [user, setUser] = useState<any>(null)
    const [course, setCourse] = useState<Course | null>(null)
    const [modules, setModules] = useState<Module[]>([])
    const [score, setScore] = useState<number | null>(null)
    const [loading, setLoading] = useState(true)
    const [checkingQuiz, setCheckingQuiz] = useState(false)
    const [quizExists, setQuizExists] = useState(false)
    const [isEnrolled, setIsEnrolled] = useState(false)
    const [watchedPrerequisite, setWatchedPrerequisite] = useState(false)
    const [showVideoModal, setShowVideoModal] = useState(false)
    const [prerequisiteModule, setPrerequisiteModule] = useState<Module | null>(null)

    useEffect(() => {
        const storedUser = sessionStorage.getItem("user")
        if (!storedUser) {
            router.push("/login")
            return
        }

        const parsed = JSON.parse(storedUser)
        setUser(parsed)
        if (id) loadAll(id as string, parsed.id)
    }, [id])

    const loadAll = async (courseId: string, userId: string) => {
        try {
            const courseSnap = await getDoc(doc(db, "courses", courseId))
            if (!courseSnap.exists()) return

            const courseData = courseSnap.data()
            setCourse({
                title: courseData.title,
                description: courseData.description,
                thumbnail: courseData.thumbnail,
                passingScore: courseData.passingScore || 60
            })

            const modQuery = query(collection(db, "modules"), where("courseId", "==", courseId))
            const modSnap = await getDocs(modQuery)
            const mods = modSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Module[]

            const sortedMods = mods.sort((a, b) => a.order - b.order)
            setModules(sortedMods)
            const preMod = sortedMods.find(m => m.type === "prerequisite")
            setPrerequisiteModule(preMod || null)

            const enrollSnap = await getDocs(query(
                collection(db, "enrollments"),
                where("userId", "==", userId),
                where("courseId", "==", courseId)
            ))
            setIsEnrolled(!enrollSnap.empty)

            const quizResultSnap = await getDocs(query(
                collection(db, "quizResults"),
                where("userId", "==", userId),
                where("courseId", "==", courseId)
            ))
            if (!quizResultSnap.empty) setScore(quizResultSnap.docs[0].data().score)

            const quizSnap = await getDoc(doc(db, "quizzes", courseId))
            setQuizExists(quizSnap.exists())

            const progressSnap = await getDoc(doc(db, "moduleProgress", `${userId}_${courseId}_prereq`))
            setWatchedPrerequisite(progressSnap.exists())

            setLoading(false)
        } catch (err) {
            console.error("Error loading:", err)
        }
    }

    const handleEnroll = async () => {
        try {
            await addDoc(collection(db, "enrollments"), {
                userId: user.id,
                courseId: id,
                enrolledAt: new Date()
            })
            setIsEnrolled(true)
        } catch (err) {
            alert("Enrollment failed.")
        }
    }

    const handleWatchEnd = async () => {
        if (!user || !id || !prerequisiteModule) return
        try {
            await setDoc(doc(db, "moduleProgress", `${user.id}_${id}_prereq`), {
                userId: user.id,
                courseId: id,
                moduleId: prerequisiteModule.id,
                watched: true,
                type: "prereq",
                timestamp: new Date()
            })
            setWatchedPrerequisite(true)
            setShowVideoModal(false)
        } catch (err) {
            alert("Could not save progress")
        }
    }

    const handleTakeQuiz = async () => {
        setCheckingQuiz(true)
        try {
            const res = await fetch(`/api/generate-quiz?courseId=${id}`)
            const data = await res.json()
            if (data.success) {
                router.push(`/quiz/${id}`)
            } else {
                alert("Quiz generation failed.")
            }
        } catch (err) {
            alert("Error generating quiz.")
        }
        setCheckingQuiz(false)
    }

    if (loading || !course) return <p className="text-center py-10">Loading course...</p>

    return (
        <Layout headerStyle={5} footerStyle={1}>
            <div className="inner-page-header" style={{ backgroundImage: 'url(/assets/img/bg/header-bg9.png)' }}>
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
                        {course.title}
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
                        {course.description}
                    </p>
                    <br/>
                    <span className="badge bg-secondary">Passing Score: {course.passingScore || 60}%</span>
                </div>
            </div>

            <section className="sp1 container">
                <div className="row justify-content-center">
                    <div className="col-lg-10">
                        <div className="mb-4 text-center">
                            <img
                                src={course.thumbnail || "/assets/img/placeholder.jpg"}
                                alt="Course Thumbnail"
                                className="img-fluid rounded"
                                style={{ maxHeight: "300px", objectFit: "cover" }}
                            />
                        </div>

                        <div className="mb-5 text-end">
                            {!isEnrolled ? (
                                <button className="vl-btn1" onClick={handleEnroll}>
                                    Enroll Now
                                </button>
                            ) : score === null ? (
                                !watchedPrerequisite ? (
                                    <button className="vl-btn1" onClick={() => setShowVideoModal(true)}>
                                        Watch Pre-requisite
                                    </button>
                                ) : quizExists ? (
                                    <Link href={`/quiz/${id}`} className="vl-btn1">
                                        Take Quiz
                                    </Link>
                                ) : (
                                    <button className="vl-btn1" onClick={handleTakeQuiz} disabled={checkingQuiz}>
                                        {checkingQuiz ? "Preparing Quiz..." : "Take Quiz"}
                                    </button>
                                )
                            ) : (
                                <Link href={`/quiz/${id}`} className="vl-btn1">
                                    Retake Quiz ({score}%)
                                </Link>
                            )}
                        </div>

                        <div className="list-group">
                            {modules.map((mod) => {
                                const unlocked = mod.type === "prerequisite" || (score !== null && score >= (course?.passingScore || 60))
                                return (
                                    <div key={mod.id} className="list-group-item p-4 mb-3 border rounded shadow-sm">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <h5 className="mb-1">{mod.title}</h5>
                                                <p className="mb-2">{mod.description}</p>
                                            </div>
                                            {unlocked ? (
                                                <video controls width="300">
                                                    <source src={mod.videoUrl} type="video/mp4" />
                                                    Your browser does not support the video tag.
                                                </video>
                                            ) : (
                                                <span className="badge bg-danger fs-6 px-3 py-2">🔒 Locked</span>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        <hr className="my-5" />
                        <h4 className="mb-4">💬 Course Discussion</h4>
                        <CommentBox courseId={id as string} user={user} />
                    </div>
                </div>
            </section>

            {showVideoModal && prerequisiteModule && (
                <div style={{
                    position: "fixed",
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: "black",
                    zIndex: 9999,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <video
                        src={prerequisiteModule.videoUrl}
                        autoPlay
                        onEnded={handleWatchEnd}
                        style={{ width: "90%", height: "90%" }}
                    />
                </div>
            )}
        </Layout>
    )
}
