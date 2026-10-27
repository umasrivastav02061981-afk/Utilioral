const $ = id => document.getElementById(id);

const esc = s =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// only normal web, email, anchor and relative links are allowed (blocks javascript:)
const safe = u => /^(https?:\/\/|mailto:|#|\/|\.{1,2}\/)/i.test(u);

/* ---------- inline: bold, italic, code, links ---------- */
function emph(s) {
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/(^|[^\w])__([^_]+)__(?![\w])/g, "$1<strong>$2</strong>");
  s = s.replace(/\*([^*\s][^*]*)\*/g, "<em>$1</em>");
  s = s.replace(/(^|[^\w])_([^_\s][^_]*)_(?![\w])/g, "$1<em>$2</em>");   // snake_case stays untouched
  s = s.replace(/~~([^~]+)~~/g, "<del>$1</del>");
  return s;
}

function inline(raw) {
  const stash = [];
  const keep = html => "\u0000" + (stash.push(html) - 1) + "\u0000";

  let s = esc(raw);                                           // HTML typed by the user stays plain text
  s = s.replace(/`([^`]+)`/g, (m, c) => keep("<code>" + c + "</code>"));
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, t, u) =>
    safe(u) ? keep('<a href="' + u + '" target="_blank" rel="noopener">' + emph(t) + "</a>") : m);
  s = emph(s);

  while (/\u0000\d+\u0000/.test(s)) s = s.replace(/\u0000(\d+)\u0000/g, (m, i) => stash[i]);
  return s;
}

/* ---------- blocks: headings, lists, quotes, code ---------- */
function item(text) {
  const t = text.match(/^\[( |x|X)\]\s+(.*)$/);
  return t
    ? '<input type="checkbox" disabled' + (t[1] !== " " ? " checked" : "") + "> " + inline(t[2])
    : inline(text);
}

function render(md) {
  const lines = md.replace(/\r\n?/g, "\n").split("\n");
  const out = [];
  let para = [];
  let list = null;
  let i = 0;

  const flushPara = () => {
    if (para.length) { out.push("<p>" + para.map(inline).join("<br>") + "</p>"); para = []; }
  };
  const flushList = () => {
    if (list) {
      out.push("<" + list.t + ">" + list.items.map(x => "<li>" + x + "</li>").join("") + "</" + list.t + ">");
      list = null;
    }
  };
  const flush = () => { flushPara(); flushList(); };

  while (i < lines.length) {
    const line = lines[i];
    let m;

    // code block
    if (/^```/.test(line)) {
      flush();
      const code = [];
      i++;
      while (i < lines.length && !/^```\s*$/.test(lines[i])) code.push(lines[i++]);
      i++;
      out.push("<pre><code>" + esc(code.join("\n")) + "</code></pre>");
      continue;
    }

    // blank line
    if (/^\s*$/.test(line)) { flush(); i++; continue; }

    // heading
    if ((m = line.match(/^(#{1,6})\s+(.*?)(?:\s+#+)?\s*$/))) {
      flush();
      out.push("<h" + m[1].length + ">" + inline(m[2]) + "</h" + m[1].length + ">");
      i++;
      continue;
    }

    // horizontal line
    if (/^\s*([-*_])(\s*\1){2,}\s*$/.test(line)) { flush(); out.push("<hr>"); i++; continue; }

    // quote
    if (/^>/.test(line)) {
      flush();
      const q = [];
      while (i < lines.length && /^>/.test(lines[i])) q.push(lines[i++].replace(/^>\s?/, ""));
      out.push("<blockquote>" + q.map(inline).join("<br>") + "</blockquote>");
      continue;
    }

    // bullet list
    if ((m = line.match(/^\s*[-*+]\s+(.*)$/))) {
      flushPara();
      if (list && list.t !== "ul") flushList();
      if (!list) list = { t: "ul", items: [] };
      list.items.push(item(m[1]));
      i++;
      continue;
    }

    // numbered list
    if ((m = line.match(/^\s*\d+[.)]\s+(.*)$/))) {
      flushPara();
      if (list && list.t !== "ol") flushList();
      if (!list) list = { t: "ol", items: [] };
      list.items.push(item(m[1]));
      i++;
      continue;
    }

    // normal text
    flushList();
    para.push(line.trim());
    i++;
  }
  flush();
  return out.join("\n");
}

/* ---------- page ---------- */
const SAMPLE = [
  "# Hello Utilioral ✨",
  "",
  "Write **bold**, *italic*, ~~strike~~ and `code`.",
  "",
  "## My list",
  "- Cook rice",
  "- [x] Drink water",
  "- [ ] Ship the project",
  "",
  "1. First step",
  "2. Second step",
  "",
  "> A wise quote goes here.",
  "",
  "[Visit GitHub](https://github.com)",
  "",
  "```",
  "console.log('Hi there');",
  "```",
  "",
  "---"
].join("\n");

function note(m) {
  $("msg").textContent = m;
  clearTimeout(note.id);
  note.id = setTimeout(() => ($("msg").textContent = ""), 1800);
}

function update() {
  const md = $("inp").value;
  $("view").innerHTML = md.trim()
    ? render(md)
    : '<p class="empty">Your preview appears here</p>';
}

function tab(write) {
  $("paneW").classList.toggle("hide", !write);
  $("paneP").classList.toggle("hide", write);
  $("tabW").classList.toggle("on", write);
  $("tabP").classList.toggle("on", !write);
}
$("tabW").onclick = () => tab(true);
$("tabP").onclick = () => { update(); tab(false); };

$("inp").addEventListener("input", update);

$("clear").onclick = () => {
  $("inp").value = "";
  update();
  $("inp").focus();
};

$("copy").onclick = async () => {
  if (!$("inp").value.trim()) return note("Nothing to copy");
  try {
    await navigator.clipboard.writeText(render($("inp").value));
    note("HTML copied ✓");
  } catch (e) {
    note("Copy was blocked by the browser");
  }
};

$("inp").value = SAMPLE;
update();