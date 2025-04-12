import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  const { email, class_id } = await req.json();

  const cleanEmail = email?.toLowerCase().trim();

  if (!cleanEmail || !cleanEmail.includes("@") || !class_id) {
    return NextResponse.json({ error: "Missing or invalid email or class ID" }, { status: 400 });
  }

  if (!process.env.NEXT_PUBLIC_APP_URL) {
    console.error("❌ Missing NEXT_PUBLIC_APP_URL in env");
    return NextResponse.json({ error: "Server misconfiguration: redirect URL missing" }, { status: 500 });
  }

  try {
    // ✅ Step 0: Check for existing invite
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

    // ✅ Step 1: Add student to class_students
    const { error: insertError } = await supabase
      .from("class_students")
      .insert({ email: cleanEmail, class_id });

    if (insertError && insertError.code !== "23505") {
      console.error("❌ Supabase insert error:", insertError.message);
      throw insertError;
    }

    // ✅ Step 2: Check if user exists in Clerk
    const users = await clerkClient.users.getUserList({ emailAddress: [cleanEmail] });

    if (users.length === 0) {
      // 📨 Invite new user
      await clerkClient.invitations.createInvitation({
        emailAddress: cleanEmail,
        redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/sign-in`,
        publicMetadata: {
          invited: true,
          class_id,
        },
      });
    } else {
      // 👤 Update metadata if user exists
      await clerkClient.users.updateUserMetadata(users[0].id, {
        publicMetadata: {
          invited: true,
          class_id,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("❌ Error inviting student:", err?.message || err);
    return NextResponse.json(
      { error: err?.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
