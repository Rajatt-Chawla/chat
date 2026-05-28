"use client";

import React from "react";
import { Memory } from "@/context/ChatContext";
import { FiCalendar, FiTrash2 } from "react-icons/fi";
import { motion } from "framer-motion";
import GlassCard from "./GlassCard";

interface MemoryCardProps {
  memory: Memory;
  onDelete: (id: string) => void;
}

export default function MemoryCard({ memory, onDelete }: MemoryCardProps) {
  const getCategoryStyles = (category: Memory["category"]) => {
    switch (category) {
      case "Technical":
        return {
          bg: "bg-cyan-500/10 border-cyan-500/20 text-cyan-600 dark:text-cyan-400",
          glow: "border-l-4 border-l-cyan-500",
        };
      case "Goals":
        return {
          bg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400",
          glow: "border-l-4 border-l-emerald-500",
        };
      case "Preferences":
        return {
          bg: "bg-indigo-500/10 border-indigo-500/20 text-indigo-600 dark:text-indigo-400",
          glow: "border-l-4 border-l-indigo-500",
        };
      default: // Personal
        return {
          bg: "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400",
          glow: "border-l-4 border-l-amber-500",
        };
    }
  };

  const style = getCategoryStyles(memory.category);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      layout
    >
      <GlassCard className={`p-5 flex flex-col justify-between h-full min-h-[140px] hover:border-zinc-300 dark:hover:border-zinc-700/80 group ${style.glow}`}>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-extrabold font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${style.bg}`}>
              {memory.category}
            </span>
            <button
              onClick={() => onDelete(memory.id)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 opacity-0 group-hover:opacity-100 transition-all"
              title="Forget this memory"
            >
              <FiTrash2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[14px] text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
            "{memory.fact}"
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 dark:text-zinc-500 mt-4 font-medium">
          <FiCalendar className="w-3 h-3" />
          <span>Logged: {memory.timestamp}</span>
        </div>
      </GlassCard>
    </motion.div>
  );
}
