import { motion } from "framer-motion";
import { Construction, Droplets, Lightbulb, MapPin, Recycle, ShieldAlert, ThumbsUp } from "lucide-react";
import { Link } from "react-router-dom";

const icons = {
  pothole: Construction,
  water_leak: Droplets,
  streetlight: Lightbulb,
  waste: Recycle,
  other: ShieldAlert,
};

const typeColors = {
  pothole: "#A855F7",
  water_leak: "#06B6D4",
  streetlight: "#F59E0B",
  waste: "#10B981",
  other: "#EF4444",
};

export function formatType(type = "other") {
  return type.replace("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function issueTypeColor(type) {
  return typeColors[type] || typeColors.other;
}

export function severityFill(severity) {
  if (Number(severity) >= 8) return "severity-fill-high";
  if (Number(severity) >= 5) return "severity-fill-med";
  return "severity-fill-low";
}

export default function IssueCard({ issue, compact = false, cta = false }) {
  const Icon = icons[issue.type] || icons.other;
  const color = issueTypeColor(issue.type);

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      className="glass-card overflow-hidden"
      style={{ borderLeft: `4px solid ${color}` }}
    >
      {!compact && (
        <Link to={`/issue/${issue.id}`} className="relative block h-44 overflow-hidden">
          <img src={issue.photo_url} alt={issue.title} className="h-full w-full object-cover transition duration-500 hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0015] to-transparent" />
        </Link>
      )}
      <div className="p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/5" style={{ color }}>
              <Icon size={21} />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-black uppercase tracking-[0.2em]" style={{ color }}>{formatType(issue.type)}</p>
              <Link to={`/issue/${issue.id}`} className="line-clamp-1 font-bold text-[#F1F5F9] hover:text-[#06B6D4]">
                {issue.title}
              </Link>
            </div>
          </div>
          <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] badge-${issue.status}`}>
            {issue.status.replace("_", " ")}
          </span>
        </div>
        <p className="line-clamp-2 text-sm leading-6 text-[#94A3B8]">{issue.description}</p>
        <div className="mt-5 space-y-2">
          <div className="flex justify-between text-xs font-semibold text-[#94A3B8]">
            <span>Severity</span>
            <span>{issue.severity}/10</span>
          </div>
          <div className="severity-bar">
            <div className={`h-full rounded-full ${severityFill(issue.severity)}`} style={{ width: `${Number(issue.severity) * 10}%` }} />
          </div>
        </div>
        <div className="mt-5 flex items-center justify-between gap-4 text-xs text-[#94A3B8]">
          <span className="flex min-w-0 items-center gap-1.5">
            <MapPin size={14} className="shrink-0 text-[#06B6D4]" />
            <span className="truncate">{issue.location?.address}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <ThumbsUp size={14} className="text-[#10B981]" /> {issue.upvotes || 0}
          </span>
        </div>
        {cta && (
          <Link to={`/issue/${issue.id}`} className="mt-5 block rounded-xl border border-[#A855F7]/30 bg-[#A855F7]/15 px-4 py-3 text-center text-sm font-black text-[#F1F5F9]">
            View & Generate Letter
          </Link>
        )}
      </div>
    </motion.article>
  );
}
