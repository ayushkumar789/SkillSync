"use client"

import Layout from "@/components/layout/Layout"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import Link from "next/link"
import withAuthProtection from "@/lib/withAuthProtection"

function DashboardPage() {
	const router = useRouter()
	const [user, setUser] = useState<any>(null)
	type Enrollment = {
		id: string
		courseId: string
		userId: string
		enrolledAt?: any
	}

	const [enrollments, setEnrollments] = useState<Enrollment[]>([])

	type Course = {
		title: string
		description: string
		thumbnail: string
	}
	const [courses, setCourses] = useState<Record<string, Course>>({})

	const [profile, setProfile] = useState<any>(null)

	useEffect(() => {
		const storedUser = sessionStorage.getItem("user")
		if (!storedUser) {
			router.push("/login")
		} else {
			const parsedUser = JSON.parse(storedUser)
			setUser(parsedUser)
			loadProfile(parsedUser.id)

			if (parsedUser.role === "learner") {
				loadEnrollments(parsedUser.id)
			} else {
				router.push("/instructor/dashboard")
			}
		}
	}, [])

	const loadEnrollments = async (uid: string) => {
		const q = query(collection(db, "enrollments"), where("userId", "==", uid))
		const snap = await getDocs(q)
		const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Enrollment[]
		setEnrollments(list)

		const courseMap: Record<string, Course> = {}
		for (const enroll of list) {
			const ref = doc(db, "courses", enroll.courseId)
			const courseSnap = await getDoc(ref)
			if (courseSnap.exists()) {
				courseMap[enroll.courseId] = courseSnap.data() as Course
			}
		}
		setCourses(courseMap)
	}


	const loadProfile = async (userId: string) => {
		const ref = doc(db, "profiles", userId)
		const snap = await getDoc(ref)
		if (snap.exists()) {
			setProfile(snap.data())
		}
	}

	if (!user) return <p className="text-center py-10">Loading dashboard...</p>

	const defaultProfilePic = "/assets/img/all-images/team/team-img12.png"
	const photo = profile?.photoURL || user.photoURL || defaultProfilePic
	const userName = user.name || "Welcome Learner"
	const userEmail = user.email

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
						Learner Dashboard
					</h1>

					<span style={{
						color: "var(--ztc-text-text-1)",
						fontFamily: "var(--grotesk)",
						fontSize: "var(--ztc-font-size-font-s20)",
						fontStyle: "normal",
						fontWeight: "var(--ztc-weight-regular)",
						lineHeight: "20px",
						marginTop: "14px",
						opacity: 0.7
					}}>
						{userEmail}
					</span>


				</div>
			</div>

			<section className="sp1 container">
				<div className="row">
					<div className="col-lg-4 text-center">
						<img src={photo} className="team-img4 rounded-circle mb-3" width={150} height={150} />
						<h4>{userName}</h4>
						<p>Learner</p>
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
						<div className="mb-4 text-end">
							<Link href="/dashboard/recommend" className="btn btn-success">
								🔍 Find Best Courses
							</Link>
						</div>

						<h4>Your Enrolled Courses</h4>
						{enrollments.length === 0 ? (
							<p className="text-muted">You haven’t enrolled in any courses yet.</p>
						) : (
							<ul className="list-group">
								{enrollments.map(enroll => {
									const course = courses[enroll.courseId]
									return course ? (
										<li key={enroll.id} className="list-group-item d-flex align-items-center justify-content-between">
											<div>
												<b>{course.title}</b><br />
												<small>{course.description}</small>
											</div>
											<Link href={`/courses/${enroll.courseId}`} className="btn btn-sm btn-outline-primary">Continue</Link>
										</li>
									) : null
								})}
							</ul>
						)}
						<h4 className="mt-5">Quiz History</h4>
						{user && (
							<QuizHistory userId={user.id} courseMap={courses} />
						)}
					</div>
				</div>
			</section>
		</Layout>
	)
}
function QuizHistory({ userId, courseMap }: { userId: string, courseMap: Record<string, any> }) {
	const [results, setResults] = useState<any[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const loadResults = async () => {
			const q = query(collection(db, "quizResults"), where("userId", "==", userId))
			const snap = await getDocs(q)
			const list = snap.docs.map(doc => ({
				id: doc.id,
				...doc.data()
			}))
			setResults(list)
			setLoading(false)
		}
		loadResults()
	}, [userId])

	if (loading) return <p>Loading quiz history...</p>
	if (results.length === 0) return <p className="text-muted">No quizzes attempted yet.</p>

	return (
		<div className="table-responsive">
			<table className="table table-bordered text-center">
				<thead className="table-light">
				<tr>
					<th>Course</th>
					<th>Score</th>
					<th>Result</th>
					<th>Date</th>
					<th>Actions</th>
				</tr>
				</thead>
				<tbody>
				{results.map((res, idx) => {
					const course = courseMap[res.courseId]
					const courseTitle = course?.title || "Unknown Course"
					const passingScore = course?.passingScore || 60
					const passed = res.score >= passingScore
					return (
						<tr key={idx}>
							<td>{courseTitle}</td>
							<td>{res.score}%</td>
							<td>
									<span className={`badge ${passed ? "bg-success" : "bg-danger"}`}>
										{passed ? "Passed" : "Failed"}
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
					)
				})}
				</tbody>
			</table>
		</div>
	)
}

export default withAuthProtection(DashboardPage)
