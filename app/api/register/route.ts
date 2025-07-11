import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  const { name, email, phone, fileUrl } = await req.json();

  if (!name || !email || !phone || !fileUrl) {
    return new Response("Missing fields", { status: 400 });
  }

  const { data, error } = await supabase.from("registrations").insert([
    {
      name,
      email,
      phone,
      file_url: fileUrl,
    },
  ]);

  if (error) {
    console.error("❌ Supabase insert error:", error);
    return new Response("Failed to save registration", { status: 500 });
  }

  return Response.json({ success: true, id: data?.[0]?.id });
}
