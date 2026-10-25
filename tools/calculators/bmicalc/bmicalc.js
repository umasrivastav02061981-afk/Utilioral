const $ = id => document.getElementById(id);
let unit = "metric";

function calc() {
  const w = parseFloat($("w").value);
  let m;
  if (unit === "metric") {
    m = parseFloat($("hcm").value) / 100;
  } else {
    const ft = parseFloat($("hft").value) || 0;
    const inch = parseFloat($("hin").value) || 0;
    m = (ft * 12 + inch) * 0.0254;
  }
  const kg = unit === "metric" ? w : w * 0.45359237;

  if (!(kg > 0) || !(m > 0)) {
    $("val").textContent = "—";
    $("cat").textContent = "Enter your details";
    $("range").textContent = "";
    $("res").style.background = "";
    return;
  }

  const bmi = kg / (m * m);
  let cat, col;
  if (bmi < 18.5) { cat = "Underweight"; col = "#F3DC95"; }
  else if (bmi < 25) { cat = "Normal"; col = "#C9D5A8"; }
  else if (bmi < 30) { cat = "Overweight"; col = "#F4B27A"; }
  else { cat = "Obese"; col = "#F2B8A2"; }

  const k = unit === "metric" ? 1 : 1 / 0.45359237;
  const lo = (18.5 * m * m * k).toFixed(1);
  const hi = (24.9 * m * m * k).toFixed(1);

  $("val").textContent = bmi.toFixed(1);
  $("cat").textContent = cat;
  $("range").textContent = "Healthy range for your height: " + lo + " – " + hi + " " + (unit === "metric" ? "kg" : "lb");
  $("res").style.background = col;
}

document.querySelectorAll(".u").forEach(b => {
  b.onclick = () => {
    unit = b.dataset.u;
    document.querySelectorAll(".u").forEach(x => x.classList.toggle("on", x === b));
    $("wu").textContent = unit === "metric" ? "kg" : "lb";
    $("hMetric").hidden = unit !== "metric";
    $("hImp").hidden = unit === "metric";
    document.querySelectorAll(".bmi input").forEach(i => (i.value = ""));
    calc();
  };
});

document.querySelectorAll(".bmi input").forEach(i => i.addEventListener("input", calc));