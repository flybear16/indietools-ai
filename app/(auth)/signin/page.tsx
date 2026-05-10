"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Github, Mail } from "lucide-react";

export default function SignInPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSignIn = async (provider: string) => {
    setLoading(provider);
    await signIn(provider, { callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to IndieTools
          </h1>
          <p className="text-gray-600">
            Sign in to submit tools, write reviews, and more
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => handleSignIn("github")}
            disabled={!!loading}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition disabled:opacity-50"
          >
            {loading === "github" ? (
              <span className="animate-pulse">Signing in...</span>
            ) : (
              <>
                <Github className="w-5 h-5" />
                Continue with GitHub
              </>
            )}
          </button>

          <button
            onClick={() => handleSignIn("google")}
            disabled={!!loading}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white text-gray-700 border-2 border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition disabled:opacity-50"
          >
            {loading === "google" ? (
              <span className="animate-pulse">Signing in...</span>
            ) : (
              <>
                <Mail className="w-5 h-5" />
                Continue with Google
              </>
            )}
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-8">
          By signing in, you agree to our terms of service and privacy policy.
        </p>
      </div>
    </div>
  );
}