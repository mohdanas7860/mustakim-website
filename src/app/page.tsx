'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Hammer, Sparkles, Lock } from 'lucide-react';

// 🔥 Yeh hai asli fix: SSR false karne se refresh par canvas white nahi hoga
const Hero3DViewer = dynamic(() => import('@/components/Hero3DViewer'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[550px] bg-[#0a0a0a] rounded-[2.5rem] border border-white/10 flex items-center justify-center flex-col space-y-4">
      <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      <span className="text-amber-500 font-mono text-xs tracking-widest">LOADING 3D STUDIO...</span>
    </div>
  ),
});

export default function Home() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-amber-500 selection:text-black">
      {/* Top Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-white/10 backdrop-blur-md sticky top-0 z-50 bg-[#050505]/80">
        <div className="flex items-center space-x-2">
          <Hammer className="w-6 h-6 text-amber-500" />
          <span className="text-xl font-bold tracking-wider">ATELIER<span className="text-amber-500">.</span>CRAFT</span>
        </div>
        <button
          onClick={() => setIsLoginOpen(true)}
          className="bg-white text-black font-semibold px-6 py-2.5 rounded-full text-sm hover:bg-amber-500 transition-all shadow-lg"
        >
          Client Login
        </button>
      </nav>

      {/* Main Hero & 3D Interactive Showcase - Sabse Upar */}
      <main className="max-w-6xl mx-auto px-6 py-10 flex flex-col items-center">
        <div className="text-center mb-6 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/20 px-4 py-1.5 rounded-full text-amber-400 text-xs mb-3">
            <Sparkles className="w-4 h-4" />
            <span>Interactive 3D Woodwork Vault</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
            Bespoke Architecture <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Engineered in 3D.</span>
          </h1>
          <p className="text-gray-400 text-sm mt-3">
            Click the wardrobe doors to open them, or use arrows to cycle through custom luxury furniture.
          </p>
        </div>

        {/* 3D Viewer Component - Bilkul Top Par */}
        <div className="w-full">
          <Hero3DViewer onUnlockVault={() => setIsLoginOpen(true)} />
        </div>
      </main>

      {/* Login Modal */}
      {isLoginOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4">
          <div className="bg-[#121212] border border-white/10 w-full max-w-md rounded-3xl p-8 relative shadow-2xl">
            <button
              onClick={() => setIsLoginOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-white"
            >
              ✕
            </button>
            <h3 className="text-2xl font-bold mb-2">Client Portal Access</h3>
            <p className="text-sm text-gray-400 mb-6">Log in to unlock direct phone/WhatsApp contact & booking options.</p>
            <form onSubmit={(e) => { e.preventDefault(); alert("Login successful!"); }} className="space-y-4">
              <input type="email" placeholder="Email address" required className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 text-white" />
              <input type="password" placeholder="Password" required className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 text-white" />
              <button type="submit" className="w-full bg-amber-500 text-black font-bold py-3 rounded-xl hover:bg-amber-400 transition">Sign In</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}