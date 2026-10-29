const $ = id => document.getElementById(id);

const WORDS = ("lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore " +
  "et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea " +
  "commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur " +
  "excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum").split(" ");
const START = ["lorem", "ipsum", "dolor", "sit", "amet"];
const LIMIT = { p: 50, s: 200, w: 2000 };

const rand = n => Math.floor(Math.random() * n);
const word = () => WORDS[rand(WORDS.length)];
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

let first = true;

function sentence(n, commas = true) {
  const w = Array.from({ length: n }, word);
  if ($("start").checked && first) {
    START.forEach((s, i) => { if (i < n) w[i] = s; });
    first = false;
  }
  if (commas && n > 7) w[2 + rand(n - 5)] += ",";
  return cap(w.join(" ")) + ".";
}

const paragraph = () =>
  Array.from({ length: 3 + rand(4) }, () => sentence(8 + rand(9))).join(" ");

function note(m) {
  $("msg").textContent = m;
  clearTimeout(note.id);
  note.id = setTimeout(() => ($("msg").textContent = ""), 1800);
}

function run() {
  const u = $("unit").value;
  let n = parseInt($("n").value, 10);
  if (isNaN(n) || n < 1) n = 1;
  n = Math.min(n, LIMIT[u]);
  first = true;

  let text;
  if (u === "p") text = Array.from({ length: n }, paragraph).join("\n\n");
  else if (u === "s") text = Array.from({ length: n }, () => sentence(8 + rand(9))).join(" ");
  else text = sentence(n, false);

  $("out").value = text;
  const wc = text.trim().split(/\s+/).length;
  $("stats").textContent = n + " " + { p: "paragraph", s: "sentence", w: "word" }[u] + (n > 1 ? "s" : "") +
    " · " + wc + " words";
}

$("n").addEventListener("input", run);
$("unit").addEventListener("change", run);
$("start").addEventListener("change", run);
$("again").onclick = run;

$("copy").onclick = async () => {
  const t = $("out").value;
  if (!t) return note("Nothing to copy");
  try {
    await navigator.clipboard.writeText(t);
    note("Copied ✓");
  } catch (e) {
    $("out").select();
    note("Long-press the text and tap Copy");
  }
};

run();