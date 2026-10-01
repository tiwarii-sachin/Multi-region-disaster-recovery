import "dotenv/config";
import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "./db.js";

const app = express();
const SECRET = process.env.JWT_SECRET || "dev-secret";
app.use(cors());
app.use(express.json());

const sign = u => jwt.sign({ id: u.id }, SECRET, { expiresIn: "7d" });
const auth = (req, res, next) => {
  try { req.user = jwt.verify((req.headers.authorization||"").replace("Bearer ",""), SECRET); next(); }
  catch { res.status(401).json({ error: "Unauthorized" }); }
};

app.post("/api/auth/register", (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || (password||"").length < 6) return res.status(400).json({ error: "Name, email and 6+ char password required" });
  try {
    const r = db.prepare("INSERT INTO users(name,email,password) VALUES(?,?,?)").run(name, email.toLowerCase(), bcrypt.hashSync(password, 10));
    const user = { id: r.lastInsertRowid, name, email };
    res.json({ token: sign(user), user });
  } catch { res.status(409).json({ error: "Email already registered" }); }
});

app.post("/api/auth/login", (req, res) => {
  const u = db.prepare("SELECT * FROM users WHERE email=?").get((req.body.email||"").toLowerCase());
  if (!u || !bcrypt.compareSync(req.body.password||"", u.password)) return res.status(401).json({ error: "Invalid credentials" });
  res.json({ token: sign(u), user: { id: u.id, name: u.name, email: u.email } });
});

app.get("/api/titles", auth, (req, res) => {
  const { genre, q } = req.query;
  let sql = "SELECT * FROM titles WHERE 1=1"; const p = [];
  if (genre) { sql += " AND genre=?"; p.push(genre); }
  if (q) { sql += " AND (title LIKE ? OR description LIKE ?)"; p.push(`%${q}%`, `%${q}%`); }
  res.json(db.prepare(sql).all(...p));
});
app.get("/api/titles/:id", auth, (req, res) => {
  const t = db.prepare("SELECT * FROM titles WHERE id=?").get(req.params.id);
  t ? res.json(t) : res.status(404).json({ error: "Not found" });
});

app.get("/api/mylist", auth, (req, res) =>
  res.json(db.prepare("SELECT t.* FROM titles t JOIN mylist m ON m.title_id=t.id WHERE m.user_id=?").all(req.user.id)));
app.post("/api/mylist", auth, (req, res) => {
  db.prepare("INSERT OR IGNORE INTO mylist VALUES(?,?)").run(req.user.id, req.body.titleId); res.json({ ok: true });
});
app.delete("/api/mylist/:id", auth, (req, res) => {
  db.prepare("DELETE FROM mylist WHERE user_id=? AND title_id=?").run(req.user.id, req.params.id); res.json({ ok: true });
});

app.get("/api/progress/:id", auth, (req, res) =>
  res.json(db.prepare("SELECT seconds FROM progress WHERE user_id=? AND title_id=?").get(req.user.id, req.params.id) || { seconds: 0 }));
app.post("/api/progress/:id", auth, (req, res) => {
  db.prepare("INSERT OR REPLACE INTO progress VALUES(?,?,?)").run(req.user.id, req.params.id, req.body.seconds); res.json({ ok: true });
});

app.listen(process.env.PORT || 5000, () => console.log("WatchMore API running"));
