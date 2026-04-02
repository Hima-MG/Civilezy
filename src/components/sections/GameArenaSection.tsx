"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

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
  { rank:"#1",   rankColor:"#FFB800",               avatar:"AR",  avatarBg:"rgba(255,184,0,0.2)",   avatarC:"#FFB800", name:"Arjun Ravi",     loc:"Thrissur • AE Level", xp:"12,840 XP", rowBg:"rgba(255,184,0,0.08)", borderTop:"",                               nameColor:"" },
  { rank:"#2",   rankColor:"#C0C0C0",               avatar:"MK",  avatarBg:"rgba(100,200,255,0.15)",avatarC:"#64C8FF", name:"Meera Krishnan", loc:"Kochi • Diploma",    xp:"11,220 XP", rowBg:"",                    borderTop:"",                               nameColor:"" },
  { rank:"#3",   rankColor:"#CD7F32",               avatar:"SP",  avatarBg:"rgba(255,98,0,0.15)",   avatarC:"#FF8534", name:"Sreejith P.",    loc:"Kozhikode • AE",     xp:"10,450 XP", rowBg:"",                    borderTop:"",                               nameColor:"" },
  { rank:"#4",   rankColor:"rgba(255,255,255,0.55)",avatar:"AN",  avatarBg:"rgba(255,255,255,0.06)",avatarC:"rgba(255,255,255,0.55)", name:"Anjali Nair", loc:"Trivandrum • ITI", xp:"9,870 XP", rowBg:"", borderTop:"", nameColor:"" },
  { rank:"#247", rankColor:"#FF6200",               avatar:"YOU", avatarBg:"rgba(255,98,0,0.2)",    avatarC:"#FF8534", name:"You",            loc:"Pro Level",           xp:"1,840 XP",  rowBg:"rgba(255,98,0,0.06)",  borderTop:"1px dashed rgba(255,98,0,0.2)",  nameColor:"#FF6200" },
] as const;

const BADGES = ["🔥 Streak Champion","⚡ Speed King","🎯 Topic Master","🌟 30-Day Legend"] as const;

const QUIZ_MODES = [
  {
    topBar:   "linear-gradient(90deg,#32C864,#00E676)",
    icon:     "🎮",
    title:    "Practice Mode",
    desc:     "Relaxed, subject-wise practice. You choose Easy / Medium / Hard. Instant explanations. XP on every correct answer.",
    features: ["Topic-wise filtering (Soil, RCC, Surveying…)","Student-set timer — no pressure","Weak subject auto-detection after 20 questions","XP + streak points on every session"],
  },
  {
    topBar:   "linear-gradient(90deg,#FFB800,#FF6200)",
    icon:     "📋",
    title:    "Topic Test",
    desc:     "Focused 20-question tests on specific topics. Know exactly where you stand on Fluid Mechanics, Estimation, Strength of Materials.",
    features: ["Single-topic deep dive — 20 questions","Accuracy % shown after each test","Comparison: your score vs toppers","Recommended next topic based on weak areas"],
  },
  {
    topBar:   "linear-gradient(90deg,#FF3232,#FF6B00)",
    icon:     "🏆",
    title:    "Full Mock Exam",
    desc:     "Exact PSC simulation. Real pool-based questions. Department-specific papers. Feel the real exam before the real exam.",
    features: ["PSC pool-based: DIP-G1, AE-KWA, ITI-PWD…","Full PSC paper pattern (100Q / 75 marks)","Rank prediction after each mock","Downloadable certificate on completion"],
  },
] as const;

const COMPARE_ROWS = [
  { feature:"Kerala PSC Pool-Based Tests",           us:"✓ Exact pools",   usStyle:"check", t:"✗",          tStyle:"cross", o:"✗",          oStyle:"cross"  },
  { feature:"Malayalam Content",                     us:"✓ Full support",  usStyle:"check", t:"✗",          tStyle:"cross", o:"✗",          oStyle:"cross"  },
  { feature:"ITI / Diploma / AE Split",              us:"✓ All 3 pools",   usStyle:"check", t:"Partial",    tStyle:"muted", o:"✗",          oStyle:"cross"  },
  { feature:"Department Papers (KWA, PWD)",          us:"✓ All depts",     usStyle:"check", t:"✗",          tStyle:"cross", o:"✗",          oStyle:"cross"  },
  { feature:"Gamified Learning (XP, Streaks)",       us:"✓ Full system",   usStyle:"check", t:"Basic",      tStyle:"muted", o:"✗",          oStyle:"cross"  },
  { feature:"Price (Full Access)",                   us:"₹1,999 one-time", usStyle:"gold",  t:"₹5,999/yr",  tStyle:"muted", o:"₹7,200/yr",  oStyle:"muted"  },
  { feature:"Weekly Live Mentorship",                us:"✓ Included",      usStyle:"check", t:"Paid extra", tStyle:"muted", o:"Paid extra", oStyle:"muted"  },
] as const;

const TESTIMONIALS = [
  { avatar:"AR", avatarBg:"rgba(255,98,0,0.2)",    avatarC:"#FF8534", name:"Arjun Ravi",     role:"Diploma Civil, Thrissur",   rank:"🏆 Rank 3 — KWA AE 2024",        quote:"I was completely lost about which pool to study for. Civilezy explained the entire DIP-G1 architecture in Malayalam. Cracked it in first attempt!" },
  { avatar:"MK", avatarBg:"rgba(255,184,0,0.2)",   avatarC:"#FFB800", name:"Meera Krishnan", role:"ITI Civil, Ernakulam",       rank:"🏆 Rank 7 — PWD Overseer 2024",  quote:"The streak system made me study every single day. After 21 days I was in the top 50 of the leaderboard. Mock tests are exactly like the real PSC paper." },
  { avatar:"SP", avatarBg:"rgba(100,200,255,0.15)",avatarC:"#64C8FF", name:"Sreejith Pillai", role:"B.Tech Civil, Kozhikode",   rank:"🏆 Rank 12 — LSGD AE 2024",      quote:"Testbook charged ₹7000 for content that didn't mention Kerala PSC. Civilezy at ₹1999 gave me 95 mock tests. Best investment of my preparation." },
  { avatar:"AN", avatarBg:"rgba(50,200,100,0.15)", avatarC:"#32C864", name:"Anjali Nair",     role:"Diploma Civil, Trivandrum", rank:"🏆 Rank 4 — KSEB Technical 2024", quote:"The weak subject detection showed I was weak in Soil Mechanics. I focused on it for 2 weeks. Score went from 54% to 89% in that topic. Life changing." },
] as const;

const STATS_BAR = [
  { num:"5,200+", label:"Active Students"                },
  { num:"98+",    label:"Government Job Placements"       },
  { num:"+43%",   label:"Avg Score Improvement / 30 Days" },
  { num:"4.9★",   label:"Average Student Rating"          },
] as const;

// ─── Shared style value helpers ───────────────────────────────────────────
function usValColor(style: string) {
  if (style === "check") return "#32C864";
  if (style === "gold")  return "#FFB800";
  return "#FF8534";
}
function themValColor(style: string) {
  return style === "cross" ? "#FF3232" : "rgba(255,255,255,0.55)";
}

// ─── Section header ───────────────────────────────────────────────────────
function SectionHeader({ tag, before, hl, after, sub }: {
  tag:string; before:string; hl:string; after:string; sub:string;
}) {
  return (
    <div style={{ textAlign:"center", maxWidth:"700px", margin:"0 auto 60px" }}>
      <div style={{ display:"inline-block", background:"rgba(255,98,0,0.15)", border:"1px solid rgba(255,98,0,0.3)", borderRadius:"20px", padding:"4px 16px", fontSize:"12px", fontWeight:700, color:"#FF8534", letterSpacing:"0.5px", marginBottom:"16px" }}>
        {tag}
      </div>
      <h2 style={{ fontFamily:"Rajdhani, sans-serif", fontSize:"clamp(28px,4vw,44px)", fontWeight:700, lineHeight:1.2, marginBottom:"16px", color:"#fff" }}>
        {before}
        <span style={{ background:"linear-gradient(135deg,#FF6200,#FFB800)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
          {hl}
        </span>
        {after}
      </h2>
      <p style={{ fontSize:"17px", color:"rgba(255,255,255,0.85)", lineHeight:1.7, margin:0 }}>{sub}</p>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────
export default function GameArenaSection() {
  const router    = useRouter();
  const modeRef   = useRef<(HTMLDivElement | null)[]>([]);
  const testiRef  = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          const el = e.target as HTMLElement;
          el.style.opacity   = "1";
          el.style.transform = "translateY(0)";
        }
      }),
      { threshold: 0.1 }
    );
    [...modeRef.current, ...testiRef.current].forEach(el => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <>
      {/* ═══════════════════════════════════════════════════════
          SECTION 1 — GAME ARENA (Journey + Leaderboard)
      ═══════════════════════════════════════════════════════ */}
      <section id="arena" style={{ background:"linear-gradient(180deg,#080F1E 0%,#0B1E3D 100%)", padding:"80px 0" }}>
        <div style={{ maxWidth:"1200px", width:"100%", margin:"0 auto", padding:"0 5%" }}>

          <SectionHeader
            tag="GAME ARENA"
            before="Study Like a "
            hl="Game. Rank Like a"
            after=" Champion."
            sub="Duolingo-style streaks, XP system, global leaderboard — designed to make you open the app every single day."
          />

          {/* Enter Game Arena CTA */}
          <div style={{ textAlign:"center", marginBottom:"56px" }}>
            <button
              onClick={() => router.push("/game-arena")}
              style={{ background:"linear-gradient(135deg,#FF6200,#FF8534)", color:"white", border:"none", padding:"16px 40px", borderRadius:"50px", fontFamily:"Nunito, sans-serif", fontSize:"18px", fontWeight:800, cursor:"pointer", boxShadow:"0 6px 30px rgba(255,98,0,0.45)", transition:"transform 0.2s, box-shadow 0.2s", display:"inline-flex", alignItems:"center", gap:"8px" }}
              onMouseEnter={e => { e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow="0 12px 40px rgba(255,98,0,0.6)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)";    e.currentTarget.style.boxShadow="0 6px 30px rgba(255,98,0,0.45)"; }}
            >
              🎮 Enter Game Arena
            </button>
            <p style={{ marginTop:"10px", fontSize:"13px", color:"rgba(255,255,255,0.4)" }}>
              Practice with real PSC-level questions in a fun game mode
            </p>
          </div>

          {/* Two-col grid */}
          <div id="arena-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"60px", alignItems:"start", width:"100%" }}>

            {/* LEFT — Journey */}
            <div>
              <div style={{ fontSize:"15px", fontWeight:700, color:"rgba(255,255,255,0.55)", letterSpacing:"0.5px", marginBottom:"16px" }}>YOUR JOURNEY</div>

              <div style={{ display:"flex", flexDirection:"column", gap:"10px", marginBottom:"24px" }}>
                {TIERS.map(t => (
                  <div key={t.name}
                    style={{ display:"flex", alignItems:"center", gap:"16px", background:t.active?"rgba(255,98,0,0.12)":"rgba(255,255,255,0.04)", border:t.active?"1px solid rgba(255,98,0,0.35)":"1px solid rgba(255,255,255,0.08)", borderRadius:"14px", padding:"14px 18px", opacity:t.locked?0.5:1, transition:"background 0.3s, border-color 0.3s" }}
                    onMouseEnter={e => { if(t.locked) return; const el=e.currentTarget; el.style.background=t.active?"rgba(255,98,0,0.18)":"rgba(255,98,0,0.08)"; el.style.borderColor=t.active?"rgba(255,98,0,0.5)":"rgba(255,98,0,0.2)"; }}
                    onMouseLeave={e => { if(t.locked) return; const el=e.currentTarget; el.style.background=t.active?"rgba(255,98,0,0.12)":"rgba(255,255,255,0.04)"; el.style.borderColor=t.active?"rgba(255,98,0,0.35)":"rgba(255,255,255,0.08)"; }}
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
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 2 — QUIZ SYSTEM
      ═══════════════════════════════════════════════════════ */}
      {/* <section id="quiz" style={{ background:"#0B1E3D", padding:"80px 0" }}>
        <div style={{ maxWidth:"1200px", width:"100%", margin:"0 auto", padding:"0 5%" }}>

          <SectionHeader
            tag="QUIZ SYSTEM"
            before="Three Modes. "
            hl="One Goal."
            after=" Top Rank."
            sub="From casual practice to full PSC simulation — every mode is engineered for Kerala PSC Civil Engineering exam success." */}
          
{/* 
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:"24px", maxWidth:"1100px", margin:"0 auto" }}>
            {QUIZ_MODES.map((m, i) => (
              <div key={m.title}
                ref={el => { modeRef.current[i] = el; }}
                style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"20px", padding:"28px", position:"relative", overflow:"hidden", transition:"transform 0.3s, border-color 0.3s, opacity 0.5s ease", opacity:0, transform:"translateY(20px)", transitionDelay:`${i*80}ms` }}
                onMouseEnter={e => { const el=e.currentTarget as HTMLDivElement; el.style.transform="translateY(-6px)"; el.style.borderColor="rgba(255,98,0,0.3)"; }}
                onMouseLeave={e => { const el=e.currentTarget as HTMLDivElement; el.style.transform="translateY(0)"; el.style.borderColor="rgba(255,255,255,0.1)"; }}
              >
                <div style={{ position:"absolute", top:0, left:0, right:0, height:"3px", background:m.topBar }} />
                <div style={{ fontSize:"40px", marginBottom:"16px" }}>{m.icon}</div>
                <div style={{ fontFamily:"Rajdhani, sans-serif", fontSize:"24px", fontWeight:700, marginBottom:"8px" }}>{m.title}</div>
                <p style={{ fontSize:"14px", color:"rgba(255,255,255,0.85)", marginBottom:"20px", lineHeight:1.6 }}>{m.desc}</p>
                <ul style={{ listStyle:"none", padding:0, display:"flex", flexDirection:"column", gap:"8px" }}>
                  {m.features.map(f => (
                    <li key={f} style={{ display:"flex", alignItems:"center", gap:"8px", fontSize:"13px", color:"rgba(255,255,255,0.85)" }}>
                      <span style={{ width:"6px", height:"6px", borderRadius:"50%", background:"#FF6200", flexShrink:0, display:"block" }} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* ═══════════════════════════════════════════════════════
          SECTION 3 — WHY CIVILEZY (Comparison Table)
      ═══════════════════════════════════════════════════════ */}
      {/* <section style={{ background:"#060D1A", padding:"80px 0" }}>
        <div style={{ maxWidth:"1200px", width:"100%", margin:"0 auto", padding:"0 5%" }}>

          <SectionHeader
            tag="WHY CIVILEZY"
            before="We're Not Just "
            hl="Different"
            after=" — We're Built For You"
            sub="National platforms serve 500 million students. We serve one specific student — a Kerala PSC Civil Engineering aspirant. That's our entire focus."
          />

          <div style={{ maxWidth:"900px", margin:"0 auto", borderRadius:"20px", overflow:"hidden", border:"1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", background:"rgba(255,255,255,0.05)", padding:"16px 24px", fontFamily:"Rajdhani, sans-serif", fontSize:"18px", fontWeight:700, borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
              <div>Feature</div>
              <div style={{ color:"#FF6200" }}>Civilezy</div>
              <div>Testbook</div>
              <div>Others</div>
            </div>
            {COMPARE_ROWS.map((r, i) => (
              <div key={i}
                style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", padding:"14px 24px", borderBottom:i<COMPARE_ROWS.length-1?"1px solid rgba(255,255,255,0.05)":"none", fontSize:"14px", alignItems:"center", transition:"background 0.2s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background="rgba(255,98,0,0.04)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background=""; }}
              >
                <div style={{ color:"rgba(255,255,255,0.85)" }}>{r.feature}</div>
                <div style={{ color:usValColor(r.usStyle), fontWeight:700 }}>{r.us}</div>
                <div style={{ color:themValColor(r.tStyle) }}>{r.t}</div>
                <div style={{ color:themValColor(r.oStyle) }}>{r.o}</div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* ═══════════════════════════════════════════════════════
          SECTION 4 — STUDENT WINS (Testimonials + Stats)
      ═══════════════════════════════════════════════════════ */}
      {/* <section style={{ background:"#060D1A", padding:"80px 0" }}>
        <div style={{ maxWidth:"1200px", width:"100%", margin:"0 auto", padding:"0 5%" }}>

          <SectionHeader
            tag="RANK HOLDERS SPEAK"
            before="98+ Students Got "
            hl="Government Jobs."
            after=""
            sub="These are real results from real students. Average score improvement: +43% after 30 days of practice on Civilezy."
          />

          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:"20px", maxWidth:"1200px", margin:"0 auto 50px" }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={t.name}
                ref={el => { testiRef.current[i] = el; }}
                style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"18px", padding:"24px", transition:"all 0.3s, opacity 0.5s ease", opacity:0, transform:"translateY(20px)", transitionDelay:`${i*80}ms` }}
                onMouseEnter={e => { const el=e.currentTarget as HTMLDivElement; el.style.borderColor="rgba(255,98,0,0.3)"; el.style.transform="translateY(-4px)"; }}
                onMouseLeave={e => { const el=e.currentTarget as HTMLDivElement; el.style.borderColor="rgba(255,255,255,0.08)"; el.style.transform="translateY(0)"; }}
              >
                <div style={{ color:"#FFB800", fontSize:"16px", marginBottom:"12px" }}>★★★★★</div>
                <p style={{ fontSize:"14px", color:"rgba(255,255,255,0.85)", lineHeight:1.7, marginBottom:"16px", fontStyle:"italic" }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
                  <div style={{ width:"44px", height:"44px", borderRadius:"50%", background:t.avatarBg, color:t.avatarC, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"16px", fontWeight:800, flexShrink:0 }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontSize:"15px", fontWeight:700 }}>{t.name}</div>
                    <div style={{ fontSize:"12px", color:"rgba(255,255,255,0.55)" }}>{t.role}</div>
                    <div style={{ fontSize:"12px", color:"#FF8534", fontWeight:700 }}>{t.rank}</div>
                  </div>
                </div>
              </div>
            ))}
          </div> */}

          {/* Stats bar */}
          {/* <div style={{ maxWidth:"900px", margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:"20px", textAlign:"center" }}>
            {STATS_BAR.map(s => (
              <div key={s.label} style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"16px", padding:"24px" }}>
                <div style={{ fontFamily:"Rajdhani, sans-serif", fontSize:"42px", fontWeight:700, background:"linear-gradient(135deg,#FF6200,#FFB800)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>{s.num}</div>
                <div style={{ fontSize:"14px", color:"rgba(255,255,255,0.55)" }}>{s.label}</div>
              </div>
            ))}
          </div> */}

        {/* </div> */}
      {/* </section> */}

      {/* Mobile responsive */}
      <style>{`
        @media (max-width: 900px) {
          #arena-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </>
  );
}