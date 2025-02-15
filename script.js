// Theme toggle functionality
function applyTheme(theme) {
  if (theme === "dark") {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }
}

let savedTheme = localStorage.getItem("theme");
const themeToggle = document.getElementById("themeToggle");

if (savedTheme) {
  applyTheme(savedTheme);
  themeToggle.checked = (savedTheme === "dark");
} else {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    applyTheme("dark");
    localStorage.setItem("theme", "dark");
    themeToggle.checked = true;
  } else {
    applyTheme("light");
    localStorage.setItem("theme", "light");
    themeToggle.checked = false;
  }
}

themeToggle.addEventListener("change", function() {
  if (this.checked) {
    applyTheme("dark");
    localStorage.setItem("theme", "dark");
  } else {
    applyTheme("light");
    localStorage.setItem("theme", "light");
  }
});

// Random angled text
const phrases = [
  "Made by a zaga student",
  "because some people don't understand grades",
  "brrrrrrrrrrrrrr"
];

const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)] + "!";
document.getElementById("angledText").textContent = randomPhrase;
