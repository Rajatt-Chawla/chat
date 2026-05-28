"use client";

import { motion } from "framer-motion";

export default function TypingLoader() {
  return (
    <div className="flex items-center gap-1.5 py-2 px-3 rounded-2xl glass-panel-light dark:glass-panel-dark max-w-[80px] justify-center">
      <motion.span
        className="w-2.5 h-2.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]"
        animate={{ y: [2, -6, 2] }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: 0,
        }}
      />
      <motion.span
        className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]"
        animate={{ y: [2, -6, 2] }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: 0.15,
        }}
      />
      <motion.span
        className="w-2.5 h-2.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]"
        animate={{ y: [2, -6, 2] }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: 0.3,
        }}
      />
    </div>
  );
}

