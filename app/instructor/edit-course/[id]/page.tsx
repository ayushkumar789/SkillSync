"use client"

import Layout from "@/components/layout/Layout"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { db } from "@/lib/firebase"
import {
    doc, getDoc, collection, query,
    where, getDocs, updateDoc
} from "firebase/firestore"

type Chapter = {
    id?: string
    title: string
    description: string
    videoUrl: string
}

export default function EditCourse() {
    const { id } = useParams()
    const router = useRouter()

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [thumbnailUrl, setThumbnailUrl] = useState("")
    const [chapters, setChapters] = useState<Chapter[]>([])
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    useEffect(() => {
        if (!id) return
        loadCourse(id as string)
    }, [id])

    const loadCourse = async (courseId: string) => {
        try {
            const courseRef = doc(db, "courses", courseId)
            const courseSnap = await getDoc(courseRef)

            if (!courseSnap.exists()) {
                setError("Course not found")
                return
            }

            const data = courseSnap.data()
            setTitle(data.title)
            setDescription(data.description)
            setThumbnailUrl(data.thumbnail)

            const q = query(collection(db, "modules"), where("courseId", "==", courseId))
            const chapterSnap = await getDocs(q)
            const chapterList = chapterSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Chapter[]

            setChapters(chapterList)
        } catch (err) {
            console.error(err)
            setError("Failed to load course")
        }
    }

    const handleChapterChange = (index: number, field: keyof Chapter, value: string) => {
        const updated = [...chapters]
        updated[index][field] = value
        setChapters(updated)
    }

    const handleAddChapter = () => {
        setChapters([...chapters, { title: "", description: "", videoUrl: "" }])
    }

    const handleRemoveChapter = (index: number) => {
        const updated = [...chapters]
        updated.splice(index, 1)
        setChapters(updated)
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        setError("")
        setSuccess("")

        try {
            await updateDoc(doc(db, "courses", id as string), {
                title,
                description,
                thumbnail: thumbnailUrl
            })

            for (const chapter of chapters) {
                if (chapter.id) {
                    await updateDoc(doc(db, "modules", chapter.id), {
                        title: chapter.title,
                        description: chapter.description,
                        videoUrl: chapter.videoUrl
                    })
                }
            }

            setSuccess("Course updated successfully!")
            router.push("/instructor/dashboard")
        } catch (err) {
            console.error(err)
            setError("Failed to update course.")
        }
    }

    return (
        <Layout headerStyle={5} footerStyle={1}>
            <div className="inner-page-header" style={{ backgroundImage: 'url(/assets/img/bg/header-bg13.png)' }}>
                <div className="container text-center">
                    <h1>Edit Course</h1>
                </div>
            </div>

            <section className="contact-form-section sp1">
                <div className="container">
                    <form onSubmit={handleSubmit} className="col-lg-8 m-auto">
                        <div className="form-group">
                            <label>Course Title</label>
                            <input type="text" className="form-control" value={title} onChange={e => setTitle(e.target.value)} required />
                        </div>
                        <div className="form-group mt-3">
                            <label>Course Description</label>
                            <textarea className="form-control" rows={3} value={description} onChange={e => setDescription(e.target.value)} required />
                        </div>
                        <div className="form-group mt-3">
                            <label>Thumbnail URL</label>
                            <input type="text" className="form-control" value={thumbnailUrl} onChange={e => setThumbnailUrl(e.target.value)} required />
                        </div>

                        <hr className="my-4" />
                        <h5>Edit Chapters</h5>

                        {chapters.map((chap, idx) => (
                            <div key={idx} className="border p-3 mb-3 rounded">
                                <div className="form-group">
                                    <label>Chapter {idx + 1} Title</label>
                                    <input type="text" className="form-control" value={chap.title} onChange={e => handleChapterChange(idx, "title", e.target.value)} required />
                                </div>
                                <div className="form-group mt-2">
                                    <label>Description</label>
                                    <textarea className="form-control" rows={2} value={chap.description} onChange={e => handleChapterChange(idx, "description", e.target.value)} required />
                                </div>
                                <div className="form-group mt-2">
                                    <label>Video URL</label>
                                    <input type="text" className="form-control" value={chap.videoUrl} onChange={e => handleChapterChange(idx, "videoUrl", e.target.value)} required />
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
                            <button type="submit" className="vl-btn1 w-100">Update Course</button>
                        </div>
                    </form>
                </div>
            </section>
        </Layout>
    )
}
