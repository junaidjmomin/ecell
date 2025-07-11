import { createClient } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'

// ✅ Validate env variables
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  throw new Error("❌ Missing Supabase environment variables.")
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, fileUrl } = body

    console.log("📥 Received data:", body)

    if (!name || !email || !phone || !fileUrl) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase.from('registrations').insert([
      {
        name,
        email,
        phone,
        file_url: fileUrl,
      },
    ])

    if (error) {
      console.error("❌ Supabase insert error:", error)
      return NextResponse.json(
        {
          success: false,
          error: 'Database insert failed',
          details: error.message,
        },
        { status: 500 }
      )
    }

    console.log("✅ Supabase insert success:", data)

    return NextResponse.json({
      success: true,
      message: 'Registration successful!',
      id: data?.[0]?.id,
    })
  } catch (err: any) {
    console.error("❌ Unexpected error:", err.message || err)
    return NextResponse.json(
      { success: false, error: 'Unexpected server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'E-Cell FRCRCE Registration API is live!',
  })
}
