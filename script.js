document.addEventListener("DOMContentLoaded", () => {
  // Theme toggle functionality
  const themeToggle = document.getElementById("themeToggle");

  function applyTheme(theme) {
    if (theme === "dark") {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }

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

  // Randomized uplifting phrase for angled text
  const phrases = [
    "Made by a Zaga student",
    "Because grades tell a story",
    "Keep pushing forward!"
  ];
  const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)] + "!";
  const angledTextElem = document.getElementById("angledText");
  if (angledTextElem) {
    angledTextElem.textContent = randomPhrase;
  }
});
