import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST() {
  try {
    // Try creating photo_albums table via a Supabase RPC
    // First check if it already exists
    const { error: checkError } = await supabaseServer
      .from("photo_albums")
      .select("id")
      .limit(1);

    if (!checkError) {
      // Table exists, check album_id column on media
      const { error: colCheck } = await supabaseServer
        .from("media")
        .select("album_id")
        .limit(1);
      if (!colCheck) {
        return NextResponse.json({ success: true, message: "Migration already applied" });
      }
    }

    return NextResponse.json({
      success: false,
      needsManualMigration: true,
      sql: `-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/iqxjqpxnurxlmolncews/sql):\n\nCREATE TABLE IF NOT EXISTS photo_albums (\n  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,\n  name_en TEXT NOT NULL,\n  name_fr TEXT,\n  cover_url TEXT,\n  created_at TIMESTAMPTZ DEFAULT NOW()\n);\n\nALTER TABLE media ADD COLUMN IF NOT EXISTS album_id UUID REFERENCES photo_albums(id) ON DELETE SET NULL;\n\n-- Enable RLS and policies:\nALTER TABLE photo_albums ENABLE ROW LEVEL SECURITY;\nCREATE POLICY "Allow public read on photo_albums" ON photo_albums FOR SELECT USING (true);\nCREATE POLICY "Allow service role full access on photo_albums" ON photo_albums USING (true) WITH CHECK (true);`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
