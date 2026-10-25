const $ = id => document.getElementById(id);
const DAY = 86400000;

// "2024-01-31" -> local date (avoids timezone shifts)
function parse(s) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}
function toStr(d) {
  const p = n => String(n).padStart(2, "0");
  return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate());
}

/* ---------- 1) days between ---------- */
function between() {
  if (!$("from").value || !$("to").value) {
    $("days").textContent = "—";
    $("ymd").textContent = "";
    $("weeks").textContent = "";
    return;
  }
  let a = parse($("from").value), b = parse($("to").value);
  if (a > b) [a, b] = [b, a];                     // order doesn't matter

  const total = Math.round((b - a) / DAY);
  let y = b.getFullYear() - a.getFullYear();
  let m = b.getMonth() - a.getMonth();
  let d = b.getDate() - a.getDate();
  if (d < 0) { m--; d += new Date(b.getFullYear(), b.getMonth(), 0).getDate(); }
  if (m < 0) { y--; m += 12; }

  $("days").textContent = total.toLocaleString("en-IN") + (total === 1 ? " day" : " days");
  $("ymd").textContent = y + " years, " + m + " months, " + d + " days";
  $("weeks").textContent = Math.floor(total / 7) + " weeks, " + (total % 7) + " days";
}

/* ---------- 2) add / subtract ---------- */
let sign = 1;

function addMonths(date, n) {
  const t = new Date(date.getFullYear(), date.getMonth() + n, 1);
  const last = new Date(t.getFullYear(), t.getMonth() + 1, 0).getDate();
  t.setDate(Math.min(date.getDate(), last));      // Jan 31 + 1 month = Feb 29/28
  return t;
}

function shift() {
  const n = parseInt($("amt").value, 10);
  if (!$("start").value || isNaN(n) || n < 0) { $("res").textContent = "—"; return; }

  const s = parse($("start").value);
  const unit = $("unit").value;
  let r;
  if (unit === "days")        r = new Date(s.getFullYear(), s.getMonth(), s.getDate() + sign * n);
  else if (unit === "weeks")  r = new Date(s.getFullYear(), s.getMonth(), s.getDate() + sign * n * 7);
  else if (unit === "months") r = addMonths(s, sign * n);
  else                        r = addMonths(s, sign * n * 12);

  $("res").textContent = r.toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric"
  });
}

document.querySelectorAll(".u").forEach(b => {
  b.onclick = () => {
    sign = parseInt(b.dataset.s, 10);
    document.querySelectorAll(".u").forEach(x => x.classList.toggle("on", x === b));
    shift();
  };
});

["from", "to"].forEach(id => $(id).addEventListener("input", between));
["start", "amt"].forEach(id => $(id).addEventListener("input", shift));
$("unit").addEventListener("change", shift);

$("start").value = toStr(new Date());             // default: today