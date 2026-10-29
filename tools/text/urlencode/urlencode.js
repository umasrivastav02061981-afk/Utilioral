const $ = id => document.getElementById(id);
let mode = "enc";
let scope = "part";

function convert(s) {
  if (mode === "enc") return scope === "part" ? encodeURIComponent(s) : encodeURI(s);
  return scope === "part" ? decodeURIComponent(s) : decodeURI(s);
}

function note(m) {
  $("msg").textContent = m;
  clearTimeout(note.id);
  note.id = setTimeout(() => ($("msg").textContent = ""), 1800);
}

function run() {
  const v = $("inp").value;
  const st = $("stats");
  st.classList.remove("err");
  if (!v) { $("out").value = ""; st.textContent = ""; return; }
  try {
    const r = convert(v);
    $("out").value = r;
    st.textContent = v.length + " → " + r.length + " characters";
  } catch (e) {
    $("out").value = "";
    st.classList.add("err");
    st.textContent = "Malformed text: it can't be converted";
  }
}

function mark(sel, attr, value) {
  document.querySelectorAll(sel + " .u").forEach(b => b.classList.toggle("on", b.dataset[attr] === value));
}

function setMode(m) {
  mode = m;
  mark("#modes", "m", m);
  $("inLabel").textContent = m === "enc" ? "Text or URL to encode" : "Encoded text to decode";
  run();
}

document.querySelectorAll("#modes .u").forEach(b => (b.onclick = () => setMode(b.dataset.m)));
document.querySelectorAll("#scopes .u").forEach(b => {
  b.onclick = () => { scope = b.dataset.s; mark("#scopes", "s", scope); run(); };
});

$("inp").addEventListener("input", run);

$("swap").onclick = () => {
  if (!$("out").value) return note("Nothing to swap yet");
  $("inp").value = $("out").value;
  setMode(mode === "enc" ? "dec" : "enc");
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