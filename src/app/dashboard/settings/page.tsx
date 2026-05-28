"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import ThemeToggle from "@/components/ThemeToggle";
import GlassCard from "@/components/GlassCard";
import { useChat } from "@/context/ChatContext";
import { useTheme } from "@/context/ThemeContext";
import {
  FiSettings,
  FiSliders,
  FiUser,
  FiEye,
  FiLock,
  FiCheck,
  FiInfo,
} from "react-icons/fi";

export default function SettingsDashboard() {
  const { activeCompanion, setActiveCompanion, companions, user, token } = useChat();
  const { theme } = useTheme();

  // Settings State variables
  const [username, setUsername] = useState(user?.name || "Jane Developer");
  const [userBio, setUserBio] = useState(user?.bio || "SaaS developer crafting open source frameworks with premium minimal grids.");
  const [email, setEmail] = useState(user?.email || "jane@developer.io");
  const [temperature, setTemperature] = useState(activeCompanion.temperature);
  const [tone, setTone] = useState(activeCompanion.tone);
  const [engine, setEngine] = useState("aetheria-cognitive-v1");
  const [fontSize, setFontSize] = useState("Standard");
  const [reduceMotion, setReduceMotion] = useState(false);
  const [apiToken, setApiToken] = useState("aeth_live_83ba9c04fe19bc42");
  
  // Privacy states
  const [privateMode, setPrivateMode] = useState(false);
  const [consentMemory, setConsentMemory] = useState(true);
  
  const [showSavedToast, setShowSavedToast] = useState(false);

  // Sync with user changes
  React.useEffect(() => {
    if (user) {
      setUsername(user.name || "");
      setUserBio(user.bio || "");
      setEmail(user.email || "");
      if (user.temperature !== undefined) setTemperature(user.temperature);
      if (user.tone) setTone(user.tone);
      if (user.cognitive_engine) setEngine(user.cognitive_engine);
      if (user.font_size) setFontSize(user.font_size);
      if (user.reduce_motion !== undefined) setReduceMotion(user.reduce_motion);
    }
  }, [user]);

  // Fetch Privacy Settings
  React.useEffect(() => {
    if (token) {
      fetch("http://localhost:8000/api/v1/profile/settings", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data) {
            if (data.private_mode !== undefined) {
              setPrivateMode(data.private_mode === true || data.private_mode === "true");
            }
            if (data.consent_memory !== undefined) {
              setConsentMemory(data.consent_memory !== false && data.consent_memory !== "false");
            }
          }
        })
        .catch(e => console.error("Error loading settings:", e));
    }
  }, [token]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save to active companion settings client fallback
    activeCompanion.temperature = temperature;
    activeCompanion.tone = tone;

    if (token) {
      try {
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        };

        // 1. Save profile
        await fetch("http://localhost:8000/api/v1/profile/me/profile", {
          method: "PATCH",
          headers,
          body: JSON.stringify({ name: username, email, bio: userBio })
        });

        // 2. Save tuning
        await fetch("http://localhost:8000/api/v1/profile/me/tuning", {
          method: "PATCH",
          headers,
          body: JSON.stringify({ temperature, tone, cognitive_engine: engine })
        });

        // 3. Save interface
        await fetch("http://localhost:8000/api/v1/profile/me/interface", {
          method: "PATCH",
          headers,
          body: JSON.stringify({ font_size: fontSize, reduce_motion: reduceMotion })
        });

        // 4. Save Privacy settings
        await fetch("http://localhost:8000/api/v1/profile/settings", {
          method: "POST",
          headers,
          body: JSON.stringify({ private_mode: privateMode, consent_memory: consentMemory })
        });

        // Update locally
        localStorage.setItem("privateMode", String(privateMode));
        localStorage.setItem("consentMemory", String(consentMemory));

      } catch (e) {
        console.error("Failed to persist settings on server:", e);
      }
    }
    
    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
    }, 2000);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50 dark:bg-zinc-950 font-sans">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Core Space */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        {/* Top Navbar */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-zinc-200/50 dark:border-zinc-800/85 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md z-10">
          <div className="flex items-center gap-2.5">
            <FiSettings className="w-5 h-5 text-indigo-500" />
            <h2 className="text-[15px] font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
              System Settings
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </header>

        {/* Scrollable setting panes */}
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-8 bg-zinc-50/50 dark:bg-[#080809]/40 relative">
          <div className="max-w-4xl mx-auto space-y-6">
            <form onSubmit={handleSave} className="space-y-6">
              {/* Profile Config Group */}
              <GlassCard className="p-6 md:p-8 border border-zinc-200/60 dark:border-zinc-800/80 shadow-sm" glow>
                <h3 className="text-[15.5px] font-bold text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-2 border-b border-zinc-200/40 dark:border-zinc-800/40 pb-3">
                  <FiUser className="text-cyan-500" /> Sovereign User Profile
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold font-mono tracking-widest text-zinc-400 dark:text-zinc-500 uppercase">
                      Username Display
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl text-[14px] bg-zinc-100/50 dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-zinc-800 focus:outline-none focus:border-cyan-500 text-zinc-800 dark:text-zinc-200 transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold font-mono tracking-widest text-zinc-400 dark:text-zinc-500 uppercase">
                      Security Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl text-[14px] bg-zinc-100/50 dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-zinc-800 focus:outline-none focus:border-cyan-500 text-zinc-800 dark:text-zinc-200 transition"
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[11px] font-bold font-mono tracking-widest text-zinc-400 dark:text-zinc-500 uppercase">
                      User Biography
                    </label>
                    <textarea
                      value={userBio}
                      onChange={(e) => setUserBio(e.target.value)}
                      rows={2}
                      className="w-full p-4 rounded-xl text-[14px] bg-zinc-100/50 dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-zinc-800 focus:outline-none focus:border-cyan-500 text-zinc-800 dark:text-zinc-200 transition resize-none"
                    />
                  </div>
                </div>
              </GlassCard>

              {/* Tuning Cognition Config */}
              <GlassCard className="p-6 md:p-8 border border-zinc-200/60 dark:border-zinc-800/80 shadow-sm">
                <h3 className="text-[15.5px] font-bold text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-2 border-b border-zinc-200/40 dark:border-zinc-800/40 pb-3">
                  <FiSliders className="text-cyan-500" /> Companion Cognition & Tuning
                </h3>

                <div className="space-y-6">
                  {/* Slider Control */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[12.5px] font-semibold text-zinc-700 dark:text-zinc-300">
                      <span className="flex items-center gap-1.5">
                        Cognitive Temperature (Creativity Weight)
                      </span>
                      <span className="font-mono text-cyan-500 font-extrabold">{temperature}</span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="1.0"
                      step="0.05"
                      value={temperature}
                      onChange={(e) => setTemperature(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase font-medium">
                      <span>Strict Logic (0.1)</span>
                      <span>Balanced (0.5)</span>
                      <span>Creative Spark (1.0)</span>
                    </div>
                  </div>

                  {/* Dropdown Selects */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold font-mono tracking-widest text-zinc-400 dark:text-zinc-500 uppercase">
                        Conversation Tone Tone
                      </label>
                      <select
                        value={tone}
                        onChange={(e) => setTone(e.target.value)}
                        className="w-full h-11 px-4 rounded-xl text-[14px] bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 focus:outline-none focus:border-cyan-500 text-zinc-700 dark:text-zinc-300 transition"
                      >
                        <option value="Analytical">Analytical (Precise & Dry)</option>
                        <option value="Empathetic">Empathetic (Warm & Witty)</option>
                        <option value="Professional">Professional (Architect-first)</option>
                        <option value="Humorous">Humorous (Playful & Sarcastic)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold font-mono tracking-widest text-zinc-400 dark:text-zinc-500 uppercase">
                        Cognitive Model Engine
                      </label>
                      <select
                        value={engine}
                        onChange={(e) => setEngine(e.target.value)}
                        className="w-full h-11 px-4 rounded-xl text-[14px] bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 focus:outline-none focus:border-cyan-500 text-zinc-700 dark:text-zinc-300 transition"
                      >
                        <option value="aetheria-cognitive-v1">Aetheria Cognitive Core (Standard)</option>
                        <option value="aria-precise-r2">Aria Logic-Compiler r2</option>
                        <option value="nova-architect-dev">Nova Dev-Infrastructure Hub</option>
                        <option value="leo-dialogue-witty">Leo Narrative Prose Builder</option>
                      </select>
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* Interface Customization */}
              <GlassCard className="p-6 md:p-8 border border-zinc-200/60 dark:border-zinc-800/80 shadow-sm">
                <h3 className="text-[15.5px] font-bold text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-2 border-b border-zinc-200/40 dark:border-zinc-800/40 pb-3">
                  <FiEye className="text-indigo-500" /> Interface & Customization
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Font picker */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold font-mono tracking-widest text-zinc-400 dark:text-zinc-500 uppercase">
                      Typography Font-Scale
                    </label>
                    <select
                      value={fontSize}
                      onChange={(e) => setFontSize(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl text-[14px] bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 focus:outline-none focus:border-cyan-500 text-zinc-700 dark:text-zinc-300 transition"
                    >
                      <option value="Compact">Compact (Standard developer spacing)</option>
                      <option value="Standard">Standard (Modern Notion scale)</option>
                      <option value="Large">Large (High-readability size)</option>
                    </select>
                  </div>

                  {/* Motion check */}
                  <div className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-250 dark:border-zinc-850 bg-zinc-100/30 dark:bg-zinc-950/20">
                    <div>
                      <h4 className="text-[13.5px] font-semibold text-zinc-800 dark:text-zinc-200">Reduce Platform Motion</h4>
                      <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5 leading-normal">
                        Bypasses all decorative Framer Motion loops.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setReduceMotion(!reduceMotion)}
                      className={`
                        w-12 h-6.5 p-1 rounded-full border transition cursor-pointer relative flex items-center
                        ${
                          reduceMotion
                            ? "bg-cyan-500 border-transparent text-white"
                            : "bg-zinc-200 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700"
                        }
                      `}
                    >
                      <span
                        className={`
                          w-4.5 h-4.5 rounded-full bg-white shadow-sm transition-transform duration-250
                          ${reduceMotion ? "translate-x-5.5" : "translate-x-0"}
                        `}
                      />
                    </button>
                  </div>
                </div>
              </GlassCard>

              {/* Data Sovereignty & Privacy Controls */}
              <GlassCard className="p-6 md:p-8 border border-zinc-200/60 dark:border-zinc-800/80 shadow-sm">
                <h3 className="text-[15.5px] font-bold text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-2 border-b border-zinc-200/40 dark:border-zinc-800/40 pb-3">
                  <FiLock className="text-emerald-500" /> Data Sovereignty & Privacy Controls
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Private Mode Toggle */}
                  <div className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-250 dark:border-zinc-850 bg-zinc-100/30 dark:bg-zinc-950/20">
                    <div>
                      <h4 className="text-[13.5px] font-semibold text-zinc-800 dark:text-zinc-200">Incognito Private Mode</h4>
                      <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5 leading-normal">
                        Bypasses all server database logging for chats and sentiments.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPrivateMode(!privateMode)}
                      className={`
                        w-12 h-6.5 p-1 rounded-full border transition cursor-pointer relative flex items-center
                        ${
                          privateMode
                            ? "bg-emerald-500 border-transparent text-white"
                            : "bg-zinc-200 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700"
                        }
                      `}
                    >
                      <span
                        className={`
                          w-4.5 h-4.5 rounded-full bg-white shadow-sm transition-transform duration-250
                          ${privateMode ? "translate-x-5.5" : "translate-x-0"}
                        `}
                      />
                    </button>
                  </div>

                  {/* Consent Memory saving toggle */}
                  <div className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-250 dark:border-zinc-850 bg-zinc-100/30 dark:bg-zinc-950/20">
                    <div>
                      <h4 className="text-[13.5px] font-semibold text-zinc-800 dark:text-zinc-200">Consent Memory Saving</h4>
                      <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5 leading-normal">
                        Allows AI to extract and store personal facts for contextual memory.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setConsentMemory(!consentMemory)}
                      className={`
                        w-12 h-6.5 p-1 rounded-full border transition cursor-pointer relative flex items-center
                        ${
                          consentMemory
                            ? "bg-emerald-500 border-transparent text-white"
                            : "bg-zinc-200 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700"
                        }
                      `}
                    >
                      <span
                        className={`
                          w-4.5 h-4.5 rounded-full bg-white shadow-sm transition-transform duration-250
                          ${consentMemory ? "translate-x-5.5" : "translate-x-0"}
                        `}
                      />
                    </button>
                  </div>
                </div>
              </GlassCard>

              {/* Sovereign Credentials API */}
              <GlassCard className="p-6 md:p-8 border border-zinc-200/60 dark:border-zinc-800/80 shadow-sm">
                <h3 className="text-[15.5px] font-bold text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-2 border-b border-zinc-200/40 dark:border-zinc-800/40 pb-3">
                  <FiLock className="text-cyan-500" /> Platform Security & Token Keys
                </h3>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold font-mono tracking-widest text-zinc-400 dark:text-zinc-500 uppercase">
                      Client-side API Token (Read-only mock)
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={apiToken}
                      className="w-full h-11 px-4 rounded-xl text-[13px] font-mono bg-zinc-150/60 dark:bg-zinc-900/65 border border-zinc-200/65 dark:border-zinc-850 text-zinc-500 dark:text-zinc-400 select-all focus:outline-none"
                    />
                  </div>

                  <div className="flex items-start gap-2 text-[12px] text-zinc-500 dark:text-zinc-400 leading-normal">
                    <FiInfo className="w-4.5 h-4.5 text-cyan-500 flex-shrink-0 mt-0.5" />
                    <p className="font-normal">
                      Tokens are processed safely inside the local browser context and never routed to remote telemetry arrays.
                    </p>
                  </div>
                </div>
              </GlassCard>

              {/* Submit trigger panel */}
              <div className="flex justify-end gap-3 pt-4 items-center">
                {showSavedToast && (
                  <span className="text-[13px] font-semibold text-emerald-500 flex items-center gap-1 animate-pulse">
                    <FiCheck /> Core settings loaded successfully!
                  </span>
                )}
                <button
                  type="submit"
                  className="px-6 h-11 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 hover:opacity-95 text-white text-[13.5px] font-semibold shadow-md shadow-indigo-500/10 cursor-pointer hover:scale-[1.01] transition-all"
                >
                  Save Platform Settings
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
