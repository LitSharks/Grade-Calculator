// script.js

// Step 1: Handle initial form submission
document.getElementById("initialForm").addEventListener("submit", function (event) {
  event.preventDefault();
  
  const sectors = parseInt(document.getElementById("sectors").value);
  if (isNaN(sectors) || sectors < 1 || sectors > 100) {
    alert("Please enter a valid number of sectors between 1 and 100.");
    return;
  }
  
  const equalWeight = document.querySelector('input[name="equalWeight"]:checked').value;
  
  // Hide step 1 and show step 2
  document.getElementById("step1").style.display = "none";
  document.getElementById("step2").style.display = "block";
  
  // Set up the weights section if custom weighting is selected
  const weightsSection = document.getElementById("weightsSection");
  const weightsInputs = document.getElementById("weightsInputs");
  weightsInputs.innerHTML = "";
  
  if (equalWeight === "n") {
    weightsSection.style.display = "block";
    for (let i = 0; i < sectors; i++) {
      const div = document.createElement("div");
      div.innerHTML = `
        <label for="weight${i}">Weight for sector ${i + 1}:</label>
        <input type="number" id="weight${i}" name="weight${i}" min="0" step="any" required>
      `;
      weightsInputs.appendChild(div);
    }
  } else {
    weightsSection.style.display = "none";
  }
  
  // Set up the marks section for each sector
  const marksInputs = document.getElementById("marksInputs");
  marksInputs.innerHTML = "";
  for (let i = 0; i < sectors; i++) {
    const div = document.createElement("div");
    div.innerHTML = `
      <h3>Sector ${i + 1}</h3>
      <label for="maxMark${i}">Maximum possible mark for sector ${i + 1}:</label>
      <input type="number" id="maxMark${i}" name="maxMark${i}" min="0" step="any" required>
      <label for="mark${i}">Your mark for sector ${i + 1}:</label>
      <input type="number" id="mark${i}" name="mark${i}" min="0" step="any" required>
    `;
    marksInputs.appendChild(div);
  }
});

// Step 2: Handle sectors form submission and grade calculation
document.getElementById("sectorsForm").addEventListener("submit", function (event) {
  event.preventDefault();
  
  const sectors = parseInt(document.getElementById("sectors").value);
  const equalWeight = document.querySelector('input[name="equalWeight"]:checked').value;
  
  let weights = [];
  let normalizedWeights = [];
  let grades = [];
  let sectorMaxMarks = [];
  let sectorAchievedMarks = [];
  
  // If using custom weighting, get and normalize weights
  if (equalWeight === "n") {
    let totalWeight = 0;
    for (let i = 0; i < sectors; i++) {
      let w = parseFloat(document.getElementById(`weight${i}`).value);
      if (isNaN(w) || w < 0) {
        alert(`Please enter a valid weight for sector ${i + 1}.`);
        return;
      }
      weights.push(w);
      totalWeight += w;
    }
    if (totalWeight === 0) {
      alert("Total weight cannot be zero.");
      return;
    }
    normalizedWeights = weights.map(w => w / totalWeight);
  } else {
    // For equal weighting, we simply use an array of ones (but weighted grade will be "not applicable")
    weights = Array(sectors).fill(1.0);
  }
  
  // Get marks and calculate normalized grades for each sector
  for (let i = 0; i < sectors; i++) {
    let maxMark = parseFloat(document.getElementById(`maxMark${i}`).value);
    let achievedMark = parseFloat(document.getElementById(`mark${i}`).value);
    
    if (isNaN(maxMark) || maxMark <= 0) {
      alert(`Please enter a valid maximum mark (> 0) for sector ${i + 1}.`);
      return;
    }
    if (isNaN(achievedMark) || achievedMark < 0 || achievedMark > maxMark) {
      alert(`Please enter a valid mark for sector ${i + 1}. It should be between 0 and ${maxMark}.`);
      return;
    }
    
    sectorMaxMarks.push(maxMark);
    sectorAchievedMarks.push(achievedMark);
    grades.push(achievedMark / maxMark);
  }
  
  // Calculate the Equal Weight Final Grade
  let equalFinalGrade = (grades.reduce((acc, curr) => acc + curr, 0) / sectors) * 100;
  
  // Calculate the Weighted Final Grade
  let weightedFinalGrade = null;
  if (equalWeight === "n") {
    weightedFinalGrade = grades.reduce((acc, curr, index) => acc + curr * normalizedWeights[index], 0) * 100;
  }
  
  // Calculate the Simple Average Final Grade
  let totalAchieved = sectorAchievedMarks.reduce((acc, curr) => acc + curr, 0);
  let totalMax = sectorMaxMarks.reduce((acc, curr) => acc + curr, 0);
  let simpleAverageGrade = (totalAchieved / totalMax) * 100;
  
  // Display the results
  document.getElementById("step2").style.display = "none";
  document.getElementById("result").style.display = "block";
  
  const weightedGradeElem = document.getElementById("weightedGrade");
  const equalGradeElem = document.getElementById("equalGrade");
  const simpleAverageGradeElem = document.getElementById("simpleAverageGrade");
  
  if (weightedFinalGrade !== null) {
    weightedGradeElem.textContent = `1. Weighted Final Grade: ${weightedFinalGrade.toFixed(2)}% (based on your assigned weights)`;
  } else {
    weightedGradeElem.textContent = `1. Weighted Final Grade: Not applicable (equal weights used)`;
  }
  
  equalGradeElem.textContent = `2. Equal Weight Final Grade: ${equalFinalGrade.toFixed(2)}% (assuming all sectors contribute equally)`;
  simpleAverageGradeElem.textContent = `3. Simple Average Final Grade: ${simpleAverageGrade.toFixed(2)}% (sum of all marks divided by total possible marks)`;
});

// Restart the calculator
document.getElementById("restart").addEventListener("click", function () {
  document.getElementById("initialForm").reset();
  document.getElementById("sectorsForm").reset();
  document.getElementById("step1").style.display = "block";
  document.getElementById("step2").style.display = "none";
  document.getElementById("result").style.display = "none";
});

// ------------------------------
// THEME TOGGLE & RANDOM ANGLED TEXT
// ------------------------------

// Helper to apply the chosen theme
function applyTheme(theme) {
  if (theme === "dark") {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }
}

// Check for saved theme or system preference
let savedTheme = localStorage.getItem("theme");
const themeToggle = document.getElementById("themeToggle");

if (savedTheme) {
  applyTheme(savedTheme);
  themeToggle.checked = (savedTheme === "dark");
} else {
  // If no saved preference, follow system setting
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

// Listen for changes to the toggle
themeToggle.addEventListener("change", function() {
  if (this.checked) {
    applyTheme("dark");
    localStorage.setItem("theme", "dark");
  } else {
    applyTheme("light");
    localStorage.setItem("theme", "light");
  }
});

// Random angled text from a predefined list
const phrases = [
  "Made by a zaga student",
  "because some people don't understand grades",
  "brrrrrrrrrrrrrr"
];
const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
document.getElementById("angledText").textContent = randomPhrase;
