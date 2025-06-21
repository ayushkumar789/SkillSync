'use client'
import { useState } from "react"

export default function Section7() {
	const [isTab, setIsTab] = useState(1)
	const handleTab = (i: number) => setIsTab(i)

	return (
		<>
			<div className="attent1-section-area sp6">
				<div className="container">
					<div className="row">
						<div className="col-lg-11 m-auto">
							<div className="heading8 text-center space-margin80">
								<h5><img src="/assets/img/icons/sub-logo1.svg" alt="" />SkillSync Learning Flow</h5>
								<div className="space32" />
								<h2>How You Can <span>Start Learning</span></h2>
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col-lg-12">
							<div className="tab-container">
								<div className="row align-items-center">
									<div className="col-lg-1" />
									<div className="col-lg-5">
										<ul className="nav flex-column nav-pills" role="tablist" aria-orientation="vertical">
											<li className="nav-item" onClick={() => handleTab(1)}>
												<a className={isTab === 1 ? "nav-link active" : "nav-link"}>
													<svg className="svg1" xmlns="http://www.w3.org/2000/svg" width={29} height={75} viewBox="0 0 29 75" fill="none">
														<path d="M0.946169 36.2765C0.388977 36.997 0.388978 38.003 0.94617 38.7235L29 75L29 0L0.946169 36.2765Z" fill="white" fillOpacity="0.2" />
													</svg>
													<svg className="svg2" xmlns="http://www.w3.org/2000/svg" width={29} height={75} viewBox="0 0 29 75" fill="none">
														<path d="M0.946169 36.2765C0.388977 36.997 0.388978 38.003 0.94617 38.7235L29 75L29 0L0.946169 36.2765Z" fill="url(#paint0_linear_2700_2802)" />
														<defs>
															<linearGradient id="paint0_linear_2700_2802" x1={0} y1={0} x2="50.4562" y2="19.5097" gradientUnits="userSpaceOnUse">
																<stop stopColor="#FF7A00" />
																<stop offset={1} stopColor="#FF0000" />
															</linearGradient>
														</defs>
													</svg>
													Sign Up & Create Profile
													<span>Start by registering as a learner or instructor. Customize your profile to match your interests or teaching goals.</span>
												</a>
											</li>
											<li className="nav-item" onClick={() => handleTab(2)}>
												<a className={isTab === 2 ? "nav-link active" : "nav-link"}>
													<svg className="svg1" xmlns="http://www.w3.org/2000/svg" width={29} height={75} viewBox="0 0 29 75" fill="none">
														<path d="M0.946169 36.2765C0.388977 36.997 0.388978 38.003 0.94617 38.7235L29 75L29 0L0.946169 36.2765Z" fill="white" fillOpacity="0.2" />
													</svg>
													<svg className="svg2" xmlns="http://www.w3.org/2000/svg" width={29} height={75} viewBox="0 0 29 75" fill="none">
														<path d="M0.946169 36.2765C0.388977 36.997 0.388978 38.003 0.94617 38.7235L29 75L29 0L0.946169 36.2765Z" fill="url(#paint0_linear_2700_2802)" />
														<defs>
															<linearGradient id="paint0_linear_2700_2802" x1={0} y1={0} x2="50.4562" y2="19.5097" gradientUnits="userSpaceOnUse">
																<stop stopColor="#FF7A00" />
																<stop offset={1} stopColor="#FF0000" />
															</linearGradient>
														</defs>
													</svg>
													Browse Courses & Enroll
													<span>Explore a wide range of courses. Read course info, preview chapters, and enroll in what excites you the most.</span>
												</a>
											</li>
											<li className="nav-item" onClick={() => handleTab(3)}>
												<a className={isTab === 3 ? "nav-link m-0 active" : "nav-link m-0"}>
													<svg className="svg1" xmlns="http://www.w3.org/2000/svg" width={29} height={75} viewBox="0 0 29 75" fill="none">
														<path d="M0.946169 36.2765C0.388977 36.997 0.388978 38.003 0.94617 38.7235L29 75L29 0L0.946169 36.2765Z" fill="white" fillOpacity="0.2" />
													</svg>
													<svg className="svg2" xmlns="http://www.w3.org/2000/svg" width={29} height={75} viewBox="0 0 29 75" fill="none">
														<path d="M0.946169 36.2765C0.388977 36.997 0.388978 38.003 0.94617 38.7235L29 75L29 0L0.946169 36.2765Z" fill="url(#paint0_linear_2700_2802)" />
														<defs>
															<linearGradient id="paint0_linear_2700_2802" x1={0} y1={0} x2="50.4562" y2="19.5097" gradientUnits="userSpaceOnUse">
																<stop stopColor="#FF7A00" />
																<stop offset={1} stopColor="#FF0000" />
															</linearGradient>
														</defs>
													</svg>
													Learn, Quiz & Unlock XP
													<span>Watch videos, complete chapter quizzes, and earn points as you progress through your personalized learning path.</span>
												</a>
											</li>
										</ul>
									</div>

									{/* Tab Images Section (With placeholder images) */}
									<div className="col-lg-6">
										<div className="tab-content">
											{[1, 2, 3].map(i => (
												<div key={i} className={isTab === i ? "tab-pane fade show active" : "tab-pane fade"}>
													<div className="about3-images">
														<img src="https://picsum.photos/seed/primary-img/311/118" alt="" className="about-img10 aniamtion-key-1" />
														<div className="img1" data-aos="zoom-in" data-aos-duration={1000}>
															<img src="https://picsum.photos/seed/img1/470/470" alt="" />
														</div>
														<div className="img2" data-aos="zoom-in" data-aos-duration={1100}>
															<img src="https://picsum.photos/seed/img2/200/200" alt="" />
														</div>
														<div className="img3" data-aos="zoom-in" data-aos-duration={1200}>
															<img src="https://picsum.photos/seed/img3/237/237" alt="" />
														</div>
													</div>
												</div>
											))}
										</div>
									</div>

								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
