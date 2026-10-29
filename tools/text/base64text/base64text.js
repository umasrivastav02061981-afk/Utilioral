const $ = id => document.getElementById(id);
let mode = "enc";

// text -> bytes -> Base64 (works for emoji and Hindi too)
function enc(s) {
  const bytes = new TextEncoder().encode(s);
  let bin = "";
  bytes.forEach(b => (bin += String.fromCharCode(b)));
  let r = btoa(bin);
  if ($("safe").checked) r = r.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  return r;
}

function dec(s) {
  s = s.replace(/\s+/g, "").replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  const bin = atob(s);                                   // throws if not valid Base64
  const bytes = Uint8Array.from(bin, c => c.charCodeAt(0));
  return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
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
  if (!v.trim()) { $("out").value = ""; st.textContent = ""; return; }
  try {
    const r = mode === "enc" ? enc(v) : dec(v);
    $("out").value = r;
    st.textContent = v.length + " → " + r.length + " characters";
  } catch (e) {
    $("out").value = "";
    st.classList.add("err");
    st.textContent = mode === "dec"
      ? "Not valid Base64, or it doesn't decode to text"
      : "Couldn't encode that text";
  }
}

function setMode(m) {
  mode = m;
  document.querySelectorAll("#modes .u").forEach(b => b.classList.toggle("on", b.dataset.m === m));
  $("inLabel").textContent = m === "enc" ? "Text to encode" : "Base64 to decode";
  run();
}

document.querySelectorAll("#modes .u").forEach(b => (b.onclick = () => setMode(b.dataset.m)));
$("inp").addEventListener("input", run);
$("safe").addEventListener("change", run);

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