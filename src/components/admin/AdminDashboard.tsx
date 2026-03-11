// src/components/admin/AdminDashboard.tsx
"use client";

import { useState, useTransition } from "react";
import {
  updateHeroContent,
  updateSiteSettings,
  createNavLink,
  updateNavLink,
  deleteNavLink,
  updateHeaderCta,
} from "@/lib/actions";
import type { SiteData } from "@/types";

// ─── Shared UI atoms ──────────────────────────────────────────────────────────
function Card({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) {
  return (
    <div id={id} className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 mb-6">
      <h2 className="text-sm font-semibold text-white/60 uppercase tracking-widest mb-5">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-white/40 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}

function Input({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full h-10 px-3.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-sm placeholder-white/20 outline-none focus:border-white/25 transition-colors"
    />
  );
}

function Textarea({ ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      rows={2}
      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-sm placeholder-white/20 outline-none focus:border-white/25 transition-colors resize-none"
    />
  );
}

function SaveButton({ pending, label = "Save changes" }: { pending: boolean; label?: string }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-5 py-2 rounded-xl bg-white text-black text-sm font-semibold hover:bg-white/90 disabled:opacity-50 transition-all"
    >
      {pending ? "Saving…" : label}
    </button>
  );
}

function Toast({ message, type }: { message: string; type: "success" | "error" }) {
  return (
    <div className={`text-xs px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5
      ${type === "success" ? "bg-green-500/15 text-green-400 border border-green-500/20" : "bg-red-500/15 text-red-400 border border-red-500/20"}`}>
      {type === "success" ? "✓" : "✕"} {message}
    </div>
  );
}

// ─── Hero Content Form ────────────────────────────────────────────────────────
function HeroForm({ hero }: { hero: SiteData["hero"] }) {
  const [form, setForm] = useState({ ...hero });
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        await updateHeroContent(form);
        setStatus({ msg: "Hero content updated!", type: "success" });
      } catch {
        setStatus({ msg: "Failed to save.", type: "error" });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <Field label="Eyebrow text (uppercase label above headline)">
          <Input value={form.eyebrowText} onChange={(e) => setForm({ ...form, eyebrowText: e.target.value })} />
        </Field>
        <Field label="Main headline">
          <Textarea value={form.headline} onChange={(e) => setForm({ ...form, headline: e.target.value })} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Email input placeholder">
            <Input value={form.inputPlaceholder} onChange={(e) => setForm({ ...form, inputPlaceholder: e.target.value })} />
          </Field>
          <Field label="CTA button text">
            <Input value={form.ctaButtonText} onChange={(e) => setForm({ ...form, ctaButtonText: e.target.value })} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Video demo link text">
            <Input value={form.videoDemoText} onChange={(e) => setForm({ ...form, videoDemoText: e.target.value })} />
          </Field>
          <Field label="Video demo URL">
            <Input value={form.videoDemoUrl} onChange={(e) => setForm({ ...form, videoDemoUrl: e.target.value })} />
          </Field>
        </div>
      </div>
      <div className="flex items-center gap-4 pt-1">
        <SaveButton pending={isPending} />
        {status && <Toast {...status} />}
      </div>
    </form>
  );
}

// ─── Site Settings Form ───────────────────────────────────────────────────────
function SettingsForm({ settings, headerCtas }: { settings: SiteData["settings"]; headerCtas: SiteData["headerCtas"] }) {
  const [form, setForm] = useState({
    logoText: settings.logoText,
    backgroundImage: settings.backgroundImage ?? "",
    logoIconUrl: settings.logoIconUrl ?? "",
  });
  const [entLabel, setEntLabel] = useState(headerCtas.find(c => c.key === "enterprise")?.label ?? "Enterprise");
  const [entHref, setEntHref] = useState(headerCtas.find(c => c.key === "enterprise")?.href ?? "#");
  const [loginLabel, setLoginLabel] = useState(headerCtas.find(c => c.key === "login")?.label ?? "Login");
  const [loginHref, setLoginHref] = useState(headerCtas.find(c => c.key === "login")?.href ?? "/login");
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        await updateSiteSettings(form);
        await updateHeaderCta("enterprise", { label: entLabel, href: entHref });
        await updateHeaderCta("login", { label: loginLabel, href: loginHref });
        setStatus({ msg: "Settings saved!", type: "success" });
      } catch {
        setStatus({ msg: "Failed to save.", type: "error" });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Logo text">
          <Input value={form.logoText} onChange={(e) => setForm({ ...form, logoText: e.target.value })} />
        </Field>
        <Field label="Logo icon URL (optional)">
          <Input value={form.logoIconUrl} placeholder="https://…/icon.png" onChange={(e) => setForm({ ...form, logoIconUrl: e.target.value })} />
        </Field>
      </div>
      <Field label="Background image URL (or CSS gradient)">
        <Input
          value={form.backgroundImage}
          placeholder="https://… or radial-gradient(…)"
          onChange={(e) => setForm({ ...form, backgroundImage: e.target.value })}
        />
        <p className="text-[11px] text-white/25 mt-1">Accepts an image URL or any valid CSS background value</p>
      </Field>

      <div className="border-t border-white/[0.06] pt-4">
        <p className="text-xs font-medium text-white/40 uppercase tracking-wide mb-3">Header CTA Buttons</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-xs text-white/30">Enterprise button</p>
            <Input placeholder="Label" value={entLabel} onChange={(e) => setEntLabel(e.target.value)} />
            <Input placeholder="URL" value={entHref} onChange={(e) => setEntHref(e.target.value)} />
          </div>
          <div className="space-y-2">
            <p className="text-xs text-white/30">Login button</p>
            <Input placeholder="Label" value={loginLabel} onChange={(e) => setLoginLabel(e.target.value)} />
            <Input placeholder="URL" value={loginHref} onChange={(e) => setLoginHref(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 pt-1">
        <SaveButton pending={isPending} />
        {status && <Toast {...status} />}
      </div>
    </form>
  );
}

// ─── Nav Links Manager ────────────────────────────────────────────────────────
function NavLinksManager({ links: initialLinks }: { links: any[] }) {
  const [links, setLinks] = useState(initialLinks);
  const [newLabel, setNewLabel] = useState("");
  const [newHref, setNewHref] = useState("");
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const handleAdd = () => {
    if (!newLabel || !newHref) return;
    startTransition(async () => {
      try {
        const created = await createNavLink({ label: newLabel, href: newHref, order: links.length + 1 });
        setLinks([...links, created]);
        setNewLabel("");
        setNewHref("");
        setStatus({ msg: "Link added!", type: "success" });
      } catch {
        setStatus({ msg: "Failed to add.", type: "error" });
      }
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      try {
        await deleteNavLink(id);
        setLinks(links.filter((l) => l.id !== id));
        setStatus({ msg: "Deleted.", type: "success" });
      } catch {
        setStatus({ msg: "Failed to delete.", type: "error" });
      }
    });
  };

  const handleToggle = (id: string, current: boolean) => {
    startTransition(async () => {
      await updateNavLink(id, { isActive: !current });
      setLinks(links.map((l) => (l.id === id ? { ...l, isActive: !current } : l)));
    });
  };

  const handleEdit = (id: string, field: string, value: string) => {
    setLinks(links.map((l) => (l.id === id ? { ...l, [field]: value } : l)));
  };

  const handleSaveEdit = (id: string, label: string, href: string) => {
    startTransition(async () => {
      await updateNavLink(id, { label, href });
      setStatus({ msg: "Updated.", type: "success" });
    });
  };

  return (
    <div className="space-y-3">
      {/* Existing links */}
      {links.map((link) => (
        <div key={link.id} className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <button
            onClick={() => handleToggle(link.id, link.isActive)}
            className={`w-8 h-4 rounded-full transition-colors flex-shrink-0 ${link.isActive ? "bg-green-500" : "bg-white/15"}`}
            title={link.isActive ? "Active – click to hide" : "Inactive – click to show"}
          >
            <span className={`block w-3 h-3 rounded-full bg-white transition-transform mx-0.5 ${link.isActive ? "translate-x-4" : "translate-x-0"}`} />
          </button>
          <input
            value={link.label}
            onChange={(e) => handleEdit(link.id, "label", e.target.value)}
            className="flex-1 bg-transparent text-white text-sm outline-none border-b border-transparent focus:border-white/20 pb-0.5 transition-colors"
          />
          <input
            value={link.href}
            onChange={(e) => handleEdit(link.id, "href", e.target.value)}
            className="flex-1 bg-transparent text-white/40 text-sm outline-none border-b border-transparent focus:border-white/20 pb-0.5 transition-colors"
          />
          <button
            onClick={() => handleSaveEdit(link.id, link.label, link.href)}
            className="text-xs text-white/40 hover:text-white transition-colors px-2"
          >
            Save
          </button>
          <button
            onClick={() => handleDelete(link.id)}
            className="text-xs text-red-400/60 hover:text-red-400 transition-colors px-1"
          >
            ✕
          </button>
        </div>
      ))}

      {/* Add new */}
      <div className="flex gap-2 pt-2">
        <Input
          placeholder="Label (e.g. Pricing)"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
        />
        <Input
          placeholder="URL (e.g. #pricing)"
          value={newHref}
          onChange={(e) => setNewHref(e.target.value)}
        />
        <button
          onClick={handleAdd}
          disabled={isPending || !newLabel || !newHref}
          className="px-4 h-10 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-medium transition-colors disabled:opacity-40 flex-shrink-0"
        >
          + Add
        </button>
      </div>
      {status && <Toast {...status} />}
    </div>
  );
}

// ─── Stats Bar ────────────────────────────────────────────────────────────────
function StatsBar({ data }: { data: SiteData; allNavLinks: any[] }) {
  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      {[
        { label: "Nav Links", value: data.navLinks.length },
        { label: "CTA Buttons", value: data.headerCtas.length },
        { label: "Active", value: "Live" },
      ].map((stat) => (
        <div key={stat.label} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
          <p className="text-2xl font-bold text-white">{stat.value}</p>
          <p className="text-xs text-white/35 mt-0.5">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export function AdminDashboard({
  siteData,
  allNavLinks,
}: {
  siteData: SiteData;
  allNavLinks: any[];
}) {
  return (
    <div className="max-w-3xl mx-auto">
      {/* Page header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Content Manager</h1>
          <p className="text-sm text-white/35 mt-1">Edit your landing page without touching code</p>
        </div>
        <a
          href="/"
          target="_blank"
          className="text-xs text-white/35 hover:text-white/60 flex items-center gap-1 transition-colors"
        >
          View site ↗
        </a>
      </div>

      <StatsBar data={siteData} allNavLinks={allNavLinks} />

      {/* Hero Content */}
      <Card id="hero" title="Hero Section">
        <HeroForm hero={siteData.hero} />
      </Card>

      {/* Navigation */}
      <Card id="nav" title="Navigation Links">
        <NavLinksManager links={allNavLinks} />
      </Card>

      {/* Global Settings */}
      <Card id="settings" title="Global Settings & CTAs">
        <SettingsForm settings={siteData.settings} headerCtas={siteData.headerCtas} />
      </Card>
    </div>
  );
}
