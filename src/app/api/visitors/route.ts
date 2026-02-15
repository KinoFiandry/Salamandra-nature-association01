import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET() {
  try {
    const { count, error } = await supabaseServer
      .from("site_visits")
      .select("ip_address", { count: "exact", head: false });

    if (error) throw error;

    // Count unique IPs
    const { data, error: viewError } = await supabaseServer
      .from("unique_visitors_count")
      .select("*")
      .single();

    if (viewError) throw viewError;

    return NextResponse.json({ count: data?.count ?? 0 });
  } catch (error: any) {
    console.error("Error fetching visitor count:", error);
    return NextResponse.json({ count: 0 });
  }
}
