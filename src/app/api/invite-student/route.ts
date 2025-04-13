import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    console.debug("API payload received:", payload);

    const { email, class_id } = payload;
    const cleanEmail = email?.toLowerCase().trim();

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

    // Step 0: Check for an existing invite in Supabase.
    const { data: existing, error: existingError } = await supabase
      .from("class_students")
      .select("id")
      .eq("email", cleanEmail)
      .eq("class_id", class_id);
    if (existingError) {
      console.error("Error checking existing invite:", existingError);
      throw existingError;
    }
    if (existing && existing.length) {
      return NextResponse.json(
        { error: "This student is already invited to this class." },
        { status: 409 }
      );
    }

    // Step 1: Insert record in Supabase.
    const { error: insertError } = await supabase
      .from("class_students")
      .insert({ email: cleanEmail, class_id });
    if (insertError && insertError.code !== "23505") {
      console.error("Supabase insert error:", insertError);
      throw insertError;
    }

    // Step 2: Interact with Clerk.
    let users;
    try {
      users = await clerkClient.users.getUserList({ emailAddress: [cleanEmail] });
      console.debug("Clerk users found:", users);
    } catch (clerkGetError) {
      console.error("Error fetching user list from Clerk:", clerkGetError);
      throw clerkGetError;
    }

    if (users.length === 0) {
      // New user — try inviting with Clerk
      try {
        console.debug("Inviting new user via Clerk for email:", cleanEmail);
        await clerkClient.invitations.createInvitation({
          emailAddress: cleanEmail,
          redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/sign-in`,
          publicMetadata: {
            invited: true,
            class_id,
          },
        });
        console.debug("Clerk invitation created successfully for:", cleanEmail);
      } catch (clerkInviteError: any) {
        console.warn("Error creating invitation; assuming invitation exists. Falling back to updating metadata.", clerkInviteError);
        // Fallback: update metadata in case an invitation already exists
        try {
          await clerkClient.users.updateUserMetadata(users[0]?.id || "", {
            publicMetadata: {
              invited: true,
              class_id,
            },
          });
          console.debug("Clerk metadata updated successfully for existing user:", users[0]?.id);
        } catch (clerkMetadataError: any) {
          console.error("Clerk update metadata error:", clerkMetadataError);
          throw clerkMetadataError;
        }
      }
    } else {
      // User exists — update metadata
      try {
        console.debug("Updating Clerk metadata for existing user:", users[0].id);
        await clerkClient.users.updateUserMetadata(users[0].id, {
          publicMetadata: {
            invited: true,
            class_id,
          },
        });
        console.debug("Clerk metadata updated successfully for user:", users[0].id);
      } catch (clerkMetadataError: any) {
        console.error("Clerk update metadata error:", clerkMetadataError);
        throw clerkMetadataError;
      }
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
