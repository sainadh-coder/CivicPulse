import { Activity, LayoutDashboard, LogIn, Plus, ShieldCheck } from "lucide-react";
import { Link, NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Home", icon: Activity },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/report", label: "Report", icon: Plus },
];

export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#A855F7]/20 bg-[#0A0015]/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-18 max-w-[1440px] items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#A855F7]/15 text-[#A855F7] shadow-[0_0_30px_rgba(168,85,247,.35)]">
            <ShieldCheck size={23} />
          </span>
          <span className="flex items-center gap-2">
            <span className="text-xl font-black text-[#F1F5F9]">CivicPulse</span>
            <span className="rounded-full border border-[#06B6D4]/30 bg-[#06B6D4]/15 px-2 py-0.5 text-xs font-black text-[#06B6D4]">AI</span>
          </span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {navItems.map(({ to, label }) => (
            <NavLink key={to} to={to} className="group relative py-2 text-sm font-semibold text-[#94A3B8] transition hover:text-[#F1F5F9]">
              {label}
              <span className="absolute inset-x-0 -bottom-1 h-0.5 origin-left scale-x-0 rounded-full bg-[#A855F7] transition-transform duration-300 group-hover:scale-x-100" />
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link to="/report" className="btn-primary hidden items-center gap-2 sm:flex">
            <Plus size={17} /> Report Issue
          </Link>
          <Link to="/login" className="flex items-center gap-2 rounded-xl border border-[#A855F7]/20 bg-[#A855F7]/5 px-3 py-2 text-sm font-semibold text-[#F1F5F9] transition hover:border-[#A855F7]/50">
            <LogIn size={17} />
            <span className="hidden sm:inline">Login</span>
          </Link>
        </div>
      </nav>
      <div className="flex border-t border-[#A855F7]/10 bg-[#0A0015]/90 md:hidden">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `flex flex-1 items-center justify-center gap-2 py-2.5 text-xs font-bold ${isActive ? "text-[#A855F7]" : "text-[#94A3B8]"}`}>
            <Icon size={15} /> {label}
          </NavLink>
        ))}
      </div>
    </header>
  );
}
