// src/app/api/profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { getAuth, clerkClient } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get Clerk user data
    const clerk = await clerkClient();
    const userData = await clerk.users.getUser(userId);
    const email = userData.emailAddresses?.[0]?.emailAddress;
    if (!email) {
      return NextResponse.json({ error: "Email not found" }, { status: 400 });
    }

    const { firstName, lastName, deployments, kids, pets, timeInGrade, timeInService } = await req.json();

    // Upsert student record into Supabase
    const { data, error } = await supabase
      .from("students")
      .upsert(
        {
          id: userId, // using Clerk's user id (a string)
          email,
          first_name: firstName,
          last_name: lastName,
          deployments,
          kids,
          pets,
          time_in_grade: timeInGrade,
          time_in_service: timeInService,
        },
        { onConflict: "id" }
      )
      .single();

    console.log("Upsert result:", { data, error });

    if (error) {
      console.error("Error updating profile:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Profile updated successfully", data });
  } catch (err: any) {
    console.error("Error in profile update API:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
