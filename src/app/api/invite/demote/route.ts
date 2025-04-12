import { clerkClient } from "@clerk/clerk-sdk-node";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

  try {
    const users = await clerkClient.users.getUserList({ emailAddress: [email] });

    if (!users.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await clerkClient.users.updateUserMetadata(users[0].id, {
      publicMetadata: {
        admin: false,
      },
    });

    return NextResponse.json({ success: true, demoted: true });
  } catch (error) {
    console.error("Demotion error:", error);
    return NextResponse.json({ error: "Failed to demote user" }, { status: 500 });
  }
}
