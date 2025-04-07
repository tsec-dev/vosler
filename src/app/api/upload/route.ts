// src/app/api/uploads/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { getAuth } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  try {
    // Get authenticated user id from Clerk
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Fetch uploads for the user (you might want to adjust your filtering logic)
    const { data, error } = await supabase
      .from("uploads")
      .select("*")
      .eq("student_id", userId);
    
    if (error) {
      console.error("Error fetching uploads:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ data });
  } catch (error: any) {
    console.error("Error in uploads endpoint:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
