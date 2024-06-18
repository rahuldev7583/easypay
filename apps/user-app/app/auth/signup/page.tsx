"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "../../../server/client";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    number: "",
    password: "",
  });

  const router = useRouter();

  // Using useMutation hook from trpc
  const signupMutation = trpc.signupRouter.signup.useMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signupMutation.mutate(formData, {
      onSuccess: (data) => {
        alert(data.message);
        setFormData({
          name: "",
          email: "",
          number: "",
          password: "",
        });
        router.push("/");
      },
      onError: (error) => {
        console.error("Sign up failed:", error.message);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </label>
      <br />
      <label>
        Email:
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </label>
      <br />
      <label>
        Phone Number:
        <input
          type="text"
          name="number"
          value={formData.number}
          onChange={handleChange}
          required
        />
      </label>
      <br />
      <label>
        Password:
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </label>
      <br />
      <button type="submit" disabled={signupMutation.isPending}>
        {signupMutation.isPending ? "Signing up..." : "Sign Up"}
      </button>
      {signupMutation.error && <p>{signupMutation.error.message}</p>}
    </form>
  );
}
