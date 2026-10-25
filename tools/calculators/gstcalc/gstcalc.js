const $ = id => document.getElementById(id);
let mode = "add";
const money = v => "₹" + v.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function clear() {
  ["big", "base", "gst", "cgst", "sgst", "total"].forEach(id => ($(id).textContent = "—"));
}

function calc() {
  const amt = parseFloat($("amt").value);
  const rate = parseFloat($("rate").value);

  document.querySelectorAll(".rt").forEach(b =>
    b.classList.toggle("on", parseFloat(b.dataset.r) === rate));

  if (!(amt >= 0) || !(rate >= 0)) return clear();

  let base, total;
  if (mode === "add") { base = amt; total = amt * (1 + rate / 100); }
  else { total = amt; base = amt / (1 + rate / 100); }
  const gst = total - base;

  $("big").textContent = money(mode === "add" ? total : base);
  $("base").textContent = money(base);
  $("gst").textContent = money(gst);
  $("cgst").textContent = money(gst / 2);
  $("sgst").textContent = money(gst / 2);
  $("total").textContent = money(total);
}

document.querySelectorAll(".u").forEach(b => {
  b.onclick = () => {
    mode = b.dataset.m;
    document.querySelectorAll(".u").forEach(x => x.classList.toggle("on", x === b));
    $("amtText").textContent = mode === "add" ? "Amount before GST (₹)" : "Amount including GST (₹)";
    $("bl").textContent = mode === "add" ? "Amount with GST" : "Amount without GST";
    calc();
  };
});

document.querySelectorAll(".rt").forEach(b => {
  b.onclick = () => { $("rate").value = b.dataset.r; calc(); };
});

$("amt").addEventListener("input", calc);
$("rate").addEventListener("input", calc);