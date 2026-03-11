// src/components/LandingPage.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { SiteData } from "@/types";

// ─── Animation variants ───────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

const navFade = {
  hidden: { opacity: 0, y: -12 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: 0.1 + i * 0.07, ease: "easeOut" },
  }),
};

// ─── Logo Icon ────────────────────────────────────────────────────────────────
function LogoIcon() {
  return (
    <div className="relative w-7 h-7 flex items-center justify-center">
      <div className="absolute inset-0 rounded-full border border-white/30" />
      <div className="absolute inset-1 rounded-full border border-white/20" />
      <div className="w-1.5 h-1.5 rounded-full bg-white/80" />
    </div>
  );
}

// ─── Background Orbs ──────────────────────────────────────────────────────────
function BackgroundOrbs({ bgImage }: { bgImage: string | null }) {
  const isUrl = bgImage?.startsWith("http");
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {isUrl ? (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{ background: bgImage ?? "radial-gradient(ellipse at 60% 40%, #1a1060 0%, #0a0a1a 60%, #000010 100%)" }}
        />
      )}

      {/* Glossy orbs */}
      <div className="orb-1 absolute top-[-10%] right-[-5%] w-[700px] h-[700px] rounded-full"
        style={{
          background: "radial-gradient(circle at 40% 40%, rgba(80,60,200,0.55) 0%, rgba(40,20,120,0.3) 45%, transparent 70%)",
          filter: "blur(2px)",
        }}
      />
      <div className="orb-2 absolute top-[5%] right-[10%] w-[500px] h-[500px] rounded-full"
        style={{
          background: "radial-gradient(circle at 35% 30%, rgba(100,80,220,0.45) 0%, rgba(60,30,160,0.25) 50%, transparent 75%)",
          filter: "blur(1px)",
        }}
      />
      <div className="orb-3 absolute top-[15%] right-[5%] w-[380px] h-[380px] rounded-full"
        style={{
          background: "radial-gradient(circle at 50% 45%, rgba(180,120,255,0.3) 0%, rgba(100,60,200,0.2) 40%, transparent 70%)",
        }}
      />
      {/* Highlight streaks */}
      <div className="absolute top-[20%] right-[15%] w-[200px] h-[600px] opacity-20"
        style={{
          background: "linear-gradient(160deg, rgba(180,150,255,0.6) 0%, transparent 60%)",
          transform: "rotate(-15deg)",
          filter: "blur(30px)",
        }}
      />
      {/* Bottom dark fade */}
      <div className="absolute bottom-0 left-0 right-0 h-48"
        style={{ background: "linear-gradient(to top, rgba(0,0,10,0.9) 0%, transparent 100%)" }}
      />
      {/* Top dark fade */}
      <div className="absolute top-0 left-0 right-0 h-32"
        style={{ background: "linear-gradient(to bottom, rgba(0,0,10,0.7) 0%, transparent 100%)" }}
      />
    </div>
  );
}

// ─── Email Input ──────────────────────────────────────────────────────────────
function EmailInput({ placeholder }: { placeholder: string }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (email) setSubmitted(true);
  };

  return (
    <div className="relative w-full max-w-sm mx-auto">
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center gap-2 h-12 px-5 rounded-full glass text-white/70 text-sm"
          >
            <span className="text-green-400">✓</span>
            <span>We&apos;ll be in touch!</span>
          </motion.div>
        ) : (
          <motion.div key="input" className="relative flex items-center">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder={placeholder}
              className="
                w-full h-12 pl-5 pr-14 rounded-full
                bg-white/[0.06] backdrop-blur-xl
                border border-white/[0.12]
                text-white/80 placeholder-white/30 text-sm
                outline-none focus:border-white/30 focus:bg-white/[0.09]
                transition-all duration-300
              "
            />
            <button
              onClick={handleSubmit}
              className="
                absolute right-1.5 w-9 h-9 rounded-full
                bg-white/15 hover:bg-white/25
                border border-white/20 hover:border-white/40
                flex items-center justify-center
                transition-all duration-200 group
              "
            >
              <svg
                className="w-4 h-4 text-white/70 group-hover:text-white transition-colors"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function LandingPage({ data }: { data: SiteData }) {
  const { settings, navLinks, hero, headerCtas } = data;

  const enterpriseCta = headerCtas.find((c) => c.key === "enterprise");
  const loginCta = headerCtas.find((c) => c.key === "login");

  return (
    <main className="relative min-h-screen flex flex-col overflow-hidden bg-[#060612]">
      <BackgroundOrbs bgImage={settings.backgroundImage} />

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="relative z-10 flex items-center justify-between px-6 md:px-10 py-5">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2.5 cursor-pointer"
        >
          <LogoIcon />
          <span className="font-bold text-lg tracking-tight text-white">
            {settings.logoText}
          </span>
        </motion.div>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link, i) => (
            <motion.a
              key={link.id}
              href={link.href}
              custom={i}
              initial="hidden"
              animate="show"
              variants={navFade}
              className="text-sm text-white/55 hover:text-white/90 transition-colors duration-200 font-medium"
            >
              {link.label}
            </motion.a>
          ))}
        </nav>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex items-center gap-2"
        >
          {enterpriseCta && (
            <a
              href={enterpriseCta.href}
              className="
                hidden sm:flex items-center px-4 py-1.5 rounded-full text-sm font-medium
                border border-white/20 text-white/70 hover:text-white hover:border-white/40
                transition-all duration-200 glass
              "
            >
              {enterpriseCta.label}
            </a>
          )}
          {loginCta && (
            <a
              href={loginCta.href}
              className="
                flex items-center px-5 py-1.5 rounded-full text-sm font-semibold
                bg-white text-black hover:bg-white/90
                transition-all duration-200
              "
            >
              {loginCta.label}
            </a>
          )}
        </motion.div>
      </header>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 pb-24 pt-12">
        {/* Eyebrow */}
        <motion.p
          custom={0}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="
            text-[11px] font-mono tracking-[0.22em] uppercase
            text-white/45 mb-6
          "
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {hero.eyebrowText}
        </motion.p>

        {/* Headline */}
        <motion.h1
          custom={1}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="
            text-gradient
            text-4xl sm:text-5xl md:text-6xl lg:text-[68px]
            font-extrabold leading-[1.1] tracking-tight
            max-w-3xl mb-10
          "
          style={{ fontFamily: "var(--font-syne)" }}
        >
          {hero.headline}
        </motion.h1>

        {/* Email input */}
        <motion.div
          custom={2}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="w-full max-w-sm"
        >
          <EmailInput placeholder={hero.inputPlaceholder} />
        </motion.div>
      </section>

      {/* ── Bottom CTA ─────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="relative z-10 flex justify-center pb-8"
      >
        <a
          href={hero.videoDemoUrl}
          className="flex items-center gap-2 text-sm text-white/45 hover:text-white/75 transition-colors duration-200 group"
        >
          <span className="
            w-7 h-7 rounded-full flex items-center justify-center
            border border-white/15 group-hover:border-white/30
            transition-colors duration-200
          ">
            <svg className="w-3 h-3 text-white/60 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5.14v14l11-7-11-7z" />
            </svg>
          </span>
          {hero.videoDemoText}
        </a>
      </motion.div>
    </main>
  );
}
