import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const allowedTypes = ["application/pdf", "application/zip"]
    const fileName = file.name.toLowerCase()

    if (!allowedTypes.includes(file.type) && !fileName.endsWith(".pdf") && !fileName.endsWith(".zip")) {
      return NextResponse.json({ error: "Only PDF and ZIP files are allowed" }, { status: 400 })
    }

    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File size must be less than 10MB" }, { status: 400 })
    }

    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const fileExtension = file.name.split(".").pop()
    const uniqueFilename = `formula-unicorn/${timestamp}-${randomString}.${fileExtension}`

    const blob = await put(uniqueFilename, file, {
      access: "public",
    })

    return NextResponse.json({
      success: true,
      url: blob.url,
      filename: uniqueFilename,
      size: file.size,
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to upload file",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
