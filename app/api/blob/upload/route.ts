import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"

export async function POST(request: NextRequest) {
  try {
    console.log("🔄 File upload started")

    // Get the file from FormData
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      console.error("❌ No file provided")
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    console.log("📁 File received:", {
      name: file.name,
      size: file.size,
      type: file.type,
    })

    // Validate file type
    const allowedTypes = ["application/pdf", "application/zip"]
    const fileName = file.name.toLowerCase()

    if (!allowedTypes.includes(file.type) && !fileName.endsWith(".pdf") && !fileName.endsWith(".zip")) {
      console.error("❌ Invalid file type:", file.type)
      return NextResponse.json({ error: "Only PDF and ZIP files are allowed" }, { status: 400 })
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      console.error("❌ File too large:", file.size)
      return NextResponse.json({ error: "File size must be less than 10MB" }, { status: 400 })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const fileExtension = file.name.split(".").pop()
    const uniqueFilename = `formula-unicorn/${timestamp}-${randomString}.${fileExtension}`

    console.log("📤 Uploading to Blob:", uniqueFilename)

    // Upload to Vercel Blob
    const blob = await put(uniqueFilename, file, {
      access: "public",
    })

    console.log("✅ File uploaded successfully:", blob.url)

    return NextResponse.json({
      success: true,
      url: blob.url,
      filename: uniqueFilename,
    })
  } catch (error) {
    console.error("❌ Blob upload error:", error)
    return NextResponse.json(
      {
        error: "Failed to upload file",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
