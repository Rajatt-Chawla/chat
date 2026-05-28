"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";
import { FiArrowRight, FiCpu, FiMessageSquare, FiShield } from "react-icons/fi";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-hidden">
      {/* Decorative Cyber Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-500/10 rounded-full blur-[120px] animate-float pointer-events-none" />

      {/* Header Bar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center text-white shadow-md">
            🌌
          </div>
          <span className="font-bold tracking-tight text-lg bg-gradient-to-r from-cyan-500 to-indigo-500 bg-clip-text text-transparent">
            AETHERIA
          </span>
        </div>
        <ThemeToggle />
      </header>

      {/* Main Core Hero */}
      <main className="w-full max-w-4xl mx-auto px-6 py-12 flex flex-col items-center text-center justify-center z-10 my-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <span className="text-[11px] font-extrabold tracking-widest font-mono text-cyan-500 dark:text-cyan-400 uppercase px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
            AETHERIA COMPANION CORE // ONLINE
          </span>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight text-zinc-900 dark:text-white max-w-2xl mx-auto">
            Your Premium
            <span className="bg-gradient-to-r from-cyan-500 via-indigo-500 to-violet-500 bg-clip-text text-transparent block mt-1">
              Cybernetic Assistant
            </span>
          </h1>

          <p className="text-[15px] md:text-lg text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto font-normal leading-relaxed">
            A minimalist, high-end AI Companion Platform. Designed with cognitive memory banking, customized mental personas, and visual theme sync boards.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Link
              href="/login"
              className="group flex items-center gap-2 h-12 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-medium shadow-md shadow-indigo-500/10 hover:shadow-indigo-500/20 hover:scale-[1.02] transition-all duration-300 w-full sm:w-auto justify-center"
            >
              Access Platform <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/signup"
              className="flex items-center justify-center h-12 px-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-950/70 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 font-medium transition w-full sm:w-auto"
            >
              Deploy Core Credentials
            </Link>
          </div>
        </motion.div>

        {/* Dynamic Feature Tiles */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-16 max-w-3xl"
        >
          <div className="flex flex-col items-center p-5 rounded-2xl bg-white/60 dark:bg-zinc-950/60 border border-zinc-200/50 dark:border-zinc-800/80 shadow-sm backdrop-blur-xs">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-500 mb-3 border border-cyan-500/20">
              <FiMessageSquare className="w-5 h-5" />
            </div>
            <h3 className="text-[14.5px] font-bold text-zinc-800 dark:text-zinc-200">Fluid Dialogues</h3>
            <p className="text-[12.5px] text-zinc-500 dark:text-zinc-400 text-center mt-1 font-normal">
              Switch mental personas dynamically from logic-check research to creative scripting.
            </p>
          </div>

          <div className="flex flex-col items-center p-5 rounded-2xl bg-white/60 dark:bg-zinc-950/60 border border-zinc-200/50 dark:border-zinc-800/80 shadow-sm backdrop-blur-xs">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 mb-3 border border-indigo-500/20">
              <FiCpu className="w-5 h-5" />
            </div>
            <h3 className="text-[14.5px] font-bold text-zinc-800 dark:text-zinc-200">Cognitive Vault</h3>
            <p className="text-[12.5px] text-zinc-500 dark:text-zinc-400 text-center mt-1 font-normal">
              A detailed memory dashboard mapping learned context preferences and habits.
            </p>
          </div>

          <div className="flex flex-col items-center p-5 rounded-2xl bg-white/60 dark:bg-zinc-950/60 border border-zinc-200/50 dark:border-zinc-800/80 shadow-sm backdrop-blur-xs">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-500 mb-3 border border-violet-500/20">
              <FiShield className="w-5 h-5" />
            </div>
            <h3 className="text-[14.5px] font-bold text-zinc-800 dark:text-zinc-200">Total Sovereignty</h3>
            <p className="text-[12.5px] text-zinc-500 dark:text-zinc-400 text-center mt-1 font-normal">
              Modify custom sliders, cognitive temperature weights, and forget facts easily.
            </p>
          </div>
        </motion.div>
      </main>

      {/* Footer System Status */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-6 text-center text-[11px] font-mono text-zinc-400 dark:text-zinc-600 z-10 border-t border-zinc-200/20 dark:border-zinc-800/20">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] mr-2 animate-pulse" />
        ALL SENSORS NOMINAL // LATENCY: 42MS // SECURE CLIENT SIDE SESSION
      </footer>
    </div>
  );
}
