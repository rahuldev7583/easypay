"use client";
// import { Button } from "@repo/ui/components/ui/button";
// import { useBalance } from "@repo/store";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import HelloComponent from "../components/hello";

export default function Page(): JSX.Element {
  // const balance = useBalance();
  const { data: session } = useSession();
  const [user, setUser] = useState<any>({});
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      if (session) {
        try {
          const response = await fetch("/api/user");
          const user = await response.json();
          setUser(user);
          console.log(user);

          if (!user.number || user.number == null) {
            router.push("/addnumber");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUser();
  }, [session]);

  return (
    <main className="">
      {session ? (
        <>
          Signed in as {session.user?.email} <br />
          {/* {<p>phone number {user.number}</p>} */}
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
          <HelloComponent />
        </>
      )}
      {/* <p>your balance is {balance}</p> */}
    </main>
  );
}
