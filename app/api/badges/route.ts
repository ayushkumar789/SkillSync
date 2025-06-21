import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) return NextResponse.json({ error: "User ID missing" }, { status: 400 });

    const resultsSnap = await getDocs(query(collection(db, "quiz_results"), where("userId", "==", userId)));
    const results = resultsSnap.docs.map(doc => doc.data());

    const badgeSet = new Set();
    let highScoreCount = 0;

    results.forEach(r => {
        if (r.score >= 40) badgeSet.add("Beginner");
        if (r.score >= 80) highScoreCount++;
    });

    if (results.length >= 3) badgeSet.add("Consistent Learner");
    if (highScoreCount >= 3) badgeSet.add("Quiz Master");

    return NextResponse.json({ badges: Array.from(badgeSet) });
}
