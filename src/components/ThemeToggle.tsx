"use client";

import { useTheme } from "@/context/ThemeContext";
import { motion } from "framer-motion";
import { FiSun, FiMoon } from "react-icons/fi";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center justify-between w-16 h-8 p-1 rounded-full cursor-pointer bg-zinc-200/80 dark:bg-zinc-800/80 border border-zinc-300/40 dark:border-zinc-700/40 shadow-inner overflow-hidden select-none"
      aria-label="Toggle Theme"
    >
      {/* Dynamic sliding ball */}
      <motion.div
        className="absolute top-1 left-1 w-6 h-6 rounded-full bg-white dark:bg-zinc-950 shadow-md flex items-center justify-center border border-zinc-200/50 dark:border-zinc-800/50"
        animate={{
          x: theme === "dark" ? 32 : 0,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        {theme === "light" ? (
          <FiSun className="w-3.5 h-3.5 text-amber-500" />
        ) : (
          <FiMoon className="w-3.5 h-3.5 text-cyan-400" />
        )}
      </motion.div>

      {/* Background Icons */}
      <span className="flex items-center justify-center w-6 h-6 text-zinc-500 pl-0.5">
        <FiSun className="w-3.5 h-3.5" />
      </span>
      <span className="flex items-center justify-center w-6 h-6 text-zinc-400 pr-0.5">
        <FiMoon className="w-3.5 h-3.5" />
      </span>
    </button>
  );
}
