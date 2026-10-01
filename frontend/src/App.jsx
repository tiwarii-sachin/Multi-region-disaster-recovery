import { useEffect, useRef, useState } from "react";
import { Routes, Route, Navigate, Link, useNavigate, useParams } from "react-router-dom";
import { api } from "./api.js";

const Private = ({ children }) => localStorage.getItem("wm_token") ? children : <Navigate to="/login" />;
const bg = t => { const [a, b] = t.colors.split(","); return { background: `linear-gradient(145deg, ${a}, ${b})` }; };

function Navbar() {
  const nav = useNavigate(); const [q, setQ] = useState("");
  const user = JSON.parse(localStorage.getItem("wm_user") || "{}");
  return (
    <header className="nav">
      <Link to="/" className="logo">WATCH<span>MORE</span></Link>
      <Link to="/">Home</Link><Link to="/mylist">My List</Link>
      <form onSubmit={e => { e.preventDefault(); nav(`/search?q=${encodeURIComponent(q)}`); }}>
        <input placeholder="Search titles…" value={q} onChange={e => setQ(e.target.value)} />
      </form>
      <span className="user">{user.name}</span>
      <button className="ghost" onClick={() => { localStorage.clear(); nav("/login"); }}>Sign out</button>
    </header>
  );
}

function Card({ t }) {
  return (
    <Link to={`/watch/${t.id}`} className="card" style={bg(t)}>
      <b>{t.title}</b><small>{t.year} · {t.type} · {t.genre}</small>
    </Link>
  );
}
const Row = ({ name, items }) => items.length > 0 && (
  <section className="row"><h2>{name}</h2><div className="scroll">{items.map(t => <Card key={t.id} t={t} />)}</div></section>
);

function Home() {
  const [titles, setTitles] = useState([]);
  useEffect(() => { api("/titles").then(setTitles); }, []);
  const hero = titles.find(t => t.featured) || titles[0];
  const genres = [...new Set(titles.map(t => t.genre))];
  return (
    <>
      {hero && (
        <div className="hero" style={bg(hero)}>
          <div><h1>{hero.title}</h1><p>{hero.description}</p>
            <Link to={`/watch/${hero.id}`} className="btn">▶ Play</Link></div>
        </div>
      )}
      <Row name="Trending Now" items={titles.slice().reverse().slice(0, 8)} />
      {genres.map(g => <Row key={g} name={g} items={titles.filter(t => t.genre === g)} />)}
    </>
  );
}

function Search() {
  const q = new URLSearchParams(location.search).get("q") || "";
  const [items, setItems] = useState([]);
  useEffect(() => { api(`/titles?q=${encodeURIComponent(q)}`).then(setItems); }, [q]);
  return <div className="page"><h2>Results for “{q}”</h2><div className="grid">{items.map(t => <Card key={t.id} t={t} />)}</div>
    {!items.length && <p>No matches.</p>}</div>;
}

function MyList() {
  const [items, setItems] = useState([]);
  useEffect(() => { api("/mylist").then(setItems); }, []);
  return <div className="page"><h2>My List</h2><div className="grid">{items.map(t => <Card key={t.id} t={t} />)}</div>
    {!items.length && <p>Nothing here yet — add titles from the watch page.</p>}</div>;
}

function Watch() {
  const { id } = useParams(); const [t, setT] = useState(null);
  const [inList, setInList] = useState(false); const vid = useRef(); const last = useRef(0);
  useEffect(() => {
    api(`/titles/${id}`).then(setT);
    api("/mylist").then(l => setInList(l.some(x => x.id === +id)));
  }, [id]);
  const resume = async () => { const p = await api(`/progress/${id}`); if (p.seconds) vid.current.currentTime = p.seconds; };
  const save = () => {
    const s = vid.current.currentTime;
    if (Math.abs(s - last.current) > 10) { last.current = s; api(`/progress/${id}`, { method: "POST", body: { seconds: s } }); }
  };
  const toggle = async () => {
    inList ? await api(`/mylist/${id}`, { method: "DELETE" }) : await api("/mylist", { method: "POST", body: { titleId: +id } });
    setInList(!inList);
  };
  if (!t) return <div className="page">Loading…</div>;
  return (
    <div className="page watch">
      <video ref={vid} src={t.video_url} controls autoPlay onLoadedMetadata={resume} onTimeUpdate={save} />
      <h1>{t.title}</h1>
      <p className="meta">{t.year} · {t.rating} · {t.type} · {t.genre}</p>
      <p>{t.description}</p>
      <button className="btn" onClick={toggle}>{inList ? "✓ In My List" : "+ My List"}</button>
    </div>
  );
}

function Auth({ mode }) {
  const nav = useNavigate(); const [f, setF] = useState({ name: "", email: "", password: "" }); const [err, setErr] = useState("");
  const submit = async e => {
    e.preventDefault();
    try {
      const r = await api(`/auth/${mode}`, { method: "POST", body: f });
      localStorage.setItem("wm_token", r.token); localStorage.setItem("wm_user", JSON.stringify(r.user)); nav("/");
    } catch (e) { setErr(e.message); }
  };
  const set = k => e => setF({ ...f, [k]: e.target.value });
  return (
    <div className="auth"><form onSubmit={submit}>
      <div className="logo big">WATCH<span>MORE</span></div>
      <h2>{mode === "login" ? "Sign In" : "Create Account"}</h2>
      {mode === "register" && <input placeholder="Name" value={f.name} onChange={set("name")} required />}
      <input type="email" placeholder="Email" value={f.email} onChange={set("email")} required />
      <input type="password" placeholder="Password (6+ chars)" value={f.password} onChange={set("password")} required />
      {err && <p className="err">{err}</p>}
      <button className="btn">{mode === "login" ? "Sign In" : "Sign Up"}</button>
      <p>{mode === "login" ? <>New here? <Link to="/register">Sign up</Link></> : <>Have an account? <Link to="/login">Sign in</Link></>}</p>
    </form></div>
  );
}

export default function App() {
  const authed = !!localStorage.getItem("wm_token");
  return (
    <>
      {authed && <Navbar />}
      <Routes>
        <Route path="/login" element={<Auth mode="login" />} />
        <Route path="/register" element={<Auth mode="register" />} />
        <Route path="/" element={<Private><Home /></Private>} />
        <Route path="/search" element={<Private><Search /></Private>} />
        <Route path="/mylist" element={<Private><MyList /></Private>} />
        <Route path="/watch/:id" element={<Private><Watch /></Private>} />
      </Routes>
    </>
  );
}
