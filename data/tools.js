// Add a tool's slug here once its page is built, e.g. "bmi"
const READY = ["basiccalc", "percentcalc", "bmicalc", "emicalc", "gstcalc", "discountcalc", "interestcalc", "agecalc", "datecalc", "unitconv", "tempconv", "fraccalc", "dice", "scicalc"];
const SLUGS = { "Basic Calculator": "basiccalc", "Percentage": "percentcalc", "BMI": "bmicalc", "EMI": "emicalc", "GST": "gstcalc", "Discount": "discountcalc", "Interest": "interestcalc", "Age Calculator": "agecalc", "Date Calculator": "datecalc", "Unit Converter": "unitconv", "Temperature": "tempconv", "Fraction": "fraccalc", "Dice": "dice", "Scientific Calculator": "scicalc" };
const CATEGORIES = [
  { id: "calculators", name: "Calculators", icon: "🧮", tools: ["Basic Calculator","Scientific Calculator","Fraction","Percentage","BMI","EMI","GST","Discount","Interest","Age Calculator","Date Calculator","Unit Converter","Temperature","Dice"] },
  { id: "pdf", name: "PDF Studio", icon: "📄", tools: ["Images to PDF","Merge PDF","Split PDF","Rotate PDF","Extract Pages"] },
  { id: "image", name: "Image Lab", icon: "🖼️", tools: ["Resizer","Compressor","Cropper","Rotate & Flip","Color Picker","Image to Base64","QR Code","Barcode"] },
  { id: "productivity", name: "Productivity", icon: "✅", tools: ["To-Do","Notes","Focus Timer","Stopwatch","Habit Tracker","Expense Tracker","Password Generator"] },
  { id: "text", name: "Text Tools", icon: "✍️", tools: ["Word Counter","Case Converter","Text Cleaner","Line Sorter","Markdown Preview","Base64 Text","URL Encoder","JSON Formatter","Lorem Ipsum"] },
  { id: "developer", name: "Dev Toolkit", icon: "💻", tools: ["UUID Generator","Hash Generator","Timestamp Converter","Gradient Builder","Box Shadow","Flexbox Playground","HTML Preview"] },
  { id: "privacy", name: "Privacy", icon: "🔒", tools: ["Password Strength","Passphrase Generator","Token Generator","Clear Local Data"] },
  { id: "web", name: "Web Utils", icon: "🌐", tools: ["World Clock","Typing Test","Countdown","ASCII Art","URL Parser"] }
];