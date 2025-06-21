"use client"

import Layout from "@/components/layout/Layout"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import Link from "next/link"
import withAuthProtection from "@/lib/withAuthProtection"

function InstructorDashboard() {
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [profile, setProfile] = useState<any>(null)
    const [courses, setCourses] = useState<any[]>([])

    useEffect(() => {
        const storedUser = sessionStorage.getItem("user")
        if (!storedUser) {
            router.push("/login")
        } else {
            const parsedUser = JSON.parse(storedUser)
            setUser(parsedUser)
            loadProfile(parsedUser.id)

            if (parsedUser.role === "instructor") {
                loadCourses(parsedUser.id)
            } else {
                router.push("/dashboard")
            }
        }
    }, [])

    const loadProfile = async (userId: string) => {
        const ref = doc(db, "profiles", userId)
        const snap = await getDoc(ref)
        if (snap.exists()) setProfile(snap.data())
    }

    const loadCourses = async (instructorId: string) => {
        const q = query(collection(db, "courses"), where("instructorId", "==", instructorId))
        const snap = await getDocs(q)
        const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        setCourses(list)
    }

    if (!user) return <p className="text-center py-10">Loading dashboard...</p>

    const defaultProfilePic = "/assets/img/all-images/team/team-img12.png"
    const photo = profile?.photoURL || user.photoURL || defaultProfilePic
    const userName = user.name || "Instructor"
    const userEmail = user.email

    return (
        <Layout headerStyle={5} footerStyle={1}>
            <div className="inner-page-header" style={{ backgroundImage: 'url(/assets/img/bg/header-bg7.png)' }}>
                <div className="container text-center">
                    <h1>Instructor Dashboard</h1>
                    <span style={{ fontWeight: 500 }}>{userEmail}</span>
                </div>
            </div>

            <section className="sp1 container">
                <div className="row">
                    <div className="col-lg-4 text-center">
                        <img src={photo} className="team-img4 rounded-circle mb-3" width={150} height={150} />
                        <h4>{userName}</h4>
                        <p>Instructor</p>
                        <Link href="/dashboard/profile" className="btn btn-outline-primary mt-3">Edit Profile</Link>

                        {profile && (
                            <div className="mt-4 text-start">
                                {profile.department && <p><b>Department:</b> {profile.department}</p>}
                                {profile.phone && <p><b>Phone:</b> {profile.phone}</p>}
                                {profile.bio && <p><b>Bio:</b><br /> {profile.bio}</p>}
                            </div>
                        )}
                    </div>

                    <div className="col-lg-8">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h4>Your Courses</h4>
                            <Link href="/instructor/add-course" className="btn btn-sm btn-primary">+ Add New Course</Link>
                        </div>

                        {courses.length === 0 ? (
                            <p className="text-muted">You haven’t added any courses yet.</p>
                        ) : (
                            <ul className="list-group">
                                {courses.map(course => (
                                    <li key={course.id} className="list-group-item d-flex align-items-center justify-content-between">
                                        <div>
                                            <b>{course.title}</b><br />
                                            <small>{course.description}</small>
                                        </div>
                                        <Link href={`/instructor/edit-course/${course.id}`} className="btn btn-sm btn-outline-primary">Edit</Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </section>
        </Layout>
    )
}

export default withAuthProtection(InstructorDashboard)
