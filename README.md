# Utilioral ✨

**Every tool you need, one place.** Utilioral is a free, fast and private utilities website. Everything runs in your browser, with no login, no server and no tracking.

Built with plain **HTML, CSS and JavaScript**, with a playful cream, rust and green neo-brutalist design that works on both mobile and desktop.

## 🌐 Live demo
Coming soon: `https://YOURUSERNAME.github.io/Utilioral`

## 🧮 What's inside

### Calculators (14 tools, complete)
Basic · Scientific · Fraction · Percentage · BMI · EMI · GST · Discount · Interest · Age · Date · Unit Converter · Temperature · Dice & Random Number

### Coming next
Text Tools · Dev Toolkit · Productivity · Image Lab · PDF Studio · Privacy · Web Utils

## ✨ Features
- Home page with category cards and instant tool search
- Every tool has its own page, with separate HTML, CSS and JS files
- Fully responsive (phone to desktop) and lightweight
- 100% client-side, so your data never leaves your device
- Keyboard support in the calculators

## 📁 Project structure
```
Utilioral/
├── index.html          Home page
├── style.css           Shared theme and components
├── script.js           Home page logic (search, categories)
├── data/
│   └── tools.js        List of all tools and which are ready
└── tools/
    └── calculators/
        ├── basiccalc/      basiccalc.html, .css, .js
        ├── scicalc/        scicalc.html, .css, .js
        └── ...             one folder per tool
```

## 🚀 Run it locally
1. Download or clone this repository.
2. Open `index.html` in a browser (or use the preview in a code editor).

No installation or build step is needed.

## ➕ Add a new tool
1. Create `tools/<category>/<slug>/` with `<slug>.html`, `<slug>.css` and `<slug>.js`.
2. In `data/tools.js`, add the slug to `READY`.
3. If the tool's display name differs from its slug, add it to `SLUGS`.

## 🗺️ Roadmap
- [x] Home page and tool search
- [x] Calculators (14 tools)
- [ ] Text Tools
- [ ] Dev Toolkit
- [ ] Productivity
- [ ] Image Lab
- [ ] PDF Studio
- [ ] Privacy and Web Utils
- [ ] Publish with GitHub Pages

## 👤 Author
Created with ♥ by **Aviral Srivastav**
