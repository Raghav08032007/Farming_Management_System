import { useState, useEffect, useRef, useCallback } from "react";

/* ─── CONFIG — change this to your FastAPI server URL ─── */
const API = "http://localhost:8000";

/* ─── GOOGLE FONTS & GLOBAL STYLES ─────────────────────── */
const FontLink = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --soil:      #1a1a1a;
      --earth:     #2ecc71;
      --bark:      #27ae60;
      --sand:      #f1c40f;
      --straw:     #f39c12;
      --cream:     #ffffff;
      --leaf-dark: #1e3a2f;
      --leaf:      #2a9d8f;
      --leaf-mid:  #48c9b0;
      --leaf-light:#a3e4d7;
      --mint:      #e8f8f5;
      --sky:       #3498db;
      --sky-deep:  #2980b9;
      --sun:       #e67e22;
      --danger:    #e74c3c;
      --warn:      #f39c12;
      --success:   #27ae60;
      --bg:        #f0f2f5;
      --card:      #ffffff;
      --border:    #dcdde1;
      --text:      #2c3e50;
      --text-mid:  #576574;
      --text-soft: #8395a7;
    }
    body { font-family:'DM Sans',sans-serif; background:var(--bg); color:var(--text); overflow-x:hidden; }
    ::-webkit-scrollbar{width:6px} ::-webkit-scrollbar-track{background:var(--cream)} ::-webkit-scrollbar-thumb{background:var(--sand);border-radius:3px}
    .fade-in{animation:fadeIn 0.35s ease both}
    @keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
    .pulse-dot{width:8px;height:8px;border-radius:50%;background:var(--leaf-mid);animation:pulse 2s infinite}
    @keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(64,145,108,.5)}50%{box-shadow:0 0 0 6px rgba(64,145,108,0)}}
    .card{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:20px;box-shadow:0 2px 12px rgba(61,43,31,.08);transition:box-shadow .2s}
    .card:hover{box-shadow:0 6px 24px rgba(61,43,31,.14)}
    .btn{display:inline-flex;align-items:center;gap:6px;padding:9px 18px;border-radius:10px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;cursor:pointer;border:none;transition:all .15s;white-space:nowrap}
    .btn-primary{background:var(--leaf);color:#fff} .btn-primary:hover{background:var(--leaf-dark);transform:translateY(-1px)}
    .btn-secondary{background:var(--cream);color:var(--earth);border:1px solid var(--border)} .btn-secondary:hover{background:var(--straw)}
    .btn-danger{background:#fde8e8;color:var(--danger);border:1px solid #f5c6c6} .btn-danger:hover{background:#f8c8c8}
    .btn:disabled{opacity:.5;cursor:not-allowed;transform:none!important}
    .btn-sm{padding:6px 12px;font-size:12px}
    input,select,textarea{font-family:'DM Sans',sans-serif;font-size:13px;color:var(--text);background:var(--cream);border:1px solid var(--border);border-radius:10px;padding:9px 14px;width:100%;transition:border-color .15s,box-shadow .15s;outline:none}
    input:focus,select:focus,textarea:focus{border-color:var(--leaf-mid);box-shadow:0 0 0 3px rgba(64,145,108,.15)}
    label{font-size:12px;font-weight:600;color:var(--text-mid);margin-bottom:4px;display:block;text-transform:uppercase;letter-spacing:.5px}
    .badge{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600}
    .badge-green{background:#d8f3dc;color:var(--leaf-dark)} .badge-yellow{background:#fff3cd;color:#856404}
    .badge-red{background:#fde8e8;color:#c0392b} .badge-blue{background:#d0ebff;color:var(--sky-deep)} .badge-earth{background:#f0e6d3;color:var(--earth)}
    .sidebar-nav-item{display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:10px;cursor:pointer;font-size:13px;font-weight:500;color:rgba(255,255,255,.7);transition:all .15s;border:none;background:none;width:100%;text-align:left}
    .sidebar-nav-item:hover{background:rgba(255,255,255,.1);color:#fff}
    .sidebar-nav-item.active{background:rgba(255,255,255,.2);color:#fff}
    .stat-card{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:18px 20px;display:flex;flex-direction:column;gap:6px}
    .table-wrap{overflow-x:auto;border-radius:12px;border:1px solid var(--border)}
    table{width:100%;border-collapse:collapse}
    th{background:var(--leaf-dark);color:#fff;padding:11px 16px;text-align:left;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.6px}
    td{padding:10px 16px;font-size:13px;border-bottom:1px solid var(--border)}
    tr:last-child td{border-bottom:none} tr:nth-child(even) td{background:#faf6f0} tr:hover td{background:var(--mint)}
    .gauge-ring{width:80px;height:80px;border-radius:50%;display:flex;align-items:center;justify-content:center;position:relative}
    .chat-bubble{padding:12px 16px;border-radius:14px;max-width:85%;font-size:13px;line-height:1.6}
    .chat-bubble.user{background:var(--leaf);color:#fff;border-bottom-right-radius:4px;margin-left:auto}
    .chat-bubble.ai{background:var(--card);border:1px solid var(--border);border-bottom-left-radius:4px}
    .progress-bar{height:8px;border-radius:4px;background:var(--straw);overflow:hidden}
    .progress-fill{height:100%;border-radius:4px;transition:width .8s ease}
    .weather-card{background:linear-gradient(135deg,#1b6ca8,#89c2d9);color:#fff;border-radius:16px;padding:20px}
    .section-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;flex-wrap:wrap;gap:10px}
    .section-title{font-family:'Playfair Display',serif;font-size:22px;font-weight:600;color:var(--soil)}
    .section-sub{font-size:13px;color:var(--text-soft);margin-top:2px}
    .grid-2{display:grid;grid-template-columns:1fr 1fr;gap:16px}
    .grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
    .grid-4{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
    @media(max-width:900px){.grid-4,.grid-3{grid-template-columns:1fr 1fr}.grid-2{grid-template-columns:1fr}}
    @media(max-width:600px){.grid-4,.grid-3,.grid-2{grid-template-columns:1fr}}
    .modal-bg{position:fixed;inset:0;background:rgba(61,43,31,.5);z-index:100;display:flex;align-items:center;justify-content:center;padding:16px;backdrop-filter:blur(4px)}
    .modal{background:var(--card);border-radius:20px;padding:28px;width:100%;max-width:520px;max-height:90vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,.25);animation:fadeIn .25s ease}
    .modal-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px}
    .modal-title{font-family:'Playfair Display',serif;font-size:20px;font-weight:600}
    .form-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
    .form-group{display:flex;flex-direction:column;gap:4px;margin-bottom:14px}
    .ai-typing{display:flex;gap:4px;align-items:center;padding:12px 16px}
    .ai-typing span{width:8px;height:8px;background:var(--sand);border-radius:50%;animation:typing 1.4s infinite}
    .ai-typing span:nth-child(2){animation-delay:.2s} .ai-typing span:nth-child(3){animation-delay:.4s}
    @keyframes typing{0%,80%,100%{transform:scale(.8);opacity:.5}40%{transform:scale(1.1);opacity:1}}
    .error-banner{background:#fde8e8;border:1px solid #f5c6c6;border-radius:12px;padding:12px 16px;color:var(--danger);font-size:13px;margin-bottom:16px;display:flex;align-items:center;gap:8px}
    .loading-row{text-align:center;padding:32px;color:var(--text-soft);font-size:13px}
    .market-up{color:var(--leaf-mid)} .market-down{color:var(--danger)}
    .nav-logo{font-family:'Playfair Display',serif;font-size:18px;font-weight:700}
  `}</style>
);

/* ─── API HELPERS ───────────────────────────────────────────── */
async function apiFetch(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`API ${path} → ${res.status}: ${err}`);
  }
  return res.json();
}
const apiGet    = (path)         => apiFetch(path);
const apiPost   = (path, body)   => apiFetch(path, { method:"POST",   body: JSON.stringify(body) });
const apiPatch  = (path, body)   => apiFetch(path, { method:"PATCH",  body: JSON.stringify(body) });
const apiDelete = (path)         => apiFetch(path, { method:"DELETE" });

/* ─── LOCAL AI Q&A ENGINE (No API key required) ────────────── */
const FARM_KB = [
  {
    patterns: [/soil.?moisture|dry.?soil|water.?content|moisture.?low/i],
    answer: (db) => {
      const alertSensors = db?.sensors?.filter(s => s.status === "alert" && s.type === "Soil Moisture") || [];
      const base = alertSensors.length > 0
        ? `⚠️ Alert detected: ${alertSensors.map(s => `${s.field_name} (${s.value}%)`).join(", ")} are below optimal levels.\n\n`
        : "";
      return base + "🌱 **Soil Moisture Advice:**\n• Optimal soil moisture for most crops is 40–70%.\n• For rice: maintain 60–80% during vegetative stage.\n• For tomatoes & vegetables: 50–65% is ideal.\n• Install drip irrigation to maintain consistent levels.\n• Mulching with straw or dry leaves reduces evaporation by 30–40%.\n• Early morning irrigation (5–7 AM) minimizes evaporation loss.";
    }
  },
  {
    patterns: [/fertilizer|fertiliser|npk|nutrient|manure|urea/i],
    answer: (db) => {
      const crops = db?.crops?.map(c => c.name).join(", ") || "your crops";
      return `🌿 **Fertilizer Recommendations for ${crops}:**\n• **Rice:** Apply 120:60:60 kg/ha NPK. Split urea into 3 doses — basal, tillering, panicle initiation.\n• **Wheat:** Use 150:75:60 NPK. Apply DAP at sowing, urea top-dressing at crown root initiation.\n• **Tomato:** 75:50:50 NPK + 2% KNO₃ foliar spray at flowering.\n• **Mango:** 1 kg Urea + 1 kg SSP + 500g MOP per tree annually.\n• Use organic compost (FYM) @ 10–15 tons/ha to improve soil health.\n• Soil test every 2 years for precise recommendations.`;
    }
  },
  {
    patterns: [/sell|market|price|profit|revenue|best.?time.?to.?sell/i],
    answer: (db) => {
      const prices = db?.prices?.map(p => `${p.crop}: ₹${p.price}/kg (${p.trend === "up" ? "↑ rising" : p.trend === "down" ? "↓ falling" : "→ stable"})`).join("\n  ") || "No market data loaded.";
      return `📊 **Current Market Prices:**\n  ${prices}\n\n💡 **Sales Strategy:**\n• Sell when market is rising (↑). Hold stock if prices are falling.\n• Rice & Wheat: Best sold immediately post-harvest (Oct–Nov, Mar–Apr).\n• Tomato: Peak prices in summer (Apr–Jun). Consider cold storage.\n• Mango: Sell within 5–7 days of harvest — highly perishable.\n• Use APMC mandis for best regulated prices, or direct-to-consumer for 20–30% more revenue.`;
    }
  },
  {
    patterns: [/water|irrigation|drip|sprinkler|watering|schedule/i],
    answer: (db) => {
      const scheduled = db?.irrigations?.filter ? "" : "";
      return `💧 **Irrigation Best Practices:**\n• **Drip Irrigation:** Most water-efficient. Use for tomatoes, cotton, sugarcane. Saves 40–50% water vs flood.\n• **Sprinkler:** Ideal for wheat, groundnut, vegetables. Uniformity is 85–90%.\n• **Flood Irrigation:** Suitable only for rice (paddy fields). Apply 2–5 cm water per week.\n• **Scheduling:** Irrigate early morning (5–7 AM) or evening (6–8 PM) to reduce evaporation.\n• Monitor soil moisture sensors — irrigate only when below 40%.\n• Skip irrigation if rainfall exceeds 25 mm/week.`;
    }
  },
  {
    patterns: [/pest|insect|disease|blight|fungus|fungal|aphid|worm|caterpillar/i],
    answer: (db) => {
      return `🐛 **Pest & Disease Management:**\n• **Rice:** Watch for Stem Borer, Brown Plant Hopper. Spray Chlorpyrifos 2 ml/L at appearance.\n• **Wheat:** Rust (yellow/brown/black) — apply Propiconazole 25% EC @ 1 ml/L.\n• **Tomato:** Early Blight, Leaf Curl Virus. Use Mancozeb 2g/L + neem oil spray weekly.\n• **Mango:** Powdery Mildew at flowering — spray Wettable Sulfur 2g/L.\n• **General:** Neem-based pesticides (Azadirachtin 0.03%) are safe & effective for minor infestations.\n• Scout fields every 3 days during critical growth stages.\n• Maintain field hygiene — remove and burn infected crop residues.`;
    }
  },
  {
    patterns: [/livestock|cow|buffalo|goat|animal|milk|treatment|sick|health/i],
    answer: (db) => {
      const animals = db?.livestock || [];
      const sick = animals.filter(a => a.status === "Under Treatment");
      const totalMilk = animals.reduce((a,l) => a + Number(l.milk), 0).toFixed(1);
      const base = sick.length > 0
        ? `⚠️ Animals under treatment: ${sick.map(a => `${a.tag} (${a.species})`).join(", ")}. Consult a vet promptly.\n\n`
        : "";
      return base + `🐄 **Livestock Health & Management:**\n• Total daily milk: **${totalMilk} L**.\n• Vaccinate cattle for FMD, HS, BQ every 6 months.\n• Deworm animals quarterly with Albendazole 7.5 mg/kg.\n• Provide 30–35 L water/day per cow, 20–25 L for buffalo.\n• Green fodder (napier grass, berseem) improves milk yield by 15–20%.\n• Separate sick animals immediately to prevent disease spread.\n• Daily body condition scoring helps detect illness early.`;
    }
  },
  {
    patterns: [/temperature|heat|cold|weather|rain|rainfall|climate|season/i],
    answer: (db) => {
      const tempSensors = db?.sensors?.filter(s => s.type === "Temperature") || [];
      const avgTemp = tempSensors.length > 0
        ? (tempSensors.reduce((a,s) => a + Number(s.value), 0) / tempSensors.length).toFixed(1)
        : null;
      const tempInfo = avgTemp ? `Current average field temperature: **${avgTemp}°C**.\n\n` : "";
      return tempInfo + `🌡️ **Climate & Crop Management (Tamil Nadu):**\n• **Normal range:** 25–35°C is optimal for most Kharif crops.\n• **Above 38°C:** Apply kaolin spray (5%) to reduce heat stress. Irrigate in the evening.\n• **Below 15°C:** Protect seedlings with polythene mulch. Delay transplanting.\n• **Northeast Monsoon (Oct–Dec):** Ideal for Samba rice, rabi crops.\n• **Southwest Monsoon (Jun–Sep):** Kuruvai rice, groundnut, cotton season.\n• Maintain windbreaks (Casuarina/Eucalyptus rows) to protect crops from dry winds.`;
    }
  },
  {
    patterns: [/ph|soil.?test|acidity|alkaline|acidic/i],
    answer: (db) => {
      const phSensors = db?.sensors?.filter(s => s.type?.includes("pH")) || [];
      const phInfo = phSensors.length > 0
        ? `Current soil pH readings: ${phSensors.map(s => `${s.field_name}: ${s.value}`).join(", ")}.\n\n`
        : "";
      return phInfo + `🧪 **Soil pH Management:**\n• **Optimal pH:** 6.0–7.5 for most crops. Rice: 5.5–6.5. Mango: 5.5–7.5.\n• **Acidic soil (pH < 6):** Apply agricultural lime @ 2–3 tons/ha. Re-test after 3 months.\n• **Alkaline soil (pH > 7.5):** Apply gypsum @ 2 tons/ha or sulfur @ 500 kg/ha.\n• **Black cotton soil:** Naturally high pH (7.5–8.5). Grows cotton, wheat, sorghum well.\n• **Red soil:** Slightly acidic (6–7). Good for groundnut, pulses, millets.\n• Soil test every 2 years from TNAU Soil Testing Lab for accurate amendments.`;
    }
  },
  {
    patterns: [/crop.?rotation|next.?crop|what.?crop|which.?crop|plant.?next|rotation/i],
    answer: (db) => {
      return `🔄 **Crop Rotation Recommendations (Tamil Nadu):**\n• **After Rice:** Grow pulses (black gram, green gram) — they fix nitrogen, improving soil for free.\n• **After Wheat:** Sunflower or groundnut to break pest cycles.\n• **After Tomato:** Avoid solanaceous crops (brinjal, chilli) for 2 seasons. Grow cereals instead.\n• **After Mango (inter-cropping):** Turmeric, ginger, or pineapple in orchard rows.\n• **Benefits of rotation:** Reduces soil-borne diseases by 40–60%, cuts fertilizer cost by 20%.\n• **Tamil Nadu calendar:** Kuruvai (Jun–Oct) → Samba (Aug–Jan) → Navarai (Jan–May).`;
    }
  },
  {
    patterns: [/harvest|ready.?to.?harvest|when.?harvest|yield|production/i],
    answer: (db) => {
      const crops = db?.crops || [];
      const ready = crops.filter(c => c.stage === "Ready to Harvest" || c.stage === "Ripening");
      const readyInfo = ready.length > 0
        ? `🌾 Crops ready/near harvest: **${ready.map(c => c.name).join(", ")}**.\n\n`
        : "";
      return readyInfo + `🌾 **Harvest Management:**\n• **Rice:** Harvest when 80–85% grains turn golden. Moisture content should be 20–22%.\n• **Wheat:** Harvest when crop turns golden yellow and grain is hard. Avoid over-ripening.\n• **Tomato:** Harvest at breaker stage (50% red color) for distant markets, fully red for local.\n• **Mango:** Harvest based on fruit maturity index — specific gravity ~1.01–1.02.\n• **Post-Harvest:** Dry grains to 12–14% moisture before storage. Use moisture meters.\n• Store in cool, dry, ventilated godowns to prevent fungal damage.`;
    }
  },
  {
    patterns: [/subsidy|scheme|government|loan|insurance|pm.?kisan|nabard/i],
    answer: () => {
      return `🏛️ **Government Schemes for Farmers (Tamil Nadu):**\n• **PM-KISAN:** ₹6,000/year direct transfer to all eligible farmers. Apply at pmkisan.gov.in.\n• **PMFBY (Crop Insurance):** Low premium insurance for Kharif & Rabi crops. Apply via bank.\n• **Tamil Nadu Soil Health Card:** Free soil testing at TNAU labs every 2 years.\n• **Drip Irrigation Subsidy:** Up to 90% subsidy for SC/ST farmers, 75% for others. Contact TNAU.\n• **NABARD Kisan Credit Card:** Revolving credit up to ₹3 lakh at 7% interest (4% with subsidy).\n• **e-NAM:** Online national market for selling produce at better prices. Register at enam.gov.in.\n• Contact your nearest Krishi Vigyan Kendra (KVK) for personalized scheme guidance.`;
    }
  },
];

const DEFAULT_ANSWERS = [
  "🌿 As your AI Farm Advisor, I can help with:\n• Soil & fertilizer advice\n• Pest & disease management\n• Irrigation scheduling\n• Market prices & selling strategy\n• Livestock health\n• Government schemes & subsidies\n• Crop rotation & harvest timing\n\nTry asking: 'What fertilizer should I use for rice?' or 'How can I reduce water usage?'",
  "🤔 I don't have a specific answer for that, but I'm trained on Tamil Nadu farming practices. Try rephrasing your question about crops, soil, irrigation, pests, livestock, or market prices!",
  "📚 That's outside my current knowledge base. For complex queries, contact your nearest KVK (Krishi Vigyan Kendra) or TNAU extension officer. I can help with soil, crops, irrigation, pests, livestock, and market decisions!",
];

let defaultIdx = 0;
function callAI(contextData, userMessage) {
  return new Promise((resolve) => {
    // Simulate a slight delay for realism
    setTimeout(() => {
      const msg = userMessage.toLowerCase();
      for (const entry of FARM_KB) {
        if (entry.patterns.some(p => p.test(msg))) {
          resolve(entry.answer(contextData));
          return;
        }
      }
      resolve(DEFAULT_ANSWERS[defaultIdx++ % DEFAULT_ANSWERS.length]);
    }, 600 + Math.random() * 600);
  });
}

/* ─── SMALL SHARED COMPONENTS ───────────────────────────────── */
function StatCard({ icon, label, value, sub, color = "var(--leaf)", badge }) {
  return (
    <div className="stat-card fade-in">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <div style={{ fontSize:26 }}>{icon}</div>
        {badge && <span className={`badge badge-${badge.type}`}>{badge.label}</span>}
      </div>
      <div style={{ fontFamily:"'DM Mono',monospace", fontSize:26, fontWeight:500, color, marginTop:4 }}>{value}</div>
      <div style={{ fontSize:12, fontWeight:600, color:"var(--text-mid)", textTransform:"uppercase", letterSpacing:".5px" }}>{label}</div>
      {sub && <div style={{ fontSize:11, color:"var(--text-soft)" }}>{sub}</div>}
    </div>
  );
}

function SensorGauge({ s }) {
  const pct = s.type==="Soil pH" ? (s.value/14)*100
            : s.type==="Rainfall" ? Math.min(s.value/50*100,100)
            : Math.min(s.value,100);
  const color = s.status==="alert" ? "var(--danger)"
              : pct>70 ? "var(--leaf-mid)" : pct>40 ? "var(--sun)" : "var(--danger)";
  const bg = `conic-gradient(${color} ${pct*3.6}deg, var(--straw) ${pct*3.6}deg)`;
  return (
    <div className="card" style={{ padding:14, display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
      <div style={{ display:"flex", justifyContent:"space-between", width:"100%" }}>
        <span style={{ fontSize:10, fontWeight:600, color:"var(--text-mid)", textTransform:"uppercase" }}>{s.type}</span>
        {s.status==="alert" && <span className="badge badge-red" style={{ fontSize:9 }}>⚠ Alert</span>}
      </div>
      <div className="gauge-ring" style={{ background:bg, boxShadow:"0 0 0 4px var(--cream)" }}>
        <div style={{ width:56,height:56,borderRadius:"50%",background:"var(--card)",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column" }}>
          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:14, fontWeight:500, color }}>{s.value}</span>
          <span style={{ fontSize:9, color:"var(--text-soft)" }}>{s.unit}</span>
        </div>
      </div>
      <div style={{ fontSize:10, color:"var(--text-soft)", textAlign:"center" }}>
        {s.field_name} · {s.last_update_fmt || "just now"}
      </div>
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="modal-bg" onClick={e => e.target===e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ErrorBanner({ msg }) {
  if (!msg) return null;
  return (
    <div className="error-banner">
      ⚠️ <strong>API Error:</strong> {msg} — Is your FastAPI server running at <code>{API}</code>?
    </div>
  );
}

/* ══════════════════════════════════════════════
   PAGES — all fetch from MySQL via FastAPI
══════════════════════════════════════════════ */

/* ── DASHBOARD ── */
function Dashboard() {
  const [summary, setSummary]   = useState(null);
  const [sensors, setSensors]   = useState([]);
  const [crops,   setCrops]     = useState([]);
  const [prices,  setPrices]    = useState([]);
  const [error,   setError]     = useState("");
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      apiGet("/dashboard"),
      apiGet("/sensors"),
      apiGet("/crops"),
      apiGet("/market-prices"),
    ])
      .then(([s, se, cr, pr]) => { setSummary(s); setSensors(se); setCrops(cr); setPrices(pr); })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-row">⏳ Loading dashboard from MySQL...</div>;

  const alerts = sensors.filter(s => s.status === "alert");

  return (
    <div className="fade-in">
      <div className="section-header">
        <div><h1 className="section-title">🏡 Farm Dashboard</h1>
          <p className="section-sub">Live data from MySQL · {new Date().toDateString()}</p></div>
        <div style={{ display:"flex", gap:8 }}>
          {alerts.length>0 && <span className="badge badge-red">⚠ {alerts.length} Alert{alerts.length>1?"s":""}</span>}
          <span className="badge badge-green">● MySQL Connected</span>
        </div>
      </div>
      <ErrorBanner msg={error} />
      {alerts.length>0 && (
        <div style={{ background:"#fff5f5", border:"1px solid #fecaca", borderRadius:12, padding:"14px 18px", marginBottom:18, display:"flex", gap:10 }}>
          <span style={{ fontSize:20 }}>⚠️</span>
          <div>
            <strong style={{ color:"var(--danger)" }}>Sensor Alert: </strong>
            <span style={{ fontSize:13, color:"var(--text-mid)" }}>
              {alerts.map(a=>`${a.type} at ${a.field_name} (${a.value}${a.unit})`).join(" · ")}
            </span>
          </div>
        </div>
      )}
      {summary && (
        <div className="grid-4" style={{ marginBottom:20 }}>
          <StatCard icon="🌾" label="Total Farms"   value={summary.farms}       color="var(--leaf)" />
          <StatCard icon="🌱" label="Active Crops"  value={summary.activeCrops} color="var(--leaf-mid)" badge={{type:"green",label:"Live"}} />
          <StatCard icon="📡" label="Live Sensors"  value={summary.sensors}     color="var(--sky-deep)" badge={summary.alerts>0?{type:"red",label:`${summary.alerts} Alert`}:null} />
          <StatCard icon="💰" label="Total Revenue" value={`₹${(summary.revenue/1000).toFixed(1)}K`} color="var(--earth)" />
        </div>
      )}
      <div className="grid-2" style={{ marginBottom:20 }}>
        <div>
          <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:15, marginBottom:12, color:"var(--soil)" }}>📡 Live Sensor Grid</h3>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
            {sensors.map(s => <SensorGauge key={s.id} s={s} />)}
          </div>
        </div>
        <div className="card">
          <h3 style={{ fontSize:14, fontWeight:600, marginBottom:12, color:"var(--soil)" }}>💰 Market Prices</h3>
          {prices.map(m => (
            <div key={m.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:"1px solid var(--border)" }}>
              <span style={{ fontSize:13, fontWeight:500 }}>{m.crop}</span>
              <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                <span style={{ fontFamily:"'DM Mono',monospace", fontSize:13, fontWeight:600 }}>₹{m.price}/kg</span>
                <span className={m.trend==="up"?"market-up":"market-down"} style={{ fontSize:12 }}>
                  {m.trend==="up"?"↑":"↓"}{Math.abs(m.change)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:15, marginBottom:10, color:"var(--soil)" }}>🌱 Active Crops</h3>
      <div className="table-wrap">
        <table><thead><tr><th>Crop</th><th>Field</th><th>Stage</th><th>Sow Date</th><th>Harvest</th><th>Status</th></tr></thead>
          <tbody>
            {crops.filter(c=>c.status==="Active").map(c => (
              <tr key={c.id}>
                <td style={{ fontWeight:500 }}>{c.name}</td>
                <td>{c.field_name}</td>
                <td><span className="badge badge-blue">{c.stage}</span></td>
                <td style={{ fontFamily:"'DM Mono',monospace", fontSize:12 }}>{c.sow_date?.split("T")[0]}</td>
                <td style={{ fontFamily:"'DM Mono',monospace", fontSize:12 }}>{c.harvest?.split("T")[0]}</td>
                <td><span className="badge badge-green">● {c.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── FARMS ── */
function Farms() {
  const [farms,   setFarms]   = useState([]);
  const [farmers, setFarmers] = useState([]);
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name:"", location:"", area:"", soil_type:"Loamy", farmer_id:"" });

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([apiGet("/farms"), apiGet("/farmers")])
      .then(([fa, fr]) => { setFarms(fa); setFarmers(fr); })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);
  useEffect(load, [load]);

  const save = async () => {
    if (!form.name || !form.area || !form.farmer_id) return;
    try {
      await apiPost("/farms", { ...form, area: parseFloat(form.area), farmer_id: parseInt(form.farmer_id) });
      setShowModal(false); setForm({ name:"", location:"", area:"", soil_type:"Loamy", farmer_id:"" }); load();
    } catch (e) { setError(e.message); }
  };

  return (
    <div className="fade-in">
      <div className="section-header">
        <div><h1 className="section-title">🌾 Farm Management</h1><p className="section-sub">MySQL: farms & farmers tables</p></div>
        <button className="btn btn-primary" onClick={()=>setShowModal(true)}>＋ Add Farm</button>
      </div>
      <ErrorBanner msg={error} />
      {loading ? <div className="loading-row">⏳ Loading...</div> : (
        <div className="grid-3" style={{ marginBottom:20 }}>
          {farms.map(f => (
            <div key={f.id} className="card" style={{ display:"flex", flexDirection:"column", gap:10 }}>
              <div style={{ display:"flex", justifyContent:"space-between" }}>
                <div>
                  <div style={{ fontFamily:"'Playfair Display',serif", fontSize:17, fontWeight:600 }}>{f.name}</div>
                  <div style={{ fontSize:12, color:"var(--text-soft)" }}>📍 {f.location}</div>
                </div>
                <span className="badge badge-earth">{f.soil_type} Soil</span>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                <div className="stat-card" style={{ padding:"10px 12px" }}>
                  <div style={{ fontSize:18, fontWeight:600, color:"var(--leaf)" }}>{f.area}</div>
                  <div style={{ fontSize:11, color:"var(--text-soft)" }}>Acres</div>
                </div>
              </div>
              <div style={{ borderTop:"1px solid var(--border)", paddingTop:8, fontSize:12, color:"var(--text-mid)" }}>
                👤 <strong>{f.farmer_name}</strong>
              </div>
            </div>
          ))}
        </div>
      )}
      <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:15, marginBottom:10, color:"var(--soil)" }}>👤 Registered Farmers</h3>
      <div className="table-wrap">
        <table><thead><tr><th>Name</th><th>Phone</th><th>Email</th><th>District</th><th>State</th></tr></thead>
          <tbody>{farmers.map(f=>(
            <tr key={f.id}>
              <td style={{ fontWeight:500 }}>{f.name}</td>
              <td style={{ fontFamily:"'DM Mono',monospace", fontSize:12 }}>{f.phone}</td>
              <td>{f.email}</td><td>{f.district}</td><td>{f.state}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      {showModal && (
        <Modal title="Add New Farm" onClose={()=>setShowModal(false)}>
          <div className="form-group"><label>Farm Name</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="e.g. Sunrise Farm" /></div>
          <div className="form-row">
            <div className="form-group"><label>Location</label><input value={form.location} onChange={e=>setForm({...form,location:e.target.value})} /></div>
            <div className="form-group"><label>Area (acres)</label><input type="number" value={form.area} onChange={e=>setForm({...form,area:e.target.value})} /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Soil Type</label>
              <select value={form.soil_type} onChange={e=>setForm({...form,soil_type:e.target.value})}>
                {["Black","Red","Loamy","Sandy","Clay","Silt"].map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group"><label>Owner (Farmer)</label>
              <select value={form.farmer_id} onChange={e=>setForm({...form,farmer_id:e.target.value})}>
                <option value="">Select Farmer</option>
                {farmers.map(f=><option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button className="btn btn-primary" onClick={save}>✓ Save to MySQL</button>
            <button className="btn btn-secondary" onClick={()=>setShowModal(false)}>Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ── CROPS ── */
function Crops() {
  const [crops,  setCrops]  = useState([]);
  const [fields, setFields] = useState([]);
  const [error,  setError]  = useState("");
  const [loading,setLoading]= useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name:"", stage:"Seedling", sow_date:"", harvest:"", status:"Active", field_id:"" });

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([apiGet("/crops"), apiGet("/fields")])
      .then(([cr, fi]) => { setCrops(cr); setFields(fi); })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);
  useEffect(load, [load]);

  const save = async () => {
    if (!form.name || !form.sow_date || !form.field_id) return;
    try {
      await apiPost("/crops", { ...form, field_id: parseInt(form.field_id) });
      setShowModal(false); load();
    } catch(e) { setError(e.message); }
  };

  const stages = ["Seedling","Vegetative","Flowering","Fruiting","Ripening","Ready to Harvest"];
  const stageColor = { Seedling:"badge-green", Vegetative:"badge-green", Flowering:"badge-blue",
    Fruiting:"badge-yellow", Ripening:"badge-yellow", "Ready to Harvest":"badge-red" };

  return (
    <div className="fade-in">
      <div className="section-header">
        <div><h1 className="section-title">🌱 Crop Management</h1><p className="section-sub">MySQL: crops table</p></div>
        <button className="btn btn-primary" onClick={()=>setShowModal(true)}>＋ Add Crop Cycle</button>
      </div>
      <ErrorBanner msg={error} />
      {loading ? <div className="loading-row">⏳ Loading...</div> : (
        <div className="grid-2">
          {crops.map(c => {
            const sowD=new Date(c.sow_date), harvD=new Date(c.harvest), now=new Date();
            const pct = Math.min(Math.max(((now-sowD)/(harvD-sowD))*100,0),100);
            return (
              <div key={c.id} className="card">
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
                  <div>
                    <div style={{ fontFamily:"'Playfair Display',serif", fontSize:16, fontWeight:600 }}>{c.name}</div>
                    <div style={{ fontSize:12, color:"var(--text-soft)" }}>📍 {c.field_name}</div>
                  </div>
                  <span className={`badge ${stageColor[c.stage]||"badge-blue"}`}>{c.stage}</span>
                </div>
                <div style={{ marginBottom:8 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"var(--text-soft)", marginBottom:4 }}>
                    <span>Sown: {c.sow_date?.split("T")[0]}</span>
                    <span>Harvest: {c.harvest?.split("T")[0]}</span>
                  </div>
                  <div className="progress-bar"><div className="progress-fill" style={{ width:`${pct.toFixed(0)}%`, background:"var(--leaf-mid)" }} /></div>
                  <div style={{ fontSize:10, color:"var(--text-soft)", marginTop:2 }}>{pct.toFixed(0)}% elapsed</div>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span className={`badge ${c.status==="Active"?"badge-green":c.status==="Harvested"?"badge-blue":"badge-red"}`}>{c.status}</span>
                  {c.yield_kg && <span style={{ fontSize:12, color:"var(--leaf)", fontWeight:600 }}>🌾 {c.yield_kg} kg</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}
      {showModal && (
        <Modal title="Add Crop Cycle" onClose={()=>setShowModal(false)}>
          <div className="form-group"><label>Crop Name & Variety</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="e.g. Rice (ADT-43)" /></div>
          <div className="form-row">
            <div className="form-group"><label>Sow Date</label><input type="date" value={form.sow_date} onChange={e=>setForm({...form,sow_date:e.target.value})} /></div>
            <div className="form-group"><label>Harvest Date</label><input type="date" value={form.harvest} onChange={e=>setForm({...form,harvest:e.target.value})} /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Growth Stage</label>
              <select value={form.stage} onChange={e=>setForm({...form,stage:e.target.value})}>
                {stages.map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group"><label>Field</label>
              <select value={form.field_id} onChange={e=>setForm({...form,field_id:e.target.value})}>
                <option value="">Select Field</option>
                {fields.map(f=><option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button className="btn btn-primary" onClick={save}>✓ Save to MySQL</button>
            <button className="btn btn-secondary" onClick={()=>setShowModal(false)}>Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ── SENSORS ── */
function Sensors() {
  const [sensors, setSensors] = useState([]);
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    apiGet("/sensors").then(setSensors).catch(e=>setError(e.message)).finally(()=>setLoading(false));
  }, []);
  useEffect(load, [load]);

  const simulate = async () => {
    try {
      await Promise.all(sensors.map(s => {
        const newVal = +(s.value + (Math.random()-0.5)*2).toFixed(1);
        const newStatus = (s.type==="Soil Moisture" && newVal<30) ? "alert" : "normal";
        return apiPatch(`/sensors/${s.id}`, { value: newVal, status: newStatus });
      }));
      load();
    } catch(e) { setError(e.message); }
  };

  return (
    <div className="fade-in">
      <div className="section-header">
        <div><h1 className="section-title">📡 IoT Sensor Network</h1><p className="section-sub">MySQL: sensors table · live readings</p></div>
        <button className="btn btn-secondary" onClick={simulate}>↻ Simulate Reading Update</button>
      </div>
      <ErrorBanner msg={error} />
      {loading ? <div className="loading-row">⏳ Loading sensors from MySQL...</div> : (
        <>
          <div className="grid-4" style={{ marginBottom:20 }}>
            <StatCard icon="📡" label="Online"   value={sensors.length} color="var(--sky-deep)" />
            <StatCard icon="⚠️" label="Alerts"   value={sensors.filter(s=>s.status==="alert").length} color="var(--danger)" />
            <StatCard icon="💧" label="Avg Moisture"  value={`${(sensors.filter(s=>s.type==="Soil Moisture").reduce((a,s)=>a+Number(s.value),0)/(sensors.filter(s=>s.type==="Soil Moisture").length||1)).toFixed(1)}%`} color="var(--leaf-mid)" />
            <StatCard icon="🌡" label="Avg Temp" value={`${(sensors.filter(s=>s.type==="Temperature").reduce((a,s)=>a+Number(s.value),0)/(sensors.filter(s=>s.type==="Temperature").length||1)).toFixed(1)}°C`} color="var(--sun)" />
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:20 }}>
            {sensors.map(s => <SensorGauge key={s.id} s={s} />)}
          </div>
          <div className="table-wrap">
            <table><thead><tr><th>ID</th><th>Type</th><th>Value</th><th>Field</th><th>Status</th><th>Updated</th></tr></thead>
              <tbody>{sensors.map(s=>(
                <tr key={s.id}>
                  <td style={{ fontFamily:"'DM Mono',monospace",fontSize:11,color:"var(--text-soft)" }}>S-{String(s.id).padStart(3,"0")}</td>
                  <td style={{ fontWeight:500 }}>{s.type}</td>
                  <td><span style={{ fontFamily:"'DM Mono',monospace",fontWeight:600,color:"var(--leaf)" }}>{s.value} {s.unit}</span></td>
                  <td>{s.field_name}</td>
                  <td>{s.status==="alert"?<span className="badge badge-red">⚠ Alert</span>:<span className="badge badge-green">● Normal</span>}</td>
                  <td style={{ fontSize:11,color:"var(--text-soft)" }}>{s.last_update_fmt}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

/* ── IRRIGATION ── */
function Irrigation() {
  const [irrs,   setIrrs]   = useState([]);
  const [fields, setFields] = useState([]);
  const [error,  setError]  = useState("");
  const [loading,setLoading]= useState(true);
  const [showModal,setShowModal]=useState(false);
  const [form, setForm] = useState({ field:"", date:"", time:"06:00", duration:30, method:"Drip", status:"Scheduled" });

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([apiGet("/irrigations"), apiGet("/fields")])
      .then(([ir, fi]) => { setIrrs(ir); setFields(fi); })
      .catch(e=>setError(e.message))
      .finally(()=>setLoading(false));
  }, []);
  useEffect(load, [load]);

  const save = async () => {
    if (!form.field || !form.date) return;
    try { await apiPost("/irrigations", { ...form, duration:+form.duration }); setShowModal(false); load(); }
    catch(e) { setError(e.message); }
  };

  const updateStatus = async (id, status) => {
    try { await apiPatch(`/irrigations/${id}/status`, { status }); load(); }
    catch(e) { setError(e.message); }
  };

  return (
    <div className="fade-in">
      <div className="section-header">
        <div><h1 className="section-title">💧 Irrigation Management</h1><p className="section-sub">MySQL: irrigations table</p></div>
        <button className="btn btn-primary" onClick={()=>setShowModal(true)}>＋ Schedule</button>
      </div>
      <ErrorBanner msg={error} />
      {loading ? <div className="loading-row">⏳ Loading...</div> : (
        <>
          <div className="grid-4" style={{ marginBottom:16 }}>
            <StatCard icon="📅" label="Scheduled" value={irrs.filter(i=>i.status==="Scheduled").length} color="var(--sky-deep)" />
            <StatCard icon="✅" label="Completed" value={irrs.filter(i=>i.status==="Completed").length} color="var(--leaf)" />
            <StatCard icon="💧" label="Water Used" value={`${(irrs.filter(i=>i.status==="Completed").reduce((a,i)=>a+i.duration*15,0)/1000).toFixed(1)}KL`} color="var(--leaf-mid)" />
            <StatCard icon="❌" label="Cancelled"  value={irrs.filter(i=>i.status==="Cancelled").length} color="var(--danger)" />
          </div>
          <div className="table-wrap">
            <table><thead><tr><th>Field</th><th>Date</th><th>Time</th><th>Duration</th><th>Method</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>{irrs.map(i=>(
                <tr key={i.id}>
                  <td style={{ fontWeight:500 }}>{i.field}</td>
                  <td style={{ fontFamily:"'DM Mono',monospace",fontSize:12 }}>{i.date?.split("T")[0]}</td>
                  <td style={{ fontFamily:"'DM Mono',monospace",fontSize:12 }}>{i.time}</td>
                  <td>{i.duration} min</td>
                  <td><span className="badge badge-blue">{i.method}</span></td>
                  <td>{i.status==="Completed"?<span className="badge badge-green">✓ Done</span>:i.status==="Cancelled"?<span className="badge badge-red">✕ Cancelled</span>:<span className="badge badge-yellow">● Scheduled</span>}</td>
                  <td>{i.status==="Scheduled"&&(
                    <div style={{ display:"flex", gap:4 }}>
                      <button className="btn btn-secondary btn-sm" onClick={()=>updateStatus(i.id,"Completed")}>✓</button>
                      <button className="btn btn-danger btn-sm"    onClick={()=>updateStatus(i.id,"Cancelled")}>✕</button>
                    </div>
                  )}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </>
      )}
      {showModal && (
        <Modal title="Schedule Irrigation" onClose={()=>setShowModal(false)}>
          <div className="form-group"><label>Field</label>
            <select value={form.field} onChange={e=>setForm({...form,field:e.target.value})}>
              <option value="">Select Field</option>
              {fields.map(f=><option key={f.id}>{f.name}</option>)}
            </select>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Date</label><input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} /></div>
            <div className="form-group"><label>Start Time</label><input type="time" value={form.time} onChange={e=>setForm({...form,time:e.target.value})} /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Duration (min)</label><input type="number" value={form.duration} onChange={e=>setForm({...form,duration:e.target.value})} /></div>
            <div className="form-group"><label>Method</label>
              <select value={form.method} onChange={e=>setForm({...form,method:e.target.value})}>
                {["Drip","Sprinkler","Flood","Manual"].map(m=><option key={m}>{m}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button className="btn btn-primary" onClick={save}>✓ Save to MySQL</button>
            <button className="btn btn-secondary" onClick={()=>setShowModal(false)}>Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ── LIVESTOCK ── */
function Livestock() {
  const [animals,setAnimals]=useState([]);
  const [error,  setError]  =useState("");
  const [loading,setLoading]=useState(true);
  const [showModal,setShowModal]=useState(false);
  const [form,setForm]=useState({tag:"",species:"Cow",breed:"",age:"",gender:"Female",weight:"",status:"Healthy",milk:0});

  const load=useCallback(()=>{
    apiGet("/livestock").then(setAnimals).catch(e=>setError(e.message)).finally(()=>setLoading(false));
  },[]);
  useEffect(load,[load]);

  const save=async()=>{
    if(!form.tag)return;
    try{await apiPost("/livestock",{...form,weight:+form.weight,milk:+form.milk});setShowModal(false);load();}
    catch(e){setError(e.message);}
  };

  return (
    <div className="fade-in">
      <div className="section-header">
        <div><h1 className="section-title">🐄 Livestock Management</h1><p className="section-sub">MySQL: livestock table</p></div>
        <button className="btn btn-primary" onClick={()=>setShowModal(true)}>＋ Register Animal</button>
      </div>
      <ErrorBanner msg={error} />
      {loading?<div className="loading-row">⏳ Loading...</div>:(
        <>
          <div className="grid-4" style={{ marginBottom:16 }}>
            <StatCard icon="🐄" label="Total"      value={animals.length} color="var(--earth)" />
            <StatCard icon="🥛" label="Daily Milk" value={`${animals.reduce((a,l)=>a+Number(l.milk),0).toFixed(1)}L`} color="var(--sky-deep)" />
            <StatCard icon="✅" label="Healthy"    value={animals.filter(a=>a.status==="Healthy").length} color="var(--leaf)" />
            <StatCard icon="💊" label="Treatment"  value={animals.filter(a=>a.status==="Under Treatment").length} color="var(--danger)" />
          </div>
          <div className="grid-3">
            {animals.map(a=>(
              <div key={a.id} className="card">
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                  <div>
                    <div style={{ fontFamily:"'DM Mono',monospace",fontSize:12,color:"var(--text-soft)" }}>{a.tag}</div>
                    <div style={{ fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:600 }}>{a.species} — {a.breed}</div>
                  </div>
                  <span className={`badge ${a.status==="Healthy"?"badge-green":"badge-red"}`}>{a.status}</span>
                </div>
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,fontSize:12,color:"var(--text-mid)" }}>
                  <div>🎂 Age: <strong>{a.age}</strong></div>
                  <div>⚖️ {a.weight} kg</div>
                  {a.milk>0 && <div>🥛 {a.milk} L/day</div>}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      {showModal&&(
        <Modal title="Register Animal" onClose={()=>setShowModal(false)}>
          <div className="form-row">
            <div className="form-group"><label>Tag No</label><input value={form.tag} onChange={e=>setForm({...form,tag:e.target.value})} placeholder="COW-004" /></div>
            <div className="form-group"><label>Species</label>
              <select value={form.species} onChange={e=>setForm({...form,species:e.target.value})}>
                {["Cow","Buffalo","Goat","Sheep","Pig","Poultry"].map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Breed</label><input value={form.breed} onChange={e=>setForm({...form,breed:e.target.value})} /></div>
            <div className="form-group"><label>Age</label><input value={form.age} onChange={e=>setForm({...form,age:e.target.value})} placeholder="3y 6m" /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Weight (kg)</label><input type="number" value={form.weight} onChange={e=>setForm({...form,weight:e.target.value})} /></div>
            <div className="form-group"><label>Daily Milk (L)</label><input type="number" value={form.milk} onChange={e=>setForm({...form,milk:e.target.value})} /></div>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button className="btn btn-primary" onClick={save}>✓ Save to MySQL</button>
            <button className="btn btn-secondary" onClick={()=>setShowModal(false)}>Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ── MARKET ── */
function Market() {
  const [prices, setPrices] = useState([]);
  const [sales,  setSales]  = useState([]);
  const [error,  setError]  = useState("");
  const [loading,setLoading]= useState(true);
  const [showModal,setShowModal]=useState(false);
  const [form,setForm]=useState({crop:"",qty:"",price:"",buyer:"",mode:"Cash",date:new Date().toISOString().split("T")[0]});

  const load=useCallback(()=>{
    setLoading(true);
    Promise.all([apiGet("/market-prices"),apiGet("/sales")])
      .then(([pr,sa])=>{setPrices(pr);setSales(sa);})
      .catch(e=>setError(e.message))
      .finally(()=>setLoading(false));
  },[]);
  useEffect(load,[load]);

  const save=async()=>{
    if(!form.crop||!form.qty)return;
    try{await apiPost("/sales",{...form,qty:+form.qty,price:+form.price});setShowModal(false);load();}
    catch(e){setError(e.message);}
  };

  const totalRev=sales.reduce((a,s)=>a+Number(s.total),0);

  return (
    <div className="fade-in">
      <div className="section-header">
        <div><h1 className="section-title">📊 Market & Sales</h1><p className="section-sub">MySQL: market_prices & sales tables</p></div>
        <button className="btn btn-primary" onClick={()=>setShowModal(true)}>＋ Record Sale</button>
      </div>
      <ErrorBanner msg={error} />
      {loading?<div className="loading-row">⏳ Loading...</div>:(
        <>
          <div className="grid-4" style={{ marginBottom:18 }}>
            <StatCard icon="💰" label="Total Revenue" value={`₹${(totalRev/1000).toFixed(1)}K`} color="var(--leaf)" />
            <StatCard icon="📦" label="Transactions"  value={sales.length} color="var(--leaf-mid)" />
            <StatCard icon="📈" label="Tracked Crops" value={prices.length} color="var(--sky-deep)" />
            <StatCard icon="🌾" label="Qty Sold"       value={`${sales.reduce((a,s)=>a+Number(s.qty),0).toLocaleString()}kg`} color="var(--earth)" />
          </div>
          <div className="grid-2">
            <div>
              <h3 style={{ fontFamily:"'Playfair Display',serif",fontSize:15,marginBottom:12,color:"var(--soil)" }}>Live Prices from MySQL</h3>
              {prices.map(m=>(
                <div key={m.id} className="card" style={{ padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8 }}>
                  <div>
                    <div style={{ fontWeight:600 }}>{m.crop}</div>
                    <div style={{ fontSize:11,color:"var(--text-soft)" }}>📍 {m.market}</div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontFamily:"'DM Mono',monospace",fontSize:17,fontWeight:600,color:"var(--leaf)" }}>₹{m.price}<span style={{ fontSize:11,fontWeight:400 }}>/kg</span></div>
                    <div className={m.trend==="up"?"market-up":"market-down"} style={{ fontSize:12,fontWeight:600 }}>
                      {m.trend==="up"?"↑ +":"↓ "}{Math.abs(m.change)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <h3 style={{ fontFamily:"'Playfair Display',serif",fontSize:15,marginBottom:12,color:"var(--soil)" }}>Sales Transactions</h3>
              <div className="table-wrap">
                <table><thead><tr><th>Crop</th><th>Qty</th><th>Rate</th><th>Total</th><th>Date</th></tr></thead>
                  <tbody>{sales.map(s=>(
                    <tr key={s.id}>
                      <td style={{ fontWeight:500 }}>{s.crop}</td>
                      <td style={{ fontFamily:"'DM Mono',monospace",fontSize:12 }}>{Number(s.qty).toLocaleString()} kg</td>
                      <td style={{ fontFamily:"'DM Mono',monospace",fontSize:12 }}>₹{s.price}</td>
                      <td style={{ fontFamily:"'DM Mono',monospace",fontWeight:600,color:"var(--leaf)" }}>₹{Number(s.total).toLocaleString()}</td>
                      <td style={{ fontSize:12,color:"var(--text-soft)" }}>{s.date?.split("T")[0]}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
      {showModal&&(
        <Modal title="Record Sale" onClose={()=>setShowModal(false)}>
          <div className="form-row">
            <div className="form-group"><label>Crop</label><input value={form.crop} onChange={e=>setForm({...form,crop:e.target.value})} /></div>
            <div className="form-group"><label>Date</label><input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Qty (kg)</label><input type="number" value={form.qty} onChange={e=>setForm({...form,qty:e.target.value})} /></div>
            <div className="form-group"><label>Price/kg (₹)</label><input type="number" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Buyer</label><input value={form.buyer} onChange={e=>setForm({...form,buyer:e.target.value})} /></div>
            <div className="form-group"><label>Payment Mode</label>
              <select value={form.mode} onChange={e=>setForm({...form,mode:e.target.value})}>
                {["Cash","Bank Transfer","UPI","Credit"].map(m=><option key={m}>{m}</option>)}
              </select>
            </div>
          </div>
          {form.qty&&form.price&&<div style={{ background:"var(--mint)",borderRadius:8,padding:"10px 14px",fontSize:13,marginBottom:12 }}>💰 Total: <strong>₹{(+form.qty * +form.price).toLocaleString()}</strong></div>}
          <div style={{ display:"flex", gap:8 }}>
            <button className="btn btn-primary" onClick={save}>✓ Save to MySQL</button>
            <button className="btn btn-secondary" onClick={()=>setShowModal(false)}>Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ── AI ADVISOR ── */
function AIAdvisor() {
  const [dbData,  setDbData]  = useState(null);
  const [messages,setMessages]= useState([
    { role:"ai", text:"👋 Hello! I'm your AI Farm Advisor. I'll load your live MySQL farm data to give you personalized advice. Click the button above to connect, or start asking questions!" }
  ]);
  const [input,   setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const [dbLoaded,setDbLoaded]= useState(false);
  const chatRef = useRef(null);

  const loadDbContext = async () => {
    try {
      const [summary, crops, sensors, prices, livestock] = await Promise.all([
        apiGet("/dashboard"), apiGet("/crops"), apiGet("/sensors"),
        apiGet("/market-prices"), apiGet("/livestock")
      ]);
      setDbData({ summary, crops, sensors, prices, livestock });
      setDbLoaded(true);
      setMessages(m => [...m, {
        role:"ai",
        text:`✅ Connected to your MySQL database!\n\n📊 Loaded:\n• ${summary.farms} farms, ${summary.activeCrops} active crops\n• ${summary.sensors} sensors (${summary.alerts} alerts)\n• ${livestock.length} animals\n• ${prices.length} market prices\n\nNow ask me anything specific to your farm!`
      }]);
    } catch(e) {
      setMessages(m => [...m, { role:"ai", text:`⚠️ Could not load MySQL data: ${e.message}\nIs your FastAPI running at ${API}?` }]);
    }
  };

  const send = async () => {
    if (!input.trim() || loading) return;
    const msg = input.trim(); setInput("");
    setMessages(m => [...m, { role:"user", text:msg }]);
    setLoading(true);
    try {
      // Pass live MySQL data as context to the local Q&A engine
      const reply = await callAI(dbData, msg);
      setMessages(m => [...m, { role:"ai", text:reply }]);
    } catch(e) {
      setMessages(m => [...m, { role:"ai", text:"⚠️ Something went wrong. Please try again." }]);
    }
    setLoading(false);
  };

  useEffect(()=>{ chatRef.current?.scrollTo({top:99999,behavior:"smooth"}); },[messages,loading]);

  const quickQ = [
    "What fertilizer should I apply for rice?",
    "Is now a good time to sell tomatoes?",
    "How can I reduce water consumption?",
    "What pests should I watch for in my crops?",
    "What is the ideal soil pH for farming?",
    "What government schemes are available for farmers?",
    "When should I harvest wheat?",
    "How do I manage livestock health?",
  ];

  return (
    <div className="fade-in">
      <div className="section-header">
        <div><h1 className="section-title">🤖 AI Farm Advisor</h1><p className="section-sub">Smart Q&A Engine · Tamil Nadu Farming Expert · No API key needed</p></div>
        <button className="btn btn-primary" onClick={loadDbContext} disabled={dbLoaded}>
          {dbLoaded ? "✅ MySQL Data Loaded" : "🔌 Load Live Farm Data"}
        </button>
      </div>
      <div className="grid-2" style={{ gap:20 }}>
        <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
          <div ref={chatRef} style={{ background:"var(--card)",border:"1px solid var(--border)",borderRadius:16,padding:16,height:440,overflowY:"auto",display:"flex",flexDirection:"column",gap:10 }}>
            {messages.map((m,i)=>(
              <div key={i} style={{ display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start" }}>
                {m.role==="ai"&&<div style={{ width:28,height:28,borderRadius:"50%",background:"var(--leaf)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,marginRight:8,flexShrink:0,alignSelf:"flex-start",marginTop:2 }}>🤖</div>}
                <div className={`chat-bubble ${m.role}`} style={{ whiteSpace:"pre-wrap" }}>{m.text}</div>
              </div>
            ))}
            {loading&&(
              <div style={{ display:"flex",alignItems:"center" }}>
                <div style={{ width:28,height:28,borderRadius:"50%",background:"var(--leaf)",display:"flex",alignItems:"center",justifyContent:"center",marginRight:8 }}>🤖</div>
                <div className="chat-bubble ai" style={{ padding:0 }}><div className="ai-typing"><span/><span/><span/></div></div>
              </div>
            )}
          </div>
          <div style={{ display:"flex",gap:8 }}>
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Ask about your crops, sensors, market..." />
            <button className="btn btn-primary" onClick={send} disabled={loading||!input.trim()}>→</button>
          </div>
        </div>
        <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
          <div className="card">
            <h3 style={{ fontFamily:"'Playfair Display',serif",fontSize:15,marginBottom:10,color:"var(--soil)" }}>💡 Quick Questions</h3>
            {quickQ.map(q=>(
              <button key={q} className="btn btn-secondary" style={{ width:"100%",textAlign:"left",justifyContent:"flex-start",fontSize:12,padding:"8px 12px",marginBottom:4 }} onClick={()=>setInput(q)}>
                💬 {q}
              </button>
            ))}
          </div>
          <div className="card">
            <h3 style={{ fontFamily:"'Playfair Display',serif",fontSize:15,marginBottom:8,color:"var(--soil)" }}>🔌 Data Source</h3>
            <div style={{ fontSize:12,color:"var(--text-mid)",display:"flex",flexDirection:"column",gap:4 }}>
              <div>{dbLoaded ? "✅" : "⭕"} MySQL Database ({dbLoaded ? "connected" : "not loaded"})</div>
              <div style={{ fontFamily:"'DM Mono',monospace",fontSize:11,background:"var(--cream)",padding:"6px 10px",borderRadius:8,marginTop:4 }}>{API}</div>
              {dbData&&<>
                <div>✅ {dbData.summary.farms} farms · {dbData.summary.activeCrops} crops</div>
                <div>✅ {dbData.sensors.length} sensors · {dbData.summary.alerts} alerts</div>
                <div>✅ {dbData.livestock.length} animals</div>
              </>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MAIN APP
══════════════════════════════════════════════ */
const NAV = [
  {id:"dashboard", label:"Dashboard",  icon:"🏡"},
  {id:"farms",     label:"Farms",      icon:"🌾"},
  {id:"crops",     label:"Crops",      icon:"🌱"},
  {id:"sensors",   label:"Sensors",    icon:"📡"},
  {id:"irrigation",label:"Irrigation", icon:"💧"},
  {id:"livestock", label:"Livestock",  icon:"🐄"},
  {id:"market",    label:"Market",     icon:"📊"},
  {id:"ai",        label:"AI Advisor", icon:"🤖"},
];

export default function App() {
  const [page, setPage]   = useState("dashboard");
  const [open, setOpen]   = useState(true);

  return (
    <>
      <FontLink />
      <div style={{ display:"flex", minHeight:"100vh" }}>
        {/* SIDEBAR */}
        <div style={{ width:open?220:64, flexShrink:0, transition:"width .25s ease",
          background:"var(--leaf-dark)", display:"flex", flexDirection:"column",
          position:"sticky", top:0, height:"100vh", overflow:"hidden" }}>
          <div style={{ padding:"18px 14px 14px", borderBottom:"1px solid rgba(255,255,255,.1)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontSize:26, flexShrink:0 }}>🌿</span>
              {open && <div>
                <div style={{ fontFamily:"'Playfair Display',serif", color:"#fff", fontSize:17, fontWeight:700 }}>FarmIQ</div>
                <div style={{ fontSize:10, color:"var(--mint)", letterSpacing:"1px" }}>SMART FARMING</div>
              </div>}
            </div>
          </div>
          <nav style={{ flex:1, padding:"10px 8px", overflowY:"auto" }}>
            {NAV.map(n => (
              <button key={n.id} className={`sidebar-nav-item ${page===n.id?"active":""}`}
                onClick={()=>setPage(n.id)}
                style={{ justifyContent: open?"flex-start":"center" }}>
                <span style={{ fontSize:18, flexShrink:0 }}>{n.icon}</span>
                {open && <span>{n.label}</span>}
                {n.id==="ai" && open && <span style={{ marginLeft:"auto", background:"var(--sun)", color:"#fff", borderRadius:10, fontSize:10, padding:"1px 7px", fontWeight:700 }}>AI</span>}
              </button>
            ))}
          </nav>
          <div style={{ padding:"10px 8px", borderTop:"1px solid rgba(255,255,255,.1)" }}>
            <button className="sidebar-nav-item" onClick={()=>setOpen(!open)} style={{ justifyContent:open?"flex-start":"center" }}>
              <span style={{ fontSize:16 }}>{open?"◀":"▶"}</span>
              {open && <span style={{ fontSize:12 }}>Collapse</span>}
            </button>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0 }}>
          <div style={{ background:"var(--card)", borderBottom:"1px solid var(--border)", padding:"12px 24px",
            display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:10 }}>
            <div style={{ fontSize:13, color:"var(--text-soft)" }}>
              {NAV.find(n=>n.id===page)?.icon} {NAV.find(n=>n.id===page)?.label}
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:10, fontSize:12, color:"var(--text-mid)" }}>
              <div className="pulse-dot" style={{ width:6,height:6 }} />
              <span>MySQL · FastAPI · {API}</span>
            </div>
          </div>
          <div style={{ flex:1, padding:"24px 24px 48px", maxWidth:1280, width:"100%" }}>
            {page==="dashboard"  && <Dashboard  />}
            {page==="farms"      && <Farms      />}
            {page==="crops"      && <Crops      />}
            {page==="sensors"    && <Sensors    />}
            {page==="irrigation" && <Irrigation />}
            {page==="livestock"  && <Livestock  />}
            {page==="market"     && <Market     />}
            {page==="ai"         && <AIAdvisor  />}
          </div>
        </div>
      </div>
    </>
  );
}
