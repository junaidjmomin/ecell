import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"

export async function POST(request: NextRequest) {
  try {
    const { filename, contentType } = await request.json()

    if (!filename) {
      return NextResponse.json({ error: "Filename is required" }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ["application/pdf", "application/zip"]
    const fileName = filename.toLowerCase()

    if (!allowedTypes.includes(contentType) && !fileName.endsWith(".pdf") && !fileName.endsWith(".zip")) {
      return NextResponse.json({ error: "Only PDF and ZIP files are allowed" }, { status: 400 })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const fileExtension = filename.split(".").pop()
    const uniqueFilename = `formula-unicorn/${timestamp}-${randomString}.${fileExtension}`

    // Use @vercel/blob put method to upload
    // We'll create a temporary blob first to get the URL structure
    const tempBlob = await put(uniqueFilename, new Uint8Array(0), {
      access: "public",
      contentType: contentType || "application/octet-stream",
    })

    console.log("Upload URL created successfully:", tempBlob.url)

    return NextResponse.json({
      success: true,
      uploadUrl: tempBlob.url,
      downloadUrl: tempBlob.url,
      filename: uniqueFilename,
    })
  } catch (error) {
    console.error("Upload URL creation error:", error)
    return NextResponse.json(
      {
        error: "Failed to create upload URL",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
