import React, { useState } from "react";

const Settings: React.FC = () => {
  const [language, setLanguage] = useState("en");
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-gray-100 p-6 space-y-6">
      <header className="space-y-1">
        <p className="text-sm text-gray-400">Tune your Mars Pioneers 2040 experience</p>
        <h1 className="text-2xl font-semibold text-white">Settings</h1>
      </header>

      <div className="bg-[#121212] border border-[rgba(255,69,0,0.25)]/50 rounded-xl p-6 shadow-lg shadow-black/30 space-y-6 max-w-3xl">
        <div className="space-y-2">
          <label className="text-sm text-gray-300" htmlFor="language">
            Language
          </label>
          <div className="relative">
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full bg-[#0D0D0D] border border-[#1f1f1f] rounded-lg px-4 py-3 text-white focus:border-orange-500/50 outline-none appearance-none"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="jp">Japanese</option>
              <option value="fr">French</option>
            </select>
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">▾</span>
          </div>
        </div>

        <div className="flex items-center justify-between bg-[#0D0D0D] border border-[#1f1f1f] rounded-lg px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-white">Theme</p>
            <p className="text-xs text-gray-400">Dark mode is optimized for the Mars palette</p>
          </div>
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode((prev) => !prev)}
              className="peer sr-only"
            />
            <div className="h-6 w-11 rounded-full bg-[#1f1f1f] border border-[#2a2a2a] peer-checked:bg-orange-500/50 transition-colors" />
            <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white peer-checked:translate-x-5 transition-transform" />
          </label>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <button className="w-full bg-orange-500/80 hover:bg-orange-500 text-white font-semibold rounded-lg px-4 py-3 transition-colors shadow-lg shadow-orange-500/20">
            Disconnect Wallet
          </button>
          <button className="w-full bg-[#141414] border border-[#1f1f1f] hover:border-orange-500/40 text-white font-semibold rounded-lg px-4 py-3 transition-colors">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;