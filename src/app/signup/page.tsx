"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";
import GlassCard from "@/components/GlassCard";
import { FiUser, FiMail, FiLock, FiArrowRight, FiCheck } from "react-icons/fi";

import { useChat } from "@/context/ChatContext";

export default function SignupPage() {
  const router = useRouter();
  const { signupUser, apiError } = useChat();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agree) return;
    setLoading(true);
    setLocalError(null);
    const success = await signupUser(name, email, password);
    setLoading(false);
    if (success) {
      router.push("/dashboard");
    } else {
      setLocalError("Failed to deploy credentials profile.");
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-hidden px-4 md:px-6">
      {/* Decorative Orbs */}
      <div className="absolute top-[10%] left-[-10%] w-[45%] h-[45%] bg-indigo-500/10 rounded-full blur-[100px] animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[45%] h-[45%] bg-cyan-500/10 rounded-full blur-[100px] animate-float pointer-events-none" />

      {/* Header bar */}
      <header className="w-full max-w-7xl mx-auto py-6 flex items-center justify-between z-10">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center text-white font-bold shadow-md">
            🌌
          </div>
          <span className="font-bold tracking-tight text-lg bg-gradient-to-r from-cyan-500 to-indigo-500 bg-clip-text text-transparent">
            AETHERIA
          </span>
        </Link>
        <ThemeToggle />
      </header>

      {/* Centered Glass Form */}
      <main className="w-full max-w-[450px] mx-auto z-10 my-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <GlassCard className="p-8 md:p-10 border border-zinc-200/50 dark:border-zinc-800/80 shadow-xl" glow>
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">
                Create Credentials
              </h2>
              <p className="text-[13px] text-zinc-500 dark:text-zinc-400">
                Deploy your sovereign profile and companion core.
              </p>
            </div>

            {(localError || apiError) && (
              <div className="mb-4 p-3 rounded-lg border border-red-500/20 bg-red-500/10 text-red-550 dark:text-red-400 text-[12.5px] text-center font-semibold">
                {apiError || localError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username Group */}
              <div className="space-y-1.5">
                <label className="text-[11.5px] font-bold font-mono tracking-widest text-zinc-400 dark:text-zinc-500 uppercase">
                  User Handle
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 w-4 h-4" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Jane Developer"
                    className="w-full h-11.5 pl-10 pr-4 rounded-xl text-[14px] bg-zinc-100/50 dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-zinc-800 focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-500 text-zinc-800 dark:text-zinc-200 transition"
                  />
                </div>
              </div>

              {/* Email Group */}
              <div className="space-y-1.5">
                <label className="text-[11.5px] font-bold font-mono tracking-widest text-zinc-400 dark:text-zinc-500 uppercase">
                  Identity Core
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 w-4 h-4" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="name@domain.com"
                    className="w-full h-11.5 pl-10 pr-4 rounded-xl text-[14px] bg-zinc-100/50 dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-zinc-800 focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-500 text-zinc-800 dark:text-zinc-200 transition"
                  />
                </div>
              </div>

              {/* Password Group */}
              <div className="space-y-1.5">
                <label className="text-[11.5px] font-bold font-mono tracking-widest text-zinc-400 dark:text-zinc-500 uppercase">
                  Passphrase Cipher
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 w-4 h-4" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Minimum 8 characters"
                    className="w-full h-11.5 pl-10 pr-4 rounded-xl text-[14px] bg-zinc-100/50 dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-zinc-800 focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-500 text-zinc-800 dark:text-zinc-200 transition"
                  />
                </div>
              </div>

              {/* Terms check */}
              <div className="flex items-start gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setAgree(!agree)}
                  className={`
                    w-5 h-5 rounded flex items-center justify-center border transition mt-0.5 cursor-pointer
                    ${
                      agree
                        ? "bg-gradient-to-r from-cyan-500 to-indigo-500 text-white border-transparent"
                        : "bg-zinc-100 dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 text-transparent"
                    }
                  `}
                >
                  <FiCheck className="w-3.5 h-3.5" />
                </button>
                <span className="text-[12px] text-zinc-500 dark:text-zinc-400 leading-normal font-normal">
                  I accept the cyber-integrity policy and allow local cognitive sync logs.
                </span>
              </div>

              {/* Submit Trigger */}
              <button
                type="submit"
                disabled={!agree || loading}
                className="w-full h-11.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 hover:opacity-95 text-white font-medium shadow-md shadow-indigo-500/10 flex items-center justify-center gap-2 mt-2 transition disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01]"
              >
                {loading ? (
                  <span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  <>
                    Initialize Profile <FiArrowRight />
                  </>
                )}
              </button>
            </form>

            <div className="text-center mt-6 text-[13px] text-zinc-500 dark:text-zinc-400">
              Already initialized?{" "}
              <Link href="/login" className="text-indigo-500 hover:text-cyan-500 font-semibold transition">
                Unlock Identity
              </Link>
            </div>
          </GlassCard>
        </motion.div>
      </main>

      {/* Footer bar */}
      <footer className="w-full max-w-7xl mx-auto py-6 text-center text-[11px] font-mono text-zinc-400 dark:text-zinc-600 z-10">
        ENCRYPTED SIGNUP CONSOLE
      </footer>
    </div>
  );
}
