"use client";

import { useState } from "react";

export default function LeadForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [stateCode, setStateCode] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, state_code: stateCode || undefined }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
        setName("");
        setStateCode("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center shadow-sm">
        <p className="text-xl font-bold text-green-800 mb-2">You&apos;re in!</p>
        <p className="text-green-700">We&apos;ll connect you with programs in your area.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md mx-auto">
      <input
        type="text"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="bg-white border-2 border-gray-200 rounded-xl px-6 py-4 text-lg focus:border-blue-500 focus:outline-none transition-colors shadow-sm"
      />
      <input
        type="email"
        placeholder="Your email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="bg-white border-2 border-gray-200 rounded-xl px-6 py-4 text-lg focus:border-blue-500 focus:outline-none transition-colors shadow-sm"
      />
      <input
        type="text"
        placeholder="State (e.g. CA, TX)"
        maxLength={2}
        value={stateCode}
        onChange={(e) => setStateCode(e.target.value.toUpperCase())}
        className="bg-white border-2 border-gray-200 rounded-xl px-6 py-4 text-lg focus:border-blue-500 focus:outline-none transition-colors shadow-sm"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-4 px-8 rounded-full text-lg transition-all hover:shadow-md"
      >
        {status === "loading" ? "Submitting..." : "Find Schools"}
      </button>
      {status === "error" && (
        <p className="text-red-600 text-sm">Something went wrong. Please try again.</p>
      )}
    </form>
  );
}
