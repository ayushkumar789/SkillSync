// components/CommentBox.tsx
"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
    addDoc,
    collection,
    query,
    orderBy,
    onSnapshot,
    Timestamp
} from "firebase/firestore";

export default function CommentBox({ courseId, user }: { courseId: string; user: any }) {
    const [comments, setComments] = useState<any[]>([]);
    const [newComment, setNewComment] = useState("");

    useEffect(() => {
        const q = query(
            collection(db, "courses", courseId, "comments"),
            orderBy("timestamp", "asc")
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setComments(list);
        });
        return () => unsubscribe();
    }, [courseId]);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        await addDoc(collection(db, "courses", courseId, "comments"), {
            userId: user.id,
            name: user.name || "Anonymous",
            comment: newComment.trim(),
            timestamp: Timestamp.now(),
        });

        setNewComment("");
    };

    return (
        <div className="mt-4">
            <form onSubmit={handleSubmit} className="mb-4">
        <textarea
            rows={3}
            className="form-control"
            placeholder="Ask a question or leave a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            required
        />
                <button type="submit" className="btn btn-primary mt-2 float-end">
                    Post
                </button>
                <br/>
                <br/>
            </form>

            {comments.length === 0 ? (
                <p className="text-muted">No comments yet. Be the first to ask a question!</p>
            ) : (
                <ul className="list-group">
                    {comments.map((c) => (
                        <li key={c.id} className="list-group-item py-3">
                            <b>{c.name}</b> <br />
                            <span>{c.comment}</span>
                            <div className="text-muted small mt-1">
                                {c.timestamp?.toDate?.().toLocaleString?.()}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
