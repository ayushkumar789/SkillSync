'use client'
import AOS from 'aos'
import { useEffect, useState } from "react"
import AddClassBody from '../elements/AddClassBody'
import BackToTop from '../elements/BackToTop'
import Footer1 from './footer/Footer1'
import Header5 from "./header/Header5"
import MobileMenu from './MobileMenu'

interface LayoutProps {
	headerStyle?: Number
	footerStyle?: Number
	children?: React.ReactNode
	breadcrumbTitle?: string
}

export default function Layout({ headerStyle, footerStyle, breadcrumbTitle, children }: LayoutProps) {
	const [scroll, setScroll] = useState<boolean>(false)
	const [isMobileMenu, setMobileMenu] = useState<boolean>(false)
	const handleMobileMenu = (): void => setMobileMenu(!isMobileMenu)
	const [isSearch, setSearch] = useState<boolean>(false)
	const handleSearch = (): void => setSearch(!isSearch)

	useEffect(() => {
		AOS.init()
		const handleScroll = (): void => {
			const scrollCheck: boolean = window.scrollY > 100
			if (scrollCheck !== scroll) {
				setScroll(scrollCheck)
			}
		}
		document.addEventListener("scroll", handleScroll)
		return () => {
			document.removeEventListener("scroll", handleScroll)
		}
	}, [scroll])

	return (
		<>
			<div id="top" />
			<AddClassBody />
			<Header5 scroll={scroll} isMobileMenu={isMobileMenu} handleMobileMenu={handleMobileMenu} isSearch={isSearch} handleSearch={handleSearch} />
			<MobileMenu isMobileMenu={isMobileMenu} handleMobileMenu={handleMobileMenu} />
			{children}
			<Footer1 />
			<BackToTop target="#top" />
		</>
	)
}
