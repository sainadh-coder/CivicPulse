import { useContext, useMemo, useState } from "react";
import { Bot, FileText, MessageSquare, ThumbsUp, UserCircle } from "lucide-react";
import { useParams } from "react-router-dom";
import { API_BASE, ApiContext } from "../App.jsx";
import AILetterModal from "../components/AILetterModal.jsx";
import IssueCard, { formatType, severityFill } from "../components/IssueCard.jsx";
import MapView from "../components/MapView.jsx";

const timeline = ["reported", "verified", "in_progress", "resolved"];

export default function IssueDetail() {
  const { id } = useParams();
  const { issues, notify, refreshData } = useContext(ApiContext);
  const [letter, setLetter] = useState("");
  const [letterOpen, setLetterOpen] = useState(false);
  const [loadingLetter, setLoadingLetter] = useState(false);
  const issue = useMemo(() => issues.find((item) => item.id === id) || issues[0], [issues, id]);

  if (!issue) return <div className="glass-card h-[70vh]" />;

  const upvote = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/issues/${issue.id}/upvote`, { method: "PATCH" });
      if (!res.ok) throw new Error("Backend not available");
      await refreshData();
      notify("Upvoted.");
    } catch (err) {
      console.error(err);
      notify("Upvote failed.", "error");
    }
  };

  const generateLetter = async () => {
    setLoadingLetter(true);
    try {
      const res = await fetch(`${API_BASE}/api/generate-letter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          issue_type: issue.type,
          location: issue.location?.address,
          severity: issue.severity,
          description: issue.description,
          reporter_name: issue.reporter_name,
        }),
      });
      if (!res.ok) throw new Error("Backend not available");
      const data = await res.json();
      setLetter(data.letter_text);
      setLetterOpen(true);
    } catch (err) {
      console.error(err);
      notify("Letter generation failed.", "error");
    } finally {
      setLoadingLetter(false);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.15fr_.85fr]">
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-[28px] border border-[#A855F7]/25">
          <img src={issue.photo_url} alt={issue.title} className="h-[340px] w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0015] to-transparent" />
          <div className="absolute bottom-6 left-6">
            <span className={`rounded-full px-4 py-2 text-xs font-black uppercase badge-${issue.status}`}>{issue.status.replace("_", " ")}</span>
            <h1 className="mt-4 text-4xl font-black">{issue.title}</h1>
          </div>
        </section>

        <section className="glass-card p-6">
          <div className="mb-5 flex items-center gap-3">
            <Bot className="text-[#A855F7]" size={30} />
            <h2 className="text-2xl font-black">AI Analysis</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="glass-card p-4">Type<br /><strong>{formatType(issue.type)}</strong></div>
            <div className="glass-card p-4">Severity<br /><strong>{issue.severity}/10</strong></div>
            <div className="glass-card p-4">ETA<br /><strong>{issue.estimated_days} days</strong></div>
          </div>
          <div className="severity-bar mt-5">
            <div className={`h-full rounded-full ${severityFill(issue.severity)}`} style={{ width: `${Number(issue.severity) * 10}%` }} />
          </div>
          <p className="mt-5 leading-8 text-[#94A3B8]">{issue.ai_description}</p>
        </section>

        <section className="glass-card p-6">
          <h2 className="mb-5 text-2xl font-black">Status Timeline</h2>
          <div className="space-y-5">
            {timeline.map((item) => (
              <div key={item} className="flex items-center gap-4">
                <div className={`h-4 w-4 rounded-full ${timeline.indexOf(item) <= timeline.indexOf(issue.status) ? "bg-[#A855F7]" : "border border-[#A855F7]/40"}`} />
                <div className="font-bold capitalize">{item.replace("_", " ")}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="glass-card p-6">
          <h2 className="mb-4 flex items-center gap-2 text-2xl font-black"><MessageSquare className="text-[#06B6D4]" /> Comments</h2>
          <input placeholder="Add a civic update..." className="w-full rounded-2xl border border-[#A855F7]/30 bg-white/5 px-4 py-3" />
        </section>
      </div>

      <aside className="space-y-6">
        <section className="glass-card p-6">
          <h2 className="mb-5 flex items-center gap-2 text-2xl font-black"><UserCircle className="text-[#F59E0B]" /> Reporter</h2>
          <div className="font-black">{issue.reporter_name}</div>
          <div className="text-sm text-[#94A3B8]">Verified civic reporter</div>
        </section>
        <section className="glass-card p-6">
          <button onClick={upvote} className="mb-4 flex w-full items-center justify-center gap-3 rounded-2xl border border-[#10B981]/30 bg-[#10B981]/10 px-5 py-5 text-xl font-black">
            <ThumbsUp className="text-[#10B981]" /> {issue.upvotes} Upvotes
          </button>
          <button onClick={generateLetter} disabled={loadingLetter} className="btn-primary flex w-full items-center justify-center gap-3">
            <FileText size={20} /> {loadingLetter ? "Generating..." : "Generate Letter"}
          </button>
        </section>
        <MapView issues={[issue]} height={320} />
        <IssueCard issue={issue} compact />
      </aside>
      <AILetterModal open={letterOpen} onClose={() => setLetterOpen(false)} letterText={letter} issue={issue} notify={notify} />
    </div>
  );
}
