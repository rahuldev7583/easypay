"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function AddNumber(): JSX.Element {
  const router = useRouter();
  const [number, setNumber] = useState("");

  const handlePhoneNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNumber(event.target.value);
  };

  const handleSubmitNumber = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      const response = await axios.post("/api/addnumber", {
        number,
      });

      if (response.status !== 200) {
        console.error("Error updating phone number:", response.data.message);
      } else {
        console.log("Phone number updated successfully!");

        router.push("/");
      }
    } catch (error) {
      console.error("Error updating phone number:", error);
    }
  };
  return (
    <form onSubmit={handleSubmitNumber}>
      <p> Add number to send/receive money</p>
      <label htmlFor="phoneNumber">Phone Number:</label>
      <input
        id="phoneNumber"
        name="phoneNumber"
        value={number}
        onChange={handlePhoneNumberChange}
        required
      />

      <button type="submit">Submit Phone Number</button>
    </form>
  );
}
