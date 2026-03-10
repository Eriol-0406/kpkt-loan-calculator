import { useState, useEffect } from "react";

const fmt = (val) => {
  if (val === null || val === undefined || val === "") return "";
  return Number(val).toLocaleString("en-MY", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const isNum = (v) => /^\d*\.?\d*$/.test(String(v).trim()) && String(v).trim() !== "";

export default function LoanCalculator() {
  const [principal, setPrincipal] = useState("1300000");
  const [tenure, setTenure] = useState("24");
  const [rate, setRate] = useState("12");
  const [npl, setNpl] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState("10-03-2026");
  const [errors, setErrors] = useState({});
  const [totalInterest, setTotalInterest] = useState(null);
  const [totalLoan, setTotalLoan] = useState(null);
  const [monthly, setMonthly] = useState(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setAnimated(true);
  }, []);

  useEffect(() => {
    const p = parseFloat(principal);
    const r = parseFloat(rate) / 100 / 12;
    const n = parseFloat(tenure);
    if (!isNaN(p) && !isNaN(r) && !isNaN(n) && n > 0 && r > 0 && p > 0) {
      const mp = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      setMonthly(mp);
      setTotalLoan(mp * n);
      setTotalInterest(mp * n - p);
    } else {
      setMonthly(null); setTotalLoan(null); setTotalInterest(null);
    }
  }, [principal, tenure, rate]);

  const validate = (field, value) => {
    const e = { ...errors };
    if (["principal","tenure","rate","npl"].includes(field)) {
      if (value && !isNum(value)) e[field] = "Only numbers allowed.";
      else delete e[field];
    }
    if (field === "rate" && value && parseFloat(value) > 18) e[field] = "Must be between 0 and 18.";
    setErrors(e);
  };

  const handle = (field, setter) => (ev) => { setter(ev.target.value); validate(field, ev.target.value); };

  const inputStyle = (field) => ({
    background: errors[field] ? "rgba(239,68,68,0.06)" : "rgba(255,255,255,0.06)",
    borderColor: errors[field] ? "#ef4444" : "rgba(255,255,255,0.12)",
  });

  const pct = totalLoan && principal ? Math.min(100, (parseFloat(principal) / totalLoan) * 100) : 0;

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a0f1e 0%, #0d1b2a 50%, #0a1628 100%)",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      padding: "40px 20px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@600;700&display=swap');
        * { box-sizing: border-box; }
        .field-input { transition: all 0.2s ease; color: #e8edf5; font-size: 14px; background: transparent; border: none; outline: none; width: 100%; }
        .field-input::placeholder { color: rgba(180,195,220,0.35); }
        .field-wrap { display: flex; align-items: center; border: 1px solid rgba(255,255,255,0.12); border-radius: 10px; overflow: hidden; transition: all 0.2s ease; }
        .field-wrap:focus-within { border-color: #4f9cf9; box-shadow: 0 0 0 3px rgba(79,156,249,0.15); }
        .prefix-tag { padding: 11px 14px; font-size: 12px; font-weight: 600; color: #7ba8d4; background: rgba(79,156,249,0.08); border-right: 1px solid rgba(255,255,255,0.08); letter-spacing: 0.05em; white-space: nowrap; }
        .suffix-tag { padding: 11px 14px; font-size: 12px; font-weight: 600; color: #7ba8d4; background: rgba(79,156,249,0.08); border-left: 1px solid rgba(255,255,255,0.08); letter-spacing: 0.05em; white-space: nowrap; }
        .card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 20px; backdrop-filter: blur(12px); }
        .result-card { background: linear-gradient(135deg, rgba(79,156,249,0.12), rgba(99,102,241,0.08)); border: 1px solid rgba(79,156,249,0.2); border-radius: 16px; padding: 22px; position: relative; overflow: hidden; }
        .result-card::before { content:''; position:absolute; inset:0; background: radial-gradient(circle at top right, rgba(79,156,249,0.08), transparent 70%); }
        .fade-in { opacity: 0; transform: translateY(18px); animation: fadeUp 0.5s ease forwards; }
        @keyframes fadeUp { to { opacity:1; transform:translateY(0); } }
        .err-msg { color: #f87171; font-size: 11px; margin-top: 5px; }
        .hint-msg { color: rgba(130,160,200,0.6); font-size: 11px; margin-top: 5px; }
        select option { background: #0d1b2a; color: #e8edf5; }
        .bar-track { height: 6px; background: rgba(255,255,255,0.08); border-radius: 99px; overflow:hidden; margin-top: 12px; }
        .bar-fill { height: 100%; border-radius: 99px; background: linear-gradient(90deg, #4f9cf9, #818cf8); transition: width 0.6s cubic-bezier(0.34,1.56,0.64,1); }
      `}</style>

      {/* Header */}
      <div className="fade-in" style={{ animationDelay: "0s", width: "100%", maxWidth: 860, marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12,
            background: "linear-gradient(135deg, #4f9cf9, #818cf8)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, boxShadow: "0 4px 20px rgba(79,156,249,0.3)"
          }}>💰</div>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "#e8edf5", letterSpacing: "-0.01em" }}>
              Loan Details
            </div>
            <div style={{ fontSize: 12, color: "rgba(130,160,200,0.6)", marginTop: 1 }}>Section 2 — Financing Overview</div>
          </div>
        </div>
        <div style={{ height: 1, background: "linear-gradient(90deg, rgba(79,156,249,0.4), transparent)", marginTop: 18 }} />
      </div>

      {/* Main Form */}
      <div style={{ width: "100%", maxWidth: 860, display: "flex", flexDirection: "column", gap: 20 }}>

        {/* Row 1 */}
        <div className="fade-in" style={{ animationDelay: "0.1s", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
          {/* Date */}
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#7ba8d4", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>Date</label>
            <div className="field-wrap" style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.12)" }}>
              <input className="field-input" style={{ padding: "11px 14px" }} value={date} onChange={e => setDate(e.target.value)} placeholder="DD-MM-YYYY" />
              <span className="suffix-tag">📅</span>
            </div>
          </div>

          {/* Principal */}
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#7ba8d4", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>Principal Loan</label>
            <div className="field-wrap" style={inputStyle("principal")}>
              <span className="prefix-tag">RM</span>
              <input className="field-input" style={{ padding: "11px 14px" }} value={principal} onChange={handle("principal", setPrincipal)} placeholder="0.00" />
            </div>
            {errors.principal ? <p className="err-msg">⚠ {errors.principal}</p> : <p className="hint-msg">Numbers only, e.g. 1000.00</p>}
          </div>

          {/* Tenure */}
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#7ba8d4", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>Repayment Period</label>
            <div className="field-wrap" style={inputStyle("tenure")}>
              <input className="field-input" style={{ padding: "11px 14px" }} value={tenure} onChange={handle("tenure", setTenure)} placeholder="0" />
              <span className="suffix-tag">Months</span>
            </div>
            {errors.tenure ? <p className="err-msg">⚠ {errors.tenure}</p> : <p className="hint-msg">Numbers only</p>}
          </div>

          {/* Rate */}
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#7ba8d4", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>Interest Rate</label>
            <div className="field-wrap" style={inputStyle("rate")}>
              <input className="field-input" style={{ padding: "11px 14px" }} value={rate} onChange={handle("rate", setRate)} placeholder="0" />
              <span className="suffix-tag">% / yr</span>
            </div>
            {errors.rate ? <p className="err-msg">⚠ {errors.rate}</p> : <p className="hint-msg">0 to 18</p>}
          </div>
        </div>

        {/* Row 2 — Results */}
        <div className="fade-in" style={{ animationDelay: "0.2s", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
          {/* NPL */}
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#7ba8d4", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>Nonperforming Loan (NPL)</label>
            <div className="field-wrap" style={inputStyle("npl")}>
              <span className="prefix-tag">RM</span>
              <input className="field-input" style={{ padding: "11px 14px" }} value={npl} onChange={handle("npl", setNpl)} placeholder="0.00" />
            </div>
            {errors.npl ? <p className="err-msg">⚠ {errors.npl}</p> : <p className="hint-msg">NPL if unpaid after 90 days</p>}
          </div>

          {/* Total Interest */}
          <div className="result-card">
            <div style={{ fontSize: 11, fontWeight: 600, color: "#7ba8d4", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>Total Interest</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <span style={{ fontSize: 11, color: "#4f9cf9", fontWeight: 600 }}>RM</span>
              <span style={{ fontSize: 20, fontWeight: 700, color: "#e8edf5", letterSpacing: "-0.02em" }}>{totalInterest !== null ? fmt(totalInterest) : <span style={{color:"rgba(180,195,220,0.25)", fontSize:14}}>—</span>}</span>
            </div>
            <p className="hint-msg" style={{marginTop:6}}>Numbers only, e.g. 1000.00</p>
          </div>

          {/* Total Loan */}
          <div className="result-card">
            <div style={{ fontSize: 11, fontWeight: 600, color: "#7ba8d4", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>Total Loan Amount</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <span style={{ fontSize: 11, color: "#4f9cf9", fontWeight: 600 }}>RM</span>
              <span style={{ fontSize: 20, fontWeight: 700, color: "#e8edf5", letterSpacing: "-0.02em" }}>{totalLoan !== null ? fmt(totalLoan) : <span style={{color:"rgba(180,195,220,0.25)", fontSize:14}}>—</span>}</span>
            </div>
            <p className="hint-msg" style={{marginTop:6}}>Numbers only, e.g. 1000.00</p>
          </div>

          {/* Outstanding */}
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#7ba8d4", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>Outstanding Balance</label>
            <div className="field-wrap" style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}>
              <span className="prefix-tag">RM</span>
              <input className="field-input" style={{ padding: "11px 14px", color: "rgba(180,195,220,0.3)" }} readOnly placeholder="Auto-calculated" />
            </div>
            <p className="hint-msg">Numbers only, e.g. 1000.00</p>
          </div>
        </div>

        {/* Summary Bar + Monthly + Note */}
        <div className="fade-in" style={{ animationDelay: "0.3s", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {/* Summary Card */}
          <div className="card">
            <div style={{ fontSize: 11, fontWeight: 600, color: "#7ba8d4", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 14 }}>Loan Breakdown</div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 12, color: "rgba(180,195,220,0.6)" }}>Principal</span>
              <span style={{ fontSize: 12, color: "#4f9cf9", fontWeight: 600 }}>{pct.toFixed(1)}%</span>
            </div>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: `${pct}%` }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <div>
                <div style={{ fontSize: 11, color: "rgba(130,160,200,0.5)", marginBottom: 3 }}>Monthly Payment</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#e8edf5" }}>
                  {monthly ? <><span style={{fontSize:11,color:"#4f9cf9",fontWeight:600,marginRight:4}}>RM</span>{fmt(monthly)}</> : <span style={{color:"rgba(180,195,220,0.25)"}}>—</span>}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 11, color: "rgba(130,160,200,0.5)", marginBottom: 3 }}>Total Repayment</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#e8edf5" }}>
                  {totalLoan ? <><span style={{fontSize:11,color:"#818cf8",fontWeight:600,marginRight:4}}>RM</span>{fmt(totalLoan)}</> : <span style={{color:"rgba(180,195,220,0.25)"}}>—</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Note */}
          <div className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#7ba8d4", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>Note</label>
              <select
                value={note}
                onChange={e => setNote(e.target.value)}
                style={{
                  width: "100%", padding: "11px 14px", fontSize: 13, color: note ? "#e8edf5" : "rgba(180,195,220,0.35)",
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 10, outline: "none", cursor: "pointer", appearance: "none",
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%237ba8d4' d='M1 1l5 5 5-5'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center"
                }}
              >
                <option value="">-- Select --</option>
                <option value="performing">Performing</option>
                <option value="npl">Non-Performing</option>
                <option value="restructured">Restructured</option>
                <option value="written-off">Written Off</option>
              </select>
            </div>
            {note && (
              <div style={{ marginTop: 14, padding: "10px 14px", borderRadius: 8, background: "rgba(79,156,249,0.08)", border: "1px solid rgba(79,156,249,0.15)", fontSize: 12, color: "#7ba8d4" }}>
                Status: <strong style={{ color: "#4f9cf9", textTransform: "capitalize" }}>{note.replace("-", " ")}</strong>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}