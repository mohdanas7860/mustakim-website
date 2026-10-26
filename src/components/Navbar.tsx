"use client";

import React from 'react';
import { Hammer } from 'lucide-react';

export default function Navbar({ onLoginClick }: { onLoginClick: () => void }) {
    return (
        <nav className="fixed top-0 inset-x-0 z-50 px-6 py-4 border-b border-white/5 bg-[#050505]/60 backdrop-blur-2xl">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center space-x-3 text-white">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-700 flex items-center justify-center shadow-lg shadow-amber-500/20">
                        <Hammer className="w-5 h-5 text-black" />
                    </div>
                    <span className="text-xl font-bold tracking-widest font-serif">ATELIER<span className="text-amber-500 px-1">.</span>CRAFT</span>
                </div>
                <div className="hidden md:flex space-x-10 text-xs font-semibold tracking-widest uppercase text-gray-400">
                    <a href="#vault" className="hover:text-amber-500 transition-colors">3D Vault</a>
                    <a href="#services" className="hover:text-amber-500 transition-colors">Bespoke Services</a>
                    <a href="#about" className="hover:text-amber-500 transition-colors">Studio</a>
                </div>
                <button
                    onClick={onLoginClick}
                    className="group relative px-6 py-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition overflow-hidden"
                >
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-amber-500/0 via-amber-500/20 to-amber-500/0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                    <span className="relative text-sm font-semibold text-white">Client Login</span>
                </button>
            </div>
        </nav>
    );
}
