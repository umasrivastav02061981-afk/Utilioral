const $ = id => document.getElementById(id);
const money = v => "₹" + v.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const ok = v => v >= 0 && v <= 100;

function clear() {
  ["final", "step", "save", "eff"].forEach(id => ($(id).textContent = "—"));
}

function calc() {
  const price = parseFloat($("price").value);
  const d1 = parseFloat($("d1").value);
  const d2 = parseFloat($("d2").value) || 0;   // empty extra discount = 0

  document.querySelectorAll(".rt").forEach(b =>
    b.classList.toggle("on", parseFloat(b.dataset.r) === d1));

  if (!(price >= 0) || !ok(d1) || !ok(d2)) return clear();

  const afterFirst = price * (1 - d1 / 100);
  const finalPrice = afterFirst * (1 - d2 / 100);
  const saved = price - finalPrice;
  const eff = price === 0 ? 0 : saved / price * 100;

  $("final").textContent = money(finalPrice);
  $("step").textContent = money(afterFirst);
  $("save").textContent = money(saved);
  $("eff").textContent = parseFloat(eff.toFixed(2)) + "%";
}

document.querySelectorAll(".rt").forEach(b => {
  b.onclick = () => { $("d1").value = b.dataset.r; calc(); };
});

["price", "d1", "d2"].forEach(id => $(id).addEventListener("input", calc));