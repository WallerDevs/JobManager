"use client";

import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  animate,
} from "framer-motion";
import { useRef, useEffect, useState, useCallback } from "react";
import Link from "next/link";

const spring = { type: "spring" as const, stiffness: 80, damping: 20 };
const easeOut: [number, number, number, number] = [0.22, 1, 0.36, 1];

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeOut } },
};

// ---------------------------------------------------------------------------
// Scroll progress bar
// ---------------------------------------------------------------------------
function ScrollProgressBar() {
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 origin-left z-[60]"
      style={{ scaleX }}
    />
  );
}

// ---------------------------------------------------------------------------
// Navbar — scrolls to semi-opaque + border on scroll
// ---------------------------------------------------------------------------
function Navbar() {
  const { scrollY } = useScroll();
  const rawBg = useTransform(scrollY, [0, 60], [0.5, 0.88]);
  const rawBorder = useTransform(scrollY, [0, 60], [0, 0.08]);
  const bgColor = useTransform(rawBg, (v) => `rgba(6,8,16,${v})`);
  const borderColor = useTransform(rawBorder, (v) => `rgba(255,255,255,${v})`);

  return (
    // suppressHydrationWarning: MotionValue styles differ between SSR and client initial render
    <motion.nav
      suppressHydrationWarning
      className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-xl"
      style={{ backgroundColor: bgColor, borderBottom: "1px solid", borderColor }}
    >
      <Link href="/" className="flex items-center gap-2.5">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 6 }}
          transition={spring}
          className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30"
        >
          <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </motion.div>
        <span className="text-sm font-semibold text-white">JobManager</span>
      </Link>

      <div className="flex items-center gap-2">
        <motion.div whileHover={{ y: -1 }} transition={spring}>
          <Link href="/login" className="px-4 py-1.5 text-sm text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5">
            Sign in
          </Link>
        </motion.div>
        <motion.div whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.96 }} transition={spring}>
          <Link href="/register" className="px-4 py-1.5 text-sm font-medium bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors shadow-sm">
            Get started
          </Link>
        </motion.div>
      </div>
    </motion.nav>
  );
}

// ---------------------------------------------------------------------------
// App preview — mock browser window
// ---------------------------------------------------------------------------
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
      {/* Browser chrome */}
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
        {/* Sidebar */}
        <div className="w-36 sm:w-44 bg-gray-950 border-r border-white/5 flex flex-col p-2.5 gap-0.5 flex-shrink-0">
          <div className="flex items-center gap-2 px-2 py-2 mb-1">
            <div className="h-5 w-5 rounded-md bg-gradient-to-br from-indigo-500 to-violet-600 flex-shrink-0" />
            <span className="text-xs font-semibold text-white hidden sm:block">JobManager</span>
          </div>
          {["Dashboard", "Applications", "Documents"].map((item, i) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.1, duration: 0.4, ease: easeOut }}
              className={`px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-2 ${i === 0 ? "bg-white/10 text-white font-medium" : "text-gray-500"}`}
            >
              <div className={`h-3.5 w-3.5 rounded flex-shrink-0 ${i === 0 ? "bg-indigo-400" : "bg-gray-700"}`} />
              <span className="hidden sm:block">{item}</span>
            </motion.div>
          ))}
        </div>

        {/* Main */}
        <div className="flex-1 bg-gray-50 p-3 sm:p-4 overflow-hidden">
          <div className="grid grid-cols-5 gap-1.5 sm:gap-2 mb-3">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.07, duration: 0.4, ease: easeOut }}
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
                transition={{ delay: 0.9 + i * 0.08, duration: 0.4, ease: easeOut }}
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

// ---------------------------------------------------------------------------
// Hero — parallax blobs + stagger entrance + scroll fade
// ---------------------------------------------------------------------------
function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const blob1Y = useSpring(useTransform(scrollYProgress, [0, 1], [0, 140]), { stiffness: 50, damping: 18 });
  const blob2Y = useSpring(useTransform(scrollYProgress, [0, 1], [0, 80]), { stiffness: 40, damping: 18 });
  const blob3Y = useSpring(useTransform(scrollYProgress, [0, 1], [0, 60]), { stiffness: 35, damping: 18 });
  const contentY = useSpring(useTransform(scrollYProgress, [0, 1], [0, 40]), { stiffness: 60, damping: 20 });
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-0 text-center overflow-hidden">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div style={{ y: blob1Y }} className="animate-blob absolute -top-40 -left-20 h-[600px] w-[600px] rounded-full bg-indigo-700/25 blur-3xl" />
        <motion.div style={{ y: blob2Y }} className="animate-blob animation-delay-2 absolute top-10 -right-20 h-[500px] w-[500px] rounded-full bg-violet-700/20 blur-3xl" />
        <motion.div style={{ y: blob3Y }} className="animate-blob animation-delay-4 absolute -bottom-20 left-1/3 h-[400px] w-[400px] rounded-full bg-purple-700/15 blur-3xl" />
      </div>

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.25) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <motion.div style={{ y: contentY, opacity: contentOpacity }} className="relative z-10 max-w-5xl mx-auto w-full">
        <motion.div variants={stagger} initial="hidden" animate="visible">

          <motion.div variants={fadeUp} className="flex justify-center mb-8">
            <motion.div
              whileHover={{ scale: 1.05, y: -1 }}
              transition={spring}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-gray-400 backdrop-blur-sm"
            >
              <motion.span
                animate={{ scale: [1, 1.5, 1], opacity: [0.8, 0.4, 0.8] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="h-1.5 w-1.5 rounded-full bg-emerald-400"
              />
              Free to get started — no credit card required
            </motion.div>
          </motion.div>

          <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08] text-white">
            Your job search,
            <br />
            <motion.span
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              className="inline-block pt-2 pb-4 bg-gradient-to-r from-indigo-400 via-violet-300 to-purple-400 bg-clip-text text-transparent"
              style={{ backgroundSize: "200% auto" }}
            >
              finally organized.
            </motion.span>
          </motion.h1>

          <motion.p variants={fadeUp} className="mt-6 text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Track every application, manage your CVs and cover letters, and stay on top of your progress — all in one beautiful place.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }} transition={spring}>
              <Link
                href="/register"
                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:from-indigo-500 hover:to-violet-500 transition-shadow duration-300"
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
            variants={{
              hidden: { opacity: 0, y: 70, scale: 0.95 },
              visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 1, ease: easeOut, delay: 0.45 } },
            }}
            className="mt-16 w-full"
          >
            <AppPreview />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Animated counter — uses framer-motion animate() with onUpdate
// ---------------------------------------------------------------------------
function AnimatedCounter({ target, suffix, inView, delay }: { target: number; suffix: string; inView: boolean; delay: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let stopped = false;
    const timer = setTimeout(() => {
      const controls = animate(0, target, {
        duration: 1.8,
        ease: "easeOut",
        onUpdate: (v) => {
          if (!stopped) setDisplay(Math.floor(v));
        },
      });
      return controls.stop;
    }, delay * 1000);
    return () => {
      stopped = true;
      clearTimeout(timer);
    };
  }, [inView, target, delay]);

  return (
    <div className="text-3xl sm:text-4xl font-bold text-white tabular-nums">
      {display.toLocaleString()}
      {suffix}
    </div>
  );
}

function StatsRow() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const stats = [
    { label: "Pipeline stages", target: 5, suffix: "" },
    { label: "Document types", target: 2, suffix: "" },
    { label: "Minutes to set up", target: 2, suffix: "" },
    { label: "Cost to start", target: 0, suffix: "$" },
  ];

  return (
    <section ref={ref} className="py-16 px-6 border-y border-white/5">
      <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: i * 0.1, ease: easeOut }}
          >
            <AnimatedCounter target={s.target} suffix={s.suffix} inView={inView} delay={i * 0.12} />
            <p className="mt-1.5 text-xs text-gray-500">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Features — mouse-tracked spotlight per card
// ---------------------------------------------------------------------------
const features = [
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

function FeatureCard({ f, i, inView }: { f: typeof features[0]; i: number; inView: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mouse-x", `${((e.clientX - rect.left) / rect.width) * 100}%`);
    card.style.setProperty("--mouse-y", `${((e.clientY - rect.top) / rect.height) * 100}%`);
  }, []);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: i * 0.09, ease: easeOut }}
      whileHover={{ y: -5, transition: spring }}
      onMouseMove={handleMouseMove}
      className="group relative rounded-2xl border border-white/5 bg-white/[0.03] p-6 hover:bg-white/[0.05] hover:border-white/10 transition-colors duration-300 cursor-default overflow-hidden"
    >
      {/* Mouse-tracked radial spotlight */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: "radial-gradient(300px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(99,102,241,0.09), transparent 65%)",
        }}
      />
      <motion.div
        whileHover={{ scale: 1.12, rotate: 6 }}
        transition={spring}
        className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20 transition-colors duration-300"
      >
        {f.icon}
      </motion.div>
      <h3 className="text-sm font-semibold text-white mb-2">{f.title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
    </motion.div>
  );
}

function Features() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative py-32 px-6 bg-[#060810]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div ref={ref} className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: easeOut }}
          className="text-center mb-16"
        >
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.05, ease: easeOut }}
            className="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-400 mb-3"
          >
            Features
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.1, ease: easeOut }}
            className="text-3xl sm:text-4xl font-bold text-white"
          >
            Everything you need to land the role
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.18, ease: easeOut }}
            className="mt-4 text-gray-400 max-w-xl mx-auto"
          >
            A focused set of tools built around how real job seekers actually work.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <FeatureCard key={f.title} f={f} i={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// How it works — 3-step stagger with bouncy entrance
// ---------------------------------------------------------------------------
const steps = [
  {
    title: "Create your account",
    description: "Sign up in seconds — just an email and password. No credit card, no lengthy onboarding survey.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    title: "Log your applications",
    description: "Add roles as you apply. Track company, position, date, and status — everything in one clean view.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    title: "Stay on top of progress",
    description: "Move applications through your pipeline, attach documents, and add notes — never miss a follow-up.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
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
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[600px] w-[600px] rounded-full bg-indigo-900/10 blur-3xl" />
      </div>

      <div ref={ref} className="max-w-5xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: easeOut }}
          className="text-center mb-16"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-violet-400 mb-3">How it works</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Up and running in minutes</h2>
          <p className="mt-4 text-gray-400 max-w-xl mx-auto">No steep learning curve. Just a clear, simple flow.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative">
          {/* Connector line — aligns with icon centers (24px padding + 32px = 56px) */}
          <div className="hidden sm:block absolute top-[56px] left-[calc(33%+32px)] right-[calc(33%+32px)] h-px bg-gradient-to-r from-indigo-500/0 via-indigo-500/40 to-indigo-500/0" />

          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: i * 0.15, ease: easeOut }}
              whileHover={{ y: -4, transition: spring }}
              className="relative flex flex-col items-center text-center p-6"
            >
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={inView ? { scale: 1, rotate: 0 } : {}}
                transition={{ type: "spring", stiffness: 200, damping: 18, delay: i * 0.15 + 0.2 }}
                className="relative mb-5"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#060810] bg-gradient-to-br from-indigo-600/30 to-violet-600/30 border border-white/10 text-indigo-400">
                  {step.icon}
                </div>
                <div className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[9px] font-bold text-white shadow-lg shadow-indigo-500/40">
                  {i + 1}
                </div>
              </motion.div>
              <h3 className="text-sm font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// CTA
// ---------------------------------------------------------------------------
function CTA() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-32 px-6">
      <motion.div
        initial={{ opacity: 0, y: 36, scale: 0.97 }}
        animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{ duration: 0.7, ease: easeOut }}
        className="max-w-2xl mx-auto text-center"
      >
        <div className="relative inline-block w-full">
          <motion.div
            animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.06, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 rounded-3xl bg-gradient-to-r from-indigo-600/25 to-violet-600/25 blur-2xl"
          />
          <motion.div
            animate={{ opacity: [0.2, 0.5, 0.2], scale: [1.05, 1, 1.05] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute inset-2 rounded-3xl bg-gradient-to-br from-violet-600/15 to-indigo-600/15 blur-xl"
          />

          <div className="relative rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-sm px-10 py-16 overflow-hidden">
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }}
            />

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.15, ease: easeOut }}
              className="text-3xl sm:text-4xl font-bold text-white mb-4 relative"
            >
              Ready to organize your job search?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.25, ease: easeOut }}
              className="text-gray-400 mb-8 relative"
            >
              Join and start managing your applications today. Free, no credit card required.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.35, ease: easeOut }}
              whileHover={{ scale: 1.05, y: -2, transition: spring }}
              whileTap={{ scale: 0.97 }}
              className="inline-block relative"
            >
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-9 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:from-indigo-500 hover:to-violet-500 transition-shadow duration-300"
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

// ---------------------------------------------------------------------------
// Footer
// ---------------------------------------------------------------------------
function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: easeOut }}
      viewport={{ once: true }}
      className="border-t border-white/5 px-6 py-8"
    >
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <motion.div whileHover={{ x: -2 }} transition={spring} className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-indigo-500 to-violet-600">
            <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-gray-400">JobManager</span>
        </motion.div>
        <p className="text-xs text-gray-600">© 2026 JobManager. All rights reserved.</p>
      </div>
    </motion.footer>
  );
}

// ---------------------------------------------------------------------------
// Landing
// ---------------------------------------------------------------------------
export function Landing() {
  return (
    <div className="min-h-screen bg-[#060810] text-white">
      <ScrollProgressBar />
      <Navbar />
      <Hero />
      <StatsRow />
      <Features />
      <HowItWorks />
      <CTA />
      <Footer />
    </div>
  );
}
