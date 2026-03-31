"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Zap,
  TrendingUp,
  Brain,
  BarChart3,
  ShieldCheck,
  Newspaper,
  MessageSquare,
  ArrowRight,
  Star,
} from "lucide-react";

const FEATURES = [
  {
    icon: BarChart3,
    color: "indigo",
    title: "Live Market Intelligence",
    desc: "Real-time NSE/BSE stock data powered by Yahoo Finance — prices, 52-week highs, moving averages, and P/E ratios at your fingertips.",
  },
  {
    icon: Brain,
    color: "violet",
    title: "AI Stock Analyzer",
    desc: "Deep-dive into any Indian stock with an AI-generated synthesis of market data and the latest news — powered by Groq's ultra-fast Llama-3 model.",
  },
  {
    icon: TrendingUp,
    color: "cyan",
    title: "Portfolio Optimizer",
    desc: "Upload your holdings and get Efficient Frontier portfolio optimization with Sharpe Ratio analysis and volatility modeling — institutional-grade, free.",
  },
  {
    icon: ShieldCheck,
    color: "emerald",
    title: "Crisis Simulator",
    desc: "Stress-test your portfolio against custom market shocks and historical crashes. Know your exposure before the market tells you.",
  },
  {
    icon: Newspaper,
    color: "amber",
    title: "News & Sentiment",
    desc: "Live financial news aggregation with AI-powered sentiment labelling — bullish, bearish, or neutral — so you always know the market mood.",
  },
  {
    icon: MessageSquare,
    color: "rose",
    title: "PulseBot AI Assistant",
    desc: "Your 24/7 financial co-pilot. Ask anything — from 'What is P/E ratio?' to 'Explain DII buying trends' — and get expert, context-aware answers.",
  },
];

const STATS = [
  { value: "50 000+", label: "Stocks Analyzed" },
  { value: "2ms", label: "Avg. Latency" },
  { value: "100%", label: "Free Forever" },
  { value: "NSE/BSE", label: "Market Coverage" },
];

export default function LandingPage() {
  const orb1 = useRef<HTMLDivElement>(null);
  const orb2 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      if (orb1.current) {
        orb1.current.style.transform = `translate(${x * 40 - 20}px, ${y * 40 - 20}px)`;
      }
      if (orb2.current) {
        orb2.current.style.transform = `translate(${-(x * 40 - 20)}px, ${-(y * 40 - 20)}px)`;
      }
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return (
    <div className="min-h-screen bg-[#050816] text-white overflow-x-hidden font-sans">
      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          ref={orb1}
          className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full opacity-20 transition-transform duration-700 ease-out"
          style={{ background: "radial-gradient(circle, #6366f1 0%, transparent 70%)" }}
        />
        <div
          ref={orb2}
          className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full opacity-15 transition-transform duration-700 ease-out"
          style={{ background: "radial-gradient(circle, #06b6d4 0%, transparent 70%)" }}
        />
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(99,102,241,0.08) 1px, transparent 0)`,
          backgroundSize: "40px 40px"
        }} />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-16 py-5 border-b border-white/5 backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">VittaDrishti</span>
        </div>
        <div className="hidden md:flex items-center space-x-8 text-sm text-slate-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#stats" className="hover:text-white transition-colors">Metrics</a>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            href="/login"
            className="text-sm text-slate-300 hover:text-white px-4 py-2 rounded-lg hover:bg-white/5 transition-all"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="text-sm font-semibold bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 px-5 py-2 rounded-lg transition-all shadow-lg shadow-indigo-500/20"
          >
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 text-center pt-24 pb-20 px-6 max-w-5xl mx-auto">
        <div className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 text-xs text-indigo-400 font-medium mb-8">
          <Star className="w-3.5 h-3.5" />
          <span>India&apos;s First AI-Powered Investment OS</span>
        </div>

        <div className="relative">
          {/* Left Decorative Element - Animated SVG Stock Chart */}
          <motion.div 
            initial={{ opacity: 0, x: -40, y: 30 }}
            animate={{ opacity: 1, x: 0, y: [0, -15, 0] }}
            transition={{ 
              duration: 1, 
              y: { duration: 5, repeat: Infinity, ease: "easeInOut" } 
            }}
            className="hidden lg:block absolute -left-28 top-2 z-20"
          >
            <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-[0_0_40px_rgba(16,185,129,0.15)] w-64 relative overflow-hidden">
               {/* Background glow */}
               <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
               
               <div className="flex justify-between items-start mb-6 relative z-10">
                 <div>
                   <div className="text-xs text-slate-400 font-medium mb-1 tracking-wider uppercase">NIFTY 50</div>
                   <div className="text-2xl font-black text-white tracking-tight">22,514<span className="text-slate-400 text-lg">.65</span></div>
                 </div>
                 <div className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold px-2.5 py-1 rounded-md shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                   +1.24%
                 </div>
               </div>
               
               {/* SVG Chart */}
               <div className="h-20 w-full relative z-10">
                 <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                   <defs>
                     <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="0%" stopColor="rgb(52 211 153)" stopOpacity="0.5" />
                       <stop offset="100%" stopColor="rgb(16 185 129)" stopOpacity="0" />
                     </linearGradient>
                     <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                       <feGaussianBlur stdDeviation="1.5" result="blur" />
                       <feComposite in="SourceGraphic" in2="blur" operator="over" />
                     </filter>
                   </defs>
                   
                   {/* Area path */}
                   <motion.path 
                     d="M0,40 L0,28 C5,28 10,22 15,25 C20,28 25,18 30,22 C35,26 40,12 50,16 C60,20 65,10 75,12 C85,14 92,4 100,5 L100,40 Z"
                     fill="url(#chart-gradient)"
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     transition={{ duration: 1, delay: 0.5 }}
                   />
                   
                   {/* Line path */}
                   <motion.path 
                     d="M0,28 C5,28 10,22 15,25 C20,28 25,18 30,22 C35,26 40,12 50,16 C60,20 65,10 75,12 C85,14 92,4 100,5"
                     fill="none"
                     stroke="#34d399"
                     strokeWidth="2"
                     filter="url(#glow)"
                     initial={{ pathLength: 0 }}
                     animate={{ pathLength: 1 }}
                     transition={{ duration: 2.5, ease: "easeInOut", repeat: Infinity, repeatType: "reverse", repeatDelay: 1 }}
                   />

                   {/* Pulsing dot at end */}
                   <motion.circle 
                     cx="100" cy="5" r="2.5" 
                     fill="#fff" 
                     initial={{ scale: 0, opacity: 0 }}
                     animate={{ scale: [1, 1.8, 1], opacity: [1, 0.5, 1] }}
                     transition={{ duration: 2, repeat: Infinity }}
                   />
                 </svg>
               </div>
            </div>
          </motion.div>

          <h1 className="relative z-10 text-5xl md:text-7xl font-extrabold leading-tight tracking-tight mb-6 px-10">
            Stop Guessing.
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400">
              Start Knowing.
            </span>
          </h1>

          {/* Right Decorative Element - Dynamic Scanner/Orderbook */}
          <motion.div 
            initial={{ opacity: 0, x: 40, y: -30 }}
            animate={{ opacity: 1, x: 0, y: [0, 15, 0] }}
            transition={{ 
              duration: 1, 
              delay: 0.2, 
              y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.2 } 
            }}
            className="hidden lg:block absolute -right-24 top-10 z-20"
          >
            <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-[0_0_40px_rgba(99,102,241,0.15)] w-64 relative overflow-hidden">
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-500/20 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2"></div>
              
              <div className="flex items-center gap-3 mb-5 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center relative overflow-hidden">
                  <Brain className="w-5 h-5 text-indigo-400 relative z-10" />
                  <motion.div 
                    animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                    className="absolute inset-0 bg-indigo-500/30 rounded-full"
                  />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-0.5">Live AI Engine</div>
                  <div className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Processing Alpha</div>
                </div>
              </div>

              {/* Data stream rows */}
              <div className="space-y-3 relative z-10">
                {[
                  { w: "80%", c: "from-indigo-500 to-violet-400", d: 0 },
                  { w: "60%", c: "from-violet-500 to-fuchsia-400", d: 0.2 },
                  { w: "90%", c: "from-cyan-500 to-indigo-400", d: 0.4 }
                ].map((bar, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-8 text-[10px] text-slate-500 font-mono">0x{i}A</div>
                    <div className="h-1.5 flex-1 bg-slate-800/80 rounded-full overflow-hidden relative">
                      <motion.div 
                        className={`absolute top-0 left-0 h-full bg-gradient-to-r ${bar.c} rounded-full`}
                        initial={{ width: "10%" }}
                        animate={{ width: ["10%", bar.w, "10%"] }}
                        transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut", delay: bar.d }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
          VittaDrishti is a comprehensive financial intelligence platform built for Indian investors.
          Real-time NSE/BSE data, AI analysis, portfolio optimization and live market sentiment — all in one place.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/signup"
            className="group flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 px-8 py-4 rounded-xl font-semibold text-base transition-all shadow-2xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5"
          >
            <span>Create Free Account</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/login"
            className="flex items-center space-x-2 px-8 py-4 rounded-xl font-semibold text-base border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all text-slate-300"
          >
            <span>Sign In</span>
          </Link>
        </div>

        {/* Mini preview card */}
        <div className="mt-16 relative mx-auto max-w-3xl">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/5 to-[#050816] z-10 rounded-2xl pointer-events-none" />
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6 shadow-2xl shadow-black/50">
            <div className="flex items-center space-x-2 mb-5">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <div className="ml-3 text-xs text-slate-500 font-mono">vitttadrishti.app / analyzer</div>
            </div>
            <div className="grid grid-cols-4 gap-3 mb-5">
              {[["RELIANCE", "₹2,845", "+1.2%", true], ["TCS", "₹3,621", "-0.4%", false], ["HDFCBANK", "₹1,732", "+0.8%", true], ["INFY", "₹1,581", "+2.1%", true]].map(([name, price, chg, up]) => (
                <div key={name as string} className="bg-slate-800/80 rounded-lg p-3 text-left">
                  <div className="text-xs text-slate-500 mb-1">{name}</div>
                  <div className="text-sm font-bold text-white">{price}</div>
                  <div className={`text-xs font-medium mt-0.5 ${up ? "text-emerald-400" : "text-rose-400"}`}>{chg}</div>
                </div>
              ))}
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 text-left">
              <div className="text-xs text-indigo-400 font-medium mb-2 flex items-center">
                <Brain className="w-3 h-3 mr-1.5" />
                AI Synthesis — RELIANCE.NS
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Reliance Industries demonstrates strong consolidation support near ₹2,820. RSI signals neutral momentum.
                Recent refinery capacity expansion and Jio subscriber growth suggest medium-term bullish fundamentals...
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="relative z-10 py-16 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map(({ value, label }) => (
            <div key={label} className="text-center p-6 rounded-2xl border border-white/5 bg-white/2 backdrop-blur-sm hover:border-indigo-500/30 transition-colors">
              <div className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400 mb-1">{value}</div>
              <div className="text-sm text-slate-500">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            Everything you need to{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
              invest smarter
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Six powerful tools. Zero subscriptions. Unlimited Indian market intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(({ icon: Icon, color, title, desc }) => {
            const colorMap: Record<string, string> = {
              indigo: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
              violet: "text-violet-400 bg-violet-500/10 border-violet-500/20",
              cyan: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
              emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
              amber: "text-amber-400 bg-amber-500/10 border-amber-500/20",
              rose: "text-rose-400 bg-rose-500/10 border-rose-500/20",
            };
            const cls = colorMap[color];
            return (
              <div
                key={title}
                className="group p-6 rounded-2xl border border-white/5 bg-white/2 hover:bg-white/4 hover:border-white/10 transition-all hover:-translate-y-1 cursor-default"
              >
                <div className={`w-11 h-11 rounded-xl border flex items-center justify-center mb-5 ${cls}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg text-white mb-2">{title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-24 px-6 text-center">
        <div className="max-w-2xl mx-auto p-10 rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 to-cyan-500/5 backdrop-blur-sm">
          <h2 className="text-4xl font-extrabold mb-4">Ready to take control?</h2>
          <p className="text-slate-400 mb-8 text-lg">Join thousands of Indian investors who&apos;ve upgraded their decision-making with VittaDrishti.</p>
          <Link
            href="/signup"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 px-10 py-4 rounded-xl font-bold text-base transition-all shadow-2xl shadow-indigo-500/30"
          >
            <span>Get Started — It&apos;s Free</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-xs text-slate-600 mt-4">No credit card required. No tricks.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-8 text-center text-sm text-slate-600">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Zap className="w-4 h-4 text-indigo-500" />
          <span className="font-semibold text-slate-400">VittaDrishti</span>
        </div>
        <p>© 2025 VittaDrishti. Built for Indian investors.</p>
      </footer>
    </div>
  );
}