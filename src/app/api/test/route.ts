// src/app/api/test/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";


export async function GET() {
  // Let's query the 'students' table as a quick test.
  const { data, error } = await supabase.from("students").select("*").limit(5);

  if (error) {
    console.error("Supabase error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json({ students: data });
}
