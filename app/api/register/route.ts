import { createClient } from '@supabase/supabase-js';
import { type NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, fileUrl } = await req.json();

    console.log("📥 Received data:", { name, email, phone, fileUrl });

    if (!name || !email || !phone || !fileUrl) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.from('registrations').insert([
      {
        name,
        email,
        phone,
        file_url: fileUrl,
      },
    ]);

    if (error) {
      console.error('❌ Supabase insert error:', error.message, error.details, error.hint);
      return NextResponse.json(
        { success: false, error: 'Database insert failed' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Registration successful!',
      id: data?.[0]?.id,
    });
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
