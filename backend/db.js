import Database from "better-sqlite3";
const db = new Database("watchmore.db");
db.pragma("journal_mode = WAL");
db.exec(`
CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY, name TEXT, email TEXT UNIQUE, password TEXT);
CREATE TABLE IF NOT EXISTS titles(id INTEGER PRIMARY KEY, title TEXT, description TEXT, genre TEXT,
  year INT, type TEXT, rating TEXT, colors TEXT, video_url TEXT, featured INT DEFAULT 0);
CREATE TABLE IF NOT EXISTS mylist(user_id INT, title_id INT, PRIMARY KEY(user_id,title_id));
CREATE TABLE IF NOT EXISTS progress(user_id INT, title_id INT, seconds REAL, PRIMARY KEY(user_id,title_id));
`);
if (!db.prepare("SELECT COUNT(*) c FROM titles").get().c) {
  const V = ["BigBuckBunny","ElephantsDream","Sintel","TearsOfSteel"].map(
    n => `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/${n}.mp4`);
  const seed = [
    ["Neon Horizon","A rogue pilot races to stop a city-wide blackout in a cyberpunk future.","Action",2024,"Movie","U/A 16+","#ff2e63,#1a1a2e"],
    ["The Last Monsoon","A family in Kerala faces the storm of the century.","Drama",2023,"Series","U/A 13+","#0f4c75,#1b262c"],
    ["Laugh Factory","Stand-up comics fight for a spot on the biggest stage in India.","Comedy",2024,"Series","U/A 13+","#f9a826,#2c2c54"],
    ["Cosmic Drift","Crew of a lost freighter discovers a signal from beyond the galaxy.","Sci-Fi",2025,"Movie","U/A 13+","#6a11cb,#2575fc"],
    ["Shadow Bazaar","A thief uncovers a secret market where memories are sold.","Thriller",2022,"Movie","A","#232526,#b91d73"],
    ["Pixel Pals","Toy robots go on an epic adventure to find their way home.","Family",2023,"Movie","U","#11998e,#38ef7d"],
    ["Royal Gambit","Two rival families, one throne, and a deadly chess game.","Drama",2025,"Series","U/A 16+","#8e0e00,#1f1c18"],
    ["Midnight Local","Strange passengers share one last train ride across Punjab.","Thriller",2024,"Series","U/A 16+","#141e30,#243b55"],
    ["Wild Planet","Breathtaking journeys through Earth's last untouched wilds.","Documentary",2023,"Series","U","#134e5e,#71b280"],
    ["Turbo Kids","Teen racers build a rocket kart to win the galactic cup.","Family",2024,"Movie","U","#fc4a1a,#f7b733"],
    ["Iron Dynasty","A warrior queen unites seven kingdoms against an invading empire.","Action",2022,"Movie","U/A 16+","#434343,#c79081"],
    ["Love in Lockdown","Two neighbours fall in love through a shared balcony wall.","Romance",2021,"Movie","U/A 13+","#ee9ca7,#ffdde1"],
  ];
  const ins = db.prepare("INSERT INTO titles(title,description,genre,year,type,rating,colors,video_url,featured) VALUES(?,?,?,?,?,?,?,?,?)");
  seed.forEach((s,i)=>ins.run(...s, V[i%4], i===0?1:0));
}
export default db;
