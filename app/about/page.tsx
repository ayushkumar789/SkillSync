'use client'

import CountUp from 'react-countup'
import Countdown from '@/components/elements/Countdown'
import Layout from "@/components/layout/Layout"
import BrandSlider from '@/components/slider/BrandSlider'
import Link from "next/link"

export default function About() {
	return (
		<Layout headerStyle={5} footerStyle={1}>
			<div>
				<div className="inner-page-header" style={{ backgroundImage: 'url(assets/img/bg/header-bg5.png)' }}>
					<div className="container">
						<div className="row">
							<div className="col-lg-4 m-auto">
								<div className="heading1 text-center">
									<h1>About SkillSync</h1>
									<div className="space20" />
									<Link href="/">Home <i className="fa-solid fa-angle-right" /> <span>About</span></Link>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="about1-section-area sp1">
					<div className="container">
						<div className="row align-items-center">
							<div className="col-lg-6">
								<div className="about-imges">
									<div className="img1 reveal image-anime">
										<img src="/assets/img/all-images/about/about-img1.png" alt="" />
									</div>
									<div className="row">
										<div className="col-lg-6 col-md-6">
											<div className="space30" />
											<div className="img1 reveal image-anime">
												<img src="/assets/img/all-images/about/about-img2.png" alt="" />
											</div>
										</div>
										<div className="col-lg-6 col-md-6">
											<div className="space30" />
											<div className="img1 reveal image-anime">
												<img src="/assets/img/all-images/about/about-img3.png" alt="" />
											</div>
										</div>
									</div>
									<div className="about-btnarea">
										<svg xmlns="http://www.w3.org/2000/svg" width={200} height={200} viewBox="0 0 200 200" fill="none" className="keyframe5">
											<path d="M93.8771 2.53621C96.8982 1.28483 98.4087 0.659138 100 0.659138C101.591 0.659138 103.102 1.28483 106.123 2.5362L164.588 26.7531C167.609 28.0045 169.119 28.6302 170.245 29.7554C171.37 30.8806 171.995 32.3912 173.247 35.4123L197.464 93.8771C198.715 96.8982 199.341 98.4087 199.341 100C199.341 101.591 198.715 103.102 197.464 106.123L173.247 164.588C171.995 167.609 171.37 169.119 170.245 170.245C169.119 171.37 167.609 171.995 164.588 173.247L106.123 197.464C103.102 198.715 101.591 199.341 100 199.341C98.4087 199.341 96.8982 198.715 93.8771 197.464L35.4123 173.247C32.3912 171.995 30.8806 171.37 29.7554 170.245C28.6302 169.119 28.0045 167.609 26.7531 164.588L2.53621 106.123C1.28483 103.102 0.659138 101.591 0.659138 100C0.659138 98.4087 1.28483 96.8982 2.5362 93.8771L26.7531 35.4123C28.0045 32.3912 28.6302 30.8806 29.7554 29.7554C30.8806 28.6302 32.3912 28.0045 35.4123 26.7531L93.8771 2.53621Z" fill="#FFBA00" />
										</svg>
										<Link href="/courses">
											<span><i className="fa-solid fa-arrow-right" /></span>
											<br />
											<div className="space12" />
											View Courses
										</Link>
									</div>
								</div>
							</div>

							<div className="col-lg-6">
								<div className="about-header-area heading2">
									<h5>About Our Platform</h5>
									<div className="space16" />
									<h2 className="text-anime-style-3">Interactive Learning. Personalized Progress.</h2>
									<div className="space16" />
									<p>
										<strong>SkillSync</strong> is an adaptive e-learning platform built to transform how students engage with online courses.
										Our system integrates interactive assessments, smart learning paths, and gamified rewards to keep learning effective and fun.
									</p>
									<div className="space32" />
									<div className="about-counter-area">
										<div className="counter-box">
											<h2><CountUp enableScrollSpy end={15} />+</h2>
											<p>Courses</p>
										</div>
										<div className="counter-box box2">
											<h2><CountUp enableScrollSpy end={40} />+</h2>
											<p>Modules & Quizzes</p>
										</div>
										<div className="counter-box box3" style={{ border: 'none' }}>
											<h2><CountUp enableScrollSpy end={1000} />+</h2>
											<p>Active Learners</p>
										</div>
									</div>
									<div className="space32" />
									<div className="btn-area1">
										<Link href="/dashboard" className="vl-btn1">Go to Dashboard</Link>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="brands3-section-area sp2">
					<div className="container">
						<div className="row">
							<div className="col-lg-5 m-auto">
								<div className="brand-header heading4 space-margin60 text-center">
									<h3>Trusted by Institutions & Educators</h3>
								</div>
							</div>
						</div>
						<div className="row">
							<div className="col-lg-12">
								<BrandSlider />
							</div>
						</div>
					</div>
				</div>

				<div className="choose-section-area sp2">
					<div className="container">
						<div className="row">
							<div className="col-lg-4 m-auto text-center space-margin60">
								<div className="heading2">
									<h5>Why SkillSync?</h5>
									<h2>Key Highlights</h2>
								</div>
							</div>
						</div>
						<div className="row">
							{[
								["Adaptive Learning", "Unlock new chapters only after passing intelligent quizzes."],
								["Gamified Progress", "Earn XP, badges, and track your journey with rewards."],
								["Quiz-Based Access", "Complete quizzes to access advanced modules and topics."],
								["Instructor Tools", "Create interactive course content with chapters and tests."],
								["AI-Powered Reports", "Get insights on learner performance and improvement areas."],
								["Mobile First", "Fully responsive platform for learners on the go."]
							].map(([title, desc], idx) => (
								<div className="col-lg-4 col-md-6" key={idx}>
									<div className="choose-widget-boxarea">
										<div className="icons">
											<img src="/assets/img/icons/choose-icons1.svg" alt="" />
										</div>
										<div className="space24" />
										<div className="content-area">
											<h5>{title}</h5>
											<div className="space16" />
											<p>{desc}</p>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>

				<div className="cta1-section-area d-lg-block d-block">
					<div className="container">
						<div className="row">
							<div className="col-lg-10 m-auto">
								<div className="cta1-main-boxarea">
									<div className="timer-btn-area">
										<Countdown />
										<div className="btn-area1">
											<Link href="/register" className="vl-btn1">Start Learning</Link>
										</div>
									</div>
									<ul>
										<li><img src="/assets/img/icons/calender1.svg" alt="" />24x7 Learning Access</li>
										<li><img src="/assets/img/icons/location1.svg" alt="" />From Anywhere, Anytime</li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>

			</div>
		</Layout>
	)
}
