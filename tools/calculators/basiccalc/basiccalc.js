const display = document.getElementById("display");
const history = document.getElementById("history");
const sym = { "+": "+", "-": "−", "*": "×", "/": "÷" };

let current = "0", prev = null, op = null, fresh = false;

const fmt = n => String(parseFloat(Number(n).toPrecision(12)));

function calc(a, b, o) {
  a = +a; b = +b;
  if (o === "+") return a + b;
  if (o === "-") return a - b;
  if (o === "*") return a * b;
  if (o === "/") return b === 0 ? NaN : a / b;
  return b;
}

function reset() { current = "0"; prev = null; op = null; fresh = false; }
function fail() { reset(); current = "Error"; show(); }
function show() {
  display.textContent = current;
  history.textContent = op ? fmt(prev) + " " + sym[op] : "";
}

function press(k) {
  if (current === "Error") reset();

  if (/^\d$/.test(k)) {
    if (!fresh && current.replace(/[-.]/g, "").length >= 12) return;
    current = (current === "0" || fresh) ? k : current + k;
    fresh = false;

  } else if (k === ".") {
    if (fresh) { current = "0."; fresh = false; }
    else if (!current.includes(".")) current += ".";

  } else if ("+-*/".includes(k)) {
    if (op && !fresh) {
      const r = calc(prev, current, op);
      if (isNaN(r)) return fail();
      current = fmt(r);
    }
    prev = current; op = k; fresh = true;

  } else if (k === "=") {
    if (op) {
      const r = calc(prev, current, op);
      if (isNaN(r)) return fail();
      history.textContent = fmt(prev) + " " + sym[op] + " " + current + " =";
      current = fmt(r); prev = null; op = null; fresh = true;
      display.textContent = current;
      return;
    }

  } else if (k === "C") {
    reset();

  } else if (k === "back") {
    if (!fresh) current = current.length > 1 ? current.slice(0, -1) : "0";
    if (current === "-") current = "0";

  } else if (k === "neg") {
    if (current !== "0") current = current.startsWith("-") ? current.slice(1) : "-" + current;

  } else if (k === "%") {
    current = fmt(parseFloat(current) / 100);
    fresh = true;
  }
  show();
}

document.querySelector(".keys").addEventListener("click", e => {
  const b = e.target.closest("button");
  if (b) press(b.dataset.k);
});

document.addEventListener("keydown", e => {
  const k = e.key;
  if (/^[0-9.+\-*\/%]$/.test(k)) press(k);
  else if (k === "Enter" || k === "=") { e.preventDefault(); press("="); }
  else if (k === "Backspace") press("back");
  else if (k === "Escape" || k.toLowerCase() === "c") press("C");
});