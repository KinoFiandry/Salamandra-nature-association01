import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET() {
  try {
    const { data, error } = await supabaseServer
      .from("reports")
      .select("*")
      .order("year", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ data: data ?? [] });
  } catch (err: any) {
    console.error("Error fetching reports:", err);
    return NextResponse.json({ error: err.message || "Failed to fetch reports" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...payload } = body;

    // Convert year to integer if present
    if (payload.year) {
      payload.year = parseInt(payload.year, 10) || payload.year;
    }

    // Normalize empty strings to null for optional fields
    if (payload.file_url === "") payload.file_url = null;
    if (payload.description_en === "") payload.description_en = null;
    if (payload.description_fr === "") payload.description_fr = null;

    let error;
    if (id) {
      ({ error } = await supabaseServer.from("reports").update(payload).eq("id", id));
    } else {
      ({ error } = await supabaseServer.from("reports").insert([payload]));
    }

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Error saving report:", err);
    return NextResponse.json({ error: err.message || "Failed to save report" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const { error } = await supabaseServer.from("reports").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Error deleting report:", err);
    return NextResponse.json({ error: err.message || "Failed to delete report" }, { status: 500 });
  }
}
