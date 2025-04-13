// Example: app/api/invite-student/route.ts (Next.js 13+) or pages/api/invite-student.ts for Next.js 12

import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    console.debug("API payload received:", payload); // Extra debug logging

    const { email, class_id } = payload;
    const cleanEmail = email?.toLowerCase().trim();

    // Debug logging of values
    console.debug("Clean Email:", cleanEmail);
    console.debug("Class ID:", class_id);

    if (!cleanEmail || !cleanEmail.includes("@") || !class_id) {
      console.error("Invalid invite parameters", { cleanEmail, class_id });
      return NextResponse.json(
        { error: "Missing or invalid email or class ID" },
        { status: 400 }
      );
    }

    if (!process.env.NEXT_PUBLIC_APP_URL) {
      console.error("❌ Missing NEXT_PUBLIC_APP_URL in env");
      return NextResponse.json(
        { error: "Server misconfiguration: redirect URL missing" },
        { status: 500 }
      );
    }

    // Step 0: Check for existing invite
    const { data: existing } = await supabase
      .from("class_students")
      .select("id")
      .eq("email", cleanEmail)
      .eq("class_id", class_id);

    if (existing?.length) {
      return NextResponse.json(
        { error: "This student is already invited to this class." },
        { status: 409 }
      );
    }

    // Step 1: Add student to class_students
    const { error: insertError } = await supabase
      .from("class_students")
      .insert({ email: cleanEmail, class_id });

    if (insertError && insertError.code !== "23505") {
      console.error("Supabase insert error:", insertError);
      throw insertError;
    }

    // Step 2: Check if user exists in Clerk
    const users = await clerkClient.users.getUserList({ emailAddress: [cleanEmail] });

    if (users.length === 0) {
      // Invite new user
      console.debug("Inviting new user via Clerk for email:", cleanEmail);
      await clerkClient.invitations.createInvitation({
        emailAddress: cleanEmail,
        redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/sign-in`,
        publicMetadata: {
          invited: true,
          class_id,
        },
      });
    } else {
      // Update metadata for existing user
      console.debug("Updating Clerk metadata for existing user:", users[0].id);
      await clerkClient.users.updateUserMetadata(users[0].id, {
        publicMetadata: {
          invited: true,
          class_id,
        },
      });
    }
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Error inviting student:", err?.message || err);
    return NextResponse.json(
      { error: err?.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
