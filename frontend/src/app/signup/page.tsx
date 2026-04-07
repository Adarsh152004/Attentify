"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Zap, Eye, EyeOff, ArrowRight, CheckCircle2, ShieldCheck} from "lucide-react";

const PERKS = [
  "Live NSE/BSE Market Data",
  "Neural Sentiment Analysis",
  "Portfolio Optimization Matrix",
  "Real-time Signal Provisioning",
  "Advanced Risk Simulator",
  "AI Investment Assistant",
];

export default function SignupPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [showPass, setShowPass] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    setError("");
    const { error } = await signUp(email, password, name);
    if (error) {
      setError(error);
      setLoading(false);
    } else {
      setSuccess(true);
      setTimeout(() => router.push("/"), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="flex flex-col justify-center">
           <div className="h-12 w-12 bg-sky-500/10 border border-sky-500/20 rounded-xl flex items-center justify-center mb-6">
              <Zap className="h-6 w-6 text-sky-400" />
           </div>
           <h1 className="text-3xl font-bold text-white tracking-tight mb-4">
             Unlock Institutional <br />
             <span className="text-sky-400">Intelligence</span>
           </h1>
           <p className="text-slate-400 text-sm max-w-sm leading-relaxed mb-10">
             Join thousands of investors using VittaDrishti&apos;s advanced AI to navigate the markets.
           </p>

           <div className="space-y-4">
              {PERKS.map((perk) => (
                <div key={perk} className="flex items-center gap-3">
                   <div className="h-6 w-6 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                      <CheckCircle2 size={14} />
                   </div>
                   <span className="text-sm font-medium text-slate-300">{perk}</span>
                </div>
              ))}
           </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
          {success ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
              <div className="h-20 w-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500">
                <ShieldCheck size={40} />
              </div>
              <h2 className="text-xl font-bold text-emerald-500">Account Created</h2>
              <p className="text-slate-500 text-sm leading-relaxed">
                Your credentials have been provisioned. <br/> Redirecting to dashboard...
              </p>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h2 className="text-xl font-bold text-white">Create Account</h2>
                <p className="text-slate-500 text-xs mt-2">Enter your details to register your node</p>
              </div>

              <form onSubmit={handleSignup} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 ml-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="John Doe"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-sky-500/50 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 ml-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="investigator@vittadrishti.io"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-sky-500/50 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 ml-1">Password</label>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-sky-500/50 transition-all pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-sky-400 transition-colors"
                    >
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="text-xs font-medium text-rose-400 bg-rose-400/10 border border-rose-400/20 rounded-lg px-4 py-3">
                    Error: {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-sky-500/20 active:scale-[0.98] disabled:opacity-50 mt-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Register Node
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-slate-800 text-center">
                <p className="text-xs text-slate-500">
                  Already Project Investigator?{" "}
                  <Link href="/login" className="text-sky-400 hover:text-sky-300 font-bold transition-colors">
                    Estabish Session
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
