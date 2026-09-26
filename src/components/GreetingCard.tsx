import React from "react";

interface GreetingCardProps {
  name?: string;
}

export default function GreetingCard({ name }: GreetingCardProps) {
  const greetingText = name && name.trim()
    ? `Welcome ${name.trim()}, I’m your Daily Preparation partner. Together we’ll ensure you are always ready.`
    : "Welcome, I’m your Daily Preparation partner. Together we’ll ensure you are always ready.";

  return (
    <div
      data-name="Greeting Frame"
      className="w-full max-w-[353px] lg:max-w-[410px] rounded-[22px] py-6 px-4 shadow-md border border-white/10"
      style={{
        backgroundColor: "rgba(46, 42, 38, 0.50)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      <h1 className="text-white font-mobile-h1 lg:font-h1">
        {greetingText}
      </h1>
    </div>
  );
}
