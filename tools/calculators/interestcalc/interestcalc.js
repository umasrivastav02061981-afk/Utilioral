const $ = id => document.getElementById(id);
const money = v => "₹" + v.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

let mode = "simple";
let inMonths = false;

function clear() {
  ["total", "prin", "intr"].forEach(id => ($(id).textContent = "—"));
}

function calc() {
  const p = parseFloat($("p").value);
  const r = parseFloat($("r").value);
  let t = parseFloat($("t").value);
  if (!(p >= 0) || !(r >= 0) || !(t >= 0)) return clear();
  if (inMonths) t = t / 12;

  let total;
  if (mode === "simple") {
    total = p + (p * r * t) / 100;
  } else {
    const n = parseInt($("freq").value, 10);
    total = p * Math.pow(1 + r / (100 * n), n * t);
  }

  $("total").textContent = money(total);
  $("prin").textContent = money(p);
  $("intr").textContent = money(total - p);
}

// Simple / Compound
document.querySelectorAll("#modes .u").forEach(b => {
  b.onclick = () => {
    mode = b.dataset.m;
    document.querySelectorAll("#modes .u").forEach(x => x.classList.toggle("on", x === b));
    $("freqBox").hidden = mode === "simple";
    calc();
  };
});

// Years / Months
document.querySelectorAll("#tunits .u").forEach(b => {
  b.onclick = () => {
    inMonths = b.dataset.t === "months";
    document.querySelectorAll("#tunits .u").forEach(x => x.classList.toggle("on", x === b));
    calc();
  };
});

["p", "r", "t"].forEach(id => $(id).addEventListener("input", calc));
$("freq").addEventListener("change", calc);