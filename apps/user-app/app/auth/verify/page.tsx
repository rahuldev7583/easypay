"use client";
import { useRouter } from "next/navigation";
import { trpc } from "../../../server/client";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const verificationCode = searchParams.get("verificationCode");
  const router = useRouter();

  const verifyEmailMutation = trpc.verification.verifyEmail.useMutation({
    onSuccess: (data) => {
      alert(data.message);
      router.push("/");
    },
    onError: (error) => {
      console.error("Verification failed:", error.message);
    },
  });

  useEffect(() => {
    if (verificationCode) {
      verifyEmailMutation.mutate({ verificationCode });
    }
  }, [verificationCode]);

  return (
    <div>
      {verifyEmailMutation.isPending && <p>Verifying...</p>}
      {verifyEmailMutation.isError && (
        <p>Error: {verifyEmailMutation.error.message}</p>
      )}
    </div>
  );
}
