import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await currentUser();
  if (user) {
    // If authenticated, send them to dashboard
    redirect("/dashboard");
  } else {
    // Otherwise, send them to sign-in
    redirect("/sign-in");
  }
}
