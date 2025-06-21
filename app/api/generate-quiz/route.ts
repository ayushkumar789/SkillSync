import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/firebase"
import { collection, getDocs, query, where, setDoc, doc } from "firebase/firestore"

const GEMINI_API_KEY = "AIzaSyDRE7UpZOUar7Sn--wTjDwrRiodP9mxa2I"

export async function GET(req: NextRequest) {
    const courseId = req.nextUrl.searchParams.get("courseId")
    if (!courseId) return NextResponse.json({ success: false, error: "Missing courseId" })

    try {
        // 1. Fetch modules excluding prerequisites
        const moduleQuery = query(collection(db, "modules"), where("courseId", "==", courseId))
        const moduleSnap = await getDocs(moduleQuery)
        const chapters = moduleSnap.docs
            .map((doc) => doc.data())
            .filter((mod: any) => mod.type !== "prerequisite")

        console.log(`[QuizGen] Found ${chapters.length} chapters for course ${courseId}`)

        if (chapters.length === 0)
            return NextResponse.json({ success: false, error: "No chapters found." })

        // 2. Prompt for Gemini
        const prompt = `
Generate 5 multiple choice questions based on the following course chapters:

${chapters.map((c, i) => `Chapter ${i + 1}: ${c.description}`).join("\n\n")}

Format your response strictly as a JSON array:
[
  {
    "question": "...",
    "options": ["...", "...", "...", "..."],
    "answer": "A" // or B, C, D
  }
]
`.trim()

        // 3. Call Gemini API
        const geminiRes = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + GEMINI_API_KEY, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        })

        const geminiJson = await geminiRes.json()
        const raw = geminiJson.candidates?.[0]?.content?.parts?.[0]?.text

        console.log("[Gemini] Raw Response:", raw)

        if (!raw) {
            console.error("[Gemini] Empty response body:", geminiJson)
            return NextResponse.json({ success: false, error: "Gemini returned no text." })
        }

        // 4. Parse JSON
        let cleaned = raw.trim()


        if (cleaned.startsWith("```json")) {
            cleaned = cleaned.slice(7)  // remove ```json\n
        }
        if (cleaned.endsWith("```")) {
            cleaned = cleaned.slice(0, -3)  // remove trailing ```
        }

        let questions
        try {
            questions = JSON.parse(cleaned)
        } catch (err) {
            console.warn("[Gemini] Failed to parse cleaned JSON. Raw:", cleaned)
            return NextResponse.json({ success: false, error: "Could not parse Gemini response." })
        }


        if (!Array.isArray(questions)) {
            questions = Object.values(questions)
        }


        // 5. Save to Firestore
        await setDoc(doc(db, "quizzes", courseId), {
            courseId,
            questions,
            createdAt: new Date()
        })

        console.log(`[QuizGen] Successfully saved quiz for course ${courseId}`)
        return NextResponse.json({ success: true })
    } catch (err) {
        console.error("Gemini quiz generation error:", err)
        return NextResponse.json({ success: false, error: "Server error." })
    }
}
