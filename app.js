function q(k) {
  const u = new URL(location.href);
  return u.searchParams.get(k);
}

function ymd(d) {
  return { y: d.getFullYear(), m: d.getMonth() + 1, d: d.getDate() };
}

const DAYS = [
  { d: 7, key: "rose", title: "Rose Day", desc: "Express love and friendship with roses.", img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1280&auto=format&fit=crop" },
  { d: 8, key: "propose", title: "Propose Day", desc: "Confess love and take the next step.", img: "https://images.unsplash.com/photo-1520975922209-c0704a0e2591?q=80&w=1280&auto=format&fit=crop" },
  { d: 9, key: "chocolate", title: "Chocolate Day", desc: "Share affection by gifting chocolates.", img: "https://images.unsplash.com/photo-1497058072375-24e22d77f0f2?q=80&w=1280&auto=format&fit=crop" },
  { d: 10, key: "teddy", title: "Teddy Day", desc: "Gift a soft toy to express love.", img: "https://images.unsplash.com/photo-1602536052684-66105b0d09b8?q=80&w=1280&auto=format&fit=crop" },
  { d: 11, key: "promise", title: "Promise Day", desc: "Make commitments to strengthen the relationship.", img: "https://images.unsplash.com/photo-1514820720301-4f5fa417eeb6?q=80&w=1280&auto=format&fit=crop" },
  { d: 12, key: "hug", title: "Hug Day", desc: "Offer comfort and affection with a hug.", img: "https://images.unsplash.com/photo-1517263904808-5dc91e3e7044?q=80&w=1280&auto=format&fit=crop" },
  { d: 13, key: "kiss", title: "Kiss Day", desc: "Romantic gestures and intimacy.", img: "https://images.unsplash.com/photo-1513026705753-bc3ba2ebc1f1?q=80&w=1280&auto=format&fit=crop" },
  { d: 14, key: "valentine", title: "Valentine's Day", desc: "Celebrate love in full bloom.", img: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1280&auto=format&fit=crop" }
];

function unlocked(day) {
  const now = new Date();
  const t = new Date(now.getFullYear(), 1, day);
  if (q("preview") === "all") return true;
  return now >= t;
}

function storeOpen(day) {
  const k = "hiya-open";
  const s = JSON.parse(localStorage.getItem(k) || "[]");
  if (!s.includes(day)) {
    s.push(day);
    localStorage.setItem(k, JSON.stringify(s));
  }
}

function wasOpened(day) {
  const s = JSON.parse(localStorage.getItem("hiya-open") || "[]");
  return s.includes(day);
}

function fmt(day) {
  const now = new Date();
  const dt = new Date(now.getFullYear(), 1, day);
  const w = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][dt.getDay()];
  return "Feb " + day + " (" + w + ")";
}

function renderTimeline() {
  const root = document.getElementById("timeline-root");
  if (!root) return;
  applyUnlockParam();
  root.innerHTML = "";
  DAYS.forEach((item) => {
    const open = unlocked(item.d) || wasOpened(item.d);
    const el = document.createElement("a");
    el.className = "timeline-item " + (open ? "open" : "locked");
    el.href = open ? ("day.html?d=" + item.d) : "javascript:void(0)";
    el.innerHTML = `
      <div class="timeline-date">${fmt(item.d)}</div>
      <div class="timeline-title">${item.title}</div>
      <div class="timeline-desc">${item.desc}</div>
      <div class="timeline-action"><span class="badge rounded-pill ${open ? "text-bg-danger" : "text-bg-secondary"}">${open ? "Open" : "Locked"}</span></div>
    `;
    root.appendChild(el);
  });
  renderPreviewControls();
  startAmbientHearts();
}

function renderWelcome() {
  const nameEl = document.getElementById("hiya-name");
  if (nameEl) nameEl.textContent = "Hiya";
  const nextBtn = document.getElementById("go-timeline");
  if (nextBtn) nextBtn.addEventListener("click", () => location.href = "timeline.html");
}

function renderPreviewControls() {
  const ctr = document.getElementById("preview-controls");
  if (!ctr) return;
  const isPreview = q("preview") === "all";
  const isAdmin = q("admin") === "1";
  if (!isAdmin && !isPreview) {
    ctr.innerHTML = "";
    return;
  }
  ctr.innerHTML = `
    <button id="unlock-all" class="button">Unlock All</button>
    <button id="relock" class="button">Relock</button>
  `;
  const unlock = document.getElementById("unlock-all");
  const relock = document.getElementById("relock");
  if (unlock) unlock.addEventListener("click", unlockAllPreview);
  if (relock) relock.addEventListener("click", relockFuture);
}

function unlockAllPreview() {
  const u = new URL(location.href);
  u.searchParams.set("preview", "all");
  location.href = u.toString();
}

function relockFuture() {
  localStorage.removeItem("hiya-open");
  const u = new URL(location.href);
  u.searchParams.delete("preview");
  location.href = u.toString();
}

function startAmbientHearts() {
  const root = document.getElementById("hearts-root");
  if (!root) return;
  for (let i = 0; i < 12; i++) {
    setTimeout(() => spawnHeartAt(root, Math.random()*window.innerWidth, window.innerHeight - Math.random()*80, 10 + Math.random()*10), i*250);
  }
}

function applyUnlockParam() {
  const mode = q("unlock");
  if (mode === "all") {
    const all = DAYS.map(d => d.d);
    localStorage.setItem("hiya-open", JSON.stringify(all));
  }
}

function renderDay() {
  const root = document.getElementById("day-root");
  if (!root) return;
  const d = parseInt(q("d") || "0", 10);
  const item = DAYS.find(x => x.d === d);
  if (!item) {
    root.innerHTML = `<div class="locked-card"><div class="locked-title">Not Found</div><a class="button" href="timeline.html">Back</a></div>`;
    return;
  }
  const open = unlocked(item.d) || wasOpened(item.d);
  if (!open) {
    root.innerHTML = `
      <div class="locked-card">
        <div class="locked-title">${fmt(item.d)} • ${item.title}</div>
        <div class="locked-desc">This page unlocks on Feb ${item.d}. Come back then.</div>
        <a class="button" href="timeline.html">Back to Dates</a>
      </div>
    `;
    return;
  }
  storeOpen(item.d);
  root.innerHTML = `
    <section class="day-hero" style="background-image:url('${item.img}')">
      <div class="day-hero-overlay">
        <h2 class="day-hero-title">${item.title}</h2>
        <p class="day-hero-sub">${fmt(item.d)}</p>
        <div style="display:flex; gap:12px">
          <button id="surprise" class="button">Surprise</button>
          <button id="music-toggle" class="button">Music</button>
        </div>
      </div>
    </section>
    <section class="day-content">
      <div class="day-card">
        <h3 class="day-card-title">A note for you</h3>
        <p id="day-message" class="day-card-body">You make everything brighter. Even from afar, I’m with you.</p>
        <div class="controls">
          <input id="custom-message" class="input" type="text" placeholder="Write your custom message">
          <button id="save-message" class="button">Save</button>
        </div>
      </div>
      <div class="day-card">
        <h3 class="day-card-title">Gallery</h3>
        <div class="slider" id="photo-slider">
          <img src="${item.img}" class="slide" alt="${item.title}">
          <img src="https://picsum.photos/seed/${item.key}/640/360" class="slide" alt="placeholder">
          <img src="https://picsum.photos/seed/${item.key}2/640/360" class="slide" alt="placeholder">
        </div>
      </div>
      <div class="day-actions">
        <a href="timeline.html" class="button">Back to Dates</a>
      </div>
    </section>
    <div id="hearts-root" class="hearts-root"></div>
    <div id="sparkles-root" class="sparkles-root"></div>
    <audio id="music" src="https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Scott_Holmes_Music/Hopeful_Cinematic/Scott_Holmes_Music_-_Sweet_Romance.mp3"></audio>
  `;
  const custom = document.getElementById("custom-message");
  const save = document.getElementById("save-message");
  const msgEl = document.getElementById("day-message");
  const k = "hiya-msg-" + item.d;
  const saved = localStorage.getItem(k);
  if (saved) msgEl.textContent = saved;
  typeText(msgEl, msgEl.textContent, 32);
  if (save && custom) {
    save.addEventListener("click", () => {
      const v = custom.value.trim();
      if (v) {
        localStorage.setItem(k, v);
        msgEl.textContent = v;
        typeText(msgEl, v, 32);
      }
    });
  }
  const surprise = document.getElementById("surprise");
  if (surprise) {
    surprise.addEventListener("click", () => celebrateHearts());
  }
  const music = document.getElementById("music");
  const toggle = document.getElementById("music-toggle");
  if (toggle && music) {
    toggle.addEventListener("click", async () => {
      try {
        if (music.paused) {
          await music.play();
        } else {
          music.pause();
        }
      } catch (e) {}
    });
  }
  if (item.d === 14) {
    runFinale();
  }
}

function celebrateHearts() {
  const root = document.getElementById("hearts-root");
  if (!root) return;
  const w = window.innerWidth;
  const h = window.innerHeight;
  for (let i = 0; i < 40; i++) {
    const x = Math.random() * w;
    const y = h - 20 - Math.random() * 40;
    const s = 12 + Math.random() * 18;
    setTimeout(() => spawnHeartAt(root, x, y, s), i * 20);
  }
}

function spawnHeartAt(root, x, y, size) {
  const el = document.createElement("div");
  el.className = "heart fade";
  el.style.left = x + "px";
  el.style.top = y + "px";
  el.style.width = size + "px";
  el.style.height = size + "px";
  el.style.setProperty("--romantic-pink", pickPink());
  root.appendChild(el);
  setTimeout(() => el.remove(), 1600);
}

function pickPink() {
  const shades = ["#F87171", "#fb7185", "#f472b6", "#ef4444", "#fca5a5"];
  return shades[Math.floor(Math.random() * shades.length)];
}

function typeText(el, text, speed) {
  el.textContent = "";
  let i = 0;
  function step() {
    if (i <= text.length) {
      el.textContent = text.slice(0, i);
      i++;
      setTimeout(step, speed);
    }
  }
  step();
}

function runFinale() {
  const sroot = document.getElementById("sparkles-root");
  if (!sroot) return;
  for (let i = 0; i < 80; i++) {
    setTimeout(() => {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      const sp = document.createElement("div");
      sp.className = "sparkle";
      sp.style.left = x + "px";
      sp.style.top = y + "px";
      sroot.appendChild(sp);
      setTimeout(() => sp.remove(), 1600);
    }, i * 18);
  }
  celebrateHearts();
}

document.addEventListener("DOMContentLoaded", () => {
  renderWelcome();
  renderTimeline();
  renderDay();
});
