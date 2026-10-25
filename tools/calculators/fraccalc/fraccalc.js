const $ = id => document.getElementById(id);
const SYM = { "+": "+", "-": "−", "*": "×", "/": "÷" };
let op = "+";

// empty box = NaN (so it is not treated as 0)
const val = id => ($(id).value.trim() === "" ? NaN : Number($(id).value));

function gcd(x, y) {
  x = Math.abs(x); y = Math.abs(y);
  while (y) [x, y] = [y, x % y];
  return x;
}

function clear(msg) {
  ["out", "mix", "dec"].forEach(id => ($(id).textContent = "—"));
  $("msg").textContent = msg || "";
}

function calc() {
  const [a, b, c, d] = ["a", "b", "c", "d"].map(val);
  if ([a, b, c, d].some(x => isNaN(x))) return clear();
  if (![a, b, c, d].every(Number.isInteger)) return clear("Use whole numbers only");
  if (b === 0 || d === 0) return clear("A denominator can't be 0");

  let n, m;
  if (op === "+")      { n = a * d + c * b; m = b * d; }
  else if (op === "-") { n = a * d - c * b; m = b * d; }
  else if (op === "*") { n = a * c;         m = b * d; }
  else {
    if (c === 0) return clear("Can't divide by zero");
    n = a * d; m = b * c;
  }
  if (!Number.isSafeInteger(n) || !Number.isSafeInteger(m)) return clear("Numbers are too big");

  // simplify, keep the minus sign on top
  const g = gcd(n, m) || 1;
  n /= g; m /= g;
  if (m < 0) { n = -n; m = -m; }

  const out = m === 1 ? String(n) : n + "/" + m;

  let mix = out;
  if (m !== 1 && Math.abs(n) > m) {
    const whole = Math.trunc(n / m);
    const rest = Math.abs(n) % m;
    mix = whole + " " + rest + "/" + m;
  }

  $("out").textContent = out;
  $("mix").textContent = mix;
  $("dec").textContent = String(parseFloat((n / m).toFixed(6)));
  $("msg").textContent = "";
}

document.querySelectorAll(".u").forEach(b => {
  b.onclick = () => {
    op = b.dataset.o;
    $("sym").textContent = SYM[op];
    document.querySelectorAll(".u").forEach(x => x.classList.toggle("on", x === b));
    calc();
  };
});

["a", "b", "c", "d"].forEach(id => $(id).addEventListener("input", calc));