const $ = id => document.getElementById(id);
const cap = w => w.charAt(0).toUpperCase() + w.slice(1);

// splits "hello_world-test" and "helloWorld" into words
const words = s =>
  s.replace(/([a-z0-9])([A-Z])/g, "$1 $2").match(/[\p{L}\p{M}\p{N}]+/gu) || [];

// code-style cases work line by line
const perLine = f => s => s.split("\n").map(f).join("\n");

const CASES = [
  ["UPPERCASE", s => s.toUpperCase()],
  ["lowercase", s => s.toLowerCase()],
  ["Title Case", s => s.toLowerCase().replace(/(^|[\s\-"(])(\p{L})/gu, (m, a, b) => a + b.toUpperCase())],
  ["Sentence case", s => s.toLowerCase().replace(/(^\s*|[.!?।]\s+|\n\s*)(\p{L})/gu, (m, a, b) => a + b.toUpperCase())],
  ["camelCase", perLine(l => words(l).map((w, i) => (i ? cap(w.toLowerCase()) : w.toLowerCase())).join(""))],
  ["PascalCase", perLine(l => words(l).map(w => cap(w.toLowerCase())).join(""))],
  ["snake_case", perLine(l => words(l).map(w => w.toLowerCase()).join("_"))],
  ["kebab-case", perLine(l => words(l).map(w => w.toLowerCase()).join("-"))],
  ["aLtErNaTiNg", s => { let i = 0; return s.replace(/\p{L}/gu, ch => (i++ % 2 ? ch.toUpperCase() : ch.toLowerCase())); }],
  ["tOGGLE cASE", s => s.replace(/\p{L}/gu, ch => (ch === ch.toUpperCase() ? ch.toLowerCase() : ch.toUpperCase()))]
];

let current = null;

function note(m) {
  $("msg").textContent = m;
  clearTimeout(note.id);
  note.id = setTimeout(() => ($("msg").textContent = ""), 1800);
}

function run() {
  $("out").value = current ? current($("inp").value) : "";
}

CASES.forEach(([label, f]) => {
  const b = document.createElement("button");
  b.className = "rt";
  b.textContent = label;
  b.onclick = () => {
    current = f;
    document.querySelectorAll("#cases .rt").forEach(x => x.classList.toggle("on", x === b));
    run();
  };
  $("cases").appendChild(b);
});

$("inp").addEventListener("input", run);       // keeps updating while you type

$("clear").onclick = () => {
  $("inp").value = "";
  $("out").value = "";
  $("inp").focus();
};

$("copy").onclick = async () => {
  const t = $("out").value;
  if (!t) return note(current ? "Nothing to copy" : "Pick a case first");
  try {
    await navigator.clipboard.writeText(t);
    note("Copied ✓");
  } catch (e) {
    $("out").select();
    note("Long-press the text and tap Copy");
  }
};