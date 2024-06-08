"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function VerifyEmail() {
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const searchParams = useSearchParams();
  const verificationToken = searchParams.get("verificationCode"); // Use type assertion for safety
  console.log(verificationToken);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch(
          `/api/auth/verify?verificationCode=${verificationToken}`
        );
        console.log(response);

        if (response.ok) {
          setIsVerified(true);
          // Redirect to "/" on successful verification (optional)
          router.push("/");
        } else {
          const data = await response.json();
          setErrorMessage(data.message);
        }
      } catch (error) {
        console.error("Error verifying email:", error);
        setErrorMessage("An error occurred. Please try again later.");
      }
    };

    if (verificationToken) {
      verifyEmail(); // Call verification function if token exists
    }
  }, []); // Run useEffect only when verificationToken changes

  return (
    <div>
      {isVerified ? (
        <p>Your email has been verified !</p>
      ) : (
        <div>
          {errorMessage ? (
            <p className="error">{errorMessage}</p>
          ) : (
            <p>Verifying your email...</p>
          )}
        </div>
      )}
    </div>
  );
}
