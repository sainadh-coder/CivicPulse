import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { issueTypeColor } from "./IssueCard.jsx";

export default function MapView({ issues = [], height = 420, selectedLocation }) {
  const pins = issues.filter((issue) => issue.location?.lat && issue.location?.lng);

  return (
    <div className="glass-card relative overflow-hidden" style={{ height }}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(168,85,247,.25),transparent_30%),radial-gradient(circle_at_70%_60%,rgba(6,182,212,.18),transparent_28%),linear-gradient(135deg,rgba(10,0,21,.9),rgba(26,0,48,.72))]" />
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "linear-gradient(rgba(168,85,247,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,.12) 1px, transparent 1px)", backgroundSize: "42px 42px" }} />
      {pins.map((issue, index) => (
        <Link
          key={issue.id}
          to={`/issue/${issue.id}`}
          className="group absolute"
          style={{
            left: `${18 + (index * 17) % 64}%`,
            top: `${20 + (index * 23) % 58}%`,
          }}
        >
          <span className="absolute -inset-4 rounded-full opacity-30 blur-xl" style={{ background: issueTypeColor(issue.type) }} />
          <span className="relative grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-[#0A0015]/80 shadow-lg transition group-hover:scale-110" style={{ color: issueTypeColor(issue.type) }}>
            <MapPin size={20} />
          </span>
          <span className="pointer-events-none absolute left-1/2 top-12 hidden w-56 -translate-x-1/2 rounded-xl border border-[#A855F7]/30 bg-[#0A0015]/95 p-3 text-xs shadow-2xl group-hover:block">
            <strong className="block text-[#F1F5F9]">{issue.title}</strong>
            <span className="mt-1 block text-[#94A3B8]">Severity {issue.severity} • {issue.location.address}</span>
          </span>
        </Link>
      ))}
      {selectedLocation && (
        <div className="absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#A855F7] text-white shadow-[0_0_40px_rgba(168,85,247,.5)]">
          <MapPin size={22} />
        </div>
      )}
      <div className="absolute bottom-4 left-4 rounded-xl border border-[#A855F7]/20 bg-[#0A0015]/80 px-4 py-2 text-sm text-[#94A3B8] backdrop-blur-xl">
        Civic density map • {pins.length} active pins
      </div>
    </div>
  );
}
