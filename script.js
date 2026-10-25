const $ = id => document.getElementById(id);
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// tool count in the hero chip
const total = CATEGORIES.reduce((n, c) => n + c.tools.length, 0);
$("count").textContent = "● " + total + " free tools";

function toast(msg) {
  const t = $("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toast.id);
  toast.id = setTimeout(() => t.classList.remove("show"), 1800);
}

function openTool(cat, name) {
  const s = slug(name);
  if (READY.includes(s)) location.href = `tools/${cat.id}/${s}/${s}.html`;
  else toast(name + " is coming soon ✨");
}

function showPanel(title, items) {
  $("panelTitle").textContent = title;
  const box = $("panelTools");
  box.textContent = "";
  items.forEach((it, i) => {
    const b = document.createElement("button");
    b.className = "tool t" + (i % 5);
    b.textContent = it.name;
    b.onclick = () => openTool(it.cat, it.name);
    box.appendChild(b);
  });
  if (!items.length) box.textContent = "No tools found 😅";
  $("panel").hidden = false;
}

// category cards
CATEGORIES.forEach((c, i) => {
  const d = document.createElement("button");
  d.className = "card c" + (i % 8);
  d.innerHTML = `<span class="ico">${c.icon}</span><b>${c.name}</b><small class="mono">${c.tools.length} tools</small>`;
  d.onclick = () => {
    showPanel(c.name, c.tools.map(name => ({ cat: c, name })));
    $("panel").scrollIntoView({ behavior: "smooth", block: "start" });
  };
  $("grid").appendChild(d);
});

// search (debounced so it never lags)
let timer;
function search() {
  const raw = $("q").value.trim();
  if (!raw) { $("panel").hidden = true; return; }
  const v = raw.toLowerCase();
  const hits = [];
  CATEGORIES.forEach(c => c.tools.forEach(name => {
    if ((name + " " + c.name).toLowerCase().includes(v)) hits.push({ cat: c, name });
  }));
  showPanel('Results for "' + raw + '"', hits);
}
$("q").addEventListener("input", () => { clearTimeout(timer); timer = setTimeout(search, 150); });
$("go").onclick = search;
$("closePanel").onclick = () => { $("panel").hidden = true; };