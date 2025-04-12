import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { supabase } from "@/lib/supabaseClient"; // using your already-exported instance

export async function POST(req: Request) {
  const { email, class_id } = await req.json();

  if (!email || !class_id) {
    return NextResponse.json({ error: "Missing email or class ID" }, { status: 400 });
  }

  try {
    // ✅ Step 1: Add to class_students (ignore if already added)
    const { error: insertError } = await supabase
      .from("class_students")
      .insert({ email: email.toLowerCase(), class_id });

    if (insertError && insertError.code !== "23505") {
      // 23505 = duplicate entry (unique violation)
      console.error("Supabase insert error:", insertError);
      throw insertError;
    }

    // ✅ Step 2: Try to promote existing Clerk user OR invite new one
    const users = await clerkClient.users.getUserList({ emailAddress: [email] });

    if (users.length === 0) {
      // 📨 Invite new student
      await clerkClient.invitations.createInvitation({
        emailAddress: email,
        redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/sign-in`,
        publicMetadata: {
          role: "student",
          class_id,
        },
      });
    } else {
      // 👤 Update metadata if user already exists
      await clerkClient.users.updateUserMetadata(users[0].id, {
        publicMetadata: {
          role: "student",
          class_id,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error inviting student:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
