"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "../../server/client";

export default function AddNumber(): JSX.Element {
  const router = useRouter();
  const [number, setNumber] = useState("");

  // Define the tRPC mutation
  const updatePhoneNumber = trpc.addNumberRouter.addNumber.useMutation({
    onSuccess: (data) => {
      console.log(data.message);
      router.push("/");
    },
    onError: (error) => {
      console.error("Error updating phone number:", error.message);
    },
  });

  const handlePhoneNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNumber(event.target.value);
  };

  const handleSubmitNumber = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Trigger the mutation with the input data
    updatePhoneNumber.mutate({ number });
  };

  return (
    <form onSubmit={handleSubmitNumber}>
      <p>Add number to send/receive money</p>
      <label htmlFor="phoneNumber">Phone Number:</label>
      <input
        id="phoneNumber"
        name="phoneNumber"
        value={number}
        onChange={handlePhoneNumberChange}
        required
      />
      <button type="submit" disabled={updatePhoneNumber.isPending}>
        {updatePhoneNumber.isPending ? "Submitting..." : "Submit Phone Number"}
      </button>
      {updatePhoneNumber.error && (
        <p style={{ color: "red" }}>{updatePhoneNumber.error.message}</p>
      )}
    </form>
  );
}
