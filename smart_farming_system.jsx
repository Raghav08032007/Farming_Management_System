import { useState, useEffect, useRef, useCallback } from "react";

/* ─── GOOGLE FONTS ─── */
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
      --accent:    #9b59b6;
    }

    body { font-family: 'DM Sans', sans-serif; background: var(--bg); color: var(--text); overflow-x: hidden; }
    
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: var(--cream); }
    ::-webkit-scrollbar-thumb { background: var(--sand); border-radius: 3px; }

    .fade-in { animation: fadeIn 0.4s ease both; }
    @keyframes fadeIn { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }

    .pulse-dot { width:8px; height:8px; border-radius:50%; background:var(--leaf-mid); animation: pulse 2s infinite; }
    @keyframes pulse { 0%,100%{box-shadow:0 0 0 0 rgba(64,145,108,0.5)} 50%{box-shadow:0 0 0 6px rgba(64,145,108,0)} }

    .shimmer { background: linear-gradient(90deg, var(--cream) 25%, var(--straw) 50%, var(--cream) 75%);
      background-size: 200% 100%; animation: shimmer 1.5s infinite; }
    @keyframes shimmer { from{background-position:200% 0} to{background-position:-200% 0} }

    .card { background:var(--card); border:1px solid var(--border); border-radius:16px; padding:20px;
      box-shadow:0 2px 12px rgba(61,43,31,0.08); transition: box-shadow 0.2s, transform 0.2s; }
    .card:hover { box-shadow:0 6px 24px rgba(61,43,31,0.14); }

    .btn { display:inline-flex; align-items:center; gap:6px; padding:9px 18px; border-radius:10px;
      font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500; cursor:pointer;
      border:none; transition:all 0.15s; white-space:nowrap; }
    .btn-primary { background:var(--leaf); color:#fff; }
    .btn-primary:hover { background:var(--leaf-dark); transform:translateY(-1px); }
    .btn-secondary { background:var(--cream); color:var(--earth); border:1px solid var(--border); }
    .btn-secondary:hover { background:var(--straw); }
    .btn-danger { background:#fde8e8; color:var(--danger); border:1px solid #f5c6c6; }
    .btn-danger:hover { background:#f8c8c8; }
    .btn-sun { background:linear-gradient(135deg,var(--sun),#e76f51); color:#fff; }
    .btn-sun:hover { filter:brightness(1.05); transform:translateY(-1px); }
    .btn:disabled { opacity:0.5; cursor:not-allowed; transform:none !important; }
    .btn-sm { padding:6px 12px; font-size:12px; }
    .btn-lg { padding:12px 28px; font-size:15px; font-weight:600; }

    input, select, textarea {
      font-family:'DM Sans',sans-serif; font-size:13px; color:var(--text);
      background:var(--cream); border:1px solid var(--border); border-radius:10px;
      padding:9px 14px; width:100%; transition:border-color 0.15s, box-shadow 0.15s; outline:none;
    }
    input:focus, select:focus, textarea:focus {
      border-color:var(--leaf-mid); box-shadow:0 0 0 3px rgba(64,145,108,0.15);
    }
    label { font-size:12px; font-weight:600; color:var(--text-mid); margin-bottom:4px; display:block; text-transform:uppercase; letter-spacing:0.5px; }

    .badge { display:inline-flex; align-items:center; gap:4px; padding:3px 10px;
      border-radius:20px; font-size:11px; font-weight:600; }
    .badge-green  { background:#d8f3dc; color:var(--leaf-dark); }
    .badge-yellow { background:#fff3cd; color:#856404; }
    .badge-red    { background:#fde8e8; color:#c0392b; }
    .badge-blue   { background:#d0ebff; color:var(--sky-deep); }
    .badge-earth  { background:#f0e6d3; color:var(--earth); }

    .sidebar-nav-item { display:flex; align-items:center; gap:10px; padding:10px 14px;
      border-radius:10px; cursor:pointer; font-size:13px; font-weight:500; color:var(--text-mid);
      transition:all 0.15s; border:none; background:none; width:100%; text-align:left; }
    .sidebar-nav-item:hover { background:var(--mint); color:var(--leaf-dark); }
    .sidebar-nav-item.active { background:var(--leaf); color:#fff; }
    .sidebar-nav-item.active .nav-icon { filter:brightness(2); }

    .stat-card { background:var(--card); border:1px solid var(--border); border-radius:14px;
      padding:18px 20px; display:flex; flex-direction:column; gap:6px; }

    .table-wrap { overflow-x:auto; border-radius:12px; border:1px solid var(--border); }
    table { width:100%; border-collapse:collapse; }
    th { background:var(--leaf-dark); color:#fff; padding:11px 16px; text-align:left;
      font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.6px; }
    td { padding:10px 16px; font-size:13px; border-bottom:1px solid var(--border); }
    tr:last-child td { border-bottom:none; }
    tr:nth-child(even) td { background:#faf6f0; }
    tr:hover td { background:var(--mint); }

    .sensor-gauge { position:relative; display:flex; flex-direction:column; align-items:center; gap:4px; }
    .gauge-ring { width:80px; height:80px; border-radius:50%; display:flex;
      align-items:center; justify-content:center; position:relative; }
    .gauge-val { font-family:'DM Mono',monospace; font-size:16px; font-weight:500; }

    .chat-bubble { padding:12px 16px; border-radius:14px; max-width:85%; font-size:13px; line-height:1.6; }
    .chat-bubble.user { background:var(--leaf); color:#fff; border-bottom-right-radius:4px; margin-left:auto; }
    .chat-bubble.ai { background:var(--card); border:1px solid var(--border); border-bottom-left-radius:4px; }

    .progress-bar { height:8px; border-radius:4px; background:var(--straw); overflow:hidden; }
    .progress-fill { height:100%; border-radius:4px; transition:width 0.8s ease; }

    .weather-card { background:linear-gradient(135deg, #1b6ca8, #89c2d9); color:#fff;
      border-radius:16px; padding:20px; }

    .market-up { color:var(--leaf-mid); }
    .market-down { color:var(--danger); }

    .section-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:18px; flex-wrap:wrap; gap:10px; }
    .section-title { font-family:'Playfair Display',serif; font-size:22px; font-weight:600; color:var(--soil); }
    .section-sub { font-size:13px; color:var(--text-soft); margin-top:2px; }

    .grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
    .grid-3 { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
    .grid-4 { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; }
    @media(max-width:900px) { .grid-4,.grid-3 { grid-template-columns:1fr 1fr; } .grid-2 { grid-template-columns:1fr; } }
    @media(max-width:600px) { .grid-4,.grid-3,.grid-2 { grid-template-columns:1fr; } }

    .modal-bg { position:fixed; inset:0; background:rgba(61,43,31,0.5); z-index:100;
      display:flex; align-items:center; justify-content:center; padding:16px; backdrop-filter:blur(4px); }
    .modal { background:var(--card); border-radius:20px; padding:28px; width:100%; max-width:520px;
      max-height:90vh; overflow-y:auto; box-shadow:0 20px 60px rgba(0,0,0,0.25); animation:fadeIn 0.25s ease; }
    .modal-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; }
    .modal-title { font-family:'Playfair Display',serif; font-size:20px; font-weight:600; }
    .form-row { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
    .form-group { display:flex; flex-direction:column; gap:4px; margin-bottom:14px; }

    .ai-typing { display:flex; gap:4px; align-items:center; padding:12px 16px; }
    .ai-typing span { width:8px; height:8px; background:var(--sand); border-radius:50%;
      animation: typing 1.4s infinite; }
    .ai-typing span:nth-child(2) { animation-delay:0.2s; }
    .ai-typing span:nth-child(3) { animation-delay:0.4s; }
    @keyframes typing { 0%,80%,100%{transform:scale(0.8);opacity:0.5} 40%{transform:scale(1.1);opacity:1} }

    .nav-logo { font-family:'Playfair Display',serif; font-size:18px; font-weight:700; }
    .hero-bg { background:linear-gradient(135deg, var(--leaf-dark) 0%, var(--leaf) 60%, var(--leaf-mid) 100%); }
  `}</style>
);

/* ─── SEED DATA ─── */
const INIT = {
  farmers: [
    { id: 1, name: "Rajan Murugan", phone: "9876543210", email: "rajan@farm.in", district: "Thanjavur", state: "Tamil Nadu" },
    { id: 2, name: "Selvi Krishnan", phone: "9765432101", email: "selvi@farm.in", district: "Coimbatore", state: "Tamil Nadu" },
  ],
  farms: [
    { id: 1, name: "Green Paddy Farm", location: "Papanasam", area: 12.5, soilType: "Black", farmerId: 1 },
    { id: 2, name: "Mango Grove", location: "Pollachi", area: 8.25, soilType: "Red", farmerId: 2 },
  ],
  fields: [
    { id: 1, name: "North Paddy Field", area: 3.5, irrigation: "Drip", farmId: 1, crop: "Rice" },
    { id: 2, name: "South Field A", area: 2.8, irrigation: "Sprinkler", farmId: 1, crop: "Wheat" },
    { id: 3, name: "Mango Orchard", area: 5.0, irrigation: "Flood", farmId: 2, crop: "Mango" },
    { id: 4, name: "Vegetable Patch", area: 1.5, irrigation: "Drip", farmId: 1, crop: "Tomato" },
  ],
  crops: [
    { id: 1, name: "Rice (Kuruvai)", stage: "Vegetative", sowDate: "2025-06-15", harvest: "2025-10-15", yieldKg: 4850, status: "Active", fieldId: 1 },
    { id: 2, name: "Wheat (HD-3086)", stage: "Ripening", sowDate: "2025-11-01", harvest: "2026-03-01", yieldKg: null, status: "Active", fieldId: 2 },
    { id: 3, name: "Alphonso Mango", stage: "Flowering", sowDate: "2025-01-10", harvest: "2026-05-01", yieldKg: null, status: "Active", fieldId: 3 },
    { id: 4, name: "Tomato (Hybrid)", stage: "Fruiting", sowDate: "2025-12-01", harvest: "2026-02-28", yieldKg: null, status: "Active", fieldId: 4 },
  ],
  sensors: [
    { id: 1, type: "Soil Moisture", value: 42.5, unit: "%", status: "normal", fieldId: 1, lastUpdate: "2 min ago" },
    { id: 2, type: "Temperature", value: 28.3, unit: "°C", status: "normal", fieldId: 1, lastUpdate: "1 min ago" },
    { id: 3, type: "Soil pH", value: 6.8, unit: "pH", status: "normal", fieldId: 2, lastUpdate: "5 min ago" },
    { id: 4, type: "Humidity", value: 72.1, unit: "%", status: "normal", fieldId: 2, lastUpdate: "3 min ago" },
    { id: 5, type: "Soil Moisture", value: 24.2, unit: "%", status: "alert", fieldId: 3, lastUpdate: "1 min ago" },
    { id: 6, type: "Rainfall", value: 8.4, unit: "mm", status: "normal", fieldId: 4, lastUpdate: "10 min ago" },
  ],
  irrigations: [
    { id: 1, field: "North Paddy Field", date: "2026-03-12", time: "06:00", duration: 45, method: "Drip", status: "Scheduled" },
    { id: 2, field: "South Field A", date: "2026-03-11", time: "07:30", duration: 30, method: "Sprinkler", status: "Completed" },
    { id: 3, field: "Vegetable Patch", date: "2026-03-13", time: "05:45", duration: 20, method: "Drip", status: "Scheduled" },
  ],
  livestock: [
    { id: 1, tag: "COW-001", species: "Cow", breed: "Gir", age: "4y", gender: "Female", weight: 380, status: "Healthy", milk: 12.5 },
    { id: 2, tag: "BUF-002", species: "Buffalo", breed: "Murrah", age: "5y", gender: "Female", weight: 520, status: "Healthy", milk: 8.2 },
    { id: 3, tag: "GOT-003", species: "Goat", breed: "Boer", age: "2y", gender: "Male", weight: 65, status: "Under Treatment", milk: 0 },
  ],
  marketPrices: [
    { crop: "Rice", price: 22.50, change: +1.2, market: "Thanjavur APMC", trend: "up" },
    { crop: "Wheat", price: 21.80, change: -0.5, market: "Coimbatore APMC", trend: "down" },
    { crop: "Tomato", price: 35.00, change: +8.5, market: "Chennai Koyambedu", trend: "up" },
    { crop: "Mango", price: 85.00, change: +12.0, market: "Madurai APMC", trend: "up" },
    { crop: "Sugarcane", price: 3.80, change: -0.1, market: "Erode APMC", trend: "down" },
  ],
  weather: {
    temp: 31, humidity: 68, rainfall: 0, windSpeed: 12,
    condition: "Partly Cloudy", uvIndex: 7, forecast: [
      { day: "Tomorrow", icon: "🌤", high: 33, low: 24 },
      { day: "Thu", icon: "🌧", high: 28, low: 22 },
      { day: "Fri", icon: "⛅", high: 30, low: 23 },
      { day: "Sat", icon: "☀️", high: 34, low: 25 },
    ]
  },
  sales: [
    { id: 1, crop: "Rice", qty: 4850, price: 22.50, total: 109125, buyer: "APMC Thanjavur", date: "2025-10-14", mode: "Bank Transfer" },
    { id: 2, crop: "Tomato", qty: 320, price: 32.00, total: 10240, buyer: "Local Market", date: "2026-01-15", mode: "Cash" },
  ]
};

/* ─── AI BACKEND CALL ─── */
async function callAI(systemPrompt, userMessage) {
  const
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage }
        ]
      })
    });
    const data = await res.json();
    return data.choices?.[0]?.message?.content || "No response selection.";
  } catch (error) {
    console.error("AI Error:", error);
    return "Error connecting to OpenAI. Please check your API key.";
  }
}

/* ─── ICONS ─── */
const Icon = ({ name, size = 16 }) => {
  const icons = {
    dashboard: "🏡", farm: "🌾", crop: "🌱", sensor: "📡", irrigation: "💧",
    livestock: "🐄", market: "📊", weather: "🌤", ai: "🤖", alert: "⚠️",
    add: "＋", edit: "✏️", delete: "🗑", close: "✕", check: "✓",
    up: "↑", down: "↓", leaf: "🍃", sun: "☀️", rain: "🌧",
    user: "👤", settings: "⚙️", sale: "💰", refresh: "↻", send: "→",
    chart: "📈", water: "🫧", temp: "🌡", humid: "💦", ph: "⚗️",
    cow: "🐄", pig: "🐷", goat: "🐐", seed: "🌰", harvest: "🌾",
  };
  return <span style={{ fontSize: size, lineHeight: 1 }}>{icons[name] || "•"}</span>;
};

/* ─── STAT CARD ─── */
function StatCard({ icon, label, value, sub, color = "var(--leaf)", badge }) {
  return (
    <div className="stat-card fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ fontSize: 28 }}>{icon}</div>
        {badge && <span className={`badge badge-${badge.type}`}>{badge.label}</span>}
      </div>
      <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 26, fontWeight: 500, color, marginTop: 4 }}>{value}</div>
      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-mid)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: "var(--text-soft)" }}>{sub}</div>}
    </div>
  );
}

/* ─── SENSOR GAUGE ─── */
function SensorGauge({ sensor }) {
  const pct = sensor.type === "Soil pH" ? (sensor.value / 14) * 100
    : sensor.type === "Rainfall" ? Math.min(sensor.value / 50 * 100, 100)
      : Math.min(sensor.value, 100);
  const color = sensor.status === "alert" ? "var(--danger)"
    : pct > 70 ? "var(--leaf-mid)" : pct > 40 ? "var(--sun)" : "var(--danger)";
  const bg = `conic-gradient(${color} ${pct * 3.6}deg, var(--straw) ${pct * 3.6}deg)`;
  return (
    <div className="card sensor-gauge" style={{ padding: 16, gap: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-mid)", textTransform: "uppercase" }}>{sensor.type}</span>
        {sensor.status === "alert" && <span className="badge badge-red">⚠ Alert</span>}
      </div>
      <div className="gauge-ring" style={{ background: bg, boxShadow: `0 0 0 4px var(--cream)` }}>
        <div style={{
          width: 56, height: 56, borderRadius: "50%", background: "var(--card)",
          display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column"
        }}>
          <span className="gauge-val" style={{ color, fontSize: 14 }}>{sensor.value}</span>
          <span style={{ fontSize: 9, color: "var(--text-soft)" }}>{sensor.unit}</span>
        </div>
      </div>
      <div style={{ fontSize: 11, color: "var(--text-soft)" }}>Field #{sensor.fieldId} · {sensor.lastUpdate}</div>
    </div>
  );
}

/* ─── MODAL WRAPPER ─── */
function Modal({ title, onClose, children }) {
  return (
    <div className="modal-bg" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>✕ Close</button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   PAGES
══════════════════════════════════════════════ */

/* ── DASHBOARD ── */
function Dashboard({ data }) {
  const alerts = data.sensors.filter(s => s.status === "alert");
  const activeCrops = data.crops.filter(c => c.status === "Active");
  return (
    <div className="fade-in">
      <div className="section-header">
        <div>
          <h1 className="section-title">🏡 Farm Dashboard</h1>
          <p className="section-sub">Wednesday, 11 March 2026 · All systems operational</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {alerts.length > 0 && <span className="badge badge-red">⚠ {alerts.length} Alert{alerts.length > 1 ? "s" : ""}</span>}
          <span className="badge badge-green">● Live</span>
        </div>
      </div>

      {alerts.length > 0 && (
        <div style={{
          background: "#fff5f5", border: "1px solid #fecaca", borderRadius: 12, padding: "14px 18px",
          marginBottom: 20, display: "flex", alignItems: "center", gap: 10
        }}>
          <span style={{ fontSize: 20 }}>⚠️</span>
          <div>
            <strong style={{ color: "var(--danger)" }}>Sensor Alert:</strong>
            <span style={{ fontSize: 13, color: "var(--text-mid)", marginLeft: 6 }}>
              {alerts.map(a => `${a.type} at Field #${a.fieldId} (${a.value}${a.unit})`).join(" · ")}
            </span>
          </div>
        </div>
      )}

      <div className="grid-4" style={{ marginBottom: 20 }}>
        <StatCard icon="🌾" label="Total Farms" value={data.farms.length} sub="Across 2 districts" color="var(--leaf)" />
        <StatCard icon="🌱" label="Active Crops" value={activeCrops.length} sub="3 near harvest" color="var(--leaf-mid)" badge={{ type: "green", label: "All Healthy" }} />
        <StatCard icon="📡" label="Live Sensors" value={data.sensors.length} sub={`${alerts.length} alerts active`} color="var(--sky-deep)" badge={alerts.length ? { type: "red", label: `${alerts.length} Alert` } : null} />
        <StatCard icon="🐄" label="Livestock" value={data.livestock.length} sub="2 dairy, 1 in treatment" color="var(--earth)" />
      </div>

      <div className="grid-2" style={{ marginBottom: 20 }}>
        <div>
          <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, marginBottom: 12, color: "var(--soil)" }}>🌡 Live Sensor Grid</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {data.sensors.map(s => <SensorGauge key={s.id} sensor={s} />)}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <WeatherWidget weather={data.weather} compact />
          <div className="card">
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: "var(--soil)" }}>💰 Top Market Prices</h3>
            {data.marketPrices.slice(0, 4).map(m => (
              <div key={m.crop} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "8px 0", borderBottom: "1px solid var(--border)"
              }}>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{m.crop}</span>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 13, fontWeight: 600 }}>₹{m.price}/kg</span>
                  <span className={m.trend === "up" ? "market-up" : "market-down"} style={{ fontSize: 12, fontWeight: 600 }}>
                    {m.trend === "up" ? "↑" : "↓"}{Math.abs(m.change)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, marginBottom: 12, color: "var(--soil)" }}>🌱 Crop Status Overview</h3>
        <div className="table-wrap">
          <table>
            <thead><tr>
              <th>Crop</th><th>Field</th><th>Stage</th><th>Sow Date</th><th>Expected Harvest</th><th>Status</th>
            </tr></thead>
            <tbody>
              {data.crops.map(c => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 500 }}>{c.name}</td>
                  <td>{data.fields.find(f => f.id === c.fieldId)?.name || "-"}</td>
                  <td><span className="badge badge-blue">{c.stage}</span></td>
                  <td style={{ fontFamily: "'DM Mono',monospace", fontSize: 12 }}>{c.sowDate}</td>
                  <td style={{ fontFamily: "'DM Mono',monospace", fontSize: 12 }}>{c.harvest}</td>
                  <td><span className="badge badge-green">● {c.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ── FARMS ── */
function Farms({ data, setData }) {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", location: "", area: "", soilType: "Black", farmerId: 1 });
  const save = () => {
    if (!form.name || !form.area) return;
    setData(d => ({ ...d, farms: [...d.farms, { ...form, id: Date.now(), area: parseFloat(form.area) }] }));
    setShowModal(false); setForm({ name: "", location: "", area: "", soilType: "Black", farmerId: 1 });
  };
  return (
    <div className="fade-in">
      <div className="section-header">
        <div><h1 className="section-title">🌾 Farm Management</h1><p className="section-sub">Manage registered farms and ownership</p></div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>＋ Add Farm</button>
      </div>
      <div className="grid-3" style={{ marginBottom: 20 }}>
        {data.farms.map(f => {
          const farmer = data.farmers.find(fa => fa.id === f.farmerId);
          const fields = data.fields.filter(fi => fi.farmId === f.id);
          return (
            <div key={f.id} className="card" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 17, fontWeight: 600 }}>{f.name}</div>
                  <div style={{ fontSize: 12, color: "var(--text-soft)" }}>📍 {f.location}</div>
                </div>
                <span className="badge badge-earth">{f.soilType} Soil</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 4 }}>
                <div className="stat-card" style={{ padding: "10px 12px" }}>
                  <div style={{ fontSize: 18, fontWeight: 600, color: "var(--leaf)" }}>{f.area}</div>
                  <div style={{ fontSize: 11, color: "var(--text-soft)" }}>Acres Total</div>
                </div>
                <div className="stat-card" style={{ padding: "10px 12px" }}>
                  <div style={{ fontSize: 18, fontWeight: 600, color: "var(--leaf)" }}>{fields.length}</div>
                  <div style={{ fontSize: 11, color: "var(--text-soft)" }}>Fields</div>
                </div>
              </div>
              <div style={{ borderTop: "1px solid var(--border)", paddingTop: 10, fontSize: 12, color: "var(--text-mid)" }}>
                👤 <strong>{farmer?.name}</strong> · {farmer?.phone}
              </div>
            </div>
          );
        })}
      </div>
      <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, marginBottom: 12, color: "var(--soil)" }}>👤 Registered Farmers</h3>
      <div className="table-wrap">
        <table><thead><tr><th>Name</th><th>Phone</th><th>Email</th><th>District</th><th>State</th><th>Farms</th></tr></thead>
          <tbody>{data.farmers.map(f => (
            <tr key={f.id}>
              <td style={{ fontWeight: 500 }}>{f.name}</td>
              <td style={{ fontFamily: "'DM Mono',monospace", fontSize: 12 }}>{f.phone}</td>
              <td>{f.email}</td><td>{f.district}</td><td>{f.state}</td>
              <td><span className="badge badge-green">{data.farms.filter(fm => fm.farmerId === f.id).length} farms</span></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      {showModal && (
        <Modal title="Add New Farm" onClose={() => setShowModal(false)}>
          <div className="form-group"><label>Farm Name</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Sunrise Paddy Farm" /></div>
          <div className="form-row">
            <div className="form-group"><label>Location</label><input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Village/Town" /></div>
            <div className="form-group"><label>Total Area (acres)</label><input type="number" value={form.area} onChange={e => setForm({ ...form, area: e.target.value })} placeholder="0.00" /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Soil Type</label>
              <select value={form.soilType} onChange={e => setForm({ ...form, soilType: e.target.value })}>
                {["Black", "Red", "Loamy", "Sandy", "Clay", "Silt"].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group"><label>Owner</label>
              <select value={form.farmerId} onChange={e => setForm({ ...form, farmerId: +e.target.value })}>
                {data.farmers.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button className="btn btn-primary" onClick={save}>✓ Save Farm</button>
            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ── CROPS ── */
function Crops({ data, setData }) {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", stage: "Seedling", sowDate: "", harvest: "", status: "Active", fieldId: 1 });
  const save = () => {
    if (!form.name || !form.sowDate) return;
    setData(d => ({ ...d, crops: [...d.crops, { ...form, id: Date.now(), yieldKg: null, fieldId: +form.fieldId }] }));
    setShowModal(false);
  };
  const stages = ["Seedling", "Vegetative", "Flowering", "Fruiting", "Ripening", "Ready to Harvest"];
  const stageColor = {
    Seedling: "badge-green", Vegetative: "badge-green", Flowering: "badge-blue",
    Fruiting: "badge-yellow", Ripening: "badge-yellow", "Ready to Harvest": "badge-red"
  };
  return (
    <div className="fade-in">
      <div className="section-header">
        <div><h1 className="section-title">🌱 Crop Management</h1><p className="section-sub">Track crop cycles, growth stages & harvest</p></div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>＋ Add Crop Cycle</button>
      </div>
      <div className="grid-2" style={{ marginBottom: 20 }}>
        {data.crops.map(c => {
          const field = data.fields.find(f => f.id === c.fieldId);
          const sowD = new Date(c.sowDate), harvD = new Date(c.harvest), now = new Date();
          const total = harvD - sowD, elapsed = now - sowD;
          const pct = Math.min(Math.max((elapsed / total) * 100, 0), 100);
          return (
            <div key={c.id} className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 600 }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: "var(--text-soft)" }}>📍 {field?.name} · {field?.area} acres</div>
                </div>
                <span className={`badge ${stageColor[c.stage] || "badge-blue"}`}>{c.stage}</span>
              </div>
              <div style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-soft)", marginBottom: 4 }}>
                  <span>Sown: {c.sowDate}</span><span>Harvest: {c.harvest}</span>
                </div>
                <div className="progress-bar"><div className="progress-fill" style={{ width: `${pct}%`, background: "var(--leaf-mid)" }} /></div>
                <div style={{ fontSize: 11, color: "var(--text-soft)", marginTop: 2 }}>{pct.toFixed(0)}% of growing period elapsed</div>
              </div>
              {c.yieldKg && (
                <div style={{ background: "var(--mint)", borderRadius: 8, padding: "8px 12px", fontSize: 12 }}>
                  🌾 Yield: <strong>{c.yieldKg.toLocaleString()} kg</strong>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {showModal && (
        <Modal title="Add Crop Cycle" onClose={() => setShowModal(false)}>
          <div className="form-group"><label>Crop Name & Variety</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Rice (ADT-43)" /></div>
          <div className="form-row">
            <div className="form-group"><label>Sow Date</label><input type="date" value={form.sowDate} onChange={e => setForm({ ...form, sowDate: e.target.value })} /></div>
            <div className="form-group"><label>Expected Harvest</label><input type="date" value={form.harvest} onChange={e => setForm({ ...form, harvest: e.target.value })} /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Growth Stage</label>
              <select value={form.stage} onChange={e => setForm({ ...form, stage: e.target.value })}>
                {stages.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group"><label>Field</label>
              <select value={form.fieldId} onChange={e => setForm({ ...form, fieldId: +e.target.value })}>
                {data.fields.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button className="btn btn-primary" onClick={save}>✓ Save</button>
            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ── SENSORS ── */
function Sensors({ data, setData }) {
  const refresh = () => {
    setData(d => ({
      ...d,
      sensors: d.sensors.map(s => ({
        ...s,
        value: +(s.value + (Math.random() - 0.5) * 2).toFixed(1),
        lastUpdate: "just now",
        status: (s.type === "Soil Moisture" && s.value < 30) ? "alert" : "normal"
      }))
    }));
  };
  return (
    <div className="fade-in">
      <div className="section-header">
        <div><h1 className="section-title">📡 IoT Sensor Network</h1><p className="section-sub">Real-time field monitoring · {data.sensors.length} sensors online</p></div>
        <button className="btn btn-secondary" onClick={refresh}>↻ Refresh Readings</button>
      </div>
      <div className="grid-4" style={{ marginBottom: 24 }}>
        <StatCard icon="📡" label="Online Sensors" value={data.sensors.length} color="var(--sky-deep)" />
        <StatCard icon="⚠️" label="Active Alerts" value={data.sensors.filter(s => s.status === "alert").length} color="var(--danger)" />
        <StatCard icon="💧" label="Avg Soil Moisture" value={`${(data.sensors.filter(s => s.type === "Soil Moisture").reduce((a, s) => a + s.value, 0) / data.sensors.filter(s => s.type === "Soil Moisture").length).toFixed(1)}%`} color="var(--leaf-mid)" />
        <StatCard icon="🌡" label="Avg Temperature" value={`${(data.sensors.filter(s => s.type === "Temperature").reduce((a, s) => a + s.value, 0) || 28.3).toFixed(1)}°C`} color="var(--sun)" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 20 }}>
        {data.sensors.map(s => <SensorGauge key={s.id} sensor={s} />)}
      </div>
      <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, marginBottom: 12, color: "var(--soil)" }}>Sensor Registry</h3>
      <div className="table-wrap">
        <table><thead><tr><th>#</th><th>Type</th><th>Current Value</th><th>Field</th><th>Status</th><th>Last Update</th></tr></thead>
          <tbody>{data.sensors.map(s => (
            <tr key={s.id}>
              <td style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: "var(--text-soft)" }}>S-{String(s.id).padStart(3, "0")}</td>
              <td style={{ fontWeight: 500 }}>{s.type}</td>
              <td><span style={{ fontFamily: "'DM Mono',monospace", fontWeight: 600, color: "var(--leaf)" }}>{s.value} {s.unit}</span></td>
              <td>{data.fields.find(f => f.id === s.fieldId)?.name || "-"}</td>
              <td>{s.status === "alert"
                ? <span className="badge badge-red">⚠ Alert</span>
                : <span className="badge badge-green">● Normal</span>}</td>
              <td style={{ fontSize: 12, color: "var(--text-soft)" }}>{s.lastUpdate}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

/* ── IRRIGATION ── */
function Irrigation({ data, setData }) {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ field: "", date: "", time: "06:00", duration: 30, method: "Drip", status: "Scheduled" });
  const save = () => {
    if (!form.field || !form.date) return;
    setData(d => ({ ...d, irrigations: [...d.irrigations, { ...form, id: Date.now(), duration: +form.duration }] }));
    setShowModal(false);
  };
  const totalWater = data.irrigations.filter(i => i.status === "Completed").reduce((a, i) => a + i.duration * 15, 0);
  return (
    <div className="fade-in">
      <div className="section-header">
        <div><h1 className="section-title">💧 Irrigation Management</h1><p className="section-sub">Schedule and track water usage across fields</p></div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>＋ Schedule Irrigation</button>
      </div>
      <div className="grid-4" style={{ marginBottom: 20 }}>
        <StatCard icon="📅" label="Scheduled" value={data.irrigations.filter(i => i.status === "Scheduled").length} color="var(--sky-deep)" />
        <StatCard icon="✅" label="Completed" value={data.irrigations.filter(i => i.status === "Completed").length} color="var(--leaf)" />
        <StatCard icon="💧" label="Water Used" value={`${(totalWater / 1000).toFixed(1)}KL`} sub="This month" color="var(--leaf-mid)" />
        <StatCard icon="💰" label="Est. Cost" value={`₹${(totalWater * 0.05).toFixed(0)}`} sub="Water charges" color="var(--earth)" />
      </div>
      <div className="table-wrap">
        <table><thead><tr><th>Field</th><th>Date</th><th>Time</th><th>Duration</th><th>Method</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>{data.irrigations.map(i => (
            <tr key={i.id}>
              <td style={{ fontWeight: 500 }}>{i.field}</td>
              <td style={{ fontFamily: "'DM Mono',monospace", fontSize: 12 }}>{i.date}</td>
              <td style={{ fontFamily: "'DM Mono',monospace", fontSize: 12 }}>{i.time}</td>
              <td>{i.duration} min</td>
              <td><span className="badge badge-blue">{i.method}</span></td>
              <td>{i.status === "Completed"
                ? <span className="badge badge-green">✓ Completed</span>
                : i.status === "Cancelled"
                  ? <span className="badge badge-red">✕ Cancelled</span>
                  : <span className="badge badge-yellow">● Scheduled</span>}</td>
              <td>
                {i.status === "Scheduled" && (
                  <div style={{ display: "flex", gap: 4 }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => setData(d => ({ ...d, irrigations: d.irrigations.map(x => x.id === i.id ? { ...x, status: "Completed" } : x) }))}>✓</button>
                    <button className="btn btn-danger btn-sm" onClick={() => setData(d => ({ ...d, irrigations: d.irrigations.map(x => x.id === i.id ? { ...x, status: "Cancelled" } : x) }))}>✕</button>
                  </div>
                )}
              </td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      {showModal && (
        <Modal title="Schedule Irrigation" onClose={() => setShowModal(false)}>
          <div className="form-group"><label>Field Name</label>
            <select value={form.field} onChange={e => setForm({ ...form, field: e.target.value })}>
              <option value="">Select Field</option>
              {data.fields.map(f => <option key={f.id}>{f.name}</option>)}
            </select>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Date</label><input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></div>
            <div className="form-group"><label>Start Time</label><input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Duration (minutes)</label><input type="number" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} /></div>
            <div className="form-group"><label>Method</label>
              <select value={form.method} onChange={e => setForm({ ...form, method: e.target.value })}>
                {["Drip", "Sprinkler", "Flood", "Manual"].map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button className="btn btn-primary" onClick={save}>✓ Schedule</button>
            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ── LIVESTOCK ── */
function Livestock({ data, setData }) {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ tag: "", species: "Cow", breed: "", age: "", gender: "Female", weight: "", status: "Healthy", milk: 0 });
  const save = () => {
    if (!form.tag) return;
    setData(d => ({ ...d, livestock: [...d.livestock, { ...form, id: Date.now(), weight: +form.weight, milk: +form.milk }] }));
    setShowModal(false);
  };
  return (
    <div className="fade-in">
      <div className="section-header">
        <div><h1 className="section-title">🐄 Livestock Management</h1><p className="section-sub">Animal health, feeding & dairy production records</p></div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>＋ Register Animal</button>
      </div>
      <div className="grid-4" style={{ marginBottom: 20 }}>
        <StatCard icon="🐄" label="Total Animals" value={data.livestock.length} color="var(--earth)" />
        <StatCard icon="🥛" label="Daily Milk" value={`${data.livestock.reduce((a, l) => a + l.milk, 0).toFixed(1)}L`} color="var(--sky-deep)" />
        <StatCard icon="✅" label="Healthy" value={data.livestock.filter(l => l.status === "Healthy").length} color="var(--leaf)" />
        <StatCard icon="💊" label="In Treatment" value={data.livestock.filter(l => l.status === "Under Treatment").length} color="var(--danger)" />
      </div>
      <div className="grid-3">
        {data.livestock.map(a => (
          <div key={a.id} className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 13, color: "var(--text-soft)" }}>{a.tag}</div>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 17, fontWeight: 600 }}>{a.species} — {a.breed}</div>
              </div>
              <span className={`badge ${a.status === "Healthy" ? "badge-green" : "badge-red"}`}>{a.status}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 12, color: "var(--text-mid)" }}>
              <div>🎂 Age: <strong>{a.age}</strong></div>
              <div>⚧ Gender: <strong>{a.gender}</strong></div>
              <div>⚖️ Weight: <strong>{a.weight} kg</strong></div>
              {a.milk > 0 && <div>🥛 Milk: <strong>{a.milk} L/day</strong></div>}
            </div>
          </div>
        ))}
      </div>
      {showModal && (
        <Modal title="Register Animal" onClose={() => setShowModal(false)}>
          <div className="form-row">
            <div className="form-group"><label>Tag No.</label><input value={form.tag} onChange={e => setForm({ ...form, tag: e.target.value })} placeholder="e.g. COW-004" /></div>
            <div className="form-group"><label>Species</label>
              <select value={form.species} onChange={e => setForm({ ...form, species: e.target.value })}>
                {["Cow", "Buffalo", "Goat", "Sheep", "Pig", "Poultry"].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Breed</label><input value={form.breed} onChange={e => setForm({ ...form, breed: e.target.value })} placeholder="e.g. HF Cross" /></div>
            <div className="form-group"><label>Age</label><input value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} placeholder="e.g. 3y 6m" /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Weight (kg)</label><input type="number" value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })} /></div>
            <div className="form-group"><label>Daily Milk (L)</label><input type="number" value={form.milk} onChange={e => setForm({ ...form, milk: e.target.value })} /></div>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button className="btn btn-primary" onClick={save}>✓ Register</button>
            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ── WEATHER ── */
function WeatherWidget({ weather, compact }) {
  if (compact) return (
    <div className="weather-card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 11, opacity: 0.8, textTransform: "uppercase", letterSpacing: "0.5px" }}>Today's Weather</div>
          <div style={{ fontSize: 32, fontWeight: 700, fontFamily: "'DM Mono',monospace" }}>{weather.temp}°C</div>
          <div style={{ fontSize: 13, opacity: 0.9 }}>{weather.condition}</div>
        </div>
        <div style={{ fontSize: 36 }}>⛅</div>
      </div>
      <div style={{ display: "flex", gap: 16, marginTop: 10, fontSize: 12, opacity: 0.9 }}>
        <span>💧 {weather.humidity}%</span>
        <span>🌬 {weather.windSpeed} km/h</span>
        <span>🌧 {weather.rainfall}mm</span>
      </div>
    </div>
  );
  return (
    <div className="fade-in">
      <div className="section-header">
        <div><h1 className="section-title">🌤 Weather & Climate</h1><p className="section-sub">Local weather monitoring for agricultural planning</p></div>
      </div>
      <div className="grid-2" style={{ marginBottom: 20 }}>
        <div className="weather-card" style={{ padding: 28 }}>
          <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 4 }}>📍 Thanjavur, Tamil Nadu</div>
          <div style={{ fontSize: 64, fontWeight: 700, fontFamily: "'DM Mono',monospace", lineHeight: 1 }}>{weather.temp}°</div>
          <div style={{ fontSize: 18, opacity: 0.9, margin: "8px 0" }}>{weather.condition}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
            {[["💧 Humidity", `${weather.humidity}%`], ["🌬 Wind", `${weather.windSpeed} km/h`],
            ["🌧 Rainfall", `${weather.rainfall}mm`], ["☀️ UV Index", weather.uvIndex]].map(([l, v]) => (
              <div key={l} style={{ background: "rgba(255,255,255,0.15)", borderRadius: 8, padding: "8px 12px" }}>
                <div style={{ fontSize: 11, opacity: 0.8 }}>{l}</div>
                <div style={{ fontSize: 16, fontWeight: 600, fontFamily: "'DM Mono',monospace" }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, marginBottom: 14, color: "var(--soil)" }}>4-Day Forecast</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {weather.forecast.map(f => (
              <div key={f.day} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "10px 14px", background: "var(--cream)", borderRadius: 10
              }}>
                <span style={{ fontSize: 13, fontWeight: 500, width: 80 }}>{f.day}</span>
                <span style={{ fontSize: 22 }}>{f.icon}</span>
                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 13 }}>
                  <span style={{ color: "var(--danger)" }}>{f.high}°</span> /
                  <span style={{ color: "var(--sky-deep)", marginLeft: 2 }}>{f.low}°</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="card">
        <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, marginBottom: 12, color: "var(--soil)" }}>🌾 Farming Advisories Based on Weather</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            ["💧", "Irrigation", "High temperature detected. Schedule drip irrigation early morning (5–7 AM) to reduce evaporation."],
            ["☀️", "Sun Exposure", "UV Index 7 — Moderate. Avoid field operations between 11 AM – 2 PM."],
            ["🌧", "Rain Forecast", "Light rain expected Thursday. Postpone pesticide application by 24 hours."],
            ["🌡", "Heat Stress", "Monitor crops for heat stress. Soil moisture below optimal for Field #3."],
          ].map(([icon, title, desc]) => (
            <div key={title} style={{ background: "var(--mint)", borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ fontSize: 16, marginBottom: 4 }}>{icon} <strong style={{ fontSize: 13 }}>{title}</strong></div>
              <div style={{ fontSize: 12, color: "var(--text-mid)" }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── MARKET ── */
function Market({ data, setData }) {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ crop: "", qty: "", price: "", buyer: "", mode: "Cash", date: new Date().toISOString().split("T")[0] });
  const save = () => {
    if (!form.crop || !form.qty) return;
    const total = +form.qty * +form.price;
    setData(d => ({ ...d, sales: [...d.sales, { ...form, id: Date.now(), qty: +form.qty, price: +form.price, total }] }));
    setShowModal(false);
  };
  const totalRev = data.sales.reduce((a, s) => a + s.total, 0);
  return (
    <div className="fade-in">
      <div className="section-header">
        <div><h1 className="section-title">📊 Market & Sales</h1><p className="section-sub">Market prices, sales transactions & revenue analytics</p></div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>＋ Record Sale</button>
      </div>
      <div className="grid-4" style={{ marginBottom: 20 }}>
        <StatCard icon="💰" label="Total Revenue" value={`₹${(totalRev / 1000).toFixed(1)}K`} color="var(--leaf)" />
        <StatCard icon="📦" label="Total Transactions" value={data.sales.length} color="var(--leaf-mid)" />
        <StatCard icon="📈" label="Best Price" value="₹85/kg" sub="Mango (Madurai)" color="var(--sun)" />
        <StatCard icon="🌾" label="Total Yield Sold" value={`${data.sales.reduce((a, s) => a + s.qty, 0).toLocaleString()} kg`} color="var(--earth)" />
      </div>
      <div className="grid-2" style={{ marginBottom: 20 }}>
        <div>
          <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, marginBottom: 12, color: "var(--soil)" }}>Live Market Prices</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {data.marketPrices.map(m => (
              <div key={m.crop} className="card" style={{ padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{m.crop}</div>
                  <div style={{ fontSize: 11, color: "var(--text-soft)" }}>📍 {m.market}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 18, fontWeight: 600, color: "var(--leaf)" }}>₹{m.price}<span style={{ fontSize: 12, fontWeight: 400 }}>/kg</span></div>
                  <div className={m.trend === "up" ? "market-up" : "market-down"} style={{ fontSize: 12, fontWeight: 600 }}>
                    {m.trend === "up" ? "↑ +" : "↓ "}{Math.abs(m.change)} today
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, marginBottom: 12, color: "var(--soil)" }}>Sales Transactions</h3>
          <div className="table-wrap">
            <table><thead><tr><th>Crop</th><th>Qty</th><th>Rate</th><th>Total</th><th>Buyer</th><th>Date</th></tr></thead>
              <tbody>{data.sales.map(s => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 500 }}>{s.crop}</td>
                  <td style={{ fontFamily: "'DM Mono',monospace", fontSize: 12 }}>{s.qty.toLocaleString()} kg</td>
                  <td style={{ fontFamily: "'DM Mono',monospace", fontSize: 12 }}>₹{s.price}</td>
                  <td style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, fontWeight: 600, color: "var(--leaf)" }}>₹{s.total.toLocaleString()}</td>
                  <td style={{ fontSize: 12 }}>{s.buyer}</td>
                  <td style={{ fontSize: 12, color: "var(--text-soft)" }}>{s.date}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      </div>
      {showModal && (
        <Modal title="Record Sale" onClose={() => setShowModal(false)}>
          <div className="form-row">
            <div className="form-group"><label>Crop</label><input value={form.crop} onChange={e => setForm({ ...form, crop: e.target.value })} placeholder="e.g. Rice" /></div>
            <div className="form-group"><label>Date</label><input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Quantity (kg)</label><input type="number" value={form.qty} onChange={e => setForm({ ...form, qty: e.target.value })} /></div>
            <div className="form-group"><label>Price per kg (₹)</label><input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Buyer Name</label><input value={form.buyer} onChange={e => setForm({ ...form, buyer: e.target.value })} /></div>
            <div className="form-group"><label>Payment Mode</label>
              <select value={form.mode} onChange={e => setForm({ ...form, mode: e.target.value })}>
                {["Cash", "Bank Transfer", "UPI", "Credit"].map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
          </div>
          {form.qty && form.price && <div style={{ background: "var(--mint)", borderRadius: 8, padding: "10px 14px", fontSize: 13, marginBottom: 12 }}>
            💰 Total: <strong>₹{(+form.qty * +form.price).toLocaleString()}</strong>
          </div>}
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-primary" onClick={save}>✓ Record Sale</button>
            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ── AI ADVISOR ── */
function AIAdvisor({ data }) {
  const [messages, setMessages] = useState([
    { role: "ai", text: "👋 Hello! I'm your AI Farm Advisor powered by Claude. Ask me anything about your crops, sensors, irrigation, pests, market prices, or farming best practices. I have full knowledge of your farm data!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  const farmContext = `
You are an expert AI agricultural advisor for a smart farming system in Tamil Nadu, India.
Current farm data summary:
- Farms: ${data.farms.map(f => f.name).join(", ")}
- Active Crops: ${data.crops.map(c => `${c.name} (${c.stage})`).join(", ")}
- Sensor Alerts: ${data.sensors.filter(s => s.status === "alert").map(s => `${s.type}=${s.value}${s.unit}`).join(", ") || "None"}
- Weather: ${data.weather.temp}°C, ${data.weather.humidity}% humidity, ${data.weather.condition}
- Market: Rice ₹22.5/kg, Tomato ₹35/kg, Mango ₹85/kg
- Livestock: ${data.livestock.length} animals (${data.livestock.filter(l => l.status === "Under Treatment").length} in treatment)
Respond helpfully, concisely (3-5 sentences), with practical actionable advice. Use emojis sparingly. Always relate to the farmer's actual data when relevant.
  `.trim();

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(m => [...m, { role: "user", text: userMsg }]);
    setLoading(true);
    try {
      const reply = await callAI(farmContext, userMsg);
      setMessages(m => [...m, { role: "ai", text: reply }]);
    } catch (e) {
      setMessages(m => [...m, { role: "ai", text: "⚠️ Unable to connect to AI backend. Please try again." }]);
    }
    setLoading(false);
  };

  useEffect(() => { chatRef.current?.scrollTo({ top: 99999, behavior: "smooth" }); }, [messages, loading]);

  const quickQuestions = [
    "Why is my soil moisture low in Field #3?",
    "What fertilizer should I use for rice this season?",
    "Is now a good time to sell my tomatoes?",
    "How can I reduce water usage on my farm?",
    "What pests should I watch for in March?",
  ];

  return (
    <div className="fade-in">
      <div className="section-header">
        <div>
          <h1 className="section-title">🤖 AI Farm Advisor</h1>
          <p className="section-sub">Powered by Claude · Personalized advice based on your farm data</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div className="pulse-dot" />
          <span style={{ fontSize: 12, color: "var(--leaf)" }}>AI Online</span>
        </div>
      </div>

      <div className="grid-2" style={{ gap: 20 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div ref={chatRef} style={{
            background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16,
            padding: 16, height: 420, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10
          }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                {m.role === "ai" && <div style={{
                  width: 28, height: 28, borderRadius: "50%", background: "var(--leaf)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, marginRight: 8, flexShrink: 0, alignSelf: "flex-start", marginTop: 2
                }}>🤖</div>}
                <div className={`chat-bubble ${m.role}`} style={{ whiteSpace: "pre-wrap" }}>{m.text}</div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--leaf)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, marginRight: 8 }}>🤖</div>
                <div className="chat-bubble ai" style={{ padding: 0 }}>
                  <div className="ai-typing"><span /><span /><span /></div>
                </div>
              </div>
            )}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Ask about crops, sensors, market prices, pests..."
              style={{ flex: 1 }} />
            <button className="btn btn-primary" onClick={send} disabled={loading || !input.trim()}>
              → Send
            </button>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div className="card">
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, marginBottom: 12, color: "var(--soil)" }}>💡 Quick Questions</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {quickQuestions.map(q => (
                <button key={q} className="btn btn-secondary" onClick={() => { setInput(q); }}
                  style={{ textAlign: "left", justifyContent: "flex-start", fontSize: 12, padding: "8px 12px" }}>
                  💬 {q}
                </button>
              ))}
            </div>
          </div>
          <div className="card">
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, marginBottom: 10, color: "var(--soil)" }}>📊 Farm Context Loaded</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12, color: "var(--text-mid)" }}>
              <div>✅ {data.farms.length} farms · {data.fields.length} fields</div>
              <div>✅ {data.crops.length} crop cycles tracked</div>
              <div>✅ {data.sensors.length} sensors · {data.sensors.filter(s => s.status === "alert").length} alerts</div>
              <div>✅ Weather: {data.weather.temp}°C, {data.weather.condition}</div>
              <div>✅ {data.livestock.length} animals registered</div>
              <div>✅ Market prices for 5 crops loaded</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────
   MAIN APP
──────────────────────────────────────── */
const NAV = [
  { id: "dashboard", label: "Dashboard", icon: "🏡" },
  { id: "farms", label: "Farms", icon: "🌾" },
  { id: "crops", label: "Crops", icon: "🌱" },
  { id: "sensors", label: "Sensors", icon: "📡" },
  { id: "irrigation", label: "Irrigation", icon: "💧" },
  { id: "livestock", label: "Livestock", icon: "🐄" },
  { id: "weather", label: "Weather", icon: "🌤" },
  { id: "market", label: "Market", icon: "📊" },
  { id: "ai", label: "AI Advisor", icon: "🤖" },
];

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [data, setData] = useState(INIT);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const alerts = data.sensors.filter(s => s.status === "alert").length;

  return (
    <>
      <FontLink />
      <div style={{ display: "flex", minHeight: "100vh" }}>

        {/* ── SIDEBAR ── */}
        <div style={{
          width: sidebarOpen ? 220 : 64, flexShrink: 0, transition: "width 0.25s ease",
          background: "var(--leaf-dark)", display: "flex", flexDirection: "column",
          position: "sticky", top: 0, height: "100vh", overflow: "hidden"
        }}>
          {/* Logo */}
          <div style={{ padding: "20px 16px 16px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 26, flexShrink: 0 }}>🌿</span>
              {sidebarOpen && <div>
                <div className="nav-logo" style={{ color: "#fff", lineHeight: 1.1 }}>FarmIQ</div>
                <div style={{ fontSize: 10, color: "var(--mint)", letterSpacing: "1px" }}>SMART FARMING</div>
              </div>}
            </div>
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, padding: "12px 8px", overflowY: "auto" }}>
            {NAV.map(n => (
              <button key={n.id} className={`sidebar-nav-item ${page === n.id ? "active" : ""}`}
                onClick={() => setPage(n.id)}
                style={{ justifyContent: sidebarOpen ? "flex-start" : "center", position: "relative" }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>{n.icon}</span>
                {sidebarOpen && <span>{n.label}</span>}
                {n.id === "ai" && sidebarOpen && <span style={{
                  marginLeft: "auto", background: "var(--sun)",
                  color: "#fff", borderRadius: 10, fontSize: 10, padding: "1px 7px", fontWeight: 700
                }}>AI</span>}
                {n.id === "sensors" && alerts > 0 && (
                  <span style={{
                    position: "absolute", top: 6, right: sidebarOpen ? 8 : 4, width: 16, height: 16,
                    background: "var(--danger)", borderRadius: "50%", fontSize: 9, fontWeight: 700,
                    color: "#fff", display: "flex", alignItems: "center", justifyContent: "center"
                  }}>{alerts}</span>
                )}
              </button>
            ))}
          </nav>

          {/* Toggle */}
          <div style={{ padding: "12px 8px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            <button className="sidebar-nav-item" onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{ justifyContent: sidebarOpen ? "flex-start" : "center" }}>
              <span style={{ fontSize: 18 }}>{sidebarOpen ? "◀" : "▶"}</span>
              {sidebarOpen && <span style={{ fontSize: 12 }}>Collapse</span>}
            </button>
          </div>
        </div>

        {/* ── MAIN ── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

          {/* Top Bar */}
          <div style={{
            background: "var(--card)", borderBottom: "1px solid var(--border)",
            padding: "12px 28px", display: "flex", alignItems: "center", justifyContent: "space-between",
            position: "sticky", top: 0, zIndex: 10
          }}>
            <div style={{ fontSize: 13, color: "var(--text-soft)" }}>
              {NAV.find(n => n.id === page)?.icon} {NAV.find(n => n.id === page)?.label}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {alerts > 0 && (
                <button className="btn btn-danger btn-sm" onClick={() => setPage("sensors")}>
                  ⚠ {alerts} Sensor Alert{alerts > 1 ? "s" : ""}
                </button>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--text-mid)" }}>
                <div className="pulse-dot" style={{ width: 6, height: 6 }} />
                Live · {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>

          {/* Page Content */}
          <div style={{ flex: 1, padding: "28px 28px 48px", maxWidth: 1300, width: "100%" }}>
            {page === "dashboard" && <Dashboard data={data} />}
            {page === "farms" && <Farms data={data} setData={setData} />}
            {page === "crops" && <Crops data={data} setData={setData} />}
            {page === "sensors" && <Sensors data={data} setData={setData} />}
            {page === "irrigation" && <Irrigation data={data} setData={setData} />}
            {page === "livestock" && <Livestock data={data} setData={setData} />}
            {page === "weather" && <WeatherWidget weather={data.weather} />}
            {page === "market" && <Market data={data} setData={setData} />}
            {page === "ai" && <AIAdvisor data={data} />}
          </div>
        </div>
      </div>
    </>
  );
}
