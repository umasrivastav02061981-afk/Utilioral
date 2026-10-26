const $ = id => document.getElementById(id);
const num = n => n.toLocaleString("en-IN");

// [...text] counts emoji as 1 character
const countChars = s => [...s].length;

function time(secs) {
  const m = Math.floor(secs / 60);
  const r = secs % 60;
  return m ? m + " min " + r + " sec" : r + " sec";
}

function note(m) {
  $("msg").textContent = m;
  clearTimeout(note.id);
  note.id = setTimeout(() => ($("msg").textContent = ""), 1800);
}

function update() {
  const t = $("txt").value;
  const trimmed = t.trim();

  const words = trimmed ? trimmed.split(/\s+/).length : 0;

  // sentences: an end mark (. ! ? or Hindi ।) followed by a space/end; 3.5 is not a sentence end
  let sentences = (trimmed.match(/[.!?।]+(?=\s|$)/g) || []).length;
  if (trimmed && !/[.!?।]$/.test(trimmed)) sentences++;

  // paragraphs: non-empty lines
  const paras = t.split(/\n+/).filter(p => p.trim()).length;

  $("w").textContent = num(words);
  $("c").textContent = num(countChars(t));
  $("cn").textContent = num(countChars(t.replace(/\s/g, "")));
  $("s").textContent = num(sentences);
  $("p").textContent = num(paras);
  $("rt").textContent = time(Math.ceil(words / 200 * 60));   // 200 words per minute
  $("st").textContent = time(Math.ceil(words / 130 * 60));   // 130 words per minute
}

$("txt").addEventListener("input", update);

$("clear").onclick = () => {
  $("txt").value = "";
  update();
  $("txt").focus();
};

$("copy").onclick = async () => {
  const t = $("txt").value;
  if (!t) return note("Nothing to copy");
  try {
    await navigator.clipboard.writeText(t);
    note("Copied ✓");
  } catch (e) {
    $("txt").select();
    note("Long-press the text and tap Copy");
  }
};

update();