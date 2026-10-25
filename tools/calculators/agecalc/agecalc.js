const $ = id => document.getElementById(id);
const DAY = 86400000;

// "2000-01-31" -> local date (avoids timezone shifts)
function parse(s) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}
function toStr(d) {
  const p = n => String(n).padStart(2, "0");
  return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate());
}

function clear(msg) {
  ["ty", "tm", "td", "days", "nb"].forEach(id => ($(id).textContent = "—"));
  $("msg").textContent = msg || "";
}

function calc() {
  if (!$("dob").value) return clear();
  const b = parse($("dob").value);
  const to = $("on").value ? parse($("on").value) : parse(toStr(new Date()));

  if (b > to) return clear("Birth date is after the chosen date");

  // years, months, days
  let y = to.getFullYear() - b.getFullYear();
  let m = to.getMonth() - b.getMonth();
  let d = to.getDate() - b.getDate();
  if (d < 0) {
    m--;
    d += new Date(to.getFullYear(), to.getMonth(), 0).getDate(); // days in previous month
  }
  if (m < 0) { y--; m += 12; }

  $("ty").textContent = y;
  $("tm").textContent = m;
  $("td").textContent = d;
  $("days").textContent = Math.round((to - b) / DAY).toLocaleString("en-IN");

  // next birthday
  let next = new Date(to.getFullYear(), b.getMonth(), b.getDate());
  if (next < to) next = new Date(to.getFullYear() + 1, b.getMonth(), b.getDate());
  const left = Math.round((next - to) / DAY);
  const wk = next.toLocaleDateString("en-IN", { weekday: "long" });
  $("nb").textContent = left === 0 ? "Today! 🎉" : left + " days (" + wk + ")";
  $("msg").textContent = "";
}

// today as the default "Age on" date, and no future birth dates
$("on").value = toStr(new Date());
$("dob").max = toStr(new Date());

$("dob").addEventListener("input", calc);
$("on").addEventListener("input", calc);