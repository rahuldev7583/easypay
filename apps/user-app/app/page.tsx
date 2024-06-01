"use client";
import { Button } from "@repo/ui/components/ui/button";
import { useBalance } from "@repo/store";

export default function Page(): JSX.Element {
  const balance = useBalance();
  return (
    <main className="">
      <Button>Button</Button>
      <p>your balance is {balance}</p>
    </main>
  );
}
