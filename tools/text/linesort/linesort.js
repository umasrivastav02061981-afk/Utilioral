const $ = id => document.getElementById(id);
const len = s => [...s].length;
const ic = () => $("icase").checked;
const nat = () => $("nat").checked;

// compare two lines using the two switches
const cmp = (a, b) =>
  a.localeCompare(b, undefined, { sensitivity: ic() ? "accent" : "variant", numeric: nat() });

const ACTIONS = [
  ["A → Z", l => l.slice().sort(cmp)],
  ["Z → A", l => l.slice().sort((a, b) => cmp(b, a))],
  ["Short → Long", l => l.slice().sort((a, b) => len(a) - len(b) || cmp(a, b))],
  ["Long → Short", l => l.slice().sort((a, b) => len(b) - len(a) || cmp(a, b))],
  ["1 → 9 (numbers)", l => l.slice().sort((a, b) => {
    const x = parseFloat(a), y = parseFloat(b);
    if (isNaN(x) && isNaN(y)) return cmp(a, b);
    if (isNaN(x)) return 1;             // lines without numbers go last
    if (isNaN(y)) return -1;
    return x - y;
  })],
  ["Reverse", l => l.slice().reverse()],
  ["Shuffle", l => {
    const r = l.slice();
    for (let i = r.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [r[i], r[j]] = [r[j], r[i]];
    }
    return r;
  }],
  ["Remove duplicates", l => {
    const seen = new Set();
    return l.filter(x => {
      const k = (ic() ? x.toLowerCase() : x).trim();
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  }],
  ["Remove empty lines", l => l.filter(x => x.trim() !== "")]
];

let current = null;

function note(m) {
  $("msg").textContent = m;
  clearTimeout(note.id);
  note.id = setTimeout(() => ($("msg").textContent = ""), 1800);
}

function getLines() {
  const t = $("inp").value.replace(/\r\n?/g, "\n");
  if (t === "") return [];
  const l = t.split("\n");
  if (l.length > 1 && l[l.length - 1] === "") l.pop();   // ignore the final Enter
  return l;
}

function run() {
  const lines = getLines();
  if (!lines.length) { $("out").value = ""; $("stats").textContent = ""; return; }
  if (!current) {
    $("out").value = "";
    $("stats").textContent = lines.length + (lines.length === 1 ? " line" : " lines");
    return;
  }
  const out = current(lines);
  $("out").value = out.join("\n");
  const removed = lines.length - out.length;
  $("stats").textContent =
    "Lines: " + lines.length + " → " + out.length + (removed > 0 ? "  (removed " + removed + ")" : "");
}

ACTIONS.forEach(([label, f]) => {
  const b = document.createElement("button");
  b.className = "rt";
  b.textContent = label;
  b.onclick = () => {
    current = f;
    document.querySelectorAll("#acts .rt").forEach(x => x.classList.toggle("on", x === b));
    run();
  };
  $("acts").appendChild(b);
});

$("inp").addEventListener("input", run);
$("icase").addEventListener("change", run);
$("nat").addEventListener("change", run);

$("use").onclick = () => {
  if (!$("out").value) return note("Nothing to use yet");
  $("inp").value = $("out").value;
  run();
  note("Result moved to the top box");
};

$("clear").onclick = () => {
  $("inp").value = "";
  run();
  $("inp").focus();
};

$("copy").onclick = async () => {
  const t = $("out").value;
  if (!t) return note(current ? "Nothing to copy" : "Pick an action first");
  try {
    await navigator.clipboard.writeText(t);
    note("Copied ✓");
  } catch (e) {
    $("out").select();
    note("Long-press the text and tap Copy");
  }
};