import React from "react";

interface GreetingCardProps {
  name?: string;
}

export default function GreetingCard({ name = "Mandy" }: GreetingCardProps) {
  return (
    <div
      data-name="Greeting Frame"
      className="w-full max-w-[390px] rounded-[24px] p-6 shadow-md border border-white/10"
      style={{
        backgroundColor: "rgba(107, 101, 91, 0.78)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      <h1 className="text-white font-mobile-h1 lg:font-h1">
        Welcome {name}, I’m your Daily Preparation partner. Together we’ll ensure you are always ready!
      </h1>
    </div>
  );
}
