'use client'

import { useState } from "react"
import { db } from "@/lib/firebase"
import { collection, addDoc, getDocs, query, where } from "firebase/firestore"
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function Register() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [role, setRole] = useState("learner")
    const [error, setError] = useState("")
    const router = useRouter()

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        try {
            const usersRef = collection(db, "users")
            const q = query(usersRef, where("email", "==", email))
            const snap = await getDocs(q)
            if (!snap.empty) return setError("Email already registered")

            await addDoc(usersRef, {
                name,
                email,
                password,
                role,
                xp: 0,
                badges: [],
                streak: 0,
                createdAt: new Date()
            })

            alert("✅ Registration successful!")
            router.push("/login")
        } catch (err: any) {
            console.error(err)
            setError("Something went wrong. Please try again.")
        }
    }

    return (
        <Layout headerStyle={5} footerStyle={1}>
            <div className="inner-page-header" style={{ backgroundImage: "url(/assets/img/bg/header-bg13.png)" }}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 m-auto text-center">
                            <div className="heading1">
                                <h1>Register</h1>
                                <Link href="/">Home</Link> <i className="fa-solid fa-angle-right mx-2" /> <span>Register</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <section className="contact-form-section sp1">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-6">
                            <form onSubmit={handleRegister}>
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input type="text" className="form-control" placeholder="Your full name" value={name} onChange={(e) => setName(e.target.value)} required />
                                </div>

                                <div className="form-group mt-3">
                                    <label>Email</label>
                                    <input type="email" className="form-control" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                </div>

                                <div className="form-group mt-3">
                                    <label>Password</label>
                                    <input type="password" className="form-control" placeholder="Create password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                </div>

                                <div className="form-group mt-3">
                                    <label>Role</label>
                                    <select className="form-control" value={role} onChange={(e) => setRole(e.target.value)}>
                                        <option value="learner">Learner</option>
                                        <option value="instructor">Instructor</option>
                                    </select>
                                </div>

                                {error && <div className="alert alert-danger mt-3">{error}</div>}

                                <div className="form-group mt-4">
                                    <button type="submit" className="vl-btn1 w-100">Register</button>
                                </div>

                                <div className="text-center mt-3">
                                    Already have an account? <Link href="/login" className="text-decoration-underline">Login here</Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    )
}
