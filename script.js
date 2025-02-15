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

  // Randomized fun phrase for angled text
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

  // Grade calculator functionality
  const initialForm = document.getElementById("initialForm");
  const sectorsForm = document.getElementById("sectorsForm");
  const step1 = document.getElementById("step1");
  const step2 = document.getElementById("step2");
  const resultDiv = document.getElementById("result");
  const weightsSection = document.getElementById("weightsSection");
  const weightsInputsDiv = document.getElementById("weightsInputs");
  const marksInputsDiv = document.getElementById("marksInputs");
  const restartBtn = document.getElementById("restart");

  let numSectors = 0;
  let equalWeight = true; // default to equal weighting

  initialForm.addEventListener("submit", (e) => {
    e.preventDefault();
    numSectors = parseInt(document.getElementById("sectors").value);
    const equalWeightValue = document.querySelector('input[name="equalWeight"]:checked').value;
    equalWeight = (equalWeightValue === "y");

    // Hide Step 1 and show Step 2
    step1.style.display = "none";
    step2.style.display = "block";

    // If custom weights are chosen, display and generate weight inputs
    if (!equalWeight) {
      weightsSection.style.display = "block";
      let weightsHTML = "";
      for (let i = 0; i < numSectors; i++) {
        weightsHTML += `<div class="form-group">
            <label for="weight${i}">Enter weight for sector ${i + 1}:</label>
            <input type="number" id="weight${i}" name="weight${i}" step="any" required />
          </div>`;
      }
      weightsInputsDiv.innerHTML = weightsHTML;
    } else {
      weightsSection.style.display = "none";
    }

    // Generate marks inputs for each sector
    let marksHTML = "";
    for (let i = 0; i < numSectors; i++) {
      marksHTML += `<fieldset class="sector-fieldset">
          <legend>Sector ${i + 1}</legend>
          <div class="form-group">
            <label for="maxMark${i}">Enter maximum possible mark for sector ${i + 1}:</label>
            <input type="number" id="maxMark${i}" name="maxMark${i}" step="any" required />
          </div>
          <div class="form-group">
            <label for="achievedMark${i}">Enter your mark for sector ${i + 1}:</label>
            <input type="number" id="achievedMark${i}" name="achievedMark${i}" step="any" required />
          </div>
        </fieldset>`;
    }
    marksInputsDiv.innerHTML = marksHTML;
  });

  sectorsForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let weights = [];
    if (!equalWeight) {
      for (let i = 0; i < numSectors; i++) {
        const weightVal = parseFloat(document.getElementById(`weight${i}`).value);
        weights.push(weightVal);
      }
      // Normalize weights so they sum to 1
      const totalWeight = weights.reduce((sum, w) => sum + w, 0);
      weights = weights.map(w => w / totalWeight);
    }

    let sectorMaxMarks = [];
    let sectorAchievedMarks = [];
    let grades = [];

    for (let i = 0; i < numSectors; i++) {
      const maxMark = parseFloat(document.getElementById(`maxMark${i}`).value);
      const achievedMark = parseFloat(document.getElementById(`achievedMark${i}`).value);
      sectorMaxMarks.push(maxMark);
      sectorAchievedMarks.push(achievedMark);
      grades.push(achievedMark / maxMark);
    }

    // Calculate weighted final grade only if custom weights were provided
    let weightedFinalGrade = null;
    if (!equalWeight) {
      weightedFinalGrade = grades.reduce((sum, grade, i) => sum + grade * weights[i], 0) * 100;
    }

    // Calculate equal weight final grade (simply the average)
    const equalFinalGrade = (grades.reduce((sum, grade) => sum + grade, 0) / numSectors) * 100;

    // Calculate the simple average grade
    const totalAchieved = sectorAchievedMarks.reduce((sum, mark) => sum + mark, 0);
    const totalMax = sectorMaxMarks.reduce((sum, mark) => sum + mark, 0);
    const simpleAverageGrade = (totalAchieved / totalMax) * 100;

    // Display results in Step 3
    document.getElementById("weightedGrade").innerHTML = 
      (weightedFinalGrade !== null)
        ? `${weightedFinalGrade.toFixed(2)}% (based on your assigned weights)`
        : `Not applicable (equal weights used)`;
    document.getElementById("equalGrade").innerHTML = 
      `${equalFinalGrade.toFixed(2)}% (assuming all sectors contribute equally)`;
    document.getElementById("simpleAverageGrade").innerHTML = 
      `${simpleAverageGrade.toFixed(2)}% (sum of all marks divided by total possible marks, less accurate)`;

    // Hide Step 2 and show results
    step2.style.display = "none";
    resultDiv.style.display = "block";
  });

  restartBtn.addEventListener("click", () => {
    // Reset forms and display the first step again
    initialForm.reset();
    sectorsForm.reset();
    step1.style.display = "block";
    step2.style.display = "none";
    resultDiv.style.display = "none";
    weightsInputsDiv.innerHTML = "";
    marksInputsDiv.innerHTML = "";
  });
});
