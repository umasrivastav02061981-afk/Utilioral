const $ = id => document.getElementById(id);
const n = id => parseFloat($(id).value);
const fmt = v => String(parseFloat(v.toFixed(4)));

function run() {
  // 1) X% of Y
  const a1 = n("a1"), b1 = n("b1");
  $("r1").textContent = isNaN(a1) || isNaN(b1) ? "—" : fmt(a1 / 100 * b1);

  // 2) X is what % of Y
  const a2 = n("a2"), b2 = n("b2");
  $("r2").textContent = isNaN(a2) || isNaN(b2) ? "—"
    : b2 === 0 ? "Can't divide by 0" : fmt(a2 / b2 * 100) + "%";

  // 3) % change from X to Y
  const a3 = n("a3"), b3 = n("b3");
  let t = "—";
  if (!isNaN(a3) && !isNaN(b3)) {
    if (a3 === 0) t = "Can't divide by 0";
    else {
      const c = (b3 - a3) / Math.abs(a3) * 100;
      t = c === 0 ? "No change"
        : (c > 0 ? "↑ " : "↓ ") + fmt(Math.abs(c)) + "% " + (c > 0 ? "increase" : "decrease");
    }
  }
  $("r3").textContent = t;
}

document.querySelectorAll("input").forEach(i => i.addEventListener("input", run));