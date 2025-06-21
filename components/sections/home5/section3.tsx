'use client'

import { useEffect, useState } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import Link from "next/link"
import Image from "next/image"

type CourseType = {
	id: string;
	title: string;
	description: string;
	thumbnail: string;
	instructorName: string;
	duration: string;
};

export default function Section3() {
	const [courses, setCourses] = useState<CourseType[]>([])

	useEffect(() => {
		const fetchCourses = async () => {
			const courseSnap = await getDocs(collection(db, "courses"))
			const courseList = courseSnap.docs.map(doc => {
				const data = doc.data()
				return {
					id: doc.id,
					title: data.title,
					description: data.description,
					thumbnail: data.thumbnail || "/assets/img/default-course.png",
					instructorName: data.instructorName || "Unknown Instructor",
					duration: data.duration || "--"
				}
			})
			setCourses(courseList)
		}
		fetchCourses()
	}, [])

	return (
		<div className="event5-section-area sp6">
			<img src="/assets/img/elements/elements28.png" alt="" className="elements28" />
			<img src="/assets/img/elements/elements29.png" alt="" className="elements29" />

			<div className="container">
				<div className="row">
					<div className="col-lg-8 m-auto">
						<div className="event2-header heading8 text-center space-margin80">
							<h5><img src="/assets/img/icons/sub-logo1.svg" alt="" /> Course Launches</h5>
							<div className="space32" />
							<h2 className="text-anime-style-3">Latest <span>Courses</span></h2>
						</div>
					</div>
				</div>

				<div className="row">
					<div className="col-lg-12" data-aos="fade-up" data-aos-duration={1000}>
						<div className="event-widget-area">
							{courses.length === 0 ? (
								<p className="text-center text-muted">No courses available at the moment.</p>
							) : (
								courses.map((course, index) => {
									const isReversed = index % 2 === 1
									return (
										<div className="row" key={course.id}>
											<div className="col-lg-1" />
											<div className="col-lg-10 m-auto">
												<div className="event2-boxarea box1">
													<h1 className="active">0{index + 1}</h1>
													<div className="row align-items-center">
														{!isReversed && (
															<div className="col-lg-5">
																<div className="img1">
																	<Image src={course.thumbnail} alt={course.title} width={500} height={300} className="w-100 rounded" />
																</div>
															</div>
														)}

														<div className="col-lg-1" />
														<div className="col-lg-6">
															<div className="content-area">
																<ul>
																	<li><span><img src="/assets/img/icons/clock1.svg" alt="" /> Duration: {course.duration}</span></li>
																</ul>
																<div className="space20" />
																<Link href={`/courses/${course.id}`} className="head">{course.title}</Link>
																<div className="space24" />

																<div className="author-area">
																	<div className="autho-name-area">
																		<div className="img1">
																			<Image src="/assets/img/instructor.png" alt={course.instructorName} width={50} height={50} className="rounded-circle" />
																		</div>
																		<div className="text">
																			<span>{course.instructorName}</span>
																			<p>Instructor</p>
																		</div>
																	</div>
																</div>

																<div className="space24" />
																<div className="btn-area1">
																	<Link href={`/courses/${course.id}`} className="vl-btn5">
																		<span className="demo">View Course</span>
																		<span className="arrow"><i className="fa-solid fa-arrow-right" /></span>
																	</Link>
																</div>
															</div>
														</div>

														{isReversed && (
															<div className="col-lg-5">
																<div className="img1">
																	<Image src={course.thumbnail} alt={course.title} width={500} height={300} className="w-100 rounded" />
																</div>
															</div>
														)}
													</div>
												</div>
											</div>
										</div>
									)
								})
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
