import { motion } from "framer-motion";
import { Medal, Trophy } from "lucide-react";

export default function Leaderboard({ users = [] }) {
  const sorted = [...users].sort((a, b) => Number(b.xp || 0) - Number(a.xp || 0)).slice(0, 10);
  const maxXp = Math.max(...sorted.map((user) => Number(user.xp || 0)), 1);

  return (
    <section className="glass-card p-5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#F59E0B]">Top Citizens</p>
          <h2 className="mt-1 text-2xl font-black">Citizen Hero Leaderboard</h2>
        </div>
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-[#A855F7] to-[#F59E0B] shadow-[0_0_34px_rgba(245,158,11,.35)]">
          <Trophy size={22} />
        </div>
      </div>
      <div className="space-y-3">
        {sorted.map((user, index) => {
          const xp = Number(user.xp || 0);
          return (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="glass-card p-3"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/5">
                  {index < 3 ? <Medal className="text-[#F59E0B]" size={20} /> : <span className="text-sm font-black text-[#94A3B8]">#{index + 1}</span>}
                </div>
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#A855F7] to-[#06B6D4] text-sm font-black">
                  {(user.name || "C").slice(0, 1)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate font-bold">{user.name}</p>
                    <span className="rounded-full border border-[#10B981]/25 bg-[#10B981]/10 px-2.5 py-1 text-[10px] font-black text-[#10B981]">
                      {user.badge}
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-gradient-to-r from-[#A855F7] via-[#06B6D4] to-[#F59E0B]" style={{ width: `${(xp / maxXp) * 100}%` }} />
                  </div>
                </div>
                <div className="w-16 text-right">
                  <div className="text-lg font-black text-[#06B6D4]">{xp}</div>
                  <div className="text-[10px] font-bold text-[#94A3B8]">XP</div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
