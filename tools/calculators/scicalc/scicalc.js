const $ = id => document.getElementById(id);
let expr = "", deg = true, done = false, err = false;

/* ---------- reading the expression (no eval) ---------- */
function tokenize(s) {
  s = s.replace(/÷/g, "/").replace(/×/g, "*").replace(/−/g, "-")
       .replace(/√/g, "sqrt").replace(/π/g, "pi");
  const re = /^(?:\d+\.?\d*(?:e[+-]?\d+)?|\.\d+|sin|cos|tan|log|ln|sqrt|pi|e|[-+*\/^!()])/;
  const out = [];
  while (s.length) {
    const m = s.match(re);
    if (!m) throw new Error("bad input");
    out.push(m[0]);
    s = s.slice(m[0].length);
  }
  return out;
}

function fact(n) {
  if (!Number.isInteger(n) || n < 0 || n > 170) throw new Error("factorial");
  let r = 1;
  for (let k = 2; k <= n; k++) r *= k;
  return r;
}

function fn(name, x) {
  const rad = deg ? x * Math.PI / 180 : x;
  switch (name) {
    case "sin": return Math.sin(rad);
    case "cos": return Math.cos(rad);
    case "tan":
      if (deg && Math.abs(x % 180) === 90) throw new Error("tan");
      return Math.tan(rad);
    case "log": return Math.log10(x);
    case "ln":  return Math.log(x);
    case "sqrt": return Math.sqrt(x);
  }
  throw new Error("function");
}

function evaluate(str) {
  const t = tokenize(str);
  let i = 0;
  const peek = () => t[i];
  const next = () => t[i++];
  const startsValue = tok =>
    tok !== undefined && (/^[\d.]/.test(tok) || /^(sin|cos|tan|log|ln|sqrt|pi|e|\()$/.test(tok));

  function expression() {
    let v = term();
    while (peek() === "+" || peek() === "-") {
      const o = next();
      const r = term();
      v = o === "+" ? v + r : v - r;
    }
    return v;
  }
  function term() {
    let v = unary();
    while (true) {
      const p = peek();
      if (p === "*" || p === "/") {
        next();
        const r = unary();
        v = p === "*" ? v * r : v / r;
      } else if (startsValue(p)) {
        v = v * unary();                 // 2π, 3(4+1), 2sin(30)
      } else break;
    }
    return v;
  }
  function unary() {
    if (peek() === "-") { next(); return -unary(); }
    if (peek() === "+") { next(); return unary(); }
    return power();
  }
  function power() {
    let b = postfix();
    if (peek() === "^") { next(); b = Math.pow(b, unary()); }
    return b;
  }
  function postfix() {
    let v = primary();
    while (peek() === "!") { next(); v = fact(v); }
    return v;
  }
  function primary() {
    const tok = next();
    if (tok === undefined) throw new Error("unexpected end");
    if (tok === "(") {
      const v = expression();
      if (next() !== ")") throw new Error("missing )");
      return v;
    }
    if (tok === "pi") return Math.PI;
    if (tok === "e") return Math.E;
    if (/^[a-z]+$/.test(tok)) {
      if (next() !== "(") throw new Error("missing (");
      const v = expression();
      if (next() !== ")") throw new Error("missing )");
      return fn(tok, v);
    }
    const n = parseFloat(tok);
    if (isNaN(n)) throw new Error("bad number");
    return n;
  }

  const result = expression();
  if (i !== t.length) throw new Error("extra input");
  return result;
}

/* ---------- showing results ---------- */
function fmt(v) {
  v = parseFloat(v.toPrecision(12));          // sin(30°) -> 0.5, not 0.49999…
  if (Math.abs(v) < 1e-12) v = 0;
  const a = Math.abs(v);
  if (a !== 0 && (a >= 1e15 || a < 1e-9)) return v.toExponential(6).replace(/\.?0+e/, "e");
  return String(v);
}

function show() {
  const d = $("disp");
  d.textContent = err ? "Error" : (expr || "0");
  d.scrollLeft = d.scrollWidth;
}

function equals() {
  if (!expr) return;
  let s = expr;
  const open = (s.match(/\(/g) || []).length - (s.match(/\)/g) || []).length;
  if (open > 0) s += ")".repeat(open);       // auto-close brackets
  try {
    const v = evaluate(s);
    if (!isFinite(v)) throw new Error("out of range");
    $("hist").textContent = s + " =";
    expr = fmt(v);
    done = true;
  } catch (e) {
    $("hist").textContent = "";
    expr = "";
    err = true;
  }
}

function press(k) {
  err = false;
  if (k === "C") {
    expr = ""; done = false;
    $("hist").textContent = "";
  } else if (k === "back") {
    if (done) { expr = ""; done = false; }
    else expr = expr.replace(/(sin\(|cos\(|tan\(|log\(|ln\(|√\()$|.$/, "");
  } else if (k === "=") {
    equals();
  } else {
    if (done) {
      if (!"+−×÷^!".includes(k)) expr = "";   // operators continue with the answer
      done = false;
    }
    expr += k;
  }
  show();
}

document.querySelector(".keys").addEventListener("click", e => {
  const b = e.target.closest("button");
  if (b) press(b.dataset.k);
});

document.querySelectorAll("#mode .u").forEach(b => {
  b.onclick = () => {
    deg = b.dataset.d === "1";
    document.querySelectorAll("#mode .u").forEach(x => x.classList.toggle("on", x === b));
  };
});

document.addEventListener("keydown", e => {
  const k = e.key;
  if (/^[0-9.()+^!]$/.test(k)) press(k);
  else if (k === "-") press("−");
  else if (k === "*") press("×");
  else if (k === "/") { e.preventDefault(); press("÷"); }
  else if (k === "Enter" || k === "=") { e.preventDefault(); press("="); }
  else if (k === "Backspace") press("back");
  else if (k === "Escape") press("C");
});