// script.js

// Step 1: Handle initial form submission to set up the sectors and weighting option
document.getElementById("initialForm").addEventListener("submit", function(event) {
  event.preventDefault();
  
  const sectors = parseInt(document.getElementById("sectors").value);
  if (isNaN(sectors) || sectors < 1 || sectors > 100) {
    alert("Please enter a valid number of sectors between 1 and 100.");
    return;
  }
  
  const defaultWeight = document.querySelector('input[name="equalWeight"]:checked').value;
  
  // Hide Step 1 and show Step 2
  document.getElementById("step1").style.display = "none";
  document.getElementById("step2").style.display = "block";
  
  // Build dynamic weight inputs if custom weights are used
  const weightsSection = document.getElementById("weightsSection");
  const weightsInputs = document.getElementById("weightsInputs");
  weightsInputs.innerHTML = "";
  
  if (defaultWeight === "n") {
    weightsSection.style.display = "block";
    for (let i = 0; i < sectors; i++) {
      const div = document.createElement("div");
      div.innerHTML = `
        <label for="weight${i}">Weight for sector ${i + 1}:</label>
        <input type="number" id="weight${i}" name="weight${i}" step="any" required>
      `;
      weightsInputs.appendChild(div);
    }
  } else {
    weightsSection.style.display = "none";
  }
  
  // Build dynamic mark inputs for each sector
  const marksInputs = document.getElementById("marksInputs");
  marksInputs.innerHTML = "";
  
  for (let i = 0; i < sectors; i++) {
    const div = document.createElement("div");
    div.innerHTML = `
      <h3>Sector ${i + 1}</h3>
      <label for="maxMark${i}">Maximum possible mark:</label>
      <input type="number" id="maxMark${i}" name="maxMark${i}" step="any" required>
      <label for="achievedMark${i}">Your achieved mark (out of maximum):</label>
      <input type="number" id="achievedMark${i}" name="achievedMark${i}" step="any" required>
    `;
    marksInputs.appendChild(div);
  }
});

// Step 2: Handle the sectors form submission and calculate grades
document.getElementById("sectorsForm").addEventListener("submit", function(event) {
  event.preventDefault();
  
  const sectors = parseInt(document.getElementById("sectors").value);
  const defaultWeight = document.querySelector('input[name="equalWeight"]:checked').value;
  
  let weights = [];
  let grades = [];
  let sectorMaxMarks = [];
  let sectorAchievedMarks = [];
  
  // For custom weights: get user input and normalize the weights
  if (defaultWeight === "n") {
    let totalWeight = 0;
    for (let i = 0; i < sectors; i++) {
      const weightInput = document.getElementById(`weight${i}`);
      const weightValue = parseFloat(weightInput.value);
      if (isNaN(weightValue) || weightValue < 0) {
        alert(`Please enter a valid weight for sector ${i + 1}.`);
        return;
      }
      weights.push(weightValue);
      totalWeight += weightValue;
    }
    // Normalize the weights
    for (let i = 0; i < sectors; i++) {
      weights[i] = weights[i] / totalWeight;
    }
  }
  
  // Get marks for each sector and compute normalized grades
  for (let i = 0; i < sectors; i++) {
    const maxMark = parseFloat(document.getElementById(`maxMark${i}`).value);
    const achievedMark = parseFloat(document.getElementById(`achievedMark${i}`).value);
    if (isNaN(maxMark) || maxMark <= 0) {
      alert(`Please enter a valid maximum mark for sector ${i + 1}.`);
      return;
    }
    if (isNaN(achievedMark) || achievedMark < 0 || achievedMark > maxMark) {
      alert(`Please enter a valid achieved mark for sector ${i + 1} (0 to ${maxMark}).`);
      return;
    }
    sectorMaxMarks.push(maxMark);
    sectorAchievedMarks.push(achievedMark);
    grades.push(achievedMark / maxMark);
  }
  
  // Calculate the three grade results
  
  // 1. Weighted Final Grade (only if custom weights are used)
  let weightedFinalGrade;
  if (defaultWeight === "n") {
    weightedFinalGrade = 0;
    for (let i = 0; i < sectors; i++) {
      weightedFinalGrade += grades[i] * weights[i];
    }
    weightedFinalGrade = weightedFinalGrade * 100;
  }
  
  // 2. Equal Weight Final Grade: average of normalized grades, scaled to percentage
  const equalFinalGrade = (grades.reduce((sum, g) => sum + g, 0) / sectors) * 100;
  
  // 3. Simple Average Final Grade: total achieved marks divided by total maximum marks, scaled to percentage
  const simpleAverageGrade = (sectorAchievedMarks.reduce((sum, m) => sum + m, 0) / 
                              sectorMaxMarks.reduce((sum, m) => sum + m, 0)) * 100;
  
  // Display the results
  document.getElementById("step2").style.display = "none";
  document.getElementById("result").style.display = "block";
  
  const weightedResultElem = document.getElementById("weightedGradeResult");
  if (defaultWeight === "n") {
    weightedResultElem.textContent = `1. Weighted Final Grade: ${weightedFinalGrade.toFixed(2)}% (based on your assigned weights)`;
  } else {
    weightedResultElem.textContent = `1. Weighted Final Grade: Not applicable (equal weights used)`;
  }
  
  document.getElementById("equalGradeResult").textContent = `2. Equal Weight Final Grade: ${equalFinalGrade.toFixed(2)}% (assuming all sectors contribute equally)`;
  document.getElementById("simpleAverageResult").textContent = `3. Simple Average Final Grade: ${simpleAverageGrade.toFixed(2)}% (sum of all marks divided by total possible marks)`;
});

// Restart the calculator
document.getElementById("restart").addEventListener("click", function() {
  document.getElementById("initialForm").reset();
  document.getElementById("sectorsForm").reset();
  document.getElementById("step1").style.display = "block";
  document.getElementById("step2").style.display = "none";
  document.getElementById("result").style.display = "none";
});
