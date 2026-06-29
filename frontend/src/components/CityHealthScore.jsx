import { motion } from "framer-motion";

export default function CityHealthScore({ score = 76, size = "large" }) {
  const radius = size === "large" ? 104 : 70;
  const stroke = size === "large" ? 16 : 11;
  const normalized = radius - stroke / 2;
  const circumference = normalized * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;
  const color = score <= 40 ? "#EF4444" : score <= 70 ? "#F59E0B" : "#10B981";

  return (
    <div className="relative grid place-items-center">
      <div className="absolute h-[85%] w-[85%] rounded-full bg-[#A855F7]/20 blur-3xl" />
      <svg width={radius * 2} height={radius * 2} className="relative -rotate-90">
        <circle cx={radius} cy={radius} r={normalized} stroke="rgba(255,255,255,.1)" strokeWidth={stroke} fill="none" />
        <motion.circle
          cx={radius}
          cy={radius}
          r={normalized}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.1, ease: "easeOut" }}
          style={{ filter: `drop-shadow(0 0 20px ${color}88)` }}
        />
      </svg>
      <div className="absolute text-center">
        <div className={size === "large" ? "text-6xl font-black tracking-[-.06em]" : "text-4xl font-black"}>{score}</div>
        <div className="mt-1 text-[11px] font-bold uppercase tracking-[0.24em] text-[#94A3B8]">City Health</div>
      </div>
    </div>
  );
}
