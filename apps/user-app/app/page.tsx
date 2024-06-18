"use client";
import { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { trpc } from "../server/client";

export default function Page(): JSX.Element {
  const { data: session } = useSession();
  const router = useRouter();

  // Use tRPC query hook to get user data
  const {
    data: userData,
    isLoading,
    error,
  } = trpc.user.getUser.useQuery(undefined, {
    enabled: !!session, // Only run query if session is available
  });

  useEffect(() => {
    if (userData && !userData.number) {
      router.push("/addnumber");
    }
  }, [userData, router]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error fetching user data: {error.message}</p>;
  }

  return (
    <main className="">
      {session ? (
        <>
          Signed in as {session.user?.email} <br />
          {userData && <p>Phone number: {userData.number}</p>}
          <button onClick={() => signOut()}>Sign out</button>
        </>
      ) : (
        <>
          <button onClick={() => router.push("/auth/signup")}>Signup</button>
          <br />
          <button onClick={() => signIn("google")}>Sign Up with Google</button>
          <br />
          <button onClick={() => signIn("github")}>Sign Up with GitHub</button>
          <br />
          <p>Already have an account</p>
          <button onClick={() => signIn("")}>Sign in</button>
        </>
      )}
    </main>
  );
}
