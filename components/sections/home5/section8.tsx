'use client'
import CountUp from 'react-countup'

export default function Section8() {
	return (
		<>
			<div className="counter5-section-area">
				<div className="container">
					<div className="row">
						<div className="col-lg-3 col-md-6">
							<div className="counter-box">
								<h2><CountUp className="odometer" enableScrollSpy={true} end={50} />+</h2>
								<p>Courses Launched</p>
							</div>
						</div>
						<div className="col-lg-3 col-md-6">
							<div className="counter-box">
								<h2><CountUp className="odometer" enableScrollSpy={true} end={1200} />+</h2>
								<p>Active Learners</p>
							</div>
						</div>
						<div className="col-lg-3 col-md-6">
							<div className="counter-box">
								<h2><CountUp className="odometer" enableScrollSpy={true} end={75} />+</h2>
								<p>Expert Instructors</p>
							</div>
						</div>
						<div className="col-lg-3 col-md-6">
							<div className="counter-box">
								<h2><CountUp className="odometer" enableScrollSpy={true} end={20} />K+</h2>
								<p>Learning Hours Delivered</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
