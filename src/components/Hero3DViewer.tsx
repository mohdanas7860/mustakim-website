"use client";

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Float } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { ChevronRight, Lock } from 'lucide-react';

/* ============================
   WARDROBE — 3 doors, each opens individually on click
   Left & Center hinge on left edge, Right hinges on right edge
   ============================ */
function WardrobeDoor({
    doorRef,
    isOpen,
    onToggle,
    position,
    doorW,
    doorH,
    doorT,
    hingeOffset,
}: {
    doorRef: React.RefObject<THREE.Group | null>;
    isOpen: boolean;
    onToggle: () => void;
    position: [number, number, number];
    doorW: number;
    doorH: number;
    doorT: number;
    hingeOffset: number; // positive = hinge on left side mesh, negative = right
}) {
    const [hov, setHov] = useState(false);
    useEffect(() => {
        document.body.style.cursor = hov ? 'pointer' : 'auto';
        return () => { document.body.style.cursor = 'auto'; };
    }, [hov]);

    // hingeOffset > 0 means door panel is offset to the right from hinge (left hinge)
    // hingeOffset < 0 means door panel is offset to the left from hinge (right hinge)
    return (
        <group position={position}>
            <group
                ref={doorRef}
                onClick={(e) => { e.stopPropagation(); onToggle(); }}
                onPointerOver={(e) => { e.stopPropagation(); setHov(true); }}
                onPointerOut={() => setHov(false)}
            >
                {/* Door panel */}
                <mesh position={[hingeOffset / 2, 0, 0]} castShadow receiveShadow>
                    <boxGeometry args={[Math.abs(hingeOffset), doorH, doorT]} />
                    <meshStandardMaterial color="#e8e8e8" roughness={0.25} metalness={0.15} envMapIntensity={1.8} />
                </mesh>
                {/* Vertical bar handle */}
                <mesh
                    position={[
                        hingeOffset > 0 ? hingeOffset - 0.08 : hingeOffset + 0.08,
                        0,
                        doorT / 2 + 0.02,
                    ]}
                    castShadow
                >
                    <boxGeometry args={[0.02, 0.9, 0.025]} />
                    <meshStandardMaterial color="#888888" roughness={0.15} metalness={0.8} envMapIntensity={2.5} />
                </mesh>
            </group>
        </group>
    );
}

function Wardrobe({ active }: { active: boolean }) {
    const groupRef = useRef<THREE.Group>(null);
    const leftPivot = useRef<THREE.Group>(null);
    const centerPivot = useRef<THREE.Group>(null);
    const rightPivot = useRef<THREE.Group>(null);
    const [openDoors, setOpenDoors] = useState<Record<string, boolean>>({ left: false, center: false, right: false });

    const W = 2.4, H = 3.0, D = 0.6, WALL = 0.04;
    const DOOR_W = W / 3;
    const DOOR_H = H - WALL * 2;
    const DOOR_T = 0.035;
    const bodyColor = '#d4d4d4', insideColor = '#c0c0c0', shelfColor = '#cccccc', handleColor = '#888888';

    const toggleDoor = (name: string) => setOpenDoors((prev) => ({ ...prev, [name]: !prev[name] }));

    useFrame((state, delta) => {
        const s = active ? 1 : 0.001;
        if (groupRef.current) {
            groupRef.current.scale.lerp(new THREE.Vector3(s, s, s), delta * 5);
            if (active) groupRef.current.rotation.y += delta * 0.08;
        }
        // Left door opens to the left (negative Y rotation)
        const tL = openDoors.left ? -Math.PI / 2.2 : 0;
        if (leftPivot.current) leftPivot.current.rotation.y = THREE.MathUtils.lerp(leftPivot.current.rotation.y, tL, delta * 4);
        // Center door opens to the left
        const tC = openDoors.center ? -Math.PI / 2.2 : 0;
        if (centerPivot.current) centerPivot.current.rotation.y = THREE.MathUtils.lerp(centerPivot.current.rotation.y, tC, delta * 4);
        // Right door opens to the right (positive Y rotation)
        const tR = openDoors.right ? Math.PI / 2.2 : 0;
        if (rightPivot.current) rightPivot.current.rotation.y = THREE.MathUtils.lerp(rightPivot.current.rotation.y, tR, delta * 4);
    });

    const bodyMat = <meshStandardMaterial color={bodyColor} roughness={0.5} metalness={0.1} envMapIntensity={1} />;

    return (
        <group ref={groupRef}>
            {/* Cabinet body */}
            <mesh position={[0, 0, -D / 2 + WALL / 2]} castShadow receiveShadow><boxGeometry args={[W, H, WALL]} />{bodyMat}</mesh>
            <mesh position={[-W / 2 + WALL / 2, 0, 0]} castShadow receiveShadow><boxGeometry args={[WALL, H, D]} />{bodyMat}</mesh>
            <mesh position={[W / 2 - WALL / 2, 0, 0]} castShadow receiveShadow><boxGeometry args={[WALL, H, D]} />{bodyMat}</mesh>
            <mesh position={[0, H / 2 - WALL / 2, 0]} castShadow receiveShadow><boxGeometry args={[W, WALL, D]} />{bodyMat}</mesh>
            <mesh position={[0, -H / 2 + WALL / 2, 0]} castShadow receiveShadow><boxGeometry args={[W, WALL, D]} />{bodyMat}</mesh>

            {/* Inside divider */}
            <mesh position={[W / 2 - DOOR_W - WALL / 2, 0, -0.02]} receiveShadow>
                <boxGeometry args={[WALL, H - WALL * 2, D - WALL * 2]} />
                <meshStandardMaterial color={insideColor} roughness={0.6} metalness={0.05} />
            </mesh>
            {/* Hanging rod */}
            <mesh position={[-DOOR_W / 2, H / 2 - 0.35, -0.05]} receiveShadow rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.02, 0.02, DOOR_W * 2 - 0.15, 16]} />
                <meshStandardMaterial color={handleColor} roughness={0.15} metalness={0.8} />
            </mesh>
            {/* 5 Shelves */}
            {[0.9, 0.4, -0.1, -0.6, -1.1].map((y, i) => (
                <mesh key={`shelf-${i}`} position={[W / 2 - DOOR_W / 2, y, -0.02]} receiveShadow>
                    <boxGeometry args={[DOOR_W - WALL * 3, WALL, D - WALL * 3]} />
                    <meshStandardMaterial color={shelfColor} roughness={0.55} metalness={0.05} />
                </mesh>
            ))}

            {/* LEFT DOOR — hinge on left edge, opens left */}
            <WardrobeDoor
                doorRef={leftPivot}
                isOpen={openDoors.left}
                onToggle={() => toggleDoor('left')}
                position={[-W / 2 + WALL, 0, D / 2 - DOOR_T / 2]}
                doorW={DOOR_W} doorH={DOOR_H} doorT={DOOR_T}
                hingeOffset={DOOR_W - WALL}
            />

            {/* CENTER DOOR — hinge on left edge, opens left */}
            <WardrobeDoor
                doorRef={centerPivot}
                isOpen={openDoors.center}
                onToggle={() => toggleDoor('center')}
                position={[-W / 2 + WALL + DOOR_W, 0, D / 2 - DOOR_T / 2]}
                doorW={DOOR_W} doorH={DOOR_H} doorT={DOOR_T}
                hingeOffset={DOOR_W - WALL}
            />

            {/* RIGHT DOOR — hinge on right edge, opens right */}
            <WardrobeDoor
                doorRef={rightPivot}
                isOpen={openDoors.right}
                onToggle={() => toggleDoor('right')}
                position={[W / 2 - WALL, 0, D / 2 - DOOR_T / 2]}
                doorW={DOOR_W} doorH={DOOR_H} doorT={DOOR_T}
                hingeOffset={-(DOOR_W - WALL)}
            />
        </group>
    );
}

/* ============================
   BED — Upholstered channel-tufted, mauve/dusty pink
   with pillows and beige blanket
   ============================ */
function Bed({ active }: { active: boolean }) {
    const groupRef = useRef<THREE.Group>(null);
    const fabricColor = '#9e7b8a';   // mauve/dusty pink
    const fabricDark = '#86687a';
    const mattressColor = '#f5f0eb'; // off-white sheet
    const blanketColor = '#c9b8a4';  // warm beige
    const pillowColor = '#d4c4b0';

    useFrame((state, delta) => {
        const s = active ? 1 : 0.001;
        if (groupRef.current) {
            groupRef.current.scale.lerp(new THREE.Vector3(s, s, s), delta * 5);
            if (active) groupRef.current.rotation.y += delta * 0.1;
        }
    });

    return (
        <group ref={groupRef} position={[0, -0.7, 0]}>
            {/* ===== Upholstered Base Frame with channel tufting ===== */}
            <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
                <boxGeometry args={[2.2, 0.4, 2.6]} />
                <meshStandardMaterial color={fabricColor} roughness={0.85} metalness={0.0} envMapIntensity={0.5} />
            </mesh>
            {/* Channel lines on base (front face) */}
            {Array.from({ length: 8 }, (_, i) => (
                <mesh key={`base-ch-${i}`} position={[-0.88 + i * 0.25, 0.2, 1.302]} castShadow>
                    <boxGeometry args={[0.02, 0.35, 0.01]} />
                    <meshStandardMaterial color={fabricDark} roughness={0.9} metalness={0} />
                </mesh>
            ))}
            {/* Channel lines on base (back face) */}
            {Array.from({ length: 8 }, (_, i) => (
                <mesh key={`base-chb-${i}`} position={[-0.88 + i * 0.25, 0.2, -1.302]} castShadow>
                    <boxGeometry args={[0.02, 0.35, 0.01]} />
                    <meshStandardMaterial color={fabricDark} roughness={0.9} metalness={0} />
                </mesh>
            ))}

            {/* ===== Mattress (white) ===== */}
            <mesh position={[0, 0.48, 0.05]} castShadow receiveShadow>
                <boxGeometry args={[2.1, 0.18, 2.4]} />
                <meshStandardMaterial color={mattressColor} roughness={0.9} metalness={0} />
            </mesh>

            {/* ===== White sheet layer ===== */}
            <mesh position={[0, 0.58, 0.05]} castShadow receiveShadow>
                <boxGeometry args={[2.08, 0.03, 2.38]} />
                <meshStandardMaterial color="#ffffff" roughness={0.95} metalness={0} />
            </mesh>

            {/* ===== Beige blanket — draped over bottom 2/3 of bed ===== */}
            <mesh position={[0, 0.62, 0.35]} castShadow receiveShadow>
                <boxGeometry args={[2.12, 0.06, 1.7]} />
                <meshStandardMaterial color={blanketColor} roughness={0.9} metalness={0} />
            </mesh>
            {/* Blanket fold at foot */}
            <mesh position={[0, 0.6, 1.21]} castShadow receiveShadow>
                <boxGeometry args={[2.14, 0.1, 0.08]} />
                <meshStandardMaterial color={blanketColor} roughness={0.9} metalness={0} />
            </mesh>

            {/* ===== Upholstered headboard with vertical channels ===== */}
            <mesh position={[0, 0.95, -1.2]} castShadow receiveShadow>
                <boxGeometry args={[2.2, 1.2, 0.2]} />
                <meshStandardMaterial color={fabricColor} roughness={0.85} metalness={0.0} envMapIntensity={0.5} />
            </mesh>
            {/* Headboard channel tufting grooves */}
            {Array.from({ length: 9 }, (_, i) => (
                <mesh key={`hb-ch-${i}`} position={[-0.88 + i * 0.22, 0.95, -1.098]} castShadow>
                    <boxGeometry args={[0.02, 1.15, 0.01]} />
                    <meshStandardMaterial color={fabricDark} roughness={0.9} metalness={0} />
                </mesh>
            ))}

            {/* ===== Two pillows ===== */}
            {[-0.45, 0.45].map((xPos, i) => (
                <mesh key={`pillow-${i}`} position={[xPos, 0.72, -0.85]} castShadow receiveShadow rotation={[0.1, 0, 0]}>
                    <boxGeometry args={[0.65, 0.15, 0.45]} />
                    <meshStandardMaterial color={pillowColor} roughness={0.9} metalness={0} />
                </mesh>
            ))}

            {/* Small feet/legs */}
            {[[-1.0, 0, -1.2], [1.0, 0, -1.2], [-1.0, 0, 1.2], [1.0, 0, 1.2]].map((pos, i) => (
                <mesh key={`foot-${i}`} position={pos as [number, number, number]} castShadow>
                    <cylinderGeometry args={[0.04, 0.04, 0.06, 12]} />
                    <meshStandardMaterial color="#555555" roughness={0.3} metalness={0.5} />
                </mesh>
            ))}
        </group>
    );
}

/* ============================
   CHAIR — Individual chair with rounded back, used by Table
   ============================ */
function Chair({
    position,
    rotation,
    isOut,
    onToggle,
}: {
    position: [number, number, number];
    rotation: [number, number, number];
    isOut: boolean;
    onToggle: () => void;
}) {
    const chairRef = useRef<THREE.Group>(null);
    const [hov, setHov] = useState(false);

    // Target position slides outward when "out"
    const outOffset = 0.5; // how far the chair slides out
    const dirZ = Math.cos(rotation[1]);
    const dirX = Math.sin(rotation[1]);
    const targetPos = isOut
        ? new THREE.Vector3(position[0] + dirX * outOffset, position[1], position[2] + dirZ * outOffset)
        : new THREE.Vector3(...position);

    useEffect(() => {
        document.body.style.cursor = hov ? 'pointer' : 'auto';
        return () => { document.body.style.cursor = 'auto'; };
    }, [hov]);

    useFrame((state, delta) => {
        if (chairRef.current) {
            chairRef.current.position.lerp(targetPos, delta * 5);
        }
    });

    const legColor = '#1a1a1a';
    const seatColor = '#e8e8e8';

    return (
        <group
            ref={chairRef}
            position={position}
            rotation={rotation}
            onClick={(e) => { e.stopPropagation(); onToggle(); }}
            onPointerOver={(e) => { e.stopPropagation(); setHov(true); }}
            onPointerOut={() => setHov(false)}
        >
            {/* Seat */}
            <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
                <boxGeometry args={[0.42, 0.04, 0.42]} />
                <meshStandardMaterial color={seatColor} roughness={0.4} metalness={0.1} />
            </mesh>
            {/* Backrest — rounded pill shape */}
            <mesh position={[0, 0.85, -0.18]} castShadow receiveShadow>
                <capsuleGeometry args={[0.18, 0.22, 8, 16]} />
                <meshStandardMaterial color={seatColor} roughness={0.4} metalness={0.1} />
            </mesh>
            {/* 4 Chair legs — thin black */}
            {[[-0.16, 0.22, -0.16], [0.16, 0.22, -0.16], [-0.16, 0.22, 0.16], [0.16, 0.22, 0.16]].map((lp, i) => (
                <mesh key={`leg-${i}`} position={lp as [number, number, number]} castShadow>
                    <cylinderGeometry args={[0.015, 0.015, 0.45, 8]} />
                    <meshStandardMaterial color={legColor} roughness={0.3} metalness={0.6} />
                </mesh>
            ))}
        </group>
    );
}

/* ============================
   TABLE — Rectangular white top, black V-legs, 4 interactive chairs
   ============================ */
function Table({ active }: { active: boolean }) {
    const groupRef = useRef<THREE.Group>(null);
    const [chairsOut, setChairsOut] = useState<boolean[]>([false, false, false, false]);

    const toggleChair = (index: number) => {
        setChairsOut((prev) => {
            const next = [...prev];
            next[index] = !next[index];
            return next;
        });
    };

    useFrame((state, delta) => {
        const s = active ? 1 : 0.001;
        if (groupRef.current) {
            groupRef.current.scale.lerp(new THREE.Vector3(s, s, s), delta * 5);
            if (active) groupRef.current.rotation.y += delta * 0.12;
        }
    });

    const TW = 2.4, TD = 1.1, TH = 0.08; // table top dimensions
    const tableY = 0.85;

    // Chair positions: front-left, front-right, back-left, back-right
    const chairPositions: [number, number, number][] = [
        [-0.55, 0, 0.75],  // front-left
        [0.55, 0, 0.75],   // front-right
        [-0.55, 0, -0.75], // back-left
        [0.55, 0, -0.75],  // back-right
    ];
    const chairRotations: [number, number, number][] = [
        [0, 0, 0],           // facing away (front)
        [0, 0, 0],           // facing away (front)
        [0, Math.PI, 0],     // facing table (back)
        [0, Math.PI, 0],     // facing table (back)
    ];

    return (
        <group ref={groupRef} position={[0, -0.9, 0]}>
            {/* ===== Table Top — white rectangular ===== */}
            <mesh position={[0, tableY, 0]} castShadow receiveShadow>
                <boxGeometry args={[TW, TH, TD]} />
                <meshStandardMaterial color="#f5f5f5" roughness={0.2} metalness={0.05} envMapIntensity={1.5} />
            </mesh>

            {/* ===== V-shaped legs (2 trapezoid frames) ===== */}
            {/* Left V-leg */}
            <mesh position={[-0.85, 0.43, 0]} castShadow rotation={[0, 0, 0.2]}>
                <boxGeometry args={[0.06, 0.85, TD - 0.1]} />
                <meshStandardMaterial color="#141414" roughness={0.3} metalness={0.6} />
            </mesh>
            <mesh position={[-0.65, 0.43, 0]} castShadow rotation={[0, 0, -0.2]}>
                <boxGeometry args={[0.06, 0.85, TD - 0.1]} />
                <meshStandardMaterial color="#141414" roughness={0.3} metalness={0.6} />
            </mesh>
            {/* Right V-leg */}
            <mesh position={[0.85, 0.43, 0]} castShadow rotation={[0, 0, -0.2]}>
                <boxGeometry args={[0.06, 0.85, TD - 0.1]} />
                <meshStandardMaterial color="#141414" roughness={0.3} metalness={0.6} />
            </mesh>
            <mesh position={[0.65, 0.43, 0]} castShadow rotation={[0, 0, 0.2]}>
                <boxGeometry args={[0.06, 0.85, TD - 0.1]} />
                <meshStandardMaterial color="#141414" roughness={0.3} metalness={0.6} />
            </mesh>

            {/* ===== 4 Chairs — click to slide out ===== */}
            {chairPositions.map((pos, i) => (
                <Chair
                    key={`chair-${i}`}
                    position={pos}
                    rotation={chairRotations[i]}
                    isOut={chairsOut[i]}
                    onToggle={() => toggleChair(i)}
                />
            ))}
        </group>
    );
}

function InteractiveFurniture({ activeIndex }: { activeIndex: number }) {
    return (
        <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
            <Wardrobe active={activeIndex === 0} />
            <Bed active={activeIndex === 1} />
            <Table active={activeIndex === 2} />
        </Float>
    );
}

export default function Hero3DViewer({ onUnlockVault }: { onUnlockVault: () => void }) {
    const [activeModelIndex, setActiveModelIndex] = useState(0);
    const [isMounted, setIsMounted] = useState(false);

    const modelTitles = [
        "Handcrafted Luxury Wardrobe",
        "Bespoke Master Bed",
        "Parametric Dining Centerpiece"
    ];

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
            className="relative w-full h-[550px] border border-white/10 bg-black overflow-hidden rounded-[2.5rem] shadow-[0_30px_100px_-20px_rgba(217,160,91,0.15)] group"
        >
            <div className="relative w-full h-full bg-black">
                {!isMounted ? (
                    <div className="absolute inset-0 flex items-center justify-center flex-col space-y-4 bg-[#0a0a0a]">
                        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                        <span className="text-amber-500 font-mono text-xs tracking-widest">INITIALIZING ENGINE...</span>
                    </div>
                ) : (
                    <Suspense fallback={
                        <div className="absolute inset-0 flex items-center justify-center flex-col space-y-4 bg-[#0a0a0a]">
                            <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                            <span className="text-amber-500 font-mono text-xs tracking-widest">LOADING ASSETS...</span>
                        </div>
                    }>
                        <Canvas gl={{ alpha: true, antialias: true }} camera={{ position: [0, 0, 5], fov: 45 }} className="bg-black">
                            <color attach="background" args={['#050505']} />
                            <gridHelper args={[20, 20, '#d9a05b', '#111111']} position={[0, -1.8, 0]} />
                            <ambientLight intensity={1.5} color="#ffffff" />
                            <directionalLight position={[5, 10, 5]} intensity={3} color="#ffe8cc" castShadow shadow-mapSize={[1024, 1024]} />
                            <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={3} castShadow color="#ffedd6" />
                            <pointLight position={[-10, -5, -10]} color="#d9a05b" intensity={1.2} />
                            <InteractiveFurniture activeIndex={activeModelIndex} />
                            <Environment preset="studio" />
                            <ContactShadows position={[0, -1.79, 0]} opacity={0.6} scale={15} blur={2.5} far={4} color="#000000" />
                            <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} maxPolarAngle={Math.PI / 2} />
                        </Canvas>
                    </Suspense>
                )}

                {/* Minimalist Viewport Overlay */}
                <div className="absolute inset-0 pointer-events-none p-8 flex flex-col justify-between z-10 transition-opacity duration-700">
                    <div className="flex justify-between items-start">
                        <div className="bg-black/30 backdrop-blur-xl border border-white/5 rounded-2xl px-6 py-4 flex flex-col shadow-2xl">
                            <span className="text-amber-500/80 font-serif italic text-sm mb-1">Edition 0{activeModelIndex + 1}</span>
                            <h3 className="text-white font-light tracking-wide text-lg md:text-xl">{modelTitles[activeModelIndex]}</h3>
                        </div>
                    </div>
                </div>

                {/* Next/Prev UI Buttons */}
                <div className="absolute top-1/2 -translate-y-1/2 left-6 pointer-events-auto z-20">
                    <button
                        onClick={() => setActiveModelIndex((prev) => (prev > 0 ? prev - 1 : 2))}
                        className="w-12 h-12 rounded-full bg-black/40 border border-white/20 flex items-center justify-center text-white hover:bg-white/10 hover:scale-110 transition-all backdrop-blur-md shadow-xl"
                    >
                        <ChevronRight className="w-6 h-6 rotate-180" />
                    </button>
                </div>
                <div className="absolute top-1/2 -translate-y-1/2 right-6 pointer-events-auto z-20">
                    <button
                        onClick={() => setActiveModelIndex((prev) => (prev < 2 ? prev + 1 : 0))}
                        className="w-12 h-12 rounded-full bg-black/40 border border-white/20 flex items-center justify-center text-white hover:bg-white/10 hover:scale-110 transition-all backdrop-blur-md shadow-xl"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>

                {/* Login Overlay */}
                <div className="absolute bottom-6 right-6 pointer-events-auto">
                    <button
                        onClick={onUnlockVault}
                        className="bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/20 text-white p-3 rounded-xl transition-all shadow-xl flex items-center space-x-2 group"
                    >
                        <Lock className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-bold tracking-wider hidden group-hover:inline-block pr-2">UNLOCK FULL VAULT</span>
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
