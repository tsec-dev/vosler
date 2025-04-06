import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-950 text-white">
      <SignIn
        appearance={{
          elements: {
            card: "bg-gray-900 text-white shadow-xl",
            headerTitle: "text-white",
            formButtonPrimary: "bg-indigo-600 hover:bg-indigo-500 text-white",
          },
        }}
      />
    </div>
  );
}
