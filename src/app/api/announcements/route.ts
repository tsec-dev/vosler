// app/api/announcements/route.ts

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(request: Request) {
  // Parse query parameters from the URL
  const { searchParams } = new URL(request.url);
  const classId = searchParams.get("classId");

  console.log("API GET /announcements called with:", { classId });

  if (!classId) {
    console.error("Missing classId parameter.");
    return NextResponse.json(
      { error: "Missing classId parameter." },
      { status: 400 }
    );
  }

  try {
    // Fetch announcements for the specified class
    const { data: announcements, error: announcementsError } = await supabase
      .from("class_announcements")
      .select("*")
      .eq("class_id", classId)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(5); // Only fetch the 5 most recent announcements

    if (announcementsError) {
      console.error("Error fetching announcements:", announcementsError);
      return NextResponse.json(
        { error: "Error fetching announcements.", detail: announcementsError },
        { status: 500 }
      );
    }

    console.log("Fetched announcements:", announcements);
    return NextResponse.json(announcements || []);
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Parse request body
    const requestBody = await request.json();
    const { classId, title, content, userEmail } = requestBody;

    console.log("API POST /announcements called with:", { classId, title, userEmail });

    if (!classId || !title || !content || !userEmail) {
      console.error("Missing required parameters.");
      return NextResponse.json(
        { error: "Missing required parameters (classId, title, content, userEmail)." },
        { status: 400 }
      );
    }

    // Verify user is an admin by checking the instructors table
    const { data: instructor, error: instructorError } = await supabase
      .from("instructors")
      .select("is_admin")
      .eq("email", userEmail)
      .single();

    if (instructorError) {
      console.error("Error verifying admin status:", instructorError);
      return NextResponse.json(
        { error: "Unauthorized. User not found or not an admin." },
        { status: 403 }
      );
    }

    if (!instructor || !instructor.is_admin) {
      console.error("User is not an admin:", userEmail);
      return NextResponse.json(
        { error: "Unauthorized. Admin privileges required." },
        { status: 403 }
      );
    }

    // Insert new announcement
    const { data: announcement, error: announcementError } = await supabase
      .from("class_announcements")
      .insert([
        {
          class_id: classId,
          title,
          content,
          created_by: userEmail,
          created_at: new Date().toISOString(),
          is_active: true
        },
      ])
      .select()
      .single();

    if (announcementError) {
      console.error("Error creating announcement:", announcementError);
      return NextResponse.json(
        { error: "Error creating announcement.", detail: announcementError },
        { status: 500 }
      );
    }

    console.log("Created announcement:", announcement);
    return NextResponse.json(announcement);
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  // Parse query parameters from the URL
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const userEmail = searchParams.get("userEmail");

  console.log("API DELETE /announcements called with:", { id, userEmail });

  if (!id || !userEmail) {
    console.error("Missing id or userEmail parameter.");
    return NextResponse.json(
      { error: "Missing id or userEmail parameter." },
      { status: 400 }
    );
  }

  try {
    // Verify user is an admin by checking the instructors table
    const { data: instructor, error: instructorError } = await supabase
      .from("instructors")
      .select("is_admin")
      .eq("email", userEmail)
      .single();

    if (instructorError) {
      console.error("Error verifying admin status:", instructorError);
      return NextResponse.json(
        { error: "Unauthorized. User not found or not an admin." },
        { status: 403 }
      );
    }

    if (!instructor || !instructor.is_admin) {
      console.error("User is not an admin:", userEmail);
      return NextResponse.json(
        { error: "Unauthorized. Admin privileges required." },
        { status: 403 }
      );
    }

    // Option 1: Hard delete
    // const { error: deleteError } = await supabase
    //   .from("class_announcements")
    //   .delete()
    //   .eq("id", id);

    // Option 2: Soft delete (recommended)
    const { error: deleteError } = await supabase
      .from("class_announcements")
      .update({ is_active: false })
      .eq("id", id);

    if (deleteError) {
      console.error("Error deleting announcement:", deleteError);
      return NextResponse.json(
        { error: "Error deleting announcement.", detail: deleteError },
        { status: 500 }
      );
    }

    console.log("Deleted announcement:", id);
    return NextResponse.json({ success: true, message: "Announcement deleted" });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}