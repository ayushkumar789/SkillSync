'use client'

import { useEffect, useState } from "react"
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "@/lib/firebase"
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import { useUser } from "@/lib/useUser"

type Course = {
    id: string
    title: string
    description: string
    thumbnail: string
}

type Enrollment = {
    id: string
    userId: string
    courseId: string
}

export default function CoursesPage() {
    const [courses, setCourses] = useState<Course[]>([])
    const [enrollments, setEnrollments] = useState<string[]>([])
    const { user } = useUser() // Custom auth context

    useEffect(() => {
        const fetchCourses = async () => {
            const snapshot = await getDocs(collection(db, "courses"))
            const fetched: Course[] = snapshot.docs.map(doc => ({
                id: doc.id,
                ...(doc.data() as Omit<Course, 'id'>)
            }))
            setCourses(fetched)
        }

        const fetchEnrollments = async () => {
            if (!user?.id) return
            const q = query(collection(db, "enrollments"), where("userId", "==", user.id))
            const snap = await getDocs(q)
            const enrolledCourseIds = snap.docs.map(doc => doc.data().courseId)
            setEnrollments(enrolledCourseIds)
        }

        fetchCourses()
        fetchEnrollments()
    }, [user?.id])

    return (
        <Layout headerStyle={5} footerStyle={1}>
            <div className="inner-page-header" style={{ backgroundImage: 'url(/assets/img/bg/header-bg13.png)' }}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 m-auto">
                            <div className="heading1 text-center">
                                <h1>Browse Courses</h1>
                                <div className="space20" />
                                <Link href="/">Home <i className="fa-solid fa-angle-right" /> <span>Courses</span></Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bloginner-section-area sp1">
                <div className="container">
                    <div className="row">
                        {courses.map((course, index) => {
                            const isEnrolled = enrollments.includes(course.id)

                            return (
                                <div className="col-lg-4 col-md-6" key={course.id} data-aos="zoom-in" data-aos-duration={800 + index * 200}>
                                    <div className="blog4-boxarea">
                                        <div className="img1">
                                            <img src={course.thumbnail} alt={course.title} />
                                        </div>
                                        <div className="content-area">
                                            <ul>
                                                <li><img src="/assets/img/icons/user1.svg" alt="lead" /> {course.title}</li>
                                            </ul>
                                            <div className="space20" />
                                            <Link href={`/courses/${course.id}`}>{course.title}</Link>
                                            <p style={{ marginTop: "10px" }}>{course.description}</p>
                                            <div className="space24" />
                                            <Link href={`/courses/${course.id}`} className="readmore">
                                                {isEnrolled ? "Continue Course" : "Enroll Now"} <i className="fa-solid fa-arrow-right" />
                                            </Link>
                                            <div className="arrow">
                                                <Link href={`/courses/${course.id}`}><i className="fa-solid fa-arrow-right" /></Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </Layout>
    )
}
