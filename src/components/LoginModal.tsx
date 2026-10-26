"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, ChevronRight } from 'lucide-react';

export default function LoginModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl px-4"
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="bg-[#0a0a0a] border border-white/10 w-full max-w-lg rounded-3xl overflow-hidden relative shadow-[0_0_100px_-20px_rgba(217,160,91,0.2)]"
                    >
                        {/* Modal decorative header */}
                        <div className="h-1 w-full bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50" />

                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 text-gray-500 hover:text-white bg-black rounded-full p-2 border border-white/10 transition-colors z-10"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="p-10">
                            <div className="flex items-center space-x-3 text-amber-500 mb-8">
                                <Shield className="w-6 h-6" />
                                <span className="font-mono text-xs tracking-[0.2em] font-bold">SECURE CLIENT PORTAL</span>
                            </div>

                            <h3 className="text-3xl font-serif font-bold text-white mb-3">Authorization Required</h3>
                            <p className="text-sm text-gray-400 mb-10 font-light leading-relaxed">
                                Authenticate to unlock full 3D model rotation capabilities, access detailed architectural schematics, and open a direct encrypted line to the master craftsman.
                            </p>

                            <form onSubmit={(e) => { e.preventDefault(); alert("System authenticating... Connected to encrypted node!"); onClose(); }} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <span className="text-gray-500 font-mono text-xs">ID:</span>
                                        </div>
                                        <input
                                            type="email"
                                            required
                                            placeholder="client@agency.com"
                                            className="w-full bg-[#111] border border-white/10 rounded-xl pl-12 pr-4 py-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-mono"
                                        />
                                    </div>

                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <span className="text-gray-500 font-mono text-xs">PW:</span>
                                        </div>
                                        <input
                                            type="password"
                                            required
                                            placeholder="••••••••••••"
                                            className="w-full bg-[#111] border border-white/10 rounded-xl pl-12 pr-4 py-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-mono"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition-colors flex justify-center items-center space-x-2 group"
                                >
                                    <span>Establish Connection</span>
                                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </form>

                            <div className="mt-8 text-center border-t border-white/5 pt-6">
                                <p className="text-[10px] text-gray-500 font-mono uppercase">
                                    New project inquiry? <a href="#" className="text-amber-500 hover:underline">Request access token</a>
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
