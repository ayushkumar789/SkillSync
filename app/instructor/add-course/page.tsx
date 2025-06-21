"use client"

import Layout from "@/components/layout/Layout"
import { useState } from "react"
import { db } from "@/lib/firebase"
import { collection, addDoc } from "firebase/firestore"
import { useRouter } from "next/navigation"
import axios from "axios"

type Chapter = {
    title: string
    description: string
    videoFile?: File | null
}

export default function AddCourse() {
    const router = useRouter()
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
    const [prerequisiteVideo, setPrerequisiteVideo] = useState<File | null>(null)
    const [chapters, setChapters] = useState<Chapter[]>([
        { title: "", description: "", videoFile: null }
    ])

    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const handleAddChapter = () => {
        setChapters([...chapters, { title: "", description: "", videoFile: null }])
    }

    const handleRemoveChapter = (index: number) => {
        const updated = [...chapters]
        updated.splice(index, 1)
        setChapters(updated)
    }

    const handleChapterChange = (index: number, field: keyof Chapter, value: any) => {
        const updated = [...chapters]
        updated[index][field] = value
        setChapters(updated)
    }

    const uploadFile = async (file: File, folder: string) => {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("folder", folder)

        const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
        })

        const data = await res.json()
        return data.filePath // /uploads/courses/xyz.jpg
    }

    const generateQuiz = async (chapters: Chapter[], courseId: string) => {
        try {
            const prompt = `Generate 5 multiple choice questions (with 4 options each and correct answer) based on these chapter descriptions:\n\n` +
                chapters.map((ch, i) => `Chapter ${i + 1}: ${ch.description}`).join("\n") +
                `\n\nFormat:\n[\n  { "question": "...", "options": ["...","...","...","..."], "answer": "..." },\n  ...\n]`

            const res = await axios.post("https://api.cohere.ai/v1/generate", {
                model: "command-r",
                prompt,
                max_tokens: 800,
                temperature: 0.7
            }, {
                headers: {
                    Authorization: `Bearer g7F2O148MMJrD0dFAZxrU6tCwpbi8scso1ZkJzF1`,
                    "Content-Type": "application/json"
                }
            })

            const rawText = res.data.generations[0].text
            const quiz = JSON.parse(rawText)

            await addDoc(collection(db, "quizzes"), {
                courseId,
                questions: quiz,
                createdAt: new Date()
            })
        } catch (err) {
            console.error("Quiz generation failed:", err)
        }
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        setError("")
        setSuccess("")

        try {
            const storedUser = JSON.parse(sessionStorage.getItem("user") || "{}")

            if (!thumbnailFile) return setError("Please upload a course thumbnail.")
            if (!prerequisiteVideo) return setError("Please upload a prerequisite video.")

            const thumbnailPath = await uploadFile(thumbnailFile, "courses")
            const prereqVideoPath = await uploadFile(prerequisiteVideo, "videos")

            const courseRef = await addDoc(collection(db, "courses"), {
                title,
                description,
                thumbnail: thumbnailPath,
                instructorId: storedUser.id,
                createdAt: new Date()
            })

            const courseId = courseRef.id

            // Save prerequisite module first
            await addDoc(collection(db, "modules"), {
                courseId,
                title: "Prerequisite",
                description: "Complete this introduction before starting the course.",
                videoUrl: prereqVideoPath,
                order: 0,
                type: "prerequisite"
            })

            // Save main chapters
            for (let i = 0; i < chapters.length; i++) {
                const chap = chapters[i]
                if (!chap.videoFile) continue

                const videoPath = await uploadFile(chap.videoFile, "videos")

                await addDoc(collection(db, "modules"), {
                    courseId,
                    title: chap.title,
                    description: chap.description,
                    videoUrl: videoPath,
                    order: i + 1,
                    type: "main"
                })
            }

            await generateQuiz(chapters, courseId)

            setSuccess("Course and quiz created successfully!")
            router.push("/instructor/dashboard")
        } catch (err) {
            console.error(err)
            setError("Something went wrong while saving the course.")
        }
    }

    return (
        <Layout headerStyle={5} footerStyle={1}>
            <div className="inner-page-header" style={{ backgroundImage: 'url(/assets/img/bg/header-bg13.png)' }}>
                <div className="container text-center"><h1>Add New Course</h1></div>
            </div>

            <section className="contact-form-section sp1">
                <div className="container">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Course Title</label>
                            <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} required />
                        </div>

                        <div className="form-group mt-3">
                            <label>Course Description</label>
                            <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} required />
                        </div>

                        <div className="form-group mt-3">
                            <label>Thumbnail Image</label>
                            <input type="file" className="form-control" accept="image/*" onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)} required />
                        </div>

                        <hr className="my-4" />
                        <h5 className="mb-3">📘 Prerequisite Video</h5>
                        <div className="form-group">
                            <input type="file" className="form-control" accept="video/*" onChange={(e) => setPrerequisiteVideo(e.target.files?.[0] || null)} required />
                        </div>

                        <hr className="my-4" />
                        <h5>📚 Chapters</h5>
                        {chapters.map((chap, idx) => (
                            <div key={idx} className="border rounded p-3 mb-3">
                                <div className="form-group">
                                    <label>Chapter {idx + 1} Title</label>
                                    <input type="text" className="form-control" value={chap.title} onChange={(e) => handleChapterChange(idx, "title", e.target.value)} required />
                                </div>
                                <div className="form-group mt-2">
                                    <label>Description</label>
                                    <textarea className="form-control" value={chap.description} onChange={(e) => handleChapterChange(idx, "description", e.target.value)} rows={2} required />
                                </div>
                                <div className="form-group mt-2">
                                    <label>Video File</label>
                                    <input type="file" className="form-control" accept="video/*" onChange={(e) => handleChapterChange(idx, "videoFile", e.target.files?.[0] || null)} required />
                                </div>
                                <button type="button" className="btn btn-sm btn-danger mt-2" onClick={() => handleRemoveChapter(idx)}>Remove Chapter</button>
                            </div>
                        ))}

                        <div className="text-end">
                            <button type="button" className="btn btn-outline-secondary" onClick={handleAddChapter}>+ Add Chapter</button>
                        </div>

                        {error && <div className="alert alert-danger mt-4">{error}</div>}
                        {success && <div className="alert alert-success mt-4">{success}</div>}

                        <div className="form-group mt-4">
                            <button type="submit" className="vl-btn1 w-100">Create Course</button>
                        </div>
                    </form>
                </div>
            </section>
        </Layout>
    )
}
