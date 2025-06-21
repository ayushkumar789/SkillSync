import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const { interests, skill_level, goal } = await req.json();

    try {
        const res = await fetch("https://course-recommender-emah.onrender.com/api/recommend", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ interests, skill_level, goal })
        });

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch recommendations" }, { status: 500 });
    }
}
