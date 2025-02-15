// Theme toggle functionality
function applyTheme(theme) {
  if (theme === "dark") {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }
}

const themeToggle = document.getElementById("themeToggle");
let savedTheme = localStorage.getItem("theme");

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

// Random angled text functionality with periodic updates
const phrases = [
  "Made by a zaga student",
  "because some people don't understand grades",
  "brrrrrrrrrrrrrr"
];

function updateAngledText() {
  const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)] + "!";
  const angledTextElement = document.getElementById("angledText");
  // Fade out before updating text
  angledTextElement.style.opacity = 0;
  setTimeout(() => {
    angledTextElement.textContent = randomPhrase;
    angledTextElement.style.opacity = 1;
  }, 500);
}

// Initialize angled text and update every 8 seconds
updateAngledText();
setInterval(updateAngledText, 8000);
