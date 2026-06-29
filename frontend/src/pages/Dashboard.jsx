import { useContext, useMemo } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Activity, AlertTriangle, CheckCircle2, Users } from "lucide-react";
import { ApiContext } from "../App.jsx";
import CityHealthScore from "../components/CityHealthScore.jsx";
import IssueCard, { formatType } from "../components/IssueCard.jsx";
import Leaderboard from "../components/Leaderboard.jsx";
import MapView from "../components/MapView.jsx";

const chartColors = ["#A855F7", "#06B6D4", "#F59E0B", "#10B981", "#EF4444"];

export default function Dashboard() {
  const { issues, stats, users } = useContext(ApiContext);

  const byCategory = useMemo(() => Object.entries(issues.reduce((acc, issue) => {
    const key = formatType(issue.type);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {})).map(([name, value]) => ({ name, value })), [issues]);

  const byStatus = useMemo(() => Object.entries(issues.reduce((acc, issue) => {
    acc[issue.status] = (acc[issue.status] || 0) + 1;
    return acc;
  }, {})).map(([name, value]) => ({ name, value })), [issues]);

  const trend = useMemo(() => ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => ({
    day,
    reported: Math.max(1, (issues.length + index) % 6),
    resolved: Math.max(0, (stats.resolved + index) % 4),
  })), [issues.length, stats.resolved]);

  const critical = issues.filter((issue) => issue.status !== "resolved").sort((a, b) => b.severity - a.severity).slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-black uppercase tracking-[.24em] text-[#F59E0B]">Operations</p>
        <h1 className="gradient-text mt-3 text-5xl font-black tracking-[-.06em]">City Command Center</h1>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          [Activity, "Total Issues", stats.total, "#A855F7"],
          [CheckCircle2, "Resolved", stats.resolved, "#10B981"],
          [AlertTriangle, "Avg Severity", stats.avgSeverity, "#F59E0B"],
          [Users, "Citizens", stats.citizens, "#06B6D4"],
        ].map(([Icon, label, value, color]) => (
          <div key={label} className="glass-card p-6">
            <div className="grid h-12 w-12 place-items-center rounded-2xl" style={{ background: `linear-gradient(135deg, ${color}, #06B6D4)` }}>
              <Icon size={22} />
            </div>
            <div className="mt-6 text-5xl font-black tracking-[-.06em]">{value}</div>
            <div className="mt-2 text-sm font-bold text-[#94A3B8]">{label}</div>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[.32fr_.68fr]">
        <div className="glass-card grid place-items-center p-6"><CityHealthScore score={stats.health} /></div>
        <div className="glass-card p-6">
          <h2 className="mb-5 text-2xl font-black">Issues by Category</h2>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={byCategory}>
              <CartesianGrid stroke="rgba(168,85,247,.12)" vertical={false} />
              <XAxis dataKey="name" stroke="#94A3B8" />
              <YAxis stroke="#94A3B8" allowDecimals={false} />
              <Tooltip contentStyle={{ background: "#0A0015", border: "1px solid rgba(168,85,247,.3)", borderRadius: 12 }} />
              <Bar dataKey="value" radius={[12, 12, 0, 0]}>
                {byCategory.map((_, index) => <Cell key={index} fill={chartColors[index % chartColors.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[.55fr_.45fr]">
        <div className="glass-card p-6">
          <h2 className="mb-5 text-2xl font-black">Reported vs Resolved</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={trend}>
              <CartesianGrid stroke="rgba(168,85,247,.12)" vertical={false} />
              <XAxis dataKey="day" stroke="#94A3B8" />
              <YAxis stroke="#94A3B8" allowDecimals={false} />
              <Tooltip contentStyle={{ background: "#0A0015", border: "1px solid rgba(168,85,247,.3)", borderRadius: 12 }} />
              <Area type="monotone" dataKey="reported" stroke="#A855F7" fill="#A855F7" fillOpacity={0.22} />
              <Area type="monotone" dataKey="resolved" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.18} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="glass-card p-6">
          <h2 className="mb-5 text-2xl font-black">Status Breakdown</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={byStatus} dataKey="value" nameKey="name" innerRadius={70} outerRadius={108}>
                {byStatus.map((_, index) => <Cell key={index} fill={chartColors[index % chartColors.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "#0A0015", border: "1px solid rgba(168,85,247,.3)", borderRadius: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <MapView issues={issues} height={450} />
        <Leaderboard users={users} />
      </section>

      <section>
        <h2 className="mb-5 text-3xl font-black">Top Critical Unresolved Issues</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {critical.map((issue) => <IssueCard key={issue.id} issue={issue} cta />)}
        </div>
      </section>
    </div>
  );
}
