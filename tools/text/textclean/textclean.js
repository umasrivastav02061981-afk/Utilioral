const $ = id => document.getElementById(id);
const len = s => [...s].length;

function note(m) {
  $("msg").textContent = m;
  clearTimeout(note.id);
  note.id = setTimeout(() => ($("msg").textContent = ""), 1800);
}

function clean(text) {
  let t = text.replace(/\r\n?/g, "\n");

  if ($("html").checked)    t = t.replace(/<[^>]*>/g, "");
  if ($("emoji").checked)   t = t.replace(/[\p{Extended_Pictographic}\uFE0F\u200D]/gu, "");
  if ($("special").checked) t = t.replace(/[^\p{L}\p{M}\p{N}\s.,!?'"\-:;()]/gu, "");
  if ($("spaces").checked)  t = t.replace(/[ \t\u00A0]+/g, " ");

  let lines = t.split("\n");
  if ($("trim").checked)  lines = lines.map(l => l.trim());
  if ($("blank").checked) lines = lines.filter(l => l.trim() !== "");

  if ($("join").checked) {
    return lines.map(l => l.trim()).filter(Boolean).join(" ");
  }
  return lines.join("\n");
}

function run() {
  const before = $("inp").value;
  const after = clean(before);
  $("out").value = after;

  if (!before) { $("stats").textContent = ""; return; }
  const diff = len(before) - len(after);
  $("stats").textContent =
    "Characters: " + len(before) + " → " + len(after) +
    (diff > 0 ? "  (removed " + diff + ")" : "  (nothing to clean)");
}

$("inp").addEventListener("input", run);
document.querySelectorAll(".opt input").forEach(c => c.addEventListener("change", run));

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