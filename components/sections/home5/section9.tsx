'use client'
import Link from 'next/link'
import { Autoplay, Navigation, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

const swiperOptions = {
	modules: [Autoplay, Pagination, Navigation],
	slidesPerView: 2,
	spaceBetween: 30,
	autoplay: {
		delay: 2500,
		disableOnInteraction: false,
	},
	loop: true,

	navigation: {
		nextEl: '.h1n',
		prevEl: '.h1p',
	},

	pagination: {
		el: '.swiper-pagination',
		clickable: true,
	},

	breakpoints: {
		320: { slidesPerView: 1, spaceBetween: 30 },
		575: { slidesPerView: 2, spaceBetween: 30 },
		767: { slidesPerView: 2, spaceBetween: 30 },
		991: { slidesPerView: 2, spaceBetween: 30 },
		1199: { slidesPerView: 2, spaceBetween: 30 },
		1350: { slidesPerView: 2, spaceBetween: 30 },
	}
}

export default function Section9() {
	return (
		<>
			<div className="memory5-section-area sp6">
				<div className="container">
					<div className="row">
						<div className="col-lg-12">
							<div className="memory-heaer2 heading8 space-margin80">
								<div className="heading8">
									<h5><img src="/assets/img/icons/sub-logo1.svg" alt="" /> Learning Highlights</h5>
									<div className="space18" />
									<h2 className="text-anime-style-3">SkillSync <span>Gallery</span></h2>
								</div>
							</div>
						</div>
						<div className="col-lg-12 memory-widget-slider5">
							<Swiper {...swiperOptions} className="owl-carousel">
								<SwiperSlide className="memory-widget-boxarea">
									<div className="img1">
										<img src="/assets/img/all-images/memory/memory-img13.jpg" alt="Workshop Snap" />
									</div>
									<div className="content-area">
										<Link href="/gallery" className="arrow"><i className="fa-solid fa-arrow-right" /></Link>
										<div className="text">
											<p>2025 Bootcamp</p>
											<div className="space12" />
											<Link href="/gallery">AI Masterclass Moments</Link>
										</div>
									</div>
								</SwiperSlide>
								<SwiperSlide className="memory-widget-boxarea">
									<div className="img1">
										<img src="/assets/img/all-images/memory/memory-img14.jpg" alt="Hackathon" />
									</div>
									<div className="content-area">
										<Link href="/gallery" className="arrow"><i className="fa-solid fa-arrow-right" /></Link>
										<div className="text">
											<p>SkillSync Hackathon</p>
											<div className="space12" />
											<Link href="/gallery">Team Collaboration Showcase</Link>
										</div>
									</div>
								</SwiperSlide>
								<SwiperSlide className="memory-widget-boxarea">
									<div className="img1">
										<img src="/assets/img/all-images/memory/memory-img15.jpg" alt="Project Presentation" />
									</div>
									<div className="content-area">
										<Link href="/gallery" className="arrow"><i className="fa-solid fa-arrow-right" /></Link>
										<div className="text">
											<p>Course Completion</p>
											<div className="space12" />
											<Link href="/gallery">Student Success Stories</Link>
										</div>
									</div>
								</SwiperSlide>
							</Swiper>

							<div className="owl-nav">
								<button type="button" role="presentation" className="owl-prev h1p">
									<i className="fa-solid fa-angle-left" />
								</button>
								<button type="button" role="presentation" className="owl-next h1n">
									<i className="fa-solid fa-angle-right" />
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
