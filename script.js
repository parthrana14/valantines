const input = document.getElementById("message-input");
const output = document.getElementById("message-output");
const celebrate = document.getElementById("celebrate-btn");
const heartsRoot = document.getElementById("hearts-root");

function updateOutput() {
  output.textContent = input.value || "";
}

function spawnHeart(x, y, size) {
  const h = document.createElement("div");
  h.className = "heart fade";
  h.style.left = x + "px";
  h.style.top = y + "px";
  h.style.width = size + "px";
  h.style.height = size + "px";
  h.style.setProperty("--romantic-pink", pickPink());
  heartsRoot.appendChild(h);
  setTimeout(() => h.remove(), 1600);
}

function pickPink() {
  const shades = ["#F87171", "#fb7185", "#f472b6", "#ef4444", "#fca5a5"];
  return shades[Math.floor(Math.random() * shades.length)];
}

function celebrateHearts() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  for (let i = 0; i < 36; i++) {
    const x = Math.random() * w;
    const y = h - 20 - Math.random() * 40;
    const s = 12 + Math.random() * 16;
    setTimeout(() => spawnHeart(x, y, s), i * 20);
  }
}

input.addEventListener("input", updateOutput);
celebrate.addEventListener("click", celebrateHearts);
updateOutput();
