const $ = id => document.getElementById(id);
let inMonths = false;
const money = v => "₹" + Math.round(v).toLocaleString("en-IN");

function clear() {
  $("emi").textContent = "—";
  $("int").textContent = "—";
  $("tot").textContent = "—";
  $("pr").style.width = "0";
}

function calc() {
  const P = parseFloat($("amt").value);
  const rate = parseFloat($("rate").value);
  const t = parseFloat($("ten").value);
  if (!(P > 0) || !(rate >= 0) || !(t > 0)) return clear();

  const n = Math.round(inMonths ? t : t * 12);
  if (n < 1) return clear();

  const r = rate / 12 / 100;
  const emi = r === 0
    ? P / n
    : P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
  const total = emi * n;

  $("emi").textContent = money(emi);
  $("int").textContent = money(total - P);
  $("tot").textContent = money(total);
  $("pr").style.width = (P / total * 100) + "%";
}

document.querySelectorAll(".u").forEach(b => {
  b.onclick = () => {
    inMonths = b.dataset.m === "1";
    document.querySelectorAll(".u").forEach(x => x.classList.toggle("on", x === b));
    calc();
  };
});

document.querySelectorAll(".emi input").forEach(i => i.addEventListener("input", calc));