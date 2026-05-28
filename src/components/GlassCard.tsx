"use client";

import React from "react";
import { useTheme } from "@/context/ThemeContext";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

export default function GlassCard({ children, className = "", glow = false }: GlassCardProps) {
  const { theme } = useTheme();

  return (
    <div
      className={`
        rounded-2xl transition-all duration-300
        ${theme === "dark" ? "glass-panel-dark" : "glass-panel-light"}
        ${glow ? "shadow-[0_0_20px_rgba(6,182,212,0.15)] dark:shadow-[0_0_25px_rgba(99,102,241,0.2)]" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
