"use client";

import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  animate as framerAnimate,
} from "framer-motion";
import { useRef, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { HeroBackground } from "@/components/marketing/HeroBackground";

// ── Shared config ─────────────────────────────────────────────────────────────
const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];
const spring = { type: "spring" as const, stiffness: 80, damping: 20 };

// ── Scroll Progress Bar ───────────────────────────────────────────────────────
function ScrollProgressBar() {
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500 via-green-400 to-teal-400 origin-left z-[60]"
      style={{ scaleX }}
    />
  );
}

// ── Navbar ────────────────────────────────────────────────────────────────────
function Navbar() {
  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 60], [0, 0.92]);
  const borderOpacity = useTransform(scrollY, [0, 60], [0, 0.06]);
  const bgColor = useTransform(bgOpacity, (v) => `rgba(3,10,6,${v})`);
  const borderColor = useTransform(borderOpacity, (v) => `rgba(255,255,255,${v})`);

  return (
    <motion.nav
      suppressHydrationWarning
      className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 sm:px-10 py-4 backdrop-blur-xl"
      style={{ backgroundColor: bgColor, borderBottom: "1px solid", borderColor }}
    >
      <Link href="/" className="flex items-center gap-2.5">
        <motion.img
          src="/logo.png" width={28} height={28} alt="JobManager"
          whileHover={{ scale: 1.1, rotate: 6 }}
          transition={spring}
          className="rounded-lg shrink-0"
        />
        <span className="font-display text-sm font-semibold italic text-white/90">JobManager</span>
      </Link>
      <div className="flex items-center gap-2">
        <Link href="/login" className="px-4 py-1.5 text-sm text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5">
          Sign in
        </Link>
        <motion.div whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.96 }} transition={spring}>
          <Link href="/register" className="px-4 py-1.5 text-sm font-medium bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors">
            Get started
          </Link>
        </motion.div>
      </div>
    </motion.nav>
  );
}

// ── Word Reveal ───────────────────────────────────────────────────────────────
// Each word slides up from an overflow-hidden container — the $30k signature move
function WordReveal({
  text,
  className,
  baseDelay = 0,
  mode = "load",
}: {
  text: string;
  className?: string;
  baseDelay?: number;
  mode?: "load" | "scroll";
}) {
  const words = text.split(" ");
  return (
    <span className={`inline-flex flex-wrap gap-x-[0.24em] ${className ?? ""}`}>
      {words.map((word, i) => (
        <span key={i} className="overflow-hidden inline-block leading-[1.2]">
          <motion.span
            className="inline-block"
            initial={{ y: "110%", opacity: 0 }}
            {...(mode === "scroll"
              ? {
                  whileInView: { y: 0, opacity: 1 },
                  viewport: { once: true, margin: "-60px" },
                }
              : { animate: { y: 0, opacity: 1 } })}
            transition={{ duration: 0.72, delay: baseDelay + i * 0.07, ease }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

// ── Marquee Strip ─────────────────────────────────────────────────────────────
const MARQUEE_ITEMS = [
  "Track Applications",
  "Manage Documents",
  "Stay Organized",
  "Land Interviews",
  "Get Hired",
  "Never Miss a Follow-Up",
  "Build Your Pipeline",
  "Own Your Career",
];

function MarqueeStrip() {
  return (
    <div className="group relative overflow-hidden border-y border-white/[0.04] py-3.5">
      <div className="flex animate-marquee group-hover:[animation-play-state:paused] whitespace-nowrap">
        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
          <span key={i} className="inline-flex items-center gap-5 mx-8">
            <span className="h-[3px] w-[3px] rounded-full bg-emerald-500/50 shrink-0" />
            <span className="font-mono text-[9px] uppercase tracking-[0.26em] text-gray-600">{item}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ── App Preview ───────────────────────────────────────────────────────────────
function AppPreview() {
  const stats = [
    { label: "Draft", value: "3", color: "bg-gray-400" },
    { label: "Sent", value: "12", color: "bg-blue-500" },
    { label: "Interview", value: "4", color: "bg-amber-500" },
    { label: "Offer", value: "1", color: "bg-emerald-500" },
    { label: "Rejected", value: "6", color: "bg-red-500" },
  ];
  const apps = [
    { company: "Google", role: "Software Engineer", status: "Interview", badge: "bg-amber-50 text-amber-700 ring-amber-200" },
    { company: "Spotify", role: "Frontend Developer", status: "Sent", badge: "bg-blue-50 text-blue-700 ring-blue-200" },
    { company: "Stripe", role: "Full Stack Eng.", status: "Offer", badge: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
    { company: "Figma", role: "Product Engineer", status: "Draft", badge: "bg-gray-100 text-gray-600 ring-gray-200" },
    { company: "Linear", role: "Backend Engineer", status: "Interview", badge: "bg-amber-50 text-amber-700 ring-amber-200" },
    { company: "Vercel", role: "DevRel Engineer", status: "Sent", badge: "bg-blue-50 text-blue-700 ring-blue-200" },
  ];

  return (
    <motion.div
      animate={{ y: [0, -12, 0] }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      className="relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_40px_120px_rgba(0,0,0,0.8)] ring-1 ring-white/5"
    >
      <div className="bg-gray-900/90 backdrop-blur px-4 py-3 flex items-center gap-3 border-b border-white/5">
        <div className="flex gap-1.5">
          {[0, 0.5, 1].map((delay) => (
            <motion.div
              key={delay}
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 3, repeat: Infinity, delay }}
              className={`h-3 w-3 rounded-full ${delay === 0 ? "bg-red-500/70" : delay === 0.5 ? "bg-yellow-500/70" : "bg-green-500/70"}`}
            />
          ))}
        </div>
        <div className="flex-1 flex justify-center">
          <div className="bg-white/5 text-gray-500 text-xs rounded-md px-6 py-1 border border-white/5">
            jobmanager.app/dashboard
          </div>
        </div>
        <div className="w-12" />
      </div>

      <div className="flex h-72 sm:h-80">
        <div className="w-36 sm:w-44 bg-gray-950 border-r border-white/5 flex flex-col p-2.5 gap-0.5 shrink-0">
          <div className="flex items-center gap-2 px-2 py-2 mb-1">
            <img src="/logo.png" width={20} height={20} alt="JobManager" className="rounded-md shrink-0" />
            <span className="text-xs font-semibold text-white hidden sm:block">JobManager</span>
          </div>
          {["Dashboard", "Applications", "Documents"].map((item, i) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.1, duration: 0.4, ease }}
              className={`px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-2 ${i === 0 ? "bg-white/10 text-white font-medium" : "text-gray-500"}`}
            >
              <div className={`h-3.5 w-3.5 rounded shrink-0 ${i === 0 ? "bg-emerald-400" : "bg-gray-700"}`} />
              <span className="hidden sm:block">{item}</span>
            </motion.div>
          ))}
        </div>

        <div className="flex-1 bg-gray-50 p-3 sm:p-4 overflow-hidden">
          <div className="grid grid-cols-5 gap-1.5 sm:gap-2 mb-3">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.07, duration: 0.4, ease }}
                className="bg-white rounded-lg p-2 sm:p-2.5 shadow-sm border border-gray-100 relative overflow-hidden"
              >
                <div className={`absolute inset-x-0 top-0 h-0.5 ${s.color}`} />
                <div className="text-[8px] sm:text-[9px] text-gray-400 font-medium uppercase tracking-wider">{s.label}</div>
                <div className="text-base sm:text-lg font-bold text-gray-900 mt-0.5">{s.value}</div>
              </motion.div>
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 sm:gap-2">
            {apps.map((app, i) => (
              <motion.div
                key={app.company}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + i * 0.08, duration: 0.4, ease }}
                className="bg-white rounded-lg p-2.5 shadow-sm border border-gray-100"
              >
                <div className="min-w-0 mb-1">
                  <div className="text-[11px] font-semibold text-gray-900 truncate">{app.company}</div>
                  <div className="text-[9px] text-gray-400 truncate mt-0.5">{app.role}</div>
                </div>
                <span className={`inline-flex text-[8px] font-medium px-1.5 py-0.5 rounded-full ring-1 ring-inset ${app.badge}`}>
                  {app.status}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const contentY = useSpring(useTransform(scrollYProgress, [0, 1], [0, 90]), { stiffness: 60, damping: 20 });
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const previewY = useSpring(useTransform(scrollYProgress, [0, 1], [0, 35]), { stiffness: 50, damping: 18 });

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-28 pb-0 text-center overflow-hidden"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.055]"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.25) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <motion.div style={{ y: contentY, opacity: contentOpacity }} className="relative z-10 max-w-5xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.55, ease }}
          className="flex justify-center mb-8"
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -1 }}
            transition={spring}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-sm text-gray-400 backdrop-blur-sm"
          >
            <motion.span
              animate={{ scale: [1, 1.5, 1], opacity: [0.8, 0.3, 0.8] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0"
            />
            Free to get started — no credit card required
          </motion.div>
        </motion.div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6">
          <span className="block leading-[1.1] mb-2">
            <WordReveal text="Your job search," baseDelay={0.08} />
          </span>
          <span className="overflow-hidden inline-block leading-[1.2]">
            <motion.span
              initial={{ y: "105%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.78, delay: 0.52, ease }}
              className="inline-block"
            >
              <motion.span
                animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                className="bg-gradient-to-r from-emerald-400 via-green-300 to-teal-400 bg-clip-text text-transparent"
                style={{ backgroundSize: "200% auto", paddingBottom: "0.12em" }}
              >
                finally organized.
              </motion.span>
            </motion.span>
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.72, ease }}
          className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
        >
          Track every application, manage your CVs and cover letters, and stay on top of your progress — all in one beautiful place.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.88, ease }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }} transition={spring}>
            <Link
              href="/register"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:from-emerald-500 hover:to-green-500 transition-shadow duration-300"
            >
              Get started for free
              <motion.svg
                className="h-4 w-4"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </motion.svg>
            </Link>
          </motion.div>
          <motion.div whileHover={{ x: 4 }} transition={spring}>
            <Link href="/login" className="inline-flex items-center gap-1.5 px-6 py-3 text-sm text-gray-500 hover:text-white transition-colors">
              Sign in to your account →
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 80, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.5, ease }}
          style={{ y: previewY }}
          className="mt-16 w-full"
        >
          <AppPreview />
        </motion.div>
      </motion.div>
    </section>
  );
}

// ── Animated Counter ──────────────────────────────────────────────────────────
function AnimatedCounter({
  target,
  suffix = "",
  prefix = "",
  inView,
  delay,
}: {
  target: number;
  suffix?: string;
  prefix?: string;
  inView: boolean;
  delay: number;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let stopped = false;
    let cleanup: (() => void) | undefined;

    const timer = setTimeout(() => {
      const controls = framerAnimate(0, target, {
        duration: 2.0,
        ease: [0.22, 1, 0.36, 1],
        onUpdate: (v) => { if (!stopped) setDisplay(Math.floor(v)); },
      });
      cleanup = () => controls.stop();
    }, delay * 1000);

    return () => {
      stopped = true;
      clearTimeout(timer);
      cleanup?.();
    };
  }, [inView, target, delay]);

  return <span className="tabular-nums">{prefix}{display.toLocaleString()}{suffix}</span>;
}

// ── Stats Section — editorial large numbers ───────────────────────────────────
function StatsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const stats = [
    { label: "Pipeline stages", target: 5 },
    { label: "Document types", target: 2 },
    { label: "Minutes to set up", target: 2 },
    { label: "Cost to start", target: 0, prefix: "$" },
  ];

  return (
    <section ref={ref} className="py-20 px-6 sm:px-10">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.85, ease }}
          className="h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent mb-16 origin-left"
        />

        <div className="grid grid-cols-2 sm:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.1, ease }}
              className="px-4 sm:px-8 py-6 text-center border-r border-white/[0.05] last:border-r-0 [&:nth-child(2)]:border-b sm:[&:nth-child(2)]:border-b-0 [&:nth-child(1)]:border-b sm:[&:nth-child(1)]:border-b-0"
            >
              <div className="font-display text-5xl sm:text-6xl lg:text-7xl font-semibold italic text-white leading-none mb-3">
                <AnimatedCounter
                  target={s.target}
                  prefix={s.prefix}
                  inView={inView}
                  delay={i * 0.1 + 0.2}
                />
              </div>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-gray-600">{s.label}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.85, delay: 0.35, ease }}
          className="h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent mt-16 origin-right"
        />
      </div>
    </section>
  );
}

// ── Feature Card — 3D tilt on hover, horizontal slide on scroll ───────────────
function FeatureCard({
  f,
  i,
  inView,
}: {
  f: { icon: React.ReactNode; title: string; description: string };
  i: number;
  inView: boolean;
}) {
  const tiltRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = tiltRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const rx = ((e.clientY - cy) / (rect.height / 2)) * -5;
    const ry = ((e.clientX - cx) / (rect.width / 2)) * 5;
    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.025)`;
    el.style.transition = "transform 0.05s linear";
    el.style.setProperty("--mx", `${((e.clientX - rect.left) / rect.width) * 100}%`);
    el.style.setProperty("--my", `${((e.clientY - rect.top) / rect.height) * 100}%`);
  }, []);

  const handleMouseLeave = useCallback(() => {
    const el = tiltRef.current;
    if (!el) return;
    el.style.transform = "";
    el.style.transition = "transform 0.5s cubic-bezier(0.22,1,0.36,1)";
  }, []);

  const isLeft = i % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, delay: Math.floor(i / 2) * 0.12 + 0.1, ease }}
    >
      <div
        ref={tiltRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ transformStyle: "preserve-3d" }}
        className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.025] p-6 cursor-default overflow-hidden h-full"
      >
        {/* Mouse-tracked spotlight */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: "radial-gradient(280px circle at var(--mx, 50%) var(--my, 50%), rgba(16,185,129,0.09), transparent 65%)",
          }}
        />
        <motion.div
          whileHover={{ scale: 1.15, rotate: 5 }}
          transition={spring}
          className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 transition-colors duration-300"
        >
          {f.icon}
        </motion.div>
        <h3 className="text-sm font-semibold text-white mb-2">{f.title}</h3>
        <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
      </div>
    </motion.div>
  );
}

// ── Features Section — alternating horizontal slide reveals ───────────────────
const FEATURES = [
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    title: "Track every application",
    description: "Never lose track of where you applied. Organize by status and get a clear view of your entire pipeline at a glance.",
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    title: "Manage your documents",
    description: "Store all your CVs and cover letters in one place. Tailor them for each specific role and company with ease.",
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    title: "Built-in timeline",
    description: "Add comments and notes to each application. Keep a full history of every interaction and next step.",
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: "Dashboard overview",
    description: "See where you stand at a glance. Clean status counts and recent activity so you always know what needs attention.",
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: "Private & secure",
    description: "Your career data is personal. Secure auth and strict access control means only you see your applications.",
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Fast & modern",
    description: "Built on the latest web tech for a snappy, responsive experience that feels great every time you use it.",
  },
];

function Features() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative py-32 px-6">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
      </div>

      <div ref={ref} className="max-w-5xl mx-auto">
        <div className="mb-16">
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, ease }}
            className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400 mb-4"
          >
            Features
          </motion.p>
          <div className="overflow-hidden">
            <motion.h2
              initial={{ y: "100%" }}
              animate={inView ? { y: 0 } : {}}
              transition={{ duration: 0.72, delay: 0.08, ease }}
              className="text-3xl sm:text-4xl font-bold text-white"
            >
              Everything you need to land the role
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.2, ease }}
            className="mt-4 text-gray-400 max-w-xl"
          >
            A focused set of tools built around how real job seekers actually work.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => (
            <FeatureCard key={f.title} f={f} i={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ── How It Works — vertical timeline with animated connecting line ─────────────
const STEPS = [
  {
    title: "Create your account",
    description: "Sign up in seconds — just an email and password. No credit card, no lengthy onboarding survey.",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    title: "Log your applications",
    description: "Add roles as you apply. Track company, position, date, and status — everything in one clean view.",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    title: "Stay on top of progress",
    description: "Move applications through your pipeline, attach documents, and add notes — never miss a follow-up.",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

function HowItWorks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative py-32 px-6 overflow-hidden">
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-emerald-900/[0.08] blur-3xl" />

      <div ref={ref} className="max-w-3xl mx-auto relative">
        <div className="mb-16 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, ease }}
            className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400 mb-4"
          >
            How it works
          </motion.p>
          <div className="overflow-hidden">
            <motion.h2
              initial={{ y: "100%" }}
              animate={inView ? { y: 0 } : {}}
              transition={{ duration: 0.72, delay: 0.08, ease }}
              className="text-3xl sm:text-4xl font-bold text-white"
            >
              Up and running in minutes
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2, ease }}
            className="mt-4 text-gray-400 max-w-md mx-auto"
          >
            No steep learning curve. Just a clear, simple flow.
          </motion.p>
        </div>

        {/* Vertical timeline */}
        <div className="relative">
          {/* Line draws itself top-to-bottom as section enters view */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 1.4, delay: 0.4, ease }}
            className="absolute left-6 top-7 bottom-7 w-px bg-gradient-to-b from-emerald-500/60 via-emerald-500/30 to-transparent origin-top"
          />

          <div className="flex flex-col gap-10">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: 30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.65, delay: i * 0.18 + 0.35, ease }}
                className="flex items-start gap-6"
              >
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={inView ? { scale: 1, opacity: 1 } : {}}
                  transition={{ type: "spring", stiffness: 200, damping: 18, delay: i * 0.18 + 0.3 }}
                  className="relative z-10 shrink-0"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#070f09] border border-emerald-500/30 text-emerald-400">
                    {step.icon}
                  </div>
                  <div className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[9px] font-bold text-white shadow-lg shadow-emerald-500/40">
                    {i + 1}
                  </div>
                </motion.div>

                <div className="pt-1.5">
                  <h3 className="text-sm font-semibold text-white mb-1.5">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── CTA ───────────────────────────────────────────────────────────────────────
function CTA() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-32 px-6">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{ duration: 0.8, ease }}
        className="max-w-2xl mx-auto text-center"
      >
        <div className="relative">
          <motion.div
            animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.06, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 rounded-3xl bg-gradient-to-r from-emerald-600/25 to-green-600/25 blur-2xl"
          />
          <motion.div
            animate={{ opacity: [0.2, 0.5, 0.2], scale: [1.05, 1, 1.05] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute inset-2 rounded-3xl bg-gradient-to-br from-green-600/15 to-emerald-600/15 blur-xl"
          />

          <div className="relative rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-sm px-10 py-16 overflow-hidden">
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.05]"
              style={{
                backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }}
            />
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2, ease }}
              className="text-3xl sm:text-4xl font-bold text-white mb-4 relative"
            >
              Ready to organize your job search?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3, ease }}
              className="text-gray-400 mb-8 relative"
            >
              Join and start managing your applications today. Free, no credit card required.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.4, ease }}
              whileHover={{ scale: 1.05, y: -2, transition: spring }}
              whileTap={{ scale: 0.97 }}
              className="inline-block relative"
            >
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 px-9 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:from-emerald-500 hover:to-green-500 transition-shadow duration-300"
              >
                Get started for free
                <motion.svg
                  className="h-4 w-4"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </motion.svg>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease }}
      viewport={{ once: true }}
      className="border-t border-white/5 px-6 sm:px-10 py-8"
    >
      <div className="flex items-center justify-between">
        <motion.div whileHover={{ x: -2 }} transition={spring} className="flex items-center gap-2">
          <img src="/logo.png" width={24} height={24} alt="JobManager" className="rounded-md shrink-0" />
          <span className="font-display text-sm font-semibold italic text-gray-400">JobManager</span>
        </motion.div>
        <p className="text-xs text-gray-600">© 2026 JobManager. All rights reserved.</p>
      </div>
    </motion.footer>
  );
}

// ── Landing ───────────────────────────────────────────────────────────────────
export function Landing() {
  return (
    <div className="min-h-screen text-white">
      <HeroBackground />
      <div className="relative z-[2]">
        <ScrollProgressBar />
        <Navbar />
        <Hero />
        <MarqueeStrip />
        <StatsSection />
        <Features />
        <HowItWorks />
        <CTA />
        <Footer />
      </div>
    </div>
  );
}
