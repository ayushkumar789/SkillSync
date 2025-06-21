import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs/promises'

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData()
        const file = formData.get('file') as File
        const folder = formData.get('folder')?.toString() || 'uploads'

        if (!file || typeof file === 'string') {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
        }

        const buffer = Buffer.from(await file.arrayBuffer())
        const timestamp = Date.now()
        const ext = file.name.split('.').pop()
        const fileName = `${timestamp}.${ext}`
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder)
        const filePath = path.join(uploadDir, fileName)

        await fs.mkdir(uploadDir, { recursive: true })
        await fs.writeFile(filePath, buffer)

        return NextResponse.json({ filePath: `/uploads/${folder}/${fileName}` }, { status: 200 })
    } catch (err) {
        console.error('Upload failed:', err)
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
    }
}
