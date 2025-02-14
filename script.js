// script.js

// Handle the initial form submission
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

  // Set up the weights section if not equal weighting
  const weightsSection = document.getElementById("weightsSection");
  const weightsInputs = document.getElementById("weightsInputs");
  weightsInputs.innerHTML = "";
  if (equalWeight === "no") {
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

  // Set up the marks section
  const marksInputs = document.getElementById("marksInputs");
  marksInputs.innerHTML = "";
  for (let i = 0; i < sectors; i++) {
    const div = document.createElement("div");
    div.innerHTML = `
      <h3>Sector ${i + 1}</h3>
      <label for="maxMark${i}">Maximum possible mark (0-100):</label>
      <input type="number" id="maxMark${i}" name="maxMark${i}" min="0" max="100" step="any" required>
      <label for="mark${i}">Your mark (out of maximum):</label>
      <input type="number" id="mark${i}" name="mark${i}" min="0" step="any" required>
    `;
    marksInputs.appendChild(div);
  }
});

// Handle the sectors form submission and grade calculation
document.getElementById("sectorsForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const sectors = parseInt(document.getElementById("sectors").value);
  const equalWeight = document.querySelector('input[name="equalWeight"]:checked').value;
  let weights = [];

  // Determine weights
  if (equalWeight === "yes") {
    const weight = 100 / sectors;
    for (let i = 0; i < sectors; i++) {
      weights.push(weight);
    }
  } else {
    let totalWeight = 0;
    for (let i = 0; i < sectors; i++) {
      const w = parseFloat(document.getElementById(`weight${i}`).value);
      if (isNaN(w) || w < 0) {
        alert(`Please enter a valid weight for sector ${i + 1}.`);
        return;
      }
      weights.push(w);
      totalWeight += w;
    }
    // Check that the weights sum to 100 (allowing a small tolerance for floating point arithmetic)
    if (Math.abs(totalWeight - 100) > 0.001) {
      alert(`The total weights must sum to 100. Currently, they sum to ${totalWeight.toFixed(2)}.`);
      return;
    }
  }

  // Calculate the final grade
  let finalGrade = 0;
  for (let i = 0; i < sectors; i++) {
    const maxMark = parseFloat(document.getElementById(`maxMark${i}`).value);
    const mark = parseFloat(document.getElementById(`mark${i}`).value);

    if (isNaN(maxMark) || maxMark <= 0 || maxMark > 100) {
      alert(`Please enter a valid maximum mark (0-100) for sector ${i + 1}.`);
      return;
    }
    if (isNaN(mark) || mark < 0 || mark > maxMark) {
      alert(`Please enter a valid mark for sector ${i + 1}. It should be between 0 and ${maxMark}.`);
      return;
    }
    const normalized = mark / maxMark;
    finalGrade += normalized * weights[i];
  }

  // Display the result
  document.getElementById("step2").style.display = "none";
  document.getElementById("finalGrade").textContent = finalGrade.toFixed(2);
  document.getElementById("result").style.display = "block";
});

// Restart the calculator
document.getElementById("restart").addEventListener("click", function () {
  // Reset the forms and return to step 1
  document.getElementById("initialForm").reset();
  document.getElementById("sectorsForm").reset();
  document.getElementById("step1").style.display = "block";
  document.getElementById("step2").style.display = "none";
  document.getElementById("result").style.display = "none";
});
