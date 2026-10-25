const $ = id => document.getElementById(id);
const IDS = ["c", "f", "k"];
const round = v => String(parseFloat(v.toFixed(2)));

function clearOthers(from) {
  IDS.forEach(id => { if (id !== from) $(id).value = ""; });
}

function update(from) {
  $("msg").textContent = "";
  const raw = parseFloat($(from).value);
  if (isNaN(raw)) return clearOthers(from);

  // everything goes through Celsius
  let c;
  if (from === "c") c = raw;
  else if (from === "f") c = (raw - 32) * 5 / 9;
  else c = raw - 273.15;

  if (c < -273.15 - 1e-9) {
    $("msg").textContent = "That is below absolute zero (−273.15 °C)";
    return clearOthers(from);
  }

  const vals = { c: c, f: c * 9 / 5 + 32, k: c + 273.15 };
  IDS.forEach(id => { if (id !== from) $(id).value = round(vals[id]); });
}

IDS.forEach(id => $(id).addEventListener("input", () => update(id)));

document.querySelectorAll(".rt").forEach(b => {
  b.onclick = () => { $("c").value = b.dataset.c; update("c"); };
});