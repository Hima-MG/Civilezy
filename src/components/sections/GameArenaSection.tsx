"use client";

import { useRouter } from "next/navigation";

// ─── Data ─────────────────────────────────────────────────────────────────
const TIERS = [
  { icon: "🌱", name: "Rookie",  desc: "0 – 500 XP • Basics unlocked",     xp: "500 XP",    active: false, locked: false },
  { icon: "📖", name: "Scholar", desc: "501 – 2,000 XP • Topic Tests",      xp: "2,000 XP",  active: false, locked: false },
  { icon: "⚡", name: "Pro",     desc: "2,001 – 5,000 XP • Mock Tests",     xp: "5,000 XP",  active: true,  locked: false },
  { icon: "🏅", name: "Expert",  desc: "5,001 – 10,000 XP • Boss Rounds",   xp: "10,000 XP", active: false, locked: true  },
  { icon: "🔥", name: "Legend",  desc: "10,000+ XP • Elite Access",         xp: "∞ XP",      active: false, locked: true  },
] as const;

const STAT_MINI = [
  { icon: "🔥", value: "14-Day",      label: "Current Streak",  bg: "rgba(255,98,0,0.1)",    border: "rgba(255,98,0,0.25)"    },
  { icon: "🏆", value: "#247",        label: "Kerala Rank",     bg: "rgba(255,184,0,0.1)",   border: "rgba(255,184,0,0.25)"   },
  { icon: "🎖️", value: "Speed King",  label: "Badge Earned",    bg: "rgba(100,200,255,0.08)",border: "rgba(100,200,255,0.2)"  },
  { icon: "📜", value: "Certificate", label: "Mock Test #12",   bg: "rgba(50,200,100,0.08)", border: "rgba(50,200,100,0.2)"   },
] as const;

const LEADERBOARD = [
  { rank:"#1",   rankColor:"#FFB800",               avatar:"AR",  avatarBg:"rgba(255,184,0,0.2)",   avatarC:"#FFB800", name:"Arjun Ravi",     loc:"Thrissur • AE Level", xp:"12,840 XP", rowBg:"rgba(255,184,0,0.08)", borderTop:"",                              nameColor:"" },
  { rank:"#2",   rankColor:"#C0C0C0",               avatar:"MK",  avatarBg:"rgba(100,200,255,0.15)",avatarC:"#64C8FF", name:"Meera Krishnan", loc:"Kochi • Diploma",    xp:"11,220 XP", rowBg:"",                    borderTop:"",                              nameColor:"" },
  { rank:"#3",   rankColor:"#CD7F32",               avatar:"SP",  avatarBg:"rgba(255,98,0,0.15)",   avatarC:"#FF8534", name:"Sreejith P.",    loc:"Kozhikode • AE",     xp:"10,450 XP", rowBg:"",                    borderTop:"",                              nameColor:"" },
  { rank:"#4",   rankColor:"rgba(255,255,255,0.55)",avatar:"AN",  avatarBg:"rgba(255,255,255,0.06)",avatarC:"rgba(255,255,255,0.55)", name:"Anjali Nair", loc:"Trivandrum • ITI", xp:"9,870 XP", rowBg:"", borderTop:"", nameColor:"" },
  { rank:"#247", rankColor:"#FF6200",               avatar:"YOU", avatarBg:"rgba(255,98,0,0.2)",    avatarC:"#FF8534", name:"You",            loc:"Pro Level",           xp:"1,840 XP",  rowBg:"rgba(255,98,0,0.06)", borderTop:"1px dashed rgba(255,98,0,0.2)", nameColor:"#FF6200" },
] as const;

const BADGES = ["🔥 Streak Champion","⚡ Speed King","🎯 Topic Master","🌟 30-Day Legend"] as const;

// ─── Component ─────────────────────────────────────────────────────────────
export default function GameArenaSection() {
  const router = useRouter();

  return (
    <section id="arena" style={{ background:"linear-gradient(180deg,#080F1E 0%,#0B1E3D 100%)", padding:"80px 0" }}>
      <div style={{ maxWidth:"1200px", width:"100%", margin:"0 auto", padding:"0 5%" }}>

        {/* ── Section header ────────────────────────────────────────── */}
        <div style={{ textAlign:"center", maxWidth:"700px", margin:"0 auto 60px" }}>
          <div style={{ display:"inline-block", background:"rgba(255,98,0,0.15)", border:"1px solid rgba(255,98,0,0.3)", borderRadius:"20px", padding:"4px 16px", fontSize:"12px", fontWeight:700, color:"#FF8534", letterSpacing:"0.5px", marginBottom:"16px" }}>
            GAME ARENA
          </div>
          <h2 style={{ fontFamily:"Rajdhani, sans-serif", fontSize:"clamp(28px,4vw,44px)", fontWeight:700, lineHeight:1.2, marginBottom:"16px", color:"#fff" }}>
            Study Like a{" "}
            <span style={{ background:"linear-gradient(135deg,#FF6200,#FFB800)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
              Game. Rank Like a
            </span>{" "}
            Champion.
          </h2>
          <p style={{ fontSize:"17px", color:"rgba(255,255,255,0.85)", lineHeight:1.7, margin:"0 0 28px" }}>
            Duolingo-style streaks, XP system, global leaderboard — designed to make you open the app every single day.
          </p>

          {/* Enter CTA */}
          <button
            onClick={() => router.push("/game-arena")}
            style={{ background:"linear-gradient(135deg,#FF6200,#FF8534)", color:"white", border:"none", padding:"16px 40px", borderRadius:"50px", fontFamily:"Nunito, sans-serif", fontSize:"18px", fontWeight:800, cursor:"pointer", boxShadow:"0 6px 30px rgba(255,98,0,0.45)", transition:"transform 0.2s, box-shadow 0.2s", display:"inline-flex", alignItems:"center", gap:"8px" }}
            onMouseEnter={e => { const el = e.currentTarget; el.style.transform="translateY(-3px)"; el.style.boxShadow="0 12px 40px rgba(255,98,0,0.6)"; }}
            onMouseLeave={e => { const el = e.currentTarget; el.style.transform="translateY(0)";    el.style.boxShadow="0 6px 30px rgba(255,98,0,0.45)"; }}
          >
            🎮 Enter Game Arena
          </button>
          <p style={{ marginTop:"10px", fontSize:"13px", color:"rgba(255,255,255,0.4)" }}>
            Practice with real PSC-level questions in a fun game mode
          </p>
        </div>

        {/* ── Two-column grid ────────────────────────────────────────── */}
        <div id="arena-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"60px", alignItems:"start", width:"100%" }}>

          {/* LEFT — Journey */}
          <div>
            <div style={{ fontSize:"15px", fontWeight:700, color:"rgba(255,255,255,0.55)", letterSpacing:"0.5px", marginBottom:"16px" }}>
              YOUR JOURNEY
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:"10px", marginBottom:"24px" }}>
              {TIERS.map(t => (
                <div key={t.name}
                  style={{ display:"flex", alignItems:"center", gap:"16px", background:t.active?"rgba(255,98,0,0.12)":"rgba(255,255,255,0.04)", border:t.active?"1px solid rgba(255,98,0,0.35)":"1px solid rgba(255,255,255,0.08)", borderRadius:"14px", padding:"14px 18px", opacity:t.locked?0.5:1, transition:"background 0.3s, border-color 0.3s" }}
                  onMouseEnter={e => { if(t.locked) return; const el=e.currentTarget as HTMLDivElement; el.style.background=t.active?"rgba(255,98,0,0.18)":"rgba(255,98,0,0.08)"; el.style.borderColor=t.active?"rgba(255,98,0,0.5)":"rgba(255,98,0,0.2)"; }}
                  onMouseLeave={e => { if(t.locked) return; const el=e.currentTarget as HTMLDivElement; el.style.background=t.active?"rgba(255,98,0,0.12)":"rgba(255,255,255,0.04)"; el.style.borderColor=t.active?"rgba(255,98,0,0.35)":"rgba(255,255,255,0.08)"; }}
                >
                  <div style={{ fontSize:"24px", flexShrink:0 }}>{t.icon}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:"Rajdhani, sans-serif", fontSize:"18px", fontWeight:700, color:t.active?"#FF6200":"#fff", display:"flex", alignItems:"center", gap:"8px", flexWrap:"wrap" }}>
                      {t.name}
                      {t.active && <span style={{ fontSize:"11px", background:"#FF6200", color:"white", padding:"2px 8px", borderRadius:"10px", fontFamily:"Nunito, sans-serif", fontWeight:700 }}>YOU ARE HERE</span>}
                    </div>
                    <div style={{ fontSize:"12px", color:"rgba(255,255,255,0.55)" }}>{t.desc}</div>
                  </div>
                  <div style={{ fontSize:"13px", fontWeight:700, color:"#FF8534", flexShrink:0 }}>{t.xp}</div>
                </div>
              ))}
            </div>

            {/* Stat mini-cards */}
            <div style={{ display:"flex", gap:"10px", flexWrap:"wrap" }}>
              {STAT_MINI.map(c => (
                <div key={c.label}
                  style={{ background:c.bg, border:`1px solid ${c.border}`, borderRadius:"10px", padding:"12px 16px", fontSize:"13px", minWidth:"80px", transition:"transform 0.2s", cursor:"default" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform="translateY(-3px)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform="translateY(0)"; }}
                >
                  <div style={{ fontSize:"20px", marginBottom:"4px" }}>{c.icon}</div>
                  <div style={{ fontWeight:700 }}>{c.value}</div>
                  <div style={{ color:"rgba(255,255,255,0.55)", fontSize:"11px" }}>{c.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Leaderboard */}
          <div>
            <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"20px", overflow:"hidden" }}>
              <div style={{ background:"linear-gradient(90deg,rgba(255,98,0,0.2),rgba(255,184,0,0.1))", padding:"16px 20px", display:"flex", alignItems:"center", gap:"10px", borderBottom:"1px solid rgba(255,255,255,0.1)" }}>
                <span style={{ fontSize:"22px" }}>🏆</span>
                <div style={{ fontFamily:"Rajdhani, sans-serif", fontSize:"20px", fontWeight:700 }}>Kerala PSC Global Leaderboard</div>
                <div style={{ marginLeft:"auto", fontSize:"12px", color:"rgba(255,255,255,0.55)" }}>This Week</div>
              </div>

              <div style={{ padding:"8px 0" }}>
                {LEADERBOARD.map((row, i) => (
                  <div key={i}
                    style={{ display:"flex", alignItems:"center", gap:"14px", padding:"10px 20px", background:row.rowBg||"", borderTop:row.borderTop||"", transition:"background 0.2s" }}
                    onMouseEnter={e => { if(!row.rowBg)(e.currentTarget as HTMLDivElement).style.background="rgba(255,255,255,0.03)"; }}
                    onMouseLeave={e => { if(!row.rowBg)(e.currentTarget as HTMLDivElement).style.background=""; }}
                  >
                    <div style={{ width:"28px", textAlign:"center", fontFamily:"Rajdhani, sans-serif", fontSize:"16px", fontWeight:700, color:row.rankColor }}>{row.rank}</div>
                    <div style={{ width:"36px", height:"36px", borderRadius:"50%", background:row.avatarBg, color:row.avatarC, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"14px", fontWeight:700, flexShrink:0 }}>{row.avatar}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:"14px", fontWeight:700, color:row.nameColor||"#fff" }}>{row.name}</div>
                      <div style={{ fontSize:"11px", color:"rgba(255,255,255,0.55)" }}>{row.loc}</div>
                    </div>
                    <div style={{ fontSize:"14px", fontWeight:700, color:"#FF8534" }}>{row.xp}</div>
                  </div>
                ))}
              </div>

              <div style={{ display:"flex", flexWrap:"wrap", gap:"10px", padding:"16px 20px", borderTop:"1px solid rgba(255,255,255,0.08)" }}>
                {BADGES.map(b => (
                  <div key={b} style={{ display:"inline-flex", alignItems:"center", gap:"6px", background:"rgba(255,98,0,0.1)", border:"1px solid rgba(255,98,0,0.25)", borderRadius:"20px", padding:"6px 12px", fontSize:"12px", fontWeight:700, color:"#FF8534" }}>{b}</div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          #arena-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </section>
  );
}