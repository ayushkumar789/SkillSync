import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, doc, getDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET() {
    const resultsSnapshot = await getDocs(query(collection(db, "quizResults"), orderBy("score", "desc")));

    const leaderboard = await Promise.all(resultsSnapshot.docs.map(async (docSnap) => {
        const result = docSnap.data();
        const userRef = doc(db, "users", result.userId);
        const userDoc = await getDoc(userRef);

        return {
            name: userDoc.exists() ? userDoc.data().name : "Unknown",
            score: result.score
        };
    }));

    return NextResponse.json({ leaderboard });
}
