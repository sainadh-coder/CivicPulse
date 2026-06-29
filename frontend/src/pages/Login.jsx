import { Chrome, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="grid min-h-[calc(100vh-8rem)] overflow-hidden rounded-[32px] border border-[#A855F7]/25 bg-[#A855F7]/5 lg:grid-cols-2">
      <section className="relative hidden p-12 lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_20%,rgba(168,85,247,.32),transparent_28rem),radial-gradient(circle_at_80%_80%,rgba(6,182,212,.18),transparent_24rem)]" />
        <div className="relative z-10 flex h-full flex-col justify-end">
          <Sparkles className="mb-8 text-[#F59E0B]" size={64} />
          <blockquote className="max-w-xl text-4xl font-black leading-tight tracking-[-.05em]">
            “Every citizen signal can become measurable civic action.”
          </blockquote>
          <p className="mt-5 text-[#94A3B8]">Demo mode is active. The hackathon build runs without Firebase credentials.</p>
        </div>
      </section>
      <section className="grid place-items-center p-6 sm:p-12">
        <div className="glass-card w-full max-w-md p-8">
          <div className="mb-8 flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#A855F7]/20 text-[#A855F7]">
              <ShieldCheck size={24} />
            </div>
            <div className="text-2xl font-black">CivicPulse <span className="text-[#06B6D4]">AI</span></div>
          </div>
          <h1 className="gradient-text text-4xl font-black">Welcome back</h1>
          <p className="mt-4 leading-7 text-[#94A3B8]">Authentication is mocked for this demo. Open the app and test reporting, dashboards, upvotes, and letter generation.</p>
          <button className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl bg-white px-5 py-4 font-black text-[#0A0015]">
            <Chrome size={21} /> Google Sign-In Demo
          </button>
          <Link to="/" className="btn-primary mt-4 flex w-full justify-center">Continue to App</Link>
        </div>
      </section>
    </div>
  );
}
