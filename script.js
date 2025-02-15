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

  // DOM elements for steps
  const initialForm = document.getElementById("initialForm");
  const step1 = document.getElementById("step1");
  const step2 = document.getElementById("step2");
  const resultSection = document.getElementById("result");
  const sectorsForm = document.getElementById("sectorsForm");
  const weightsSection = document.getElementById("weightsSection");
  const weightsInputsDiv = document.getElementById("weightsInputs");
  const marksInputsDiv = document.getElementById("marksInputs");
  const restartButton = document.getElementById("restart");

  let sectors = 0;
  let equalWeighting = true;

  // Step 1: Get number of sectors and equal weighting option
  initialForm.addEventListener("submit", (e) => {
    e.preventDefault();
    sectors = parseInt(document.getElementById("sectors").value);
    equalWeighting = document.querySelector('input[name="equalWeight"]:checked').value === "y";

    // Move to Step 2
    step1.style.display = "none";
    step2.style.display = "block";

    // If not using equal weighting, show weight inputs
    if (!equalWeighting) {
      weightsSection.style.display = "block";
      weightsInputsDiv.innerHTML = "";
      for (let i = 0; i < sectors; i++) {
        const div = document.createElement("div");
        div.classList.add("form-group");
        div.innerHTML = `<label for="weight${i}">Enter weight for sector ${i + 1}:</label>
                         <input type="number" step="any" id="weight${i}" required />`;
        weightsInputsDiv.appendChild(div);
      }
    } else {
      weightsSection.style.display = "none";
    }

    // Generate marks input fields for each sector
    marksInputsDiv.innerHTML = "";
    for (let i = 0; i < sectors; i++) {
      const div = document.createElement("div");
      div.classList.add("sector-group");
      div.innerHTML = `<h3>Sector ${i + 1}</h3>
                       <div class="form-group">
                         <label for="maxMark${i}">Enter maximum possible mark for sector ${i + 1}:</label>
                         <input type="number" step="any" id="maxMark${i}" required />
                       </div>
                       <div class="form-group">
                         <label for="achievedMark${i}">Enter your mark for sector ${i + 1}:</label>
                         <input type="number" step="any" id="achievedMark${i}" required />
                       </div>`;
      marksInputsDiv.appendChild(div);
    }
  });

  // Step 2: Calculate grades when the marks (and weights, if applicable) are submitted
  sectorsForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let weights = [];
    let grades = [];
    let sector_max_marks = [];
    let sector_achieved_marks = [];
    let totalGradeRatio = 0;
    let totalAchieved = 0;
    let totalMax = 0;

    // Get and normalize weights if needed
    if (!equalWeighting) {
      for (let i = 0; i < sectors; i++) {
        const weightInput = document.getElementById("weight" + i);
        weights.push(parseFloat(weightInput.value));
      }
      const totalWeight = weights.reduce((a, b) => a + b, 0);
      weights = weights.map(w => w / totalWeight);
    }

    // Get marks and calculate grade ratios for each sector
    for (let i = 0; i < sectors; i++) {
      const maxMark = parseFloat(document.getElementById("maxMark" + i).value);
      const achievedMark = parseFloat(document.getElementById("achievedMark" + i).value);
      sector_max_marks.push(maxMark);
      sector_achieved_marks.push(achievedMark);
      const gradeRatio = achievedMark / maxMark;
      grades.push(gradeRatio);
      totalGradeRatio += gradeRatio;
      totalAchieved += achievedMark;
      totalMax += maxMark;
    }

    // Calculate weighted final grade (if applicable)
    let weighted_final_grade;
    if (!equalWeighting) {
      weighted_final_grade = 0;
      for (let i = 0; i < sectors; i++) {
        weighted_final_grade += grades[i] * weights[i];
      }
      weighted_final_grade = weighted_final_grade * 100;
    }

    // Calculate equal weight final grade (simply the average of ratios)
    let equal_final_grade = (totalGradeRatio / sectors) * 100;

    // Calculate simple average grade (total achieved divided by total max)
    let simple_average_grade = (totalAchieved / totalMax) * 100;

    // Show results
    step2.style.display = "none";
    resultSection.style.display = "block";
    const weightedGradeElem = document.getElementById("weightedGrade");
    const equalGradeElem = document.getElementById("equalGrade");
    const simpleAverageGradeElem = document.getElementById("simpleAverageGrade");
    if (!equalWeighting) {
      weightedGradeElem.textContent = `1. Weighted Final Grade: ${weighted_final_grade.toFixed(2)}% (based on your assigned weights)`;
    } else {
      weightedGradeElem.textContent = `1. Weighted Final Grade: Not applicable (equal weights used)`;
    }
    equalGradeElem.textContent = `2. Equal Weight Final Grade: ${equal_final_grade.toFixed(2)}% (assuming all sectors contribute equally)`;
    simpleAverageGradeElem.textContent = `3. Simple Average Final Grade: ${simple_average_grade.toFixed(2)}% (sum of all marks divided by total possible marks)`;
  });

  // Restart functionality: reset and show the first step again
  restartButton.addEventListener("click", () => {
    document.getElementById("initialForm").reset();
    document.getElementById("sectorsForm").reset();
    step1.style.display = "block";
    step2.style.display = "none";
    resultSection.style.display = "none";
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
