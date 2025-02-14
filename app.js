import React, { useState } from "react";

const GradeCalculator = () => {
    const [sectors, setSectors] = useState(1);
    const [defaultWeight, setDefaultWeight] = useState(true);
    const [weights, setWeights] = useState([]);
    const [maxMarks, setMaxMarks] = useState([]);
    const [achievedMarks, setAchievedMarks] = useState([]);
    const [finalGrades, setFinalGrades] = useState(null);

    // Handle sector count change
    const handleSectorChange = (e) => {
        let newSectors = Number(e.target.value);
        setSectors(newSectors);
        setWeights(new Array(newSectors).fill(1));
        setMaxMarks(new Array(newSectors).fill(100));
        setAchievedMarks(new Array(newSectors).fill(0));
    };

    const handleWeightChoice = (e) => {
        setDefaultWeight(e.target.value === "yes");
    };

    const calculateGrades = () => {
        let normalizedWeights;

        if (defaultWeight) {
            normalizedWeights = Array(sectors).fill(1 / sectors);
        } else {
            const totalWeight = weights.reduce((a, b) => a + b, 0);
            normalizedWeights = weights.map(w => w / totalWeight);
        }

        const normalizedGrades = achievedMarks.map((mark, i) => mark / maxMarks[i]);
        const weightedFinalGrade = normalizedGrades.reduce((sum, grade, i) => sum + (grade * normalizedWeights[i]), 0) * 100;
        const equalFinalGrade = normalizedGrades.reduce((sum, grade) => sum + grade, 0) / sectors * 100;
        const simpleAverageGrade = (achievedMarks.reduce((a, b) => a + b, 0) / maxMarks.reduce((a, b) => a + b, 0)) * 100;

        setFinalGrades({ weightedFinalGrade, equalFinalGrade, simpleAverageGrade });
    };

    return (
        <div className="calculator">
            <h1>Grade Calculator</h1>
            <label>Number of Sectors:</label>
            <input type="number" min="1" max="100" value={sectors} onChange={handleSectorChange} />

            <label>Equal Weight for Each Sector?</label>
            <select onChange={handleWeightChoice}>
                <option value="yes">Yes</option>
                <option value="no">No</option>
            </select>

            {/* If equal weights are NOT used, allow weight input */}
            {!defaultWeight && (
                <div>
                    <h2>Enter Weights</h2>
                    {weights.map((_, i) => (
                        <input key={i} type="number" placeholder={`Weight ${i + 1}`} onChange={(e) => {
                            let newWeights = [...weights];
                            newWeights[i] = Number(e.target.value);
                            setWeights(newWeights);
                        }} />
                    ))}
                </div>
            )}

            <h2>Enter Marks</h2>
            {maxMarks.map((_, i) => (
                <div key={i}>
                    <input type="number" placeholder={`Max Mark ${i + 1}`} onChange={(e) => {
                        let newMaxMarks = [...maxMarks];
                        newMaxMarks[i] = Number(e.target.value);
                        setMaxMarks(newMaxMarks);
                    }} />

                    <input type="number" placeholder={`Your Mark ${i + 1}`} onChange={(e) => {
                        let newAchievedMarks = [...achievedMarks];
                        newAchievedMarks[i] = Number(e.target.value);
                        setAchievedMarks(newAchievedMarks);
                    }} />
                </div>
            ))}

            <button onClick={calculateGrades}>Calculate</button>

            {finalGrades && (
                <div>
                    <p>Weighted Final Grade: {finalGrades.weightedFinalGrade.toFixed(2)}%</p>
                    <p>Equal Weight Final Grade: {finalGrades.equalFinalGrade.toFixed(2)}%</p>
                    <p>Simple Average Grade: {finalGrades.simpleAverageGrade.toFixed(2)}%</p>
                </div>
            )}
        </div>
    );
};

export default GradeCalculator;
