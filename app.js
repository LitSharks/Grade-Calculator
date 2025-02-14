document.getElementById("sectors").addEventListener("input", updateInputs);
document.getElementById("equalWeight").addEventListener("change", updateInputs);

function updateInputs() {
    let sectorCount = parseInt(document.getElementById("sectors").value);
    let useEqualWeights = document.getElementById("equalWeight").value === "yes";
    
    let weightsContainer = document.getElementById("weightsContainer");
    let marksContainer = document.getElementById("marksContainer");
    
    weightsContainer.innerHTML = "";
    marksContainer.innerHTML = "";

    for (let i = 0; i < sectorCount; i++) {
        if (!useEqualWeights) {
            let weightInput = document.createElement("input");
            weightInput.type = "number";
            weightInput.placeholder = `Weight for Sector ${i + 1}`;
            weightInput.classList.add("weight");
            weightsContainer.appendChild(weightInput);
        }

        let maxMarkInput = document.createElement("input");
        maxMarkInput.type = "number";
        maxMarkInput.placeholder = `Max Mark for Sector ${i + 1}`;
        maxMarkInput.classList.add("maxMark");
        marksContainer.appendChild(maxMarkInput);

        let achievedMarkInput = document.createElement("input");
        achievedMarkInput.type = "number";
        achievedMarkInput.placeholder = `Your Mark for Sector ${i + 1}`;
        achievedMarkInput.classList.add("achievedMark");
        marksContainer.appendChild(achievedMarkInput);
    }
}

function calculateGrades() {
    let sectorCount = parseInt(document.getElementById("sectors").value);
    let useEqualWeights = document.getElementById("equalWeight").value === "yes";

    let weights = [];
    if (!useEqualWeights) {
        document.querySelectorAll(".weight").forEach(input => {
            weights.push(parseFloat(input.value) || 0);
        });
        let totalWeight = weights.reduce((a, b) => a + b, 0);
        weights = weights.map(w => w / totalWeight);
    } else {
        weights = new Array(sectorCount).fill(1 / sectorCount);
    }

    let maxMarks = [];
    let achievedMarks = [];
    document.querySelectorAll(".maxMark").forEach(input => maxMarks.push(parseFloat(input.value) || 1));
    document.querySelectorAll(".achievedMark").forEach(input => achievedMarks.push(parseFloat(input.value) || 0));

    let normalizedGrades = achievedMarks.map((mark, i) => mark / maxMarks[i]);

    let weightedFinalGrade = normalizedGrades.reduce((sum, grade, i) => sum + (grade * weights[i]), 0) * 100;
    let equalFinalGrade = normalizedGrades.reduce((sum, grade) => sum + grade, 0) / sectorCount * 100;
    let simpleAverageGrade = (achievedMarks.reduce((a, b) => a + b, 0) / maxMarks.reduce((a, b) => a + b, 0)) * 100;

    document.getElementById("weightedGrade").textContent = weightedFinalGrade.toFixed(2) + "%";
    document.getElementById("equalGrade").textContent = equalFinalGrade.toFixed(2) + "%";
    document.getElementById("simpleGrade").textContent = simpleAverageGrade.toFixed(2) + "%";
}

updateInputs();
