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
      <div className="bg-secondary-fixed/20 border border-secondary/20 rounded-2xl p-8 text-center shadow-sm">
        <div className="w-16 h-16 bg-secondary-fixed rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-secondary text-2xl">check_circle</span>
        </div>
        <h3 className="text-xl font-bold text-secondary mb-2">You&apos;re in!</h3>
        <p className="text-on-secondary-fixed-variant">We&apos;ll connect you with programs in your area.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
      <input
        type="text"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="bg-white/10 border border-white/20 rounded-xl px-6 py-4 text-lg text-white focus:border-secondary focus:outline-none transition-colors shadow-sm placeholder:text-white/60"
      />
      <input
        type="email"
        placeholder="Your email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="bg-white/10 border border-white/20 rounded-xl px-6 py-4 text-lg text-white focus:border-secondary focus:outline-none transition-colors shadow-sm placeholder:text-white/60"
      />
      <input
        type="text"
        placeholder="State (e.g. CA, TX)"
        maxLength={2}
        value={stateCode}
        onChange={(e) => setStateCode(e.target.value.toUpperCase())}
        className="bg-white/10 border border-white/20 rounded-xl px-6 py-4 text-lg text-white focus:border-secondary focus:outline-none transition-colors shadow-sm placeholder:text-white/60"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="cta-gradient disabled:opacity-50 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all hover:shadow-md active:scale-95"
      >
        {status === "loading" ? "Connecting..." : "Find Programs"}
      </button>
      {status === "error" && (
        <div className="bg-error-container/20 border border-error/20 rounded-lg p-4 text-center">
          <p className="text-error text-sm">Something went wrong. Please try again.</p>
        </div>
      )}
    </form>
  );
}