// src/app/company/page.tsx
import Link from "next/link";

export default function CompanyPage() {
  return (
    <main className="relative min-h-screen flex flex-col overflow-hidden bg-[#060612]">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 60% 40%, #1a1060 0%, #0a0a1a 60%, #000010 100%)" }} />
        <div className="absolute top-[-10%] right-[-5%] w-[700px] h-[700px] rounded-full" style={{ background: "radial-gradient(circle at 40% 40%, rgba(80,60,200,0.45) 0%, transparent 70%)" }} />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 md:px-10 py-5">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="relative w-7 h-7 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-white/30" />
            <div className="absolute inset-1 rounded-full border border-white/20" />
            <div className="w-1.5 h-1.5 rounded-full bg-white/80" />
          </div>
          <span className="font-bold text-lg tracking-tight text-white">Imagica</span>
        </Link>
        <nav className="hidden md:flex items-center gap-7">
          {[["Product","/product"],["How it works","/how-it-works"],["Features","/features"],["Mission","/mission"],["Company","/company"]].map(([label, href]) => (
            <Link key={href} href={href} className="text-sm text-white/55 hover:text-white/90 transition-colors font-medium">{label}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/admin" className="flex items-center px-5 py-1.5 rounded-full text-sm font-semibold bg-white text-black hover:bg-white/90 transition-all">Login</Link>
        </div>
      </header>

      {/* Content */}
      <section className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 pb-24 pt-12">
        <p className="text-[11px] tracking-[0.22em] uppercase text-white/45 mb-6 font-mono">Imagica</p>
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight max-w-3xl mb-6" style={{ background: "linear-gradient(135deg, #ffffff 0%, #c4c4ff 50%, #a0a0cc 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Company
        </h1>
        <p className="text-lg text-white/40 max-w-xl mb-10">Meet the team building the future of no-code AI.</p>
        <Link href="/" className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors">
          ← Back to home
        </Link>
      </section>
    </main>
  );
}
