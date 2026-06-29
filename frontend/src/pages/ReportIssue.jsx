import { useContext, useState } from "react";
import { motion } from "framer-motion";
import { Bot, CheckCircle2, LocateFixed, Send, UploadCloud, WandSparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API_BASE, ApiContext } from "../App.jsx";
import MapView from "../components/MapView.jsx";

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ReportIssue() {
  const { notify, refreshData } = useContext(ApiContext);
  const [step, setStep] = useState(1);
  const [image, setImage] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState({ lat: 17.385, lng: 78.4867, address: "Detected Area, Hyderabad" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const analyze = async (base64) => {
    setLoading(true);
    setStep(2);
    try {
      const res = await fetch(`${API_BASE}/api/analyze-image`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64 }),
      });
      if (!res.ok) throw new Error("Backend not available");
      const data = await res.json();
      setAnalysis(data);
      setTitle(`${data.type.replace("_", " ")} requires attention`);
      notify("AI analysis complete.");
    } catch (err) {
      console.error(err);
      const fallback = { type: "pothole", severity: 8, estimated_days: 4, description: "Severe civic issue detected. Municipal intervention is required." };
      setAnalysis(fallback);
      setTitle("Civic issue requires attention");
      notify("Using fallback analysis.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleFile = async (file) => {
    if (!file) return;
    const base64 = await readFileAsDataUrl(file);
    setImage(base64);
    analyze(base64);
  };

  const detectLocation = () => {
    navigator.geolocation?.getCurrentPosition(
      (position) => {
        setLocation({ lat: position.coords.latitude, lng: position.coords.longitude, address: "GPS Location, Hyderabad" });
        notify("GPS location detected.");
      },
      () => notify("GPS unavailable, using default location.", "error"),
    );
  };

  const submitIssue = async () => {
    setLoading(true);
    try {
      const payload = {
        type: analysis.type,
        severity: Number(analysis.severity),
        title,
        description: analysis.description,
        ai_description: analysis.description,
        location,
        photo_url: image || "https://images.unsplash.com/photo-1515162816951-d5ea80c8db79?w=800",
        reporter_id: "demo-user",
        reporter_name: "Demo Citizen",
        estimated_days: Number(analysis.estimated_days),
        resolved_at: null,
      };
      const res = await fetch(`${API_BASE}/api/issues`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Backend not available");
      const created = await res.json();
      await refreshData();
      setSuccess(true);
      notify("Issue submitted.");
      setTimeout(() => navigate(`/issue/${created.id}`), 1000);
    } catch (err) {
      console.error(err);
      notify("Submission failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="text-center">
        <p className="text-xs font-black uppercase tracking-[.24em] text-[#A855F7]">AI Intake</p>
        <h1 className="gradient-text mt-3 text-5xl font-black tracking-[-.06em]">Report a Civic Issue</h1>
      </div>

      <div className="glass-card p-5">
        <div className="grid gap-3 sm:grid-cols-4">
          {["Upload", "AI Analysis", "Location", "Submit"].map((label, index) => (
            <div key={label} className={`rounded-2xl border p-4 text-center font-black ${step >= index + 1 ? "border-[#A855F7] bg-[#A855F7]/20 text-[#F1F5F9]" : "border-[#A855F7]/20 text-[#94A3B8]"}`}>
              {index + 1}. {label}
            </div>
          ))}
        </div>
      </div>

      <section className="glass-card min-h-[540px] p-6">
        {step === 1 && (
          <label className="upload-zone grid min-h-[430px] cursor-pointer place-items-center rounded-[28px] p-8 text-center">
            <input type="file" accept="image/*" className="hidden" onChange={(event) => handleFile(event.target.files?.[0])} />
            <div>
              <div className="mx-auto mb-6 grid h-24 w-24 place-items-center rounded-[28px] bg-gradient-to-br from-[#A855F7] to-[#06B6D4] shadow-[0_0_60px_rgba(168,85,247,.45)]">
                <UploadCloud size={42} />
              </div>
              <h2 className="text-3xl font-black">Drag & drop or click to upload</h2>
              <p className="mt-3 text-[#94A3B8]">Gemini-style mock AI will analyze your photo instantly.</p>
            </div>
          </label>
        )}

        {step === 2 && (
          <div className="grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
            <img src={image} alt="" className="h-[480px] w-full rounded-[28px] object-cover" />
            <div className="grid place-items-center">
              {loading ? (
                <div className="text-center">
                  <Bot className="mx-auto mb-5 animate-pulse text-[#A855F7]" size={64} />
                  <h2 className="text-3xl font-black">Analyzing issue...</h2>
                </div>
              ) : (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card w-full p-6">
                  <div className="mb-4 flex items-center gap-2 text-[#06B6D4]"><WandSparkles size={18} /> AI Results</div>
                  <input value={title} onChange={(event) => setTitle(event.target.value)} className="mb-3 w-full rounded-2xl border border-[#A855F7]/30 bg-white/5 px-4 py-3" />
                  <textarea value={analysis?.description || ""} onChange={(event) => setAnalysis({ ...analysis, description: event.target.value })} rows={5} className="w-full rounded-2xl border border-[#A855F7]/30 bg-white/5 px-4 py-3" />
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div className="glass-card p-4">Type<br /><strong>{analysis?.type}</strong></div>
                    <div className="glass-card p-4">Severity<br /><strong>{analysis?.severity}/10</strong></div>
                    <div className="glass-card p-4">ETA<br /><strong>{analysis?.estimated_days} days</strong></div>
                  </div>
                  <button onClick={() => setStep(3)} className="btn-primary mt-5 w-full">Continue</button>
                </motion.div>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <button onClick={detectLocation} className="btn-primary flex items-center gap-2"><LocateFixed size={18} /> Use my GPS location</button>
            <MapView issues={[]} selectedLocation={location} height={360} />
            <input value={location.address} onChange={(event) => setLocation({ ...location, address: event.target.value })} className="w-full rounded-2xl border border-[#A855F7]/30 bg-white/5 px-4 py-4" />
            <button onClick={() => setStep(4)} className="btn-primary">Review</button>
          </div>
        )}

        {step === 4 && (
          <div className="grid gap-6 lg:grid-cols-2">
            <img src={image} alt="" className="h-[420px] w-full rounded-[28px] object-cover" />
            <div className="glass-card p-6">
              {success ? (
                <div className="grid min-h-[360px] place-items-center text-center">
                  <div>
                    <CheckCircle2 className="mx-auto mb-5 text-[#10B981]" size={80} />
                    <h2 className="text-3xl font-black">Report Submitted</h2>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-3xl font-black">{title}</h2>
                  <p className="mt-4 text-[#94A3B8]">{analysis?.description}</p>
                  <div className="mt-5 text-[#94A3B8]">{location.address}</div>
                  <button onClick={submitIssue} disabled={loading} className="btn-primary mt-6 flex items-center gap-2">
                    <Send size={18} /> Submit Report
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
