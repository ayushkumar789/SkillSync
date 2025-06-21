"use client"

import Layout from "@/components/layout/Layout"
import Link from "next/link"
import { useEffect, useState } from "react"
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "@/lib/firebase"
import withAuthProtection from "@/lib/withAuthProtection"
import Image from "next/image"

function InstructorCoursesPage() {
    const [courses, setCourses] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<any>(null)

    useEffect(() => {
        const storedUser = sessionStorage.getItem("user")
        if (!storedUser) return

        const parsed = JSON.parse(storedUser)
        setUser(parsed)
        loadCourses(parsed.id)
    }, [])

    const loadCourses = async (instructorId: string) => {
        try {
            const q = query(collection(db, "courses"), where("instructorId", "==", instructorId))
            const snap = await getDocs(q)
            const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            setCourses(list)
        } catch (err) {
            console.error("Error fetching courses:", err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Layout headerStyle={5} footerStyle={1}>
            <div className="inner-page-header" style={{ backgroundImage: 'url(/assets/img/bg/header-bg7.png)' }}>
                <div className="container text-center">
                    <h1>My Courses</h1>
                    <span style={{ fontWeight: 500 }}>{user?.email}</span>
                </div>
            </div>

            <section className="sp1 container">
                <div className="row">
                    <div className="col-lg-12 mb-4 d-flex justify-content-between align-items-center">
                        <h4 className="mb-0">Courses You Created</h4>
                        <Link href="/instructor/add-course" className="btn btn-primary btn-sm">+ Add New Course</Link>
                    </div>

                    {loading ? (
                        <p className="text-center py-5">Loading...</p>
                    ) : courses.length === 0 ? (
                        <p className="text-muted">No courses created yet.</p>
                    ) : (
                        <div className="row">
                            {courses.map(course => (
                                <div key={course.id} className="col-md-6 col-lg-4 mb-4">
                                    <div className="card h-100">
                                        <Image
                                            src={course.thumbnail || "/assets/img/bg/placeholder.jpg"}
                                            className="card-img-top"
                                            alt={course.title}
                                            width={500}
                                            height={280}
                                            style={{ objectFit: 'cover', height: '200px' }}
                                        />
                                        <div className="card-body">
                                            <h5 className="card-title">{course.title}</h5>
                                            <p className="card-text small text-muted">{course.category || "No category"}</p>
                                            <div className="d-flex justify-content-between mt-3">
                                                <Link href={`/instructor/edit-course/${course.id}`} className="btn btn-outline-primary btn-sm">Edit</Link>
                                                <Link href={`/courses/${course.id}`} className="btn btn-outline-secondary btn-sm">View</Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </Layout>
    )
}

export default withAuthProtection(InstructorCoursesPage)
