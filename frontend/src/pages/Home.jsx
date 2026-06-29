import { useContext } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Bot, FileText, Gauge, MapPinned, ShieldCheck, Sparkles, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { ApiContext } from "../App.jsx";
import CityHealthScore from "../components/CityHealthScore.jsx";
import IssueCard from "../components/IssueCard.jsx";
import MapView from "../components/MapView.jsx";

export default function Home() {
  const { issues, stats } = useContext(ApiContext);
  const recent = issues.slice(0, 5);

  return (
    <div className="relative space-y-20">
      <section className="grid min-h-[calc(100vh-7rem)] items-center gap-10 py-10 lg:grid-cols-[1.05fr_.95fr]">
        <div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-6 inline-flex items-center gap-3 rounded-full border border-[#A855F7]/30 bg-[#A855F7]/15 px-4 py-2 text-sm font-black text-[#A855F7]">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#A855F7] shadow-[0_0_18px_rgba(168,85,247,.9)]" />
            AI-POWERED CIVIC PLATFORM
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} className="text-[clamp(3.4rem,8vw,72px)] font-extrabold leading-[.95] tracking-[-2px]">
            Fix Your City
            <span className="gradient-text block">With AI Power</span>
          </motion.h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-[#94A3B8]">
            Report civic issues with photos, get instant AI analysis, generate municipal letters, and track resolution with your community.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link to="/report" className="btn-primary flex items-center gap-2">
              Report Issue <ArrowRight size={18} />
            </Link>
            <Link to="/dashboard" className="rounded-xl border border-[#A855F7]/30 bg-[#A855F7]/5 px-7 py-3 font-bold text-[#F1F5F9] transition hover:bg-[#A855F7]/15">
              View Dashboard
            </Link>
          </div>
          <div className="mt-10 grid max-w-3xl gap-4 sm:grid-cols-3">
            {[
              [ShieldCheck, "5", "Active Issues", "#A855F7"],
              [Bot, "AI", "Smart Analysis", "#06B6D4"],
              [FileText, "1-click", "Letters", "#F59E0B"],
            ].map(([Icon, value, label, color]) => (
              <div key={label} className="glass-card p-5">
                <Icon style={{ color }} />
                <div className="mt-4 text-3xl font-black">{value}</div>
                <div className="text-sm text-[#94A3B8]">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[.22em] text-[#06B6D4]">Live City Score</p>
              <h2 className="text-3xl font-black">Civic Mission Control</h2>
            </div>
            <Sparkles className="text-[#F59E0B]" />
          </div>
          <CityHealthScore score={stats.health} />
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              ["Total", stats.total, "#A855F7"],
              ["Resolved", stats.resolved, "#10B981"],
              ["Citizens", stats.citizens, "#06B6D4"],
            ].map(([label, value, color]) => (
              <div key={label} className="rounded-2xl border border-[#A855F7]/20 bg-white/5 p-4 text-center">
                <div className="text-3xl font-black" style={{ color }}>{value}</div>
                <div className="text-xs font-bold uppercase tracking-[.16em] text-[#94A3B8]">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {[
          [Gauge, "Total Issues", stats.total, "#A855F7"],
          [ShieldCheck, "Resolved", stats.resolved, "#10B981"],
          [MapPinned, "In Progress", stats.inProgress, "#F59E0B"],
          [Users, "Citizens", stats.citizens, "#06B6D4"],
        ].map(([Icon, label, value, color]) => (
          <div key={label} className="glass-card p-6">
            <Icon style={{ color }} />
            <div className="mt-5 text-5xl font-black tracking-[-.06em]">{value}</div>
            <div className="mt-2 text-sm font-bold text-[#94A3B8]">{label}</div>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.05fr_.95fr]">
        <div>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm font-black text-[#10B981]"><span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#10B981]" /> LIVE</div>
              <h2 className="text-4xl font-black">Live Issue Feed</h2>
            </div>
          </div>
          <div className="space-y-4">
            {recent.map((issue) => <IssueCard key={issue.id} issue={issue} compact />)}
          </div>
        </div>
        <MapView issues={issues} height={560} />
      </section>
    </div>
  );
}
