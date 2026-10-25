const $ = id => document.getElementById(id);

// every unit = how many "base" units it contains
const UNITS = {
  Length: { mm: 0.001, cm: 0.01, m: 1, km: 1000, inch: 0.0254, foot: 0.3048, yard: 0.9144, mile: 1609.344 },
  Weight: { mg: 0.000001, g: 0.001, kg: 1, tonne: 1000, ounce: 0.028349523125, pound: 0.45359237 },
  Area:   { "cm²": 0.0001, "m²": 1, "km²": 1000000, hectare: 10000, acre: 4046.8564224, "sq ft": 0.09290304, "sq yd": 0.83612736, "sq inch": 0.00064516 },
  Volume: { ml: 0.001, litre: 1, "m³": 1000, tsp: 0.00492892159375, tbsp: 0.01478676478125, cup: 0.2365882365, gallon: 3.785411784 },
  Speed:  { "m/s": 1, "km/h": 1 / 3.6, mph: 0.44704, knot: 0.5144444444, "ft/s": 0.3048 }
};
const DEFAULTS = {
  Length: ["m", "foot"], Weight: ["kg", "pound"], Area: ["m²", "sq ft"],
  Volume: ["litre", "gallon"], Speed: ["km/h", "mph"]
};
let cat = "Length";

function fmt(v) {
  if (v === 0) return "0";
  const a = Math.abs(v);
  if (a < 1e-6 || a >= 1e15) return v.toExponential(4);
  return parseFloat(v.toPrecision(10)).toLocaleString("en-IN", { maximumFractionDigits: 8 });
}

function calc() {
  const x = parseFloat($("val").value);
  if (isNaN(x)) { $("out").textContent = "—"; $("eq").textContent = ""; return; }
  const u = UNITS[cat];
  const r = x * u[$("from").value] / u[$("to").value];
  $("eq").textContent = fmt(x) + " " + $("from").value + " =";
  $("out").textContent = fmt(r) + " " + $("to").value;
}

function fill() {
  const names = Object.keys(UNITS[cat]);
  [$("from"), $("to")].forEach((sel, i) => {
    sel.innerHTML = "";
    names.forEach(n => sel.add(new Option(n, n)));
    sel.value = DEFAULTS[cat][i];
  });
  calc();
}

// category buttons
Object.keys(UNITS).forEach(name => {
  const b = document.createElement("button");
  b.className = "rt" + (name === cat ? " on" : "");
  b.textContent = name;
  b.onclick = () => {
    cat = name;
    document.querySelectorAll("#cats .rt").forEach(x => x.classList.toggle("on", x === b));
    fill();
  };
  $("cats").appendChild(b);
});

$("swap").onclick = () => {
  const f = $("from").value;
  $("from").value = $("to").value;
  $("to").value = f;
  calc();
};

$("val").addEventListener("input", calc);
$("from").addEventListener("change", calc);
$("to").addEventListener("change", calc);

$("val").value = "1";
fill();