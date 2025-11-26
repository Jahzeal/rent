"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface SignInData {
  email: string;
  password: string;
}

interface SignUpData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const signIn = async ({ email, password }: SignInData) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.message || "Sign in failed");
        return;
      }

      const data = await res.json();
      localStorage.setItem("access_token", data.access_token);
      router.push("/rentals"); // redirect after login
    } catch (err) {
      setError("An error occurred during sign in.");
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (data: SignUpData) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errData = await res.json();
        setError(errData.message || "Signup failed");
        return;
      }

      const result = await res.json();
      // optionally, auto-login after signup:
      localStorage.setItem("access_token", result.access_token);
      router.push("/rentals");
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { signIn, signUp, loading, error };
};
