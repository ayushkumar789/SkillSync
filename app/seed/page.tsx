"use client"
import { useEffect } from "react"
import { seedModuleProgress } from "@/lib/seedEvents"

export default function SeedPage() {
    useEffect(() => {
        seedModuleProgress()
    }, [])

    return <div className="text-center py-5">Seeding module progress...</div>
}
