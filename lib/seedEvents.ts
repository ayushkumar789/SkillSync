import { db } from "@/lib/firebase"
import { doc, setDoc } from "firebase/firestore"

export async function seedModuleProgress() {
    const userId = "DW00kK4vtowApN4tbBXd"  // replace with session user ID if dynamic
    const courseId = "9rFz4FHyLa3NEgzJ8ra3"
    const moduleId = "wVmBXwdICV86axYIlhVJ"  // prerequisite module ID

    const docId = `${userId}_${courseId}_prereq`

    await setDoc(doc(db, "moduleProgress", docId), {
        userId,
        courseId,
        moduleId,
        type: "prereq",
        watched: true,
        timestamp: new Date()
    })

    console.log("✅ Module progress seeded successfully.")
}
