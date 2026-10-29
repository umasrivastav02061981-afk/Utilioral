const $ = id => document.getElementById(id);
let act = "format";

const sortDeep = v =>
  Array.isArray(v) ? v.map(sortDeep)
  : v && typeof v === "object"
    ? Object.keys(v).sort().reduce((o, k) => ((o[k] = sortDeep(v[k])), o), {})
    : v;

// finds "line X, column Y" from the browser's error message
function where(msg, text) {
  let m = msg.match(/line (\d+) column (\d+)/i);
  if (m) return "Line " + m[1] + ", column " + m[2];
  m = msg.match(/position (\d+)/i);
  if (m) {
    const pos = +m[1];
    const before = text.slice(0, pos);
    return "Line " + before.split("\n").length + ", column " + (pos - before.lastIndexOf("\n"));
  }
  return "";
}

function note(m) {
  $("msg").textContent = m;
  clearTimeout(note.id);
  note.id = setTimeout(() => ($("msg").textContent = ""), 1800);
}

function run() {
  const t = $("inp").value;
  const st = $("status");
  st.className = "status mono";
  if (!t.trim()) { $("out").value = ""; st.textContent = ""; return; }

  try {
    let v = JSON.parse(t);
    if ($("sort").checked) v = sortDeep(v);
    const ind = $("indent").value === "tab" ? "\t" : Number($("indent").value);
    $("out").value = act === "format" ? JSON.stringify(v, null, ind) : JSON.stringify(v);
    st.classList.add("ok");
    st.textContent = "✓ Valid JSON";
  } catch (e) {
    $("out").value = "";
    st.classList.add("bad");
    const w = where(e.message, t);
    st.textContent = "✗ Invalid JSON" + (w ? " (" + w + ")" : "") + "\n" + e.message;
  }
}

document.querySelectorAll("#acts .rt").forEach(b => {
  b.onclick = () => {
    act = b.dataset.a;
    document.querySelectorAll("#acts .rt").forEach(x => x.classList.toggle("on", x === b));
    run();
  };
});

$("inp").addEventListener("input", run);
$("indent").addEventListener("change", run);
$("sort").addEventListener("change", run);

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