import { clerkClient } from "@clerk/clerk-sdk-node";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, metadata = { admin: true } } = body;

  if (!email) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

  try {
    const users = await clerkClient.users.getUserList({ emailAddress: [email] });

    if (users.length > 0) {
      // User already exists — promote them
      await clerkClient.users.updateUserMetadata(users[0].id, {
        publicMetadata: metadata,
      });

      return NextResponse.json({ promoted: true });
    } else {
      // User does not exist — send invite
      await clerkClient.invitations.createInvitation({
        emailAddress: email,
        redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/sign-in`, // Optional
        publicMetadata: metadata,
      });

      return NextResponse.json({ invited: true });
    }
  } catch (error) {
    console.error("Clerk invite/promotion failed:", error);
    return NextResponse.json({ error: "Clerk error" }, { status: 500 });
  }
}