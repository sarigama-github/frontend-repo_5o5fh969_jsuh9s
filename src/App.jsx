import { useMemo, useState } from 'react'
import Spline from '@splinetool/react-spline'
import { motion } from 'framer-motion'
import { ArrowRight, Check, Sparkles, Shield, Zap, Mail } from 'lucide-react'

function Badge({ children }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur">
      <Sparkles className="h-3.5 w-3.5 text-amber-300" />
      {children}
    </span>
  )
}

function Feature({ icon: Icon, title, desc }) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition hover:bg-white/10">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-white/10 p-2 text-white">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h4 className="text-white font-semibold">{title}</h4>
          <p className="text-white/70 text-sm">{desc}</p>
        </div>
      </div>
    </div>
  )
}

function PriceCard({ name, price, caption, features, highlight = false, onJoin }) {
  return (
    <div className={`${highlight ? 'ring-2 ring-indigo-400/70 bg-white/15' : 'bg-white/10'} relative flex flex-col rounded-2xl border border-white/10 p-6 text-white backdrop-blur-xl`}> 
      {highlight && (
        <div className="absolute -top-3 right-6 rounded-full bg-indigo-500 px-3 py-1 text-xs font-medium">Popular</div>
      )}
      <h3 className="text-lg font-semibold">{name}</h3>
      <div className="mt-3 flex items-end gap-1">
        <span className="text-3xl font-bold">{price}</span>
        <span className="text-white/70">/mo</span>
      </div>
      <p className="mt-2 text-sm text-white/70">{caption}</p>
      <ul className="mt-4 space-y-2 text-sm">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 text-emerald-300" />
            <span className="text-white/80">{f}</span>
          </li>
        ))}
      </ul>
      <button onClick={onJoin} className="mt-6 inline-flex items-center justify-center rounded-lg bg-indigo-500 px-4 py-2 font-medium text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-400 focus:outline-none">
        Join waitlist
        <ArrowRight className="ml-2 h-4 w-4" />
      </button>
    </div>
  )
}

export default function App() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [plan, setPlan] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(null)

  const API_BASE = useMemo(() => {
    const env = import.meta.env.VITE_BACKEND_URL
    if (env) return String(env).replace(/\/$/, '')
    // fallback for local dev
    return 'http://localhost:8000'
  }, [])

  async function submitWaitlist(e) {
    e?.preventDefault?.()
    if (!email) return
    setLoading(true)
    setStatus(null)
    try {
      const res = await fetch(`${API_BASE}/api/waitlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name: name || undefined, plan: plan || undefined, source: 'landing' })
      })
      if (!res.ok) throw new Error(await res.text())
      setStatus({ ok: true, msg: 'You’re on the list. We’ll reach out soon!' })
      setEmail('')
      setName('')
      setPlan('')
    } catch (err) {
      setStatus({ ok: false, msg: 'Something went wrong. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  function quickJoin(selected) {
    setPlan(selected)
    const el = document.getElementById('waitlist')
    el?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-[#0B0F1A]">
      {/* subtle gradient + grid backdrop */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_600px_at_70%_-10%,rgba(99,102,241,0.25),transparent),radial-gradient(800px_500px_at_20%_0%,rgba(59,130,246,0.2),transparent)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.06),transparent_30%)]" />

      {/* Navigation */}
      <header className="relative z-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-white/10 ring-1 ring-white/20" />
            <span className="text-white text-sm tracking-wider">Cardly</span>
          </div>
          <nav className="hidden gap-6 text-sm text-white/70 md:flex">
            <a href="#features" className="hover:text-white">Features</a>
            <a href="#pricing" className="hover:text-white">Pricing</a>
            <a href="#waitlist" className="hover:text-white">Waitlist</a>
          </nav>
          <a href="#waitlist" className="inline-flex items-center rounded-lg bg-white/10 px-3 py-1.5 text-sm text-white backdrop-blur transition hover:bg-white/20">
            Join waitlist
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 py-14 md:grid-cols-2 md:py-24">
          <div>
            <div className="mb-4"><Badge>Coming soon</Badge></div>
            <h1 className="text-4xl font-semibold leading-tight text-white md:text-5xl">
              The glassmorphic card for modern finance teams
            </h1>
            <p className="mt-4 max-w-xl text-white/70">
              Issue virtual cards, control spend, and see transactions in real-time. Minimal, secure, beautifully fast.
            </p>

            <form id="waitlist" onSubmit={submitWaitlist} className="mt-6 flex flex-col gap-3 sm:flex-row">
              <div className="flex w-full items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 backdrop-blur">
                <Mail className="h-4 w-4 text-white/60" />
                <input
                  type="email"
                  placeholder="you@company.com"
                  className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center rounded-xl bg-indigo-500 px-5 py-2.5 font-medium text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-400 disabled:opacity-60"
              >
                {loading ? 'Joining…' : 'Join waitlist'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </form>
            {status && (
              <p className={`mt-3 text-sm ${status.ok ? 'text-emerald-300' : 'text-rose-300'}`}>{status.msg}</p>
            )}

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Feature icon={Shield} title="Bank-grade security" desc="Best-in-class encryption and controls." />
              <Feature icon={Zap} title="Instant cards" desc="Create, pause, and set limits in seconds." />
              <Feature icon={Sparkles} title="Beautifully simple" desc="A modern UI your team will love." />
            </div>
          </div>
          <div className="relative aspect-[4/3] w-full md:aspect-[5/4]">
            <div className="absolute inset-0 overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl">
              <Spline scene="https://prod.spline.design/41MGRk-UDPKO-l6W/scene.splinecode" style={{ width: '100%', height: '100%' }} />
            </div>
            <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-t from-[#0B0F1A] via-transparent to-transparent opacity-60" />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative z-10 border-t border-white/10/20">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold text-white">Simple, transparent pricing</h2>
            <p className="mt-2 text-white/70">Pay monthly when we launch. Join now to secure early access.</p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <PriceCard
              name="Starter"
              price="$9"
              caption="For individuals and small teams"
              features={["1 physical + 3 virtual cards", "Basic spending controls", "Email support"]}
              onJoin={() => quickJoin('starter')}
            />
            <PriceCard
              name="Pro"
              price="$29"
              caption="For growing teams"
              features={["Unlimited virtual cards", "Advanced controls & rules", "Priority support"]}
              highlight
              onJoin={() => quickJoin('pro')}
            />
            <PriceCard
              name="Enterprise"
              price="Custom"
              caption="For large organizations"
              features={["SAML SSO & audit logs", "Dedicated support", "Custom limits & SLAs"]}
              onJoin={() => quickJoin('enterprise')}
            />
          </div>
        </div>
      </section>

      {/* Extended waitlist (name + plan) */}
      <section className="relative z-10">
        <div className="mx-auto max-w-3xl px-6 pb-20">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h3 className="text-xl font-semibold">Be first in line</h3>
                <p className="text-white/70 text-sm">We’ll notify you as soon as we’re live. No spam—ever.</p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <input
                type="text"
                placeholder="Full name (optional)"
                className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-white placeholder-white/40 focus:outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Preferred plan (optional)"
                className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-white placeholder-white/40 focus:outline-none"
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
              />
              <button
                onClick={submitWaitlist}
                disabled={loading || !email}
                className="inline-flex items-center justify-center rounded-xl bg-indigo-500 px-5 py-2.5 font-medium text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-400 disabled:opacity-60"
              >
                {loading ? 'Submitting…' : 'Confirm join'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
            {!email && (
              <p className="mt-2 text-sm text-white/60">Add your email above in the hero to enable submit.</p>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-10 text-white/60 md:flex-row">
          <p className="text-sm">© {new Date().getFullYear()} Cardly — All rights reserved.</p>
          <div className="text-sm">Built with love • Modern, minimalist, digital</div>
        </div>
      </footer>
    </div>
  )
}
