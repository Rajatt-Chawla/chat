"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";
import GlassCard from "@/components/GlassCard";
import { FiMail, FiLock, FiArrowRight, FiShield } from "react-icons/fi";

import { useChat } from "@/context/ChatContext";

export default function LoginPage() {
  const router = useRouter();
  const { loginUser, apiError } = useChat();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLocalError(null);
    const success = await loginUser(email, password);
    setLoading(false);
    if (success) {
      router.push("/dashboard");
    } else {
      setLocalError("Invalid authentication credentials.");
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-hidden px-4 md:px-6">
      {/* Dynamic Cyber Orbs */}
      <div className="absolute top-[20%] right-[-10%] w-[45%] h-[45%] bg-cyan-500/10 rounded-full blur-[100px] animate-float pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-10%] w-[45%] h-[45%] bg-indigo-500/10 rounded-full blur-[100px] animate-pulse-slow pointer-events-none" />

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
      <main className="w-full max-w-[440px] mx-auto z-10 my-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <GlassCard className="p-8 md:p-10 border border-zinc-200/50 dark:border-zinc-800/80 shadow-xl" glow>
            <div className="text-center space-y-2 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 flex items-center justify-center mx-auto text-xl shadow-[0_0_15px_rgba(6,182,212,0.1)]">
                <FiShield />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">
                Initialize Connection
              </h2>
              <p className="text-[13px] text-zinc-500 dark:text-zinc-400">
                Provide credentials to sync your companion profile.
              </p>
            </div>

            {(localError || apiError) && (
              <div className="mb-4 p-3 rounded-lg border border-red-500/20 bg-red-500/10 text-red-550 dark:text-red-400 text-[12.5px] text-center font-semibold">
                {apiError || localError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email group */}
              <div className="space-y-1.5">
                <label className="text-[11.5px] font-bold font-mono tracking-widest text-zinc-400 dark:text-zinc-500 uppercase">
                  Terminal Identity
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

              {/* Password group */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[11.5px] font-bold font-mono tracking-widest text-zinc-400 dark:text-zinc-500 uppercase">
                    Security Cipher
                  </label>
                  <a
                    href="#"
                    className="text-[11px] text-indigo-500 hover:text-cyan-500 font-medium transition"
                  >
                    Forgot passphrase?
                  </a>
                </div>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 w-4 h-4" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••••••"
                    className="w-full h-11.5 pl-10 pr-4 rounded-xl text-[14px] bg-zinc-100/50 dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-zinc-800 focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-500 text-zinc-800 dark:text-zinc-200 transition"
                  />
                </div>
              </div>

              {/* Submit Trigger */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 hover:opacity-95 text-white font-medium shadow-md shadow-indigo-500/10 flex items-center justify-center gap-2 mt-2 transition cursor-pointer hover:scale-[1.01]"
              >
                {loading ? (
                  <span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  <>
                    Unlock Console <FiArrowRight />
                  </>
                )}
              </button>
            </form>

            <div className="text-center mt-6 text-[13px] text-zinc-500 dark:text-zinc-400">
              Not registered?{" "}
              <Link href="/signup" className="text-indigo-500 hover:text-cyan-500 font-semibold transition">
                Create Credentials
              </Link>
            </div>
          </GlassCard>
        </motion.div>
      </main>

      {/* Footer bar */}
      <footer className="w-full max-w-7xl mx-auto py-6 text-center text-[11px] font-mono text-zinc-400 dark:text-zinc-600 z-10">
        ENCRYPTED SESSION // IDENTITY PROTECTED
      </footer>
    </div>
  );
}
