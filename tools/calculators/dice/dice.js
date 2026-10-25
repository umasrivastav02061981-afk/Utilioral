const $ = id => document.getElementById(id);
const FACES = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let count = 2;
let busy = false;

function draw(values) {
  const box = $("dice");
  box.textContent = "";
  values.forEach(v => {
    const d = document.createElement("div");
    d.className = "die";
    d.textContent = FACES[v - 1];
    box.appendChild(d);
  });
}

function roll() {
  if (busy) return;
  busy = true;
  let step = 0;
  const steps = reduce ? 1 : 8;               // quick "shuffle" animation
  const timer = setInterval(() => {
    const vals = Array.from({ length: count }, () => rand(1, 6));
    draw(vals);
    step++;
    if (step >= steps) {
      clearInterval(timer);
      busy = false;
      $("total").textContent = count > 1
        ? "Total: " + vals.reduce((a, b) => a + b, 0)
        : "You rolled a " + vals[0];
    }
  }, 70);
}

document.querySelectorAll("#counts .rt").forEach(b => {
  b.onclick = () => {
    if (busy) return;
    count = parseInt(b.dataset.n, 10);
    document.querySelectorAll("#counts .rt").forEach(x => x.classList.toggle("on", x === b));
    draw(Array(count).fill(1));
    $("total").textContent = "";
  };
});
$("roll").onclick = roll;

/* ---------- random number ---------- */
function gen() {
  let a = parseInt($("min").value, 10);
  let b = parseInt($("max").value, 10);
  if (isNaN(a) || isNaN(b)) { $("rnd").textContent = "Enter two whole numbers"; return; }
  if (Math.abs(a) > 1e12 || Math.abs(b) > 1e12) { $("rnd").textContent = "Use numbers up to 1 trillion"; return; }
  if (a > b) [a, b] = [b, a];                 // min and max can be in any order
  $("rnd").textContent = rand(a, b).toLocaleString("en-IN");
}
$("gen").onclick = gen;

draw(Array(count).fill(1));