import { type NextRequest, NextResponse } from "next/server"

const registrations: Array<{
  id: string
  name: string
  email: string
  phone: string
  fileUrl: string
  timestamp: string
}> = []

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, fileUrl } = body

    if (!name || !email || !phone || !fileUrl) {
      return NextResponse.json(
        {
          success: false,
          error: "All fields are required: name, email, phone, fileUrl",
        },
        { status: 400 },
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email format",
        },
        { status: 400 },
      )
    }

    const registration = {
      id: `FU_${Date.now()}_${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      fileUrl,
      timestamp: new Date().toISOString(),
    }

    registrations.push(registration)

    return NextResponse.json({
      success: true,
      message: "Registration submitted successfully!",
      registrationId: registration.id,
      timestamp: registration.timestamp,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "E-Cell FRCRCE Registration API is working!",
    totalRegistrations: registrations.length,
  })
}
