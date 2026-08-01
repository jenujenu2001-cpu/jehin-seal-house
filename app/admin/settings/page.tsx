"use client";

import { useEffect, useState } from "react";
import type { Business, Hero, Testimonial } from "@/lib/content";

type Settings = { business: Business; hero: Hero; testimonials: Testimonial[] };

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/content");
        const data = await res.json().catch(() => null);
        if (cancelled) return;
        if (!res.ok || !data || !data.business || !data.hero) {
          setLoadError((data && data.error) || "Could not load settings. Please refresh.");
          return;
        }
        setSettings(data);
      } catch {
        if (!cancelled) setLoadError("Could not reach the server. Check your connection and refresh.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSave() {
    if (!settings) return;
    setSaving(true);
    setSaved(false);
    setSaveError("");
    try {
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setSaveError(data.error || "Could not save changes. Please try again.");
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setSaveError("Could not reach the server. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="mx-auto max-w-4xl px-5 py-10 text-sm text-ink/50">Loading…</div>;
  if (!settings) {
    return (
      <div className="mx-auto max-w-4xl px-5 py-10 text-sm text-clay">
        {loadError || "Could not load settings."}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Settings</h1>
          <p className="mt-1 text-sm text-ink/60">Business details, homepage hero, and testimonials.</p>
        </div>
        <div className="text-right">
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-full bg-moss px-5 py-2 text-sm font-semibold text-paper hover:bg-fern disabled:opacity-60"
          >
            {saving ? "Saving…" : saved ? "Saved ✓" : "Save Changes"}
          </button>
          {saveError && <p className="mt-2 text-sm text-clay">{saveError}</p>}
        </div>
      </div>

      <section className="mt-8 rounded-2xl border border-ink/10 bg-paper p-6">
        <h2 className="font-display text-lg font-semibold text-ink">Business Info</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Business name" value={settings.business.name} onChange={(v) => setSettings({ ...settings, business: { ...settings.business, name: v } })} />
          <Field label="Phone" value={settings.business.phone} onChange={(v) => setSettings({ ...settings, business: { ...settings.business, phone: v } })} />
          <Field label="WhatsApp number (digits only, e.g. 94771234567)" value={settings.business.whatsapp} onChange={(v) => setSettings({ ...settings, business: { ...settings.business, whatsapp: v } })} />
          <Field label="Email" value={settings.business.email} onChange={(v) => setSettings({ ...settings, business: { ...settings.business, email: v } })} />
          <Field label="Address" value={settings.business.address} onChange={(v) => setSettings({ ...settings, business: { ...settings.business, address: v } })} full />
          <Field label="Google Maps embed URL" value={settings.business.mapEmbedUrl} onChange={(v) => setSettings({ ...settings, business: { ...settings.business, mapEmbedUrl: v } })} full />
          <Field label="Google Maps direction link" value={settings.business.mapLink} onChange={(v) => setSettings({ ...settings, business: { ...settings.business, mapLink: v } })} full />
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-ink/10 bg-paper p-6">
        <h2 className="font-display text-lg font-semibold text-ink">Opening Hours</h2>
        <div className="mt-4 space-y-3">
          {settings.business.hours.map((h, i) => (
            <div key={i} className="grid grid-cols-2 gap-3">
              <input
                value={h.day}
                onChange={(e) => {
                  const hours = [...settings.business.hours];
                  hours[i] = { ...hours[i], day: e.target.value };
                  setSettings({ ...settings, business: { ...settings.business, hours } });
                }}
                className="rounded-lg border border-ink/15 px-3 py-2 text-sm"
              />
              <input
                value={h.time}
                onChange={(e) => {
                  const hours = [...settings.business.hours];
                  hours[i] = { ...hours[i], time: e.target.value };
                  setSettings({ ...settings, business: { ...settings.business, hours } });
                }}
                className="rounded-lg border border-ink/15 px-3 py-2 text-sm"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-ink/10 bg-paper p-6">
        <h2 className="font-display text-lg font-semibold text-ink">Homepage Hero</h2>
        <div className="mt-4 grid gap-4">
          <Field label="Eyebrow tag" value={settings.hero.eyebrow} onChange={(v) => setSettings({ ...settings, hero: { ...settings.hero, eyebrow: v } })} full />
          <Field label="Headline" value={settings.hero.headline} onChange={(v) => setSettings({ ...settings, hero: { ...settings.hero, headline: v } })} full />
          <Field label="Subheadline" value={settings.hero.subheadline} onChange={(v) => setSettings({ ...settings, hero: { ...settings.hero, subheadline: v } })} full textarea />
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-ink/10 bg-paper p-6">
        <h2 className="font-display text-lg font-semibold text-ink">Testimonials</h2>
        <div className="mt-4 space-y-4">
          {settings.testimonials.map((t, i) => (
            <div key={i} className="grid gap-2 rounded-lg border border-ink/10 p-3 sm:grid-cols-2">
              <Field label="Name" value={t.name} onChange={(v) => {
                const testimonials = [...settings.testimonials];
                testimonials[i] = { ...testimonials[i], name: v };
                setSettings({ ...settings, testimonials });
              }} />
              <Field label="Role" value={t.role} onChange={(v) => {
                const testimonials = [...settings.testimonials];
                testimonials[i] = { ...testimonials[i], role: v };
                setSettings({ ...settings, testimonials });
              }} />
              <Field label="Quote" value={t.quote} onChange={(v) => {
                const testimonials = [...settings.testimonials];
                testimonials[i] = { ...testimonials[i], quote: v };
                setSettings({ ...settings, testimonials });
              }} full textarea />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  full,
  textarea
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  full?: boolean;
  textarea?: boolean;
}) {
  return (
    <label className={full ? "sm:col-span-2" : ""}>
      <span className="text-sm font-medium text-ink/80">{label}</span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="mt-1.5 w-full rounded-lg border border-ink/15 px-3.5 py-2 text-sm focus:border-moss"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-ink/15 px-3.5 py-2 text-sm focus:border-moss"
        />
      )}
    </label>
  );
}
