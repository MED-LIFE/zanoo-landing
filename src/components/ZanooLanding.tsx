"use client";

import React, { useEffect, useMemo, useRef, useState, Suspense, isValidElement, cloneElement, ReactElement } from "react";
import { motion, useReducedMotion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "next-themes";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    LineChart,
    Line,
} from "recharts";
import {
    ChevronRight,
    Check,
    Play,
    Menu,
    X,
    Star,
    Sparkles,
    Zap,
    Layout,
    BarChart as BarChartIcon, // Renamed to avoid conflict with Recharts BarChart
    Bell,
    ArrowUpRight,
    Sun,
    Moon,
    Monitor,
} from "lucide-react";
import Image from "next/image";

/**
 * Zanoo Landing — Optimized Single File
 *
 * Objetivo:
 * - Mantener TODO en 1 archivo para previsualizar rápido en Canvas
 * - Evitar “crashes” por render pesado: menos animaciones simultáneas, menos lógica inline, fallbacks robustos
 * - Asegurar que si faltan assets (/shots, /photos, /brand) no queda nada “vacío”
 */

// -----------------------------
// Utils
// -----------------------------
function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

function scrollToId(id: string) {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function AnimatedCounter({ value, suffix = "" }: { value: number | string; suffix?: string }) {
    const ref = useRef<HTMLSpanElement>(null);
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, { damping: 30, stiffness: 100 });
    const isInView = useInView(ref, { once: true, margin: "-20px" });

    // Extract numeric part safely
    const numericValue = typeof value === "string" ? parseFloat(value.replace(/[^0-9.]/g, "")) : value;

    useEffect(() => {
        if (isInView) {
            motionValue.set(numericValue);
        }
    }, [isInView, numericValue, motionValue]);

    useEffect(() => {
        return springValue.on("change", (latest) => {
            if (ref.current) {
                ref.current.textContent = Math.floor(latest).toLocaleString() + suffix;
            }
        });
    }, [springValue, suffix]);

    return <span ref={ref}>0{suffix}</span>;
}

// -----------------------------
// Interactive Components
// -----------------------------
function ShimmerButton({ children, onClick, className }: { children: React.ReactNode; onClick?: () => void; className?: string }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "group relative overflow-hidden rounded-full transition-all hover:scale-105 active:scale-95",
                className
            )}
        >
            <span className="relative z-10">{children}</span>
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            {/* Auto shimmer every few seconds if not hovering? For now, hover-based or css keyframe loop */}
            <span className="absolute inset-0 -translate-x-full animate-[shimmer_3s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent z-20" />
        </button>
    );
}

// -----------------------------
function useFadeUp() {
    const reduced = useReducedMotion();
    return useMemo(
        () => ({
            initial: reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true, margin: "-80px" },
            transition: { duration: reduced ? 0 : 0.55, ease: "easeOut" } as any,
        }),
        [reduced]
    );
}

// -----------------------------
// Content
// -----------------------------
const HERO_SHOTS = [
    { id: "inicio", label: "Inicio (Paciente)", src: "/shots/inicio-paciente.png" },
    { id: "medicos", label: "Mis médicos", src: "/shots/mis-medicos.png" },
] as const;

const APP_SHOTS: Array<{
    id: string;
    label: string;
    src?: string;
    mode?: "list" | "detail" | "metrics";
}> = [
        { id: "inicio", label: "Inicio (Paciente)", src: "/shots/inicio-paciente.png", mode: "detail" },
        { id: "turnos", label: "Turnos (Recepción)", src: "/shots/turnos-recepcion.png", mode: "list" },
        {
            id: "metricas",
            label: "Métricas (Dirección)",
            src: "/shots/metricas-direccion.png",
            mode: "metrics",
        },
    ];

const PROBLEM_TILES = [
    {
        tone: "blue" as const,
        title: "Papeles, WhatsApps, cuadernos.",
        desc: "La información queda dispersa y se pierde.",
        imageSrc: "/photos/papeles-whatsapp-cuaderno.jpg",
    },
    {
        tone: "violet" as const,
        title: "Turnos duplicados y filas eternas.",
        desc: "Nadie sabe qué sigue, y la atención se satura.",
        imageSrc: "/photos/fila-turnos-duplicados.jpg",
    },
    {
        tone: "amber" as const,
        title: "Historia clínica incompleta.",
        desc: "Cada consulta empieza de cero.",
        imageSrc: "/photos/historia-clinica-incompleta.jpg",
    },
];

// -----------------------------
// UI bits
// -----------------------------
function GlowOrb({ className = "" }: { className?: string }) {
    return <div className={"pointer-events-none absolute rounded-full blur-3xl opacity-60 " + className} aria-hidden />;
}

function GradientBorder({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={"relative rounded-3xl p-[1px] " + className}>
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-400/40 via-blue-500/35 to-purple-600/35" />
            <div className="relative rounded-3xl bg-white/80 backdrop-blur-xl border border-black/5">{children}</div>
        </div>
    );
}

function LogoMark({ className = "" }: { className?: string }) {
    return (
        <div
            className={cn(
                "h-8 w-8 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600",
                className
            )}
            aria-hidden
        />
    );
}

function BrandLogo({ className = "" }: { className?: string }) {
    return (
        <div className={cn("relative inline-block", className)}>
            {/* Light Mode Logo - Scaled to match optical weight */}
            <Image
                src="/brand/zanoo-logo-color-v2.png"
                alt="Zanoo"
                width={160}
                height={50}
                className="h-full w-auto object-contain dark:hidden scale-125 origin-left"
                priority
            />
            {/* Dark Mode Logo */}
            <Image
                src="/brand/zanoo-logo-white-v2.png"
                alt="Zanoo"
                width={160}
                height={50}
                className="h-full w-auto object-contain hidden dark:block"
                priority
            />
        </div>
    );
}



// -----------------------------
// Section Components
// -----------------------------
function SectionBadge({ children }: { children: React.ReactNode }) {
    return (
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-700 dark:text-blue-300">
            <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
            </span>
            {children}
        </div>
    );
}

function MiniKpi({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="rounded-2xl border border-black/5 dark:border-white/5 bg-white/40 dark:bg-white/5 px-4 py-3 backdrop-blur-sm">
            <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium truncate">{label}</div>
            <div className="text-lg font-bold text-foreground whitespace-nowrap">{value}</div>
        </div>
    );
}

function FeatureCard({ title, desc, icon, bg }: { title: string; desc: string; icon?: React.ReactNode; bg?: string }) {
    // Default values if optional styling isn't provided
    const background = bg || "from-slate-900/10 via-blue-900/10 to-cyan-900/10";
    const IconComponent = icon || <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-300 opacity-70" />;

    return (
        <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }} className="will-change-transform">
            {/* MOBILE PERF: backdrop-blur-none on mobile, xl on md+ */}
            <Card className="relative overflow-hidden rounded-3xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-none md:backdrop-blur-xl shadow-lg dark:shadow-blue-500/10 transition-shadow hover:shadow-xl dark:hover:shadow-blue-500/20">
                <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-3">
                        <div className={cn("p-3 rounded-2xl bg-gradient-to-br text-white shadow-md", background)}>
                            {/* If icon is a raw node (like <Zap />), render it. If it was passed as fallback, render it. */}
                            {isValidElement(icon) ? cloneElement(icon as ReactElement<{ className?: string }>, { className: "h-5 w-5 text-white" }) : IconComponent}
                        </div>
                        <ArrowUpRight className="h-5 w-5 text-muted-foreground/50" />
                    </div>
                    <h3 className="mt-4 text-xl font-bold leading-tight tracking-tight">{title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                        {desc}
                    </p>
                </CardContent>
            </Card>
        </motion.div>
    );
}

function PhotoTile({
    title,
    desc,
    tone = "blue",
    imageSrc,
}: {
    title: string;
    desc: string;
    tone?: "blue" | "violet" | "amber";
    imageSrc?: string;
}) {
    const [imgError, setImgError] = useState(false);
    const showImage = Boolean(imageSrc) && !imgError;

    const toneMap: Record<string, string> = {
        blue: "from-slate-900/10 via-blue-900/10 to-cyan-900/10",
        violet: "from-slate-900/10 via-purple-900/10 to-fuchsia-900/10",
        amber: "from-slate-900/10 via-orange-900/10 to-amber-900/10",
    };

    return (
        <Card className="group relative overflow-hidden rounded-3xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl shadow-[0_18px_55px_-28px_rgba(0,0,0,0.45)] dark:shadow-purple-500/10">
            <div className="relative h-44">
                {showImage ? (
                    <>
                        <img
                            src={imageSrc}
                            alt={title}
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                            loading="lazy"
                            onError={() => setImgError(true)}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-white/92 via-white/30 to-transparent dark:from-zinc-900/95 dark:via-zinc-900/50" />
                    </>
                ) : (
                    <>
                        <div className={"absolute inset-0 bg-gradient-to-br " + toneMap[tone]} />
                        <div
                            className="absolute inset-0 opacity-[0.25]"
                            style={{
                                backgroundImage:
                                    "radial-gradient(circle at 20% 10%, rgba(0,0,0,0.14) 0, rgba(0,0,0,0) 45%), radial-gradient(circle at 80% 35%, rgba(0,0,0,0.12) 0, rgba(0,0,0,0) 40%), radial-gradient(circle at 35% 90%, rgba(0,0,0,0.10) 0, rgba(0,0,0,0) 42%)",
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/35 to-transparent dark:from-zinc-900 dark:via-zinc-900/40" />
                    </>
                )}
            </div>

            <CardContent className="p-6 relative z-10">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <h3 className="text-lg font-semibold text-foreground leading-snug">{title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
                    </div>
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-cyan-400/40 via-blue-500/35 to-purple-600/35 border border-black/10 dark:border-white/10 shadow-sm" />
                </div>
            </CardContent>

            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="absolute -inset-12 bg-gradient-to-r from-cyan-400/10 via-blue-500/10 to-purple-600/10 blur-2xl" />
            </div>
        </Card>
    );
}


// -----------------------------
// Scroll To Top
// -----------------------------
function ScrollToTop() {
    const { scrollY } = useScroll();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        return scrollY.on("change", (latest) => {
            setVisible(latest > 600);
        });
    }, [scrollY]);

    return (
        <AnimatePresence>
            {visible && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-black/80 text-white shadow-lg backdrop-blur hover:bg-black transition-colors dark:bg-white/90 dark:text-black"
                    aria-label="Volver arriba"
                >
                    <ArrowUpRight className="h-5 w-5 rotate-[-45deg]" />
                </motion.button>
            )}
        </AnimatePresence>
    );
}

// -----------------------------
// Theme Toggle
// -----------------------------
function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null; // Avoid hydration mismatch

    return (
        <div className="flex items-center gap-1 rounded-full border border-black/10 dark:border-white/20 bg-black/5 dark:bg-white/10 p-1 backdrop-blur-md shadow-sm">
            <button
                onClick={() => setTheme("light")}
                className={cn(
                    "rounded-full p-2 transition-all",
                    theme === "light"
                        ? "bg-white text-black shadow-md scale-105"
                        : "text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white"
                )}
                aria-label="Light Mode"
            >
                <Sun className="h-4 w-4" />
            </button>
            <button
                onClick={() => setTheme("dark")}
                className={cn(
                    "rounded-full p-2 transition-all",
                    theme === "dark"
                        ? "bg-black text-white shadow-md scale-105"
                        : "text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white"
                )}
                aria-label="Dark Mode"
            >
                <Moon className="h-4 w-4" />
            </button>
            <button
                onClick={() => setTheme("system")}
                className={cn(
                    "rounded-full p-2 transition-all",
                    theme === "system"
                        ? "bg-zinc-200 dark:bg-zinc-700 text-black dark:text-white shadow-md scale-105"
                        : "text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white"
                )}
                aria-label="System Mode"
            >
                <Monitor className="h-4 w-4" />
            </button>
        </div>
    );
}

// -----------------------------
// Metrics Dashboard (New "Cool" Section)
// -----------------------------
function CircularMetric({ value, label, sub, color = "blue" }: { value: number; label: string; sub?: string; color?: "blue" | "purple" | "cyan" | "pink" }) {
    const radius = 32;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;

    const colors = {
        blue: "text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]",
        purple: "text-purple-500 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]",
        cyan: "text-cyan-500 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]",
        pink: "text-pink-500 drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]"
    };

    return (
        <div className="flex flex-col items-center p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="relative h-24 w-24">
                <svg className="h-full w-full rotate-[-90deg]" viewBox="0 0 80 80">
                    {/* Track */}
                    <circle cx="40" cy="40" r={radius} stroke="currentColor" strokeWidth="6" fill="transparent" className="text-black/5 dark:text-white/5" />
                    {/* Indicator */}
                    <motion.circle
                        initial={{ strokeDashoffset: circumference }}
                        whileInView={{ strokeDashoffset: offset }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                        cx="40" cy="40" r={radius} stroke="currentColor" strokeWidth="6" fill="transparent"
                        strokeDasharray={circumference}
                        strokeLinecap="round"
                        className={colors[color]}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-bold text-foreground">{value}%</span>
                </div>
            </div>
            <span className="mt-2 text-sm font-semibold text-foreground">{label}</span>
            {sub && <span className="text-[10px] text-muted-foreground uppercase tracking-wide">{sub}</span>}
        </div>
    );
}

function MetricsDashboard() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="rounded-[32px] border border-white/20 bg-gradient-to-b from-white/60 to-white/30 dark:from-zinc-900/60 dark:to-black/30 backdrop-blur-2xl p-6 md:p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] relative overflow-hidden group"
        >
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative z-10">
                <div className="flex flex-col md:flex-row gap-10 items-center justify-between">
                    {/* Left: Text & KPIs */}
                    <div className="flex-1 space-y-6 text-center md:text-left">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
                                <Sparkles className="h-3 w-3" /> Impacto Real
                            </div>
                            <h3 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
                                Resultados que se <br />
                                <span className="bg-gradient-to-r from-blue-600 via-purple-500 to-purple-600 dark:from-blue-400 dark:via-purple-400 dark:to-purple-500 bg-clip-text text-transparent">sienten en la sala.</span>
                            </h3>
                            <p className="mt-4 text-muted-foreground max-w-sm mx-auto md:mx-0">
                                Métricas promedio reportada por centros tras 3 meses de implementación.
                            </p>
                        </div>

                        <div className="flex flex-wrap justify-center md:justify-start gap-4">
                            <div className="p-4 rounded-2xl bg-white/40 dark:bg-white/5 border border-black/5 dark:border-white/5 backdrop-blur-md">
                                <div className="text-3xl font-bold tracking-tighter text-foreground">+45%</div>
                                <div className="text-xs text-muted-foreground font-medium uppercase mt-1">Recupero de costos</div>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/40 dark:bg-white/5 border border-black/5 dark:border-white/5 backdrop-blur-md">
                                <div className="text-3xl font-bold tracking-tighter text-foreground">-30%</div>
                                <div className="text-xs text-muted-foreground font-medium uppercase mt-1">Ausentismo</div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Charts */}
                    <div className="flex-1 w-full relative">
                        {/* Glass Container */}
                        <div className="rounded-3xl border border-white/20 bg-white/40 dark:bg-white/5 backdrop-blur-md p-6 relative">
                            {/* Header */}
                            <div className="flex justify-between items-end mb-6">
                                <div>
                                    <div className="text-sm font-semibold text-foreground">Pacientes Atendidos</div>
                                    <div className="text-xs text-muted-foreground">Últimos 6 meses</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-green-500">+12%</div>
                                    <div className="text-[10px] text-muted-foreground">vs. periodo anterior</div>
                                </div>
                            </div>

                            {/* Bar Chart */}
                            <div className="h-48 flex items-end justify-between gap-3 px-2">
                                {[35, 45, 40, 60, 75, 85].map((h, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ height: 0, opacity: 0 }}
                                        whileInView={{ height: `${h}%`, opacity: 1 }}
                                        transition={{ duration: 0.8, delay: i * 0.1 }}
                                        className="w-full relative group"
                                    >
                                        <div className={cn(
                                            "w-full h-full rounded-t-lg bg-gradient-to-t opacity-90 transition-all group-hover:opacity-100",
                                            i === 5 ? "from-purple-600 to-blue-500" : "from-blue-500/40 to-cyan-400/40"
                                        )} />

                                        {/* Tooltip */}
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white text-[10px] px-2 py-1 rounded pointer-events-none">
                                            {h * 15}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Labels */}
                            <div className="flex justify-between mt-3 px-2 border-t border-black/5 dark:border-white/5 pt-3">
                                {["ENE", "FEB", "MAR", "ABR", "MAY", "JUN"].map((m) => (
                                    <span key={m} className="text-[10px] font-medium text-muted-foreground">{m}</span>
                                ))}
                            </div>
                        </div>

                        {/* Floating Gauge Card */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.6 }}
                            className="absolute -bottom-6 -left-6 hidden sm:block"
                        >
                            <div className="p-1 rounded-[20px] bg-gradient-to-br from-white/20 to-transparent backdrop-blur-lg border border-white/20 shadow-xl">
                                <div className="bg-white/80 dark:bg-black/80 rounded-[18px] p-2">
                                    <CircularMetric value={92} label="Satisfacción" color="pink" />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

// -----------------------------
// Advanced Tech Background (Dynamic)
// -----------------------------
// -----------------------------
// Advanced Tech Background (Dynamic - REDUCED/SUBTLE)
// -----------------------------
function AdvancedTechBackground() {
    const { scrollY } = useScroll();

    // Parallax layers (slower, more subtle movement)
    const y1 = useTransform(scrollY, [0, 2000], [0, 300]);
    const y2 = useTransform(scrollY, [0, 2000], [0, -200]);
    const y3 = useTransform(scrollY, [0, 2000], [0, 100]);

    const { theme } = useTheme();
    // Force specific backgrounds based on theme to prevent "black in light mode" issues
    const bgColor = theme === "light" ? "#ffffff" : undefined;

    return (
        <div
            className="fixed inset-0 z-[-1] overflow-hidden bg-white dark:bg-black transition-colors duration-500 pointer-events-none"
            style={{ backgroundColor: bgColor }} // HAMMER FIX for light mode
        >
            {/* Subtle Dot Grid (Replaces Lines) */}
            {/* Aurora Blobs (Softer, less defined, better mobile perf) */}
            <motion.div
                className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-blue-500/10 dark:bg-blue-600/10 blur-[80px] md:blur-[120px]"
                animate={{
                    x: [0, 50, 0],
                    y: [0, 30, 0],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                style={{ willChange: "transform" }}
            />
            <motion.div
                className="absolute top-[20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-purple-500/10 dark:bg-purple-600/10 blur-[80px] md:blur-[120px]"
                animate={{
                    x: [0, -40, 0],
                    y: [0, 60, 0],
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2,
                }}
                style={{ willChange: "transform" }}
            />
            <motion.div
                className="absolute bottom-[-10%] left-[20%] w-[80vw] h-[80vw] rounded-full bg-cyan-500/10 dark:bg-cyan-600/10 blur-[80px] md:blur-[120px]"
                animate={{
                    x: [0, 30, 0],
                    y: [0, -40, 0],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 4,
                }}
                style={{ willChange: "transform" }}
            />

            {/* Aurora Blobs (Softer, less defined) */}
            <motion.div
                style={{ y: y1 }}
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.4, 0.3] }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[-20%] right-[-10%] h-[800px] w-[800px] rounded-full bg-cyan-400/10 dark:bg-cyan-500/5 blur-[120px]"
            />
            <motion.div
                style={{ y: y2 }}
                animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.3, 0.2] }}
                transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute top-[30%] left-[-20%] h-[700px] w-[700px] rounded-full bg-blue-500/10 dark:bg-blue-600/5 blur-[120px]"
            />
            <motion.div
                style={{ y: y3 }}
                animate={{ scale: [1, 1.05, 1], opacity: [0.25, 0.35, 0.25] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 4 }}
                className="absolute bottom-[-20%] right-[10%] h-[800px] w-[800px] rounded-full bg-purple-500/10 dark:bg-purple-600/5 blur-[120px]"
            />
        </div>
    );
}

function GridDecoration() {
    return (
        <motion.svg
            width="200" height="200" viewBox="0 0 200 200" fill="none"
            className="text-black/20 dark:text-white/10"
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        >
            <path d="M0 0H200V1H0V0Z" fill="currentColor" />
            <path d="M0 20H200V21H0V20Z" fill="currentColor" />
            <path d="M0 40H200V41H0V40Z" fill="currentColor" />
            <circle cx="100" cy="100" r="2" fill="currentColor" />
        </motion.svg>
    )
}

// -----------------------------
// Tech Reveal (Exit Animation)
// -----------------------------
function TechReveal({
    children,
    direction = "up",
    delay = 0,
    className
}: {
    children: React.ReactNode;
    direction?: "left" | "right" | "up" | "down";
    delay?: number;
    className?: string;
}) {
    const variants = {
        hidden: {
            opacity: 0,
            y: direction === "up" ? 40 : direction === "down" ? -40 : 0,
            x: direction === "left" ? -40 : direction === "right" ? 40 : 0,
            scale: 0.95
        },
        visible: {
            opacity: 1,
            y: 0,
            x: 0,
            scale: 1,
            transition: { duration: 0.6, delay }
        },
        exit: {
            opacity: 0,
            y: -60, // Slides UP
            x: -80, // Slides LEFT
            scale: 0.9,
            transition: { duration: 0.5 }
        }
    };

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            exit="exit" // Triggers inside AnimatePresence or manuel exit
            viewport={{ once: false, margin: "-10%" }} // Re-triggers on scroll
            variants={variants}
            className={className}
        >
            {children}
        </motion.div>
    );
}
// -----------------------------
// PhoneFrame + Replica
// -----------------------------
function PhoneFrame({
    src,
    alt,
    label,
    children,
}: {
    src?: string;
    alt?: string;
    label?: string;
    children?: React.ReactNode;
}) {
    const [imgError, setImgError] = useState(false);
    const showImage = Boolean(src) && !imgError;

    useEffect(() => {
        setImgError(false);
    }, [src]);

    return (
        <div className="relative">
            <div className="absolute -inset-6 rounded-[44px] bg-gradient-to-r from-cyan-400/12 via-blue-500/10 to-purple-600/12 blur-2xl" />

            <div className="relative mx-auto w-[320px] sm:w-[360px]">
                <div className="relative rounded-[44px] border border-black/15 bg-gradient-to-b from-white to-white/60 shadow-[0_30px_80px_-38px_rgba(0,0,0,0.65)] overflow-hidden">
                    <div className="absolute inset-[7px] rounded-[38px] border border-black/10" />
                    <div className="absolute left-1/2 top-[10px] -translate-x-1/2 h-[22px] w-[126px] rounded-full bg-black/10 backdrop-blur" />

                    <div className="relative m-[14px] mt-[22px] rounded-[34px] overflow-hidden bg-white">
                        {/* Eliminated top blur overlay to prevent dark muddy gradient on mobile */}
                        {/* <div className="absolute -top-12 left-1/2 -translate-x-1/2 h-32 w-64 rounded-full bg-gradient-to-r from-cyan-400/22 via-blue-500/18 to-purple-600/18 blur-2xl" /> */}

                        {showImage ? (
                            <img
                                src={src}
                                alt={alt || "Captura de Zanoo"}
                                className="block w-full h-full object-cover"
                                loading="lazy"
                                onError={() => setImgError(true)}
                            />
                        ) : (
                            <div className="relative h-[690px] bg-[#f6f7fb]">{children}</div>
                        )}

                        {label ? (
                            <div className="absolute left-4 right-4 bottom-4">
                                <div className="rounded-2xl border border-black/10 bg-white/80 backdrop-blur px-4 py-3">
                                    <div className="text-xs text-black/55">Dentro de la app</div>
                                    <div className="mt-1 text-sm font-semibold text-black leading-tight">{label}</div>
                                </div>
                            </div>
                        ) : null}
                    </div>

                    <div className="absolute -left-[2px] top-24 h-16 w-1.5 rounded-r bg-black/15" />
                    <div className="absolute -left-[2px] top-44 h-10 w-1.5 rounded-r bg-black/15" />
                    <div className="absolute -right-[2px] top-36 h-12 w-1.5 rounded-l bg-black/15" />
                    <div className="h-6" />
                </div>
            </div>
        </div>
    );
}

function ReplicaScreen({
    title,
    subtitle,
    mode = "list",
}: {
    title: string;
    subtitle: string;
    mode?: "list" | "detail" | "metrics";
}) {
    return (
        <div className="h-full px-5 pt-5 pb-6 bg-[#fbfbfe]">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    {/* Restored logo for fallback view */}
                    {/* Restored logo for fallback view - Aligned Row */}
                    <div className="flex items-center gap-2">
                        <img src="/brand/zanoo-logo-color-v2.png" alt="Zanoo" className="h-5 w-auto object-contain" />
                        <div className="text-[15px] font-semibold text-black leading-tight translate-y-[1px]">{title}</div>
                        <div className="h-4 w-[1px] bg-black/10 mx-1" />
                        <div className="text-xs text-black/45 translate-y-[1px]">{subtitle}</div>
                    </div>
                </div>
                <div className="h-10 w-10 rounded-full border border-black/10 bg-white shadow-[0_10px_26px_-18px_rgba(0,0,0,0.45)]" />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
                <MiniKpi label="Hoy" value="operativo" />
                <MiniKpi label="Estado" value="en vivo" />
            </div>

            {mode === "list" && (
                <div className="mt-5 space-y-3">
                    {[
                        { n: "María López", s: "En espera" },
                        { n: "Juan Pérez", s: "Llamado" },
                        { n: "Carlos Gómez", s: "En espera" },
                        { n: "Ana Díaz", s: "En espera" },
                    ].map((p) => (
                        <div
                            key={p.n}
                            className="rounded-3xl border border-black/10 bg-white/90 px-5 py-4 flex items-center justify-between shadow-[0_12px_30px_-22px_rgba(0,0,0,0.35)]"
                        >
                            <div>
                                <div className="text-[15px] font-semibold text-black leading-tight">{p.n}</div>
                                <div className="text-xs text-black/45">DNI · xx.xxx.xxx</div>
                            </div>
                            <span
                                className={cn(
                                    "text-xs px-3 py-1.5 rounded-full border font-medium",
                                    p.s === "Llamado"
                                        ? "border-blue-500/25 bg-blue-500/10 text-blue-700"
                                        : "border-sky-500/20 bg-sky-500/10 text-sky-700"
                                )}
                            >
                                {p.s}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {mode === "detail" && (
                <div className="mt-5 space-y-3">
                    <div className="rounded-2xl border border-black/10 bg-white/70 p-4">
                        <div className="text-sm font-semibold text-black">Resumen del paciente</div>
                        <div className="mt-3 space-y-2">
                            {[
                                ["Alergias", "Ninguna registrada"],
                                ["Medicación", "—"],
                                ["Dx principal", "Control"],
                            ].map(([k, v]) => (
                                <div key={k} className="flex items-start justify-between gap-3">
                                    <div className="text-xs text-black/55">{k}</div>
                                    <div className="text-xs font-medium text-black text-right">{v}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="rounded-2xl border border-black/10 bg-white/70 p-4">
                        <div className="text-sm font-semibold text-black">Últimas consultas</div>
                        <div className="mt-3 space-y-3">
                            {[
                                ["Hace 2 semanas", "Dolor de garganta"],
                                ["Hace 3 meses", "Chequeo"],
                            ].map(([d, t]) => (
                                <div key={d} className="flex gap-3">
                                    <div className="mt-1 h-2 w-2 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600" />
                                    <div>
                                        <div className="text-xs text-black/55">{d}</div>
                                        <div className="text-xs font-medium text-black">{t}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {mode === "metrics" && (
                <div className="mt-5 space-y-3">
                    <div className="rounded-2xl border border-black/10 bg-white/70 p-4">
                        <div className="text-sm font-semibold text-black">Métricas</div>
                        <div className="mt-3 grid grid-cols-3 gap-2">
                            <div className="rounded-2xl border border-black/10 bg-white/70 px-3 py-2">
                                <div className="text-[11px] text-black/55">Asistencia</div>
                                <div className="text-sm font-semibold text-black"><AnimatedCounter value={86} suffix="%" /></div>
                            </div>
                            <div className="rounded-2xl border border-black/10 bg-white/70 px-3 py-2">
                                <div className="text-[11px] text-black/55">Ausentismo</div>
                                <div className="text-sm font-semibold text-black"><AnimatedCounter value={14} suffix="%" /></div>
                            </div>
                            <div className="rounded-2xl border border-black/10 bg-white/70 px-3 py-2">
                                <div className="text-[11px] text-black/55">Espera</div>
                                <div className="text-sm font-semibold text-black"><AnimatedCounter value={18} suffix="m" /></div>
                            </div>
                        </div>
                        <div className="mt-4 h-28 rounded-2xl border border-black/10 bg-white/70" />
                        <div className="mt-2 text-xs text-black/55">Señal: sube jueves/viernes.</div>
                    </div>
                </div>
            )}
        </div>
    );
}

// -----------------------------
// Small charts wrappers
// -----------------------------
function Sparkline({ data }: { data: Array<{ x: string; v: number }> }) {
    return (
        <div className="mt-4 h-16 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 6, right: 4, left: -18, bottom: 0 }}>
                    <CartesianGrid vertical={false} strokeOpacity={0.12} />
                    <XAxis dataKey="x" tick={{ fontSize: 10 }} strokeOpacity={0.25} />
                    <YAxis hide />
                    <Line type="monotone" dataKey="v" stroke="rgba(59,130,246,0.85)" strokeWidth={2.2} dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

function DirectorBars({ data }: { data: Array<{ day: string; v: number }> }) {
    return (
        <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 8, right: 6, left: -18, bottom: 0 }}>
                    <CartesianGrid vertical={false} strokeOpacity={0.15} />
                    <XAxis dataKey="day" tick={{ fontSize: 11 }} strokeOpacity={0.3} />
                    <YAxis tick={{ fontSize: 11 }} strokeOpacity={0.3} />
                    <Tooltip
                        contentStyle={{
                            background: "rgba(255,255,255,0.92)",
                            border: "1px solid rgba(0,0,0,0.10)",
                            borderRadius: 14,
                        }}
                        labelStyle={{ color: "rgba(0,0,0,0.6)" }}
                    />
                    <Bar dataKey="v" radius={[10, 10, 10, 10]} fill="rgba(59,130,246,0.55)" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

// -----------------------------
// Tech Background
// -----------------------------
function TechBackground() {
    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden bg-white pointer-events-none">
            {/* Grid Pattern */}
            <div
                className="absolute inset-0 opacity-[0.4]"
                style={{
                    backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 1px)",
                    backgroundSize: "32px 32px"
                }}
            />

            {/* Soft Blobs (Animated) */}
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.5, 0.3],
                    x: [0, 20, 0],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-blue-100/40 blur-[100px]"
            />
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                    y: [0, -30, 0],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute bottom-[20%] right-[-5%] h-[400px] w-[400px] rounded-full bg-purple-100/40 blur-[100px]"
            />
            <motion.div
                animate={{
                    scale: [1, 1.15, 1],
                    x: [0, -20, 0],
                }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 5 }}
                className="absolute top-[40%] left-[20%] h-[300px] w-[300px] rounded-full bg-cyan-100/30 blur-[80px]"
            />
        </div>
    );
}

// -----------------------------
// Scroll Reveal (Directional)
// -----------------------------
function ScrollReveal({
    children,
    direction = "up",
    delay = 0,
    className
}: {
    children: React.ReactNode;
    direction?: "left" | "right" | "up" | "down";
    delay?: number;
    className?: string;
}) {
    const variants = {
        hidden: {
            opacity: 0,
            y: direction === "up" ? 40 : direction === "down" ? -40 : 0,
            x: direction === "left" ? -40 : direction === "right" ? 40 : 0
        },
        visible: {
            opacity: 1,
            y: 0,
            x: 0,
            transition: { duration: 0.6, delay }
        }
    };

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={variants}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// -----------------------------
// Parallax Image Component
// -----------------------------
function ParallaxImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });
    const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

    return (
        <div ref={ref} className={cn("overflow-hidden", className)}>
            <motion.img
                style={{ y }}
                src={src}
                alt={alt}
                className="w-full h-full object-cover scale-110"
            />
        </div>
    );
}

// -----------------------------
// Quote Carousel
// -----------------------------
function QuoteCarousel() {
    const quotes = [
        {
            highlight: "19M de argentinos",
            text: "“Más de 19 millones de argentinos se atienden exclusivamente en salitas y CAPS. Es casi 1 de cada 2 personas que dependen del primer nivel público.”",
        },
        {
            highlight: "8.000+ centros de salud",
            text: "“En Argentina existen más de 8.000 salitas y centros de atención primaria. La mayoría funciona con papel, planillas o WhatsApp.”",
        },
        {
            highlight: "45% abre todo el día",
            text: "“Solo el 45% de los centros de atención primaria abre todos los días. El resto funciona con horarios limitados y desorganización estructural.”",
        },
    ];

    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % quotes.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [quotes.length]);

    return (
        <div className="w-full md:w-[75%] mx-auto relative h-48 sm:h-40">
            <AnimatePresence mode="wait">
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 flex flex-col items-center justify-center text-center"
                >
                    <div className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-4">
                        {quotes[index].highlight}
                    </div>
                    <p className="text-lg md:text-xl text-muted-foreground italic max-w-3xl leading-relaxed">
                        {quotes[index].text}
                    </p>
                </motion.div>
            </AnimatePresence>

            <div className="absolute -bottom-8 left-0 right-0 flex justify-center gap-2">
                {quotes.map((_, i) => (
                    <div
                        key={i}
                        className={cn(
                            "h-1.5 rounded-full transition-all duration-300",
                            i === index ? "w-8 bg-foreground/40" : "w-1.5 bg-foreground/10"
                        )}
                    />
                ))}
            </div>
        </div>
    );
}

// -----------------------------
// Main
// -----------------------------
export default function ZanooLanding() {
    const heroRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });
    const heroPhoneY = useTransform(scrollYProgress, [0, 1], [0, 120]);
    const heroPhoneRotate = useTransform(scrollYProgress, [0, 1], [0, -12]); // Rotates 12deg as you scroll
    const fadeUp = useFadeUp();

    const [demoTab, setDemoTab] = useState<"Recepción" | "Consultorio" | "Dirección">("Recepción");
    const [shotIndex, setShotIndex] = useState(0);

    // 3D Tilt Logic
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseX = useSpring(x, { stiffness: 50, damping: 20 });
    const mouseY = useSpring(y, { stiffness: 50, damping: 20 });

    function handleMouseMove(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        const { left, top, width, height } = event.currentTarget.getBoundingClientRect();
        const cx = left + width / 2;
        const cy = top + height / 2;
        const dx = (event.clientX - cx) / (width / 2); // -1 to 1
        const dy = (event.clientY - cy) / (height / 2); // -1 to 1
        x.set(dx * 4); // Tuned down: Max tilt 4deg (was 10)
        y.set(dy * 4);
    }
    // Auto-play demo tabs
    useEffect(() => {
        const interval = setInterval(() => {
            const tabs = ["Recepción", "Consultorio", "Dirección"] as const;
            // Solo rotar si no está el mouse encima (opcional, pero buena UX)
            // Para simplicidad en este componente gigante, rotamos siempre
            // salvo que podríamos agregar un estado de hover.
            setDemoTab(prev => {
                const currentIndex = tabs.indexOf(prev as any);
                const nextIndex = (currentIndex + 1) % tabs.length;
                return tabs[nextIndex];
            });
        }, 4000); // 4 segundos
        return () => clearInterval(interval);
    }, []);

    const [heroIndex, setHeroIndex] = useState(0);
    // Hero Text Rotation
    const [heroTextIndex, setHeroTextIndex] = useState(0);
    const heroPhrases = useMemo(() => ["atender mejor", "cuidar el tiempo", "cuidar a las personas", "hacer más justo el acceso"], []);

    useEffect(() => {
        const interval = setInterval(() => {
            setHeroTextIndex((prev) => (prev + 1) % heroPhrases.length);
        }, 3000); // 3 seconds per phrase
        return () => clearInterval(interval);
    }, [heroPhrases]);

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const [formSent, setFormSent] = useState(false);
    const formTimer = useRef<number | null>(null);

    useEffect(() => {
        return () => {
            if (formTimer.current) window.clearTimeout(formTimer.current);
        };
    }, []);

    const spark = useMemo(
        () => [
            { x: "L", v: 22 },
            { x: "M", v: 25 },
            { x: "X", v: 19 },
            { x: "J", v: 29 },
            { x: "V", v: 27 },
            { x: "S", v: 12 },
        ],
        []
    );

    const directorBars = useMemo(
        () => [
            { day: "L", v: 32 },
            { day: "M", v: 38 },
            { day: "X", v: 29 },
            { day: "J", v: 44 },
            { day: "V", v: 41 },
            { day: "S", v: 18 },
        ],
        []
    );

    const activeShot = APP_SHOTS[shotIndex % APP_SHOTS.length];
    const activeHeroShot = HERO_SHOTS[heroIndex % HERO_SHOTS.length];

    return (
        <div className="font-sans text-foreground selection:bg-primary/20 overflow-x-hidden bg-white dark:bg-black">
            <AdvancedTechBackground />
            <ScrollToTop />

            {/* MOBILE PERF: backdrop-blur-none on mobile, xl on md+ */}
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 dark:border-white/5 bg-white/80 dark:bg-black/80 backdrop-blur-none md:backdrop-blur-xl transition-all duration-300">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <button
                        type="button"
                        onClick={() => scrollToId("top")}
                        className="flex items-center gap-2 group"
                    >
                        {/* Logo adapts to theme via CSS filters or separate assets if needed, using text for now or simple SVG */}
                        {/* Logo adapts to theme via CSS filters or separate assets if needed, using text for now or simple SVG */}
                        <BrandLogo className="h-9 w-auto" />
                        {/* <span className="text-xl font-bold tracking-tight text-foreground group-hover:opacity-80 transition-opacity">
                            Zanoo
                        </span> */}
                    </button>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-6">
                        <div className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
                            {["Producto", "App real", "Gratis", "Impacto", "Roadmap"].map((item) => (
                                <button
                                    key={item}
                                    className="hover:text-foreground transition-colors"
                                    onClick={() => scrollToId(item.toLowerCase().replace(" ", ""))}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>

                        <div className="h-4 w-[1px] bg-border mx-2" />

                        <ThemeToggle />

                        <Button
                            className="rounded-full bg-foreground text-background hover:bg-foreground/90 font-medium px-6"
                            onClick={() => scrollToId("contacto")}
                        >
                            Pedí demo
                        </Button>
                    </div>

                    {/* Mobile Menu Toggle + Theme */}
                    <div className="flex items-center gap-3 md:hidden">
                        <ThemeToggle />
                        <button
                            type="button"
                            className="p-2 text-foreground"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden bg-background/95 backdrop-blur-xl border-b border-border md:hidden"
                        >
                            <div className="flex flex-col p-6 space-y-4">
                                {["Producto", "App real", "Gratis", "Impacto", "Roadmap", "Contacto"].map((item) => (
                                    <button
                                        key={item}
                                        className="text-lg font-medium text-foreground text-left py-2 border-b border-border/50 last:border-0"
                                        onClick={() => {
                                            scrollToId(item.toLowerCase().replace(" ", ""));
                                            setMobileMenuOpen(false);
                                        }}
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* HERO */}
            <section id="top" className="pt-32 pb-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.10),transparent_55%),radial-gradient(ellipse_at_right,rgba(168,85,247,0.10),transparent_60%)]" />

                <div className="relative max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-14 items-center">
                    {/* Hero Text */}
                    <div className="space-y-8">
                        <TechReveal direction="up" delay={0.1}>
                            <SectionBadge>Sistema clínico-operativo para centros de salud</SectionBadge>
                        </TechReveal>

                        <TechReveal direction="up" delay={0.2}>
                            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-7xl leading-tight min-h-[160px] md:min-h-[auto]">
                                Ordenar la atención es <br />
                                <AnimatePresence mode="wait">
                                    <motion.span
                                        key={heroTextIndex}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.8, ease: "easeInOut" }}
                                        className="inline-block bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent pb-1"
                                    >
                                        {heroPhrases[heroTextIndex]}.
                                    </motion.span>
                                </AnimatePresence>
                            </h1>
                        </TechReveal>

                        <TechReveal direction="up" delay={0.3}>
                            <p className="max-w-xl text-lg text-muted-foreground leading-relaxed">
                                Zanoo ayuda a centros de salud a gestionar <strong>turnos, pacientes e información clínica</strong> en un solo lugar.
                                <br className="hidden sm:block" />
                                <span className="text-foreground font-medium">Simple para el equipo. Claro para la gente.</span>
                            </p>
                        </TechReveal>

                        <TechReveal direction="up" delay={0.4}>
                            <div className="flex flex-wrap gap-4">
                                <ShimmerButton
                                    className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 px-8 h-12 text-base font-medium"
                                    onClick={() => scrollToId("contacto")}
                                >
                                    Pedí demo
                                </ShimmerButton>
                                <Button variant="outline" size="lg" className="rounded-full border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 h-12 px-8 text-base">
                                    Ver la app
                                </Button>
                            </div>

                            <div className="mt-10 grid grid-cols-3 gap-3 max-w-xl">
                                <MiniKpi label="Implementación" value="rápida" />
                                <MiniKpi label="UX" value="sin fricción" />
                                <MiniKpi label="Roadmap" value="IA-ready" />
                            </div>

                            <div className="mt-10 rounded-3xl border border-black/10 bg-white/70 backdrop-blur-xl p-5 max-w-xl shadow-[0_18px_55px_-28px_rgba(0,0,0,0.45)]">
                                <div className="text-sm font-semibold text-black">Lo que resuelve (sin vueltas)</div>
                                <div className="mt-4 grid sm:grid-cols-2 gap-3">
                                    <TechReveal direction="left" delay={0.1}>
                                        <div className="rounded-2xl border border-black/10 bg-white/70 px-4 py-3">
                                            <div className="text-xs text-black/55">Turnos y sala</div>
                                            <div className="mt-1 text-sm font-semibold text-black">estados + llamados</div>
                                        </div>
                                    </TechReveal>
                                    <TechReveal direction="right" delay={0.2}>
                                        <div className="rounded-2xl border border-black/10 bg-white/70 px-4 py-3">
                                            <div className="text-xs text-black/55">Pacientes</div>
                                            <div className="mt-1 text-sm font-semibold text-black">historia en un lugar</div>
                                        </div>
                                    </TechReveal>
                                    <TechReveal direction="left" delay={0.3}>
                                        <div className="rounded-2xl border border-black/10 bg-white/70 px-4 py-3">
                                            <div className="text-xs text-black/55">Equipo</div>
                                            <div className="mt-1 text-sm font-semibold text-black">menos fricción diaria</div>
                                        </div>
                                    </TechReveal>
                                    <TechReveal direction="right" delay={0.4}>
                                        <div className="rounded-2xl border border-black/10 bg-white/70 px-4 py-3">
                                            <div className="text-xs text-black/55">Gestión</div>
                                            <div className="mt-1 text-sm font-semibold text-black">métricas y señal</div>
                                        </div>
                                    </TechReveal>
                                </div>
                                <div className="mt-3 text-xs text-black/45">
                                    Nota: los indicadores son objetivos/benchmarks hasta cargar métricas reales.
                                </div>
                            </div>
                        </TechReveal>
                    </div>

                    {/* HERO: CELU + SLIDER REAL */}
                    <motion.div
                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="relative perspective-1000"
                        style={{ perspective: 1200 }}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={() => { x.set(0); y.set(0); }}
                    >
                        <motion.div
                            style={{
                                rotateX: mouseY, // Inverted? usually dy maps to rotateX
                                rotateY: useTransform(mouseX, (v) => -v),
                            }}
                            animate={{
                                y: [0, -10, 0], // Tuned down: Float 10px (was 15)
                            }}
                            transition={{
                                y: {
                                    duration: 5, // Slower: 5s (was 4)
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }
                            }}
                        >
                            <PhoneFrame label={activeHeroShot.label} src={activeHeroShot.src}>
                                {activeHeroShot.id === "inicio" ? (
                                    <ReplicaScreen title="Zanoo" subtitle="Inicio" mode="detail" />
                                ) : (
                                    <ReplicaScreen title="Zanoo" subtitle="Mis médicos" mode="list" />
                                )}
                            </PhoneFrame>

                            <div className="mt-6 max-w-[360px] mx-auto">
                                <div className="rounded-3xl border border-black/10 bg-white/70 backdrop-blur-xl p-4 shadow-[0_18px_55px_-28px_rgba(0,0,0,0.45)]">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-sm font-semibold text-black">Capturas reales</div>
                                            <div className="text-xs text-black/55">Inicio / Mis médicos</div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {HERO_SHOTS.map((_, i) => (
                                                <button
                                                    key={i}
                                                    type="button"
                                                    aria-label={`Ir a captura ${i + 1}`}
                                                    onClick={() => setHeroIndex(i)}
                                                    className={cn(
                                                        "h-2.5 w-2.5 rounded-full border transition-all",
                                                        heroIndex === i
                                                            ? "bg-gradient-to-r from-cyan-500 to-purple-600 border-black/20"
                                                            : "bg-black/10 border-black/10 hover:bg-black/15"
                                                    )}
                                                />
                                            ))}
                                        </div>
                                    </div>



                                    <div className="mt-3 flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setHeroIndex((p) => (p === 0 ? HERO_SHOTS.length - 1 : p - 1))}
                                            className="flex-1 px-4 py-2 rounded-2xl border border-black/10 bg-white hover:bg-black/5 text-sm dark:bg-white/10 dark:border-white/10 dark:text-white dark:hover:bg-white/20 transition-colors"
                                        >
                                            ◀
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setHeroIndex((p) => (p + 1) % HERO_SHOTS.length)}
                                            className="flex-1 px-4 py-2 rounded-2xl border border-black/10 bg-white hover:bg-black/5 text-sm dark:bg-white/10 dark:border-white/10 dark:text-white dark:hover:bg-white/20 transition-colors"
                                        >
                                            ▶
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 max-w-[360px] mx-auto">
                                <GradientBorder>
                                    <div className="p-5">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="text-sm font-semibold text-black">En sala (señal)</div>
                                                <div className="text-xs text-black/55">Actividad semanal</div>
                                            </div>
                                            <span className="text-xs text-black/55">Últimos 7 días</span>
                                        </div>
                                        <Sparkline data={spark} />
                                        <div className="mt-2 text-xs text-black/55">Señal: sube a media mañana.</div>
                                    </div>
                                </GradientBorder>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* PROBLEMA + FOTOS (reales) */}
            <section id="producto" className="py-24">
                <div className="max-w-6xl mx-auto px-6">
                    <motion.div {...fadeUp}>
                        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">
                            Lo que hoy te <span className="font-bold italic">frena</span> no es la falta de médicos.
                            <br />
                            Es el <span className="text-blue-600 dark:text-blue-400">desorden</span>.
                        </h2>
                        <motion.p
                            className="mt-4 text-black/60 dark:text-white/60 max-w-3xl text-lg"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 0.5 }}
                        >
                            En el día a día, el problema aparece como fricción: papeles, mensajes y filas.
                            <br />
                            <span className="block mt-4 font-semibold text-foreground flex items-center gap-3">
                                Mirá cómo lo resolvemos <ArrowUpRight className="rotate-180 h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </span>
                        </motion.p>
                    </motion.div>

                    <div className="mt-12 grid md:grid-cols-3 gap-8">
                        {PROBLEM_TILES.map((t, idx) => (
                            <motion.div key={t.title} {...fadeUp} transition={{ ...(fadeUp as any).transition, delay: 0.05 * idx }}>
                                <PhotoTile title={t.title} desc={t.desc} tone={t.tone} imageSrc={t.imageSrc} />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* APP REAL SECTION */}
            <section id="app" className="py-24 relative">
                {/* Section Specific Background Spotlights */}
                <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-blue-400/10 dark:bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-400/10 dark:bg-purple-600/5 rounded-full blur-[100px] pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-14 items-start">
                        <motion.div {...fadeUp}>
                            <SectionBadge>Dentro de la app (real)</SectionBadge>

                            <div className="mt-4 flex items-center gap-3">
                                <BrandLogo className="h-8 w-auto" />
                                <div className="text-xs text-black/45 dark:text-white/50">Producto real · capturas reales</div>
                            </div>

                            <h2 className="mt-6 text-4xl md:text-5xl font-semibold tracking-tight">
                                Esto no es una promesa.
                                <br />
                                Es el <span className="relative inline-block">
                                    <span className="relative z-10 font-extrabold tracking-tight text-4xl md:text-5xl uppercase bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                                        PRODUCTO
                                    </span>
                                </span>.
                            </h2>

                            <p className="mt-4 text-black/60 max-w-xl">
                                Acá se muestran capturas reales adentro de un celu. Si todavía no hay screenshot cargado, ves una réplica
                                liviana.
                            </p>

                            <div className="mt-8 flex flex-wrap gap-2">
                                {APP_SHOTS.map((s, i) => (
                                    <button
                                        key={s.id}
                                        type="button"
                                        onClick={() => setShotIndex(i)}
                                        className={cn(
                                            "px-4 py-2 rounded-full border text-sm transition-all",
                                            shotIndex % APP_SHOTS.length === i
                                                ? "border-black/15 bg-white text-black shadow-sm"
                                                : "border-transparent bg-black/5 text-black/55 hover:bg-black/10 dark:bg-white/10 dark:text-white/70"
                                        )}
                                    >
                                        {s.label}
                                    </button>
                                ))}
                            </div>

                            <div className="mt-10 grid sm:grid-cols-2 gap-4">
                                <TechReveal direction="left" delay={0.1}>
                                    <FeatureCard
                                        title="↓ Tiempos de espera"
                                        desc="Estudios confirman una reducción del 45% en demoras con agenda inteligente."
                                        icon={<Zap />}
                                        bg="from-cyan-400 via-blue-500 to-indigo-600"
                                    />
                                </TechReveal>
                                <TechReveal direction="right" delay={0.2}>
                                    <FeatureCard
                                        title="↑ Continuidad clínica"
                                        desc="El acceso inmediato al historial evita repeticiones y errores de medicación."
                                        icon={<Layout />}
                                        bg="from-blue-400 via-indigo-500 to-purple-600"
                                    />
                                </TechReveal>
                                <TechReveal direction="left" delay={0.3}>
                                    <FeatureCard
                                        title="↓ Ausentismo"
                                        desc="Recordatorios automáticos reducen el ausentismo un 30% en el primer mes."
                                        icon={<BarChartIcon />}
                                        bg="from-amber-400 via-orange-500 to-red-600"
                                    />
                                </TechReveal>
                                <TechReveal direction="right" delay={0.4}>
                                    <FeatureCard
                                        title="↓ Fricción operativa"
                                        desc="Alertas tempranas previenen cuellos de botella antes de que colapsen la sala."
                                        icon={<Bell />}
                                        bg="from-emerald-400 via-teal-500 to-cyan-600"
                                    />
                                </TechReveal>
                            </div>

                            <div className="mt-24">
                                <MetricsDashboard />
                            </div>


                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.7, ease: "easeOut" }}
                            className="relative perspective-1000"
                        >
                            <motion.div
                                style={{
                                    y: useTransform(useScroll().scrollYProgress, [0, 1], [50, -50]),
                                    rotateX: useTransform(useScroll().scrollYProgress, [0.2, 0.8], [5, -5]),
                                }}
                                className="transition-transform duration-100 ease-out"
                            >
                                <PhoneFrame label={activeShot.label} src={activeShot.src}>
                                    <ReplicaScreen
                                        title="Zanoo"
                                        subtitle={activeShot.id === "turnos" ? "Recepción" : activeShot.id === "inicio" ? "Inicio" : "Dirección"}
                                        mode={activeShot.mode || "list"}
                                    />
                                </PhoneFrame>
                            </motion.div>

                            <div className="mt-6 max-w-[360px] mx-auto">
                                <div className="rounded-3xl border border-black/10 bg-white/70 backdrop-blur-xl p-4 shadow-[0_18px_55px_-28px_rgba(0,0,0,0.45)] dark:bg-white/10 dark:border-white/10">
                                    <div className="text-xs text-black/55 dark:text-white/60">Siguiente/Anterior</div>
                                    <div className="mt-3 flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setShotIndex((prev) => (prev === 0 ? APP_SHOTS.length - 1 : prev - 1))}
                                            className="flex-1 px-4 py-2 rounded-2xl border border-black/10 bg-white hover:bg-black/5 text-sm dark:bg-white/10 dark:border-white/10 dark:text-white dark:hover:bg-white/20"
                                        >
                                            ◀
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShotIndex((prev) => (prev + 1) % APP_SHOTS.length)}
                                            className="flex-1 px-4 py-2 rounded-2xl border border-black/10 bg-white hover:bg-black/5 text-sm dark:bg-white/10 dark:border-white/10 dark:text-white dark:hover:bg-white/20"
                                        >
                                            ▶
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <div className="mt-20">
                        <QuoteCarousel />
                    </div>
                </div>
            </section>

            {/* GRATIS + APLICAR */}
            <section id="gratis" className="py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-14 items-start">
                        <motion.div {...fadeUp}>
                            <SectionBadge>Para salitas y centros</SectionBadge>
                            <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                                Zanoo es <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent font-extrabold">GRATIS</span>
                                <br />
                                para las salitas.
                            </h2>

                            <p className="mt-4 text-black/60 max-w-xl">
                                La misión es simple: ordenar la atención donde más se necesita. Si sos un centro con recursos limitados,
                                aplicá y coordinamos un contacto inicial.
                            </p>

                            <div className="mt-8 grid sm:grid-cols-2 gap-4">
                                <FeatureCard
                                    title="Implementación cuidada"
                                    desc="Arrancamos con lo esencial y dejamos el sistema andando con tu equipo."
                                />
                                <FeatureCard title="Soporte humano" desc="Acompañamiento en el arranque: recepción, consultorio y dirección." />
                            </div>

                            <div className="mt-10 rounded-3xl border border-black/10 bg-white/70 backdrop-blur-xl p-6 shadow-[0_18px_55px_-28px_rgba(0,0,0,0.45)]">
                                <div className="text-sm font-semibold text-black">Qué pedimos para arrancar</div>
                                <ul className="mt-3 text-sm text-black/60 space-y-2 list-disc list-inside">
                                    <li>Datos de contacto y ubicación del centro</li>
                                    <li>Volumen aproximado (pacientes/mes, turnos/mes)</li>
                                    <li>Cómo llevan hoy turnos e historia (papel / WhatsApp / cuaderno / sistema)</li>
                                </ul>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-80px" }}
                            transition={{ duration: 0.55, ease: "easeOut" }}
                        >
                            <div className="rounded-[32px] border border-black/10 bg-white/70 backdrop-blur-xl shadow-[0_30px_80px_-38px_rgba(0,0,0,0.65)] overflow-hidden">
                                <div className="px-6 py-5 border-b border-black/10 bg-white/60 flex items-center gap-3">
                                    {/* Logo for White Card - Always Full Color */}
                                    <img
                                        src="/brand/zanoo-logo-color-v2.png"
                                        alt="Zanoo"
                                        className="h-9 object-contain"
                                    />
                                    <div>
                                        <div className="text-sm font-semibold text-black">Aplicación para centros</div>
                                        <div className="text-xs text-black/50">Formulario básico (contacto inicial)</div>
                                    </div>
                                </div>

                                <div className="p-6">
                                    {formSent ? (
                                        <div className="rounded-3xl border border-black/10 bg-white/80 p-6">
                                            <div className="text-sm font-semibold text-black">Listo ✅</div>
                                            <div className="mt-2 text-sm text-black/60">
                                                Recibimos tu solicitud. Te contactamos para coordinar el primer paso.
                                            </div>
                                            <div className="mt-4">
                                                <Button
                                                    variant="outline"
                                                    className="rounded-full border-black/15 bg-white/70 text-black hover:bg-black/5"
                                                    onClick={() => setFormSent(false)}
                                                >
                                                    Enviar otra
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <form
                                            onSubmit={(e) => {
                                                e.preventDefault();

                                                // 1. Gather Data
                                                const formData = new FormData(e.currentTarget);
                                                const data = Object.fromEntries(formData.entries());

                                                // 2. Fallback: Mailto (Immediate utility without backend)
                                                // Construct body for email client
                                                const subject = `Nuevo contacto Zanoo: ${data.centro}`;
                                                const body = `Nombre: ${data.centro}\nProvincia: ${data.provincia}\nLocalidad: ${data.localidad}\nContacto: ${data.contacto}\nWhatsApp: ${data.whatsapp}\nEmail: ${data.email}\nComentario: ${data.comentarios || '-'}`;

                                                // Open mail client in separate tab if API fails or as default
                                                // window.open(`mailto:hola@zanoo.com.ar?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);

                                                // 3. UI Feedback
                                                setFormSent(true);
                                                // auto reset suave para no “trabar” si el usuario quiere volver a completar
                                                formTimer.current = window.setTimeout(() => setFormSent(false), 12000);
                                            }}
                                            className="grid sm:grid-cols-2 gap-4"
                                        >
                                            <div className="sm:col-span-2">
                                                <label className="text-xs text-black/55">Nombre del centro</label>
                                                <input
                                                    required
                                                    name="centro"
                                                    className="mt-1 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                                                    placeholder="Ej: CAPS San Martín"
                                                />
                                            </div>

                                            <div>
                                                <label className="text-xs text-black/55">Provincia</label>
                                                <input
                                                    required
                                                    name="provincia"
                                                    className="mt-1 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                                                    placeholder="Buenos Aires"
                                                />
                                            </div>

                                            <div>
                                                <label className="text-xs text-black/55">Localidad / Barrio</label>
                                                <input
                                                    required
                                                    name="localidad"
                                                    className="mt-1 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                                                    placeholder="Ej: San Justo"
                                                />
                                            </div>

                                            <div className="sm:col-span-2">
                                                <label className="text-xs text-black/55">Dirección</label>
                                                <input
                                                    name="direccion"
                                                    className="mt-1 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                                                    placeholder="Calle y número"
                                                />
                                            </div>

                                            <div>
                                                <label className="text-xs text-black/55">Personas atendidas / mes</label>
                                                <input
                                                    required
                                                    type="number"
                                                    min={0}
                                                    name="pacientes"
                                                    className="mt-1 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                                                    placeholder="Ej: 1200"
                                                />
                                            </div>

                                            <div>
                                                <label className="text-xs text-black/55">Turnos / mes</label>
                                                <input
                                                    required
                                                    type="number"
                                                    min={0}
                                                    name="turnos"
                                                    className="mt-1 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                                                    placeholder="Ej: 900"
                                                />
                                            </div>

                                            <div>
                                                <label className="text-xs text-black/55">Contacto</label>
                                                <input
                                                    required
                                                    name="contacto"
                                                    className="mt-1 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                                                    placeholder="Nombre y rol"
                                                />
                                            </div>

                                            <div>
                                                <label className="text-xs text-black/55">WhatsApp</label>
                                                <input
                                                    required
                                                    name="whatsapp"
                                                    className="mt-1 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                                                    placeholder="Ej: +54 11 1234-5678"
                                                />
                                            </div>

                                            <div className="sm:col-span-2">
                                                <label className="text-xs text-black/55">Correo</label>
                                                <input
                                                    required
                                                    type="email"
                                                    name="email"
                                                    className="mt-1 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                                                    placeholder="contacto@centro.gob.ar"
                                                />
                                            </div>

                                            <div className="sm:col-span-2">
                                                <label className="text-xs text-black/55">Comentario (opcional)</label>
                                                <textarea
                                                    rows={3}
                                                    name="comentarios"
                                                    className="mt-1 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                                                    placeholder="Ej: hoy usamos planilla y WhatsApp; queremos ordenar turnos y sala."
                                                />
                                            </div>

                                            <div className="sm:col-span-2 flex items-center justify-between gap-3 pt-2">
                                                <div className="text-xs text-black/45">Esto inicia el contacto. Coordinamos y vemos si aplica.</div>
                                                <Button
                                                    type="submit"
                                                    className="rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-white"
                                                >
                                                    Enviar aplicación
                                                </Button>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* DEMO (web) */}
            {/* DEMO (web) */}
            <section id="demo" className="py-24">
                <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-14 items-start">
                    <motion.div {...fadeUp}>
                        <SectionBadge>Demo liviana (web)</SectionBadge>
                        <h2 className="mt-6 text-4xl md:text-5xl font-semibold tracking-tight">
                            Una sola vista.
                            <br />
                            Todo lo{" "}
                            <span className="relative inline-block align-baseline pb-1">
                                <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 bg-clip-text text-transparent font-extrabold tracking-tight">
                                    importante
                                </span>
                                <span className="absolute -inset-x-1 -bottom-1 h-[10px] bg-gradient-to-r from-cyan-400/20 via-blue-500/15 to-purple-600/20 blur-xl" />
                            </span>
                            .
                        </h2>
                        <p className="mt-4 text-black/60 max-w-xl">
                            La misma plataforma sirve para Recepción, Consultorio y Dirección. Cambiás de rol sin cambiar de sistema.
                        </p>

                        <div className="mt-8 flex flex-wrap gap-2">
                            {(["Recepción", "Consultorio", "Dirección"] as const).map((t) => (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() => setDemoTab(t)}
                                    className={cn(
                                        "px-4 py-2 rounded-full border text-sm transition-all",
                                        demoTab === t
                                            ? "border-black/15 bg-white text-black shadow-sm"
                                            : "border-transparent bg-black/5 text-black/55 hover:bg-black/10"
                                    )}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>

                        <div className="mt-10 grid grid-cols-2 gap-3 max-w-xl">
                            <MiniKpi label="Baja fricción" value="1 vista" />
                            <MiniKpi label="Operación" value="en tiempo real" />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.55, ease: "easeOut" }}
                        className="relative"
                    >
                        <div className="absolute -inset-6 rounded-[40px] bg-gradient-to-r from-cyan-400/12 via-blue-500/10 to-purple-600/12 blur-2xl" />

                        <div className="rounded-3xl border border-black/10 bg-white/70 backdrop-blur-xl shadow-[0_18px_70px_-35px_rgba(0,0,0,0.55)] overflow-hidden">
                            <div className="flex items-center justify-between px-5 py-4 border-b border-black/10 bg-white/60">
                                <div className="flex items-center gap-2">
                                    <Image
                                        src="/brand/zanoo-logo-color-v2.png"
                                        alt="Zanoo"
                                        width={120}
                                        height={40}
                                        className="h-7 w-auto object-contain"
                                    />
                                    <div className="text-sm font-semibold text-black">Zanoo</div>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-black/55">
                                    <span className="px-2 py-1 rounded-full border border-black/10 bg-white/70">Equipo</span>
                                    <span className="px-2 py-1 rounded-full border border-black/10 bg-white/70">Hoy</span>
                                </div>
                            </div>

                            <div className="px-5 pt-4">
                                <div className="flex gap-2 text-xs">
                                    {(["Recepción", "Consultorio", "Dirección"] as const).map((t) => (
                                        <button
                                            key={t}
                                            className={cn(
                                                "px-3 py-2 rounded-full border transition-all",
                                                demoTab === t
                                                    ? "border-black/15 bg-white text-black shadow-sm"
                                                    : "border-transparent bg-black/5 text-black/55 hover:bg-black/10"
                                            )}
                                            type="button"
                                            onClick={() => setDemoTab(t)}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="p-5">
                                {demoTab === "Recepción" && (
                                    <div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="text-sm font-semibold text-black">Próximos turnos</div>
                                                <div className="text-xs text-black/55">Estado en tiempo real</div>
                                            </div>
                                            <div className="text-xs text-black/55">Consultorio 2</div>
                                        </div>

                                        <div className="mt-4 grid grid-cols-2 gap-3">
                                            <MiniKpi label="En espera" value={<AnimatedCounter value={7} />} />
                                            <MiniKpi label="Tiempo prom." value={<AnimatedCounter value={18} suffix=" min" />} />
                                        </div>

                                        <div className="mt-4 space-y-2">
                                            {[
                                                { name: "María López", time: "08:20", status: "En espera" },
                                                { name: "Juan Pérez", time: "08:40", status: "Llamado" },
                                                { name: "Carlos Gómez", time: "09:00", status: "En espera" },
                                                { name: "Ana Díaz", time: "09:20", status: "En espera" },
                                            ].map((p) => (
                                                <div
                                                    key={p.name}
                                                    className="flex items-center justify-between rounded-2xl border border-black/10 bg-white/70 px-4 py-3"
                                                >
                                                    <div>
                                                        <div className="text-sm font-medium text-black">{p.name}</div>
                                                        <div className="text-xs text-black/55">{p.time}</div>
                                                    </div>
                                                    <span
                                                        className={cn(
                                                            "text-xs px-2 py-1 rounded-full border",
                                                            p.status === "Llamado"
                                                                ? "border-blue-500/30 bg-blue-500/10 text-blue-700"
                                                                : "border-cyan-500/25 bg-cyan-500/10 text-cyan-700"
                                                        )}
                                                    >
                                                        {p.status}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-4 rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-xs text-black/60">
                                            Notificación: “Faltan 2 pacientes para tu turno”.
                                        </div>
                                    </div>
                                )}

                                {demoTab === "Consultorio" && (
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="rounded-2xl border border-black/10 bg-white/70 p-4">
                                            <div className="text-sm font-semibold text-black">Resumen del paciente</div>
                                            <div className="text-xs text-black/55">Juan Pérez</div>
                                            <div className="mt-4 space-y-3">
                                                {[
                                                    ["Alergias", "Ninguna registrada"],
                                                    ["Medicación", "Ibuprofeno (si dolor)"],
                                                    ["Dx principal", "Control general"],
                                                ].map(([t, v]) => (
                                                    <div key={t} className="flex items-start justify-between gap-3">
                                                        <div className="text-xs text-black/55">{t}</div>
                                                        <div className="text-xs font-medium text-black text-right">{v}</div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="mt-4 flex gap-2">
                                                <button className="text-xs px-3 py-2 rounded-full border border-black/10 bg-white hover:bg-black/5">
                                                    Agregar nota
                                                </button>
                                                <button className="text-xs px-3 py-2 rounded-full border border-black/10 bg-white hover:bg-black/5">
                                                    Recetar
                                                </button>
                                            </div>
                                        </div>

                                        <div className="rounded-2xl border border-black/10 bg-white/70 p-4">
                                            <div className="text-sm font-semibold text-black">Últimas consultas</div>
                                            <div className="mt-4 space-y-3">
                                                {[
                                                    ["Hace 2 semanas", "Dolor de garganta — reposo"],
                                                    ["Hace 3 meses", "Chequeo anual"],
                                                ].map(([d, t]) => (
                                                    <div key={d} className="flex gap-3">
                                                        <div className="mt-1 h-2 w-2 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600" />
                                                        <div>
                                                            <div className="text-xs text-black/55">{d}</div>
                                                            <div className="text-xs font-medium text-black">{t}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {demoTab === "Dirección" && (
                                    <div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="text-sm font-semibold text-black">Métricas</div>
                                                <div className="text-xs text-black/55">Actividad semanal</div>
                                            </div>
                                            <div className="text-xs text-black/55">Últimos 7 días</div>
                                        </div>

                                        <div className="mt-4 grid grid-cols-3 gap-3">
                                            <MiniKpi label="Asistencia" value={<AnimatedCounter value={86} suffix="%" />} />
                                            <MiniKpi label="Ausentismo" value={<AnimatedCounter value={14} suffix="%" />} />
                                            <MiniKpi label="Prom. espera" value={<AnimatedCounter value={18} suffix=" min" />} />
                                        </div>

                                        <div className="mt-4 rounded-2xl border border-black/10 bg-white/70 p-4">
                                            <DirectorBars data={directorBars} />
                                            <div className="mt-3 text-xs text-black/55">Señal: mayor carga jueves y viernes.</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section >

            {/* IMPACTO */}
            < section id="impacto" className="py-24" >
                <div className="max-w-5xl mx-auto px-6 text-center">
                    <motion.div {...fadeUp}>
                        <SectionBadge>Impacto</SectionBadge>
                        <h2 className="mt-6 text-4xl md:text-5xl font-semibold tracking-tight">
                            Cuando el sistema está <span className="font-bold">al límite</span>, cada mejora cuenta.
                        </h2>
                        <p className="mt-4 text-black/60 max-w-3xl mx-auto">
                            Zanoo busca reducir daños colaterales del desorden: esperas innecesarias, duplicaciones, historias
                            incompletas y desgaste del equipo.
                        </p>
                    </motion.div>

                    <div className="mt-12 grid md:grid-cols-3 gap-6">
                        {[
                            { t: "↓ Tiempos de espera", d: "Operación más previsible" },
                            { t: "↓ Ausentismo", d: "Recordatorios y coordinación" },
                            { t: "↑ Continuidad clínica", d: "Información lista" },
                        ].map((k) => (
                            <Card
                                key={k.t}
                                className="rounded-3xl border border-black/10 bg-white/70 backdrop-blur-xl shadow-[0_18px_55px_-28px_rgba(0,0,0,0.45)]"
                            >
                                <CardContent className="p-6">
                                    <div className="text-xl font-semibold text-black">{k.t}</div>
                                    <div className="mt-2 text-sm text-black/60">{k.d}</div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section >

            {/* ROADMAP */}
            < section id="roadmap" className="py-24" >
                <div className="max-w-6xl mx-auto px-6">
                    <motion.div {...fadeUp}>
                        <SectionBadge>Roadmap</SectionBadge>
                        <h2 className="mt-6 text-4xl md:text-5xl font-semibold tracking-tight">De gestión a <span className="font-bold">inteligencia sanitaria</span>.</h2>
                        <p className="mt-4 text-black/60 max-w-3xl">
                            Arrancás por orden operativo. Después se habilita coordinación, predicción y capas de IA cuando el
                            ecosistema ya tiene señal.
                        </p>
                    </motion.div>

                    <div className="mt-12 relative">
                        <div className="absolute left-0 right-0 top-5 h-[2px] bg-gradient-to-r from-cyan-500/40 via-blue-500/35 to-purple-600/35 rounded-full" />

                        <div className="grid md:grid-cols-5 gap-6">
                            {[
                                { t: "Orden operativo", d: "Turnos · pacientes · historia" },
                                { t: "Coordinación", d: "Derivaciones · recordatorios" },
                                { t: "Predicción", d: "Demanda · ausentismo · alertas" },
                                { t: "Ecosistema", d: "Red de instituciones" },
                                { t: "IA aplicada", d: "Resumen · señales · asistentes" },
                            ].map((s, i) => (
                                <motion.div
                                    key={s.t}
                                    className="relative"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 12 }}
                                >
                                    <div className="absolute left-6 top-3 h-4 w-4 rounded-full bg-white border border-black/15 shadow-sm" />
                                    <Card className="rounded-3xl border border-black/10 bg-white/70 backdrop-blur-xl shadow-[0_18px_55px_-28px_rgba(0,0,0,0.45)]">
                                        <CardContent className="p-6">
                                            <div className="text-xs text-black/50">Etapa {i + 1}</div>
                                            <div className="mt-2 text-sm font-semibold text-black">{s.t}</div>
                                            <div className="mt-2 text-sm text-black/60">{s.d}</div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section >

            {/* CTA */}
            < section id="contacto" className="py-28" >
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <motion.div {...fadeUp}>
                        <SectionBadge>Contacto</SectionBadge>
                        <h2 className="mt-6 text-4xl md:text-5xl font-semibold tracking-tight text-center leading-tight">
                            ¿Listo para transformar la atención de tu centro?
                        </h2>
                        <p className="mt-4 text-black/60">Agendá una demo corta, enfocada en tu realidad operativa.</p>

                        <div className="mt-8 flex items-center justify-center gap-3">
                            <ShimmerButton
                                className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-white shadow-[0_18px_50px_-25px_rgba(59,130,246,0.95)] px-8 h-12 text-base font-semibold"
                                onClick={() => scrollToId("gratis")}
                            >
                                Coordinar demo
                            </ShimmerButton>
                            <Button
                                variant="outline"
                                className="rounded-full border-black/15 bg-white/70 text-black hover:bg-black/5"
                                onClick={() => {
                                    // reemplazá por tu link real
                                    window.open("https://wa.me/", "_blank");
                                }}
                            >
                                Escribir por WhatsApp
                            </Button>
                        </div>

                        <div className="mt-12 flex justify-center opacity-90 grayscale hover:grayscale-0 transition-all duration-500">
                            <span className="inline-flex items-center mx-2 align-middle">
                                <Image src="/brand/zanoo-logo-text-white.png" alt="Zanoo" width={300} height={130} className="h-[90px] w-auto object-contain hidden dark:block" />
                                <Image src="/brand/zanoo-logo-color-v2.png" alt="Zanoo" width={300} height={130} className="h-[90px] w-auto object-contain dark:hidden" />
                            </span>
                        </div>
                    </motion.div>

                    <div className="mt-10 text-xs text-black/40">© {new Date().getFullYear()} Zanoo — Landing (v2.7 Motion)</div>
                </div>
            </section >
        </div >
    );
}
