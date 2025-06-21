import { NextResponse } from "next/server"
import { db } from "@/lib/firebase"
import { collection, addDoc, doc, Timestamp } from "firebase/firestore"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { title, description, thumbnail, passingScore, instructorId, modules } = body

        if (!title || !description || !instructorId || !Array.isArray(modules)) {
            return NextResponse.json({ success: false, message: "Invalid request body" }, { status: 400 })
        }

        // 1️⃣ Add course
        const courseRef = await addDoc(collection(db, "courses"), {
            title,
            description,
            thumbnail: thumbnail || "/assets/img/default-course.jpg",
            passingScore: passingScore || 60,
            instructorId,
            createdAt: Timestamp.now()
        })

        // 2️⃣ Add modules (each chapter)
        for (const [index, mod] of modules.entries()) {
            if (!mod.title || !mod.videoUrl) continue

            await addDoc(collection(db, "modules"), {
                courseId: courseRef.id,
                title: mod.title,
                description: mod.description || "",
                videoUrl: mod.videoUrl,
                type: mod.type || "main", // main or prerequisite
                order: index + 1
            })
        }

        return NextResponse.json({ success: true, courseId: courseRef.id })
    } catch (err) {
        console.error("Error adding course:", err)
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
    }
}
