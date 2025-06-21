'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function MobileMenu({ isMobileMenu, handleMobileMenu }: any) {
	const [isAccordion, setIsAccordion] = useState<number | null>(null)
	const [user, setUser] = useState<any>(null)

	useEffect(() => {
		if (typeof window !== 'undefined') {
			const storedUser = sessionStorage.getItem('user')
			if (storedUser) setUser(JSON.parse(storedUser))
		}
	}, [])

	const isLoggedIn = !!user
	const role = user?.role

	const handleAccordion = (key: number) => {
		setIsAccordion(prev => (prev === key ? null : key))
	}

	return (
		<div className={`mobile-sidebar mobile-sidebar1 ${isMobileMenu ? 'mobile-menu-active' : ''}`}>
			<div className="logosicon-area">
				<div className="logos">
					<img src="/assets/img/logo/logo2.png" alt="logo" />
				</div>
				<div className="menu-close" onClick={handleMobileMenu}>
					<i className="fa-solid fa-xmark" />
				</div>
			</div>

			<div className="mobile-nav mobile-nav1">
				<ul className="mobile-nav-list nav-list1">
					<li><Link href="/" className="hash-nav">Home</Link></li>

					<li className="has-sub hash-has-sub">
						<span className={`submenu-button ${isAccordion === 1 ? 'submenu-opened' : ''}`} onClick={() => handleAccordion(1)}><em /></span>
						<Link href="#" className="hash-nav">Courses</Link>
						<ul className={`sub-menu ${isAccordion === 1 ? 'open-sub' : ''}`}>
							<li><Link href="/courses" className="hash-nav">All Courses</Link></li>
							{role === 'instructor' && (
								<li><Link href="/instructor/dashboard/create-course" className="hash-nav">Create Course</Link></li>
							)}
						</ul>
					</li>

					{isLoggedIn && (
						<li className="has-sub hash-has-sub">
							<span className={`submenu-button ${isAccordion === 2 ? 'submenu-opened' : ''}`} onClick={() => handleAccordion(2)}><em /></span>
							<Link href="#" className="hash-nav">Assessments</Link>
							<ul className={`sub-menu ${isAccordion === 2 ? 'open-sub' : ''}`}>
								{role === 'learner' && <li><Link href="/dashboard" className="hash-nav">My Dashboard</Link></li>}
								{role === 'instructor' && <li><Link href="/instructor/dashboard" className="hash-nav">Instructor Dashboard</Link></li>}
								<li><Link href="/quiz-history" className="hash-nav">Quiz History</Link></li>
							</ul>
						</li>
					)}

					{isLoggedIn && (
						<li className="has-sub hash-has-sub">
							<span className={`submenu-button ${isAccordion === 3 ? 'submenu-opened' : ''}`} onClick={() => handleAccordion(3)}><em /></span>
							<Link href="#" className="hash-nav">Achievements</Link>
							<ul className={`sub-menu ${isAccordion === 3 ? 'open-sub' : ''}`}>
								<li><Link href="/leaderboard" className="hash-nav">Leaderboard</Link></li>
								<li><Link href="/badges" className="hash-nav">My Badges</Link></li>
							</ul>
						</li>
					)}

					<li className="has-sub hash-has-sub">
						<span className={`submenu-button ${isAccordion === 4 ? 'submenu-opened' : ''}`} onClick={() => handleAccordion(4)}><em /></span>
						<Link href="#" className="hash-nav">Pages</Link>
						<ul className={`sub-menu ${isAccordion === 4 ? 'open-sub' : ''}`}>
							<li><Link href="/about" className="hash-nav">About</Link></li>
							<li><Link href="/contact" className="hash-nav">Contact</Link></li>
						</ul>
					</li>

					<li className="hash-has-sub">
						{isLoggedIn ? (
							<button onClick={() => {
								sessionStorage.removeItem('user')
								window.location.href = '/login'
							}} className="hash-nav" style={{ background: 'none', border: 'none', padding: 0 }}>
								Logout
							</button>
						) : (
							<Link href="/login" className="hash-nav">Login</Link>
						)}
					</li>
				</ul>
			</div>
		</div>
	)
}
