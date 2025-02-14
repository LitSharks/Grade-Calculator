class GradeCalculator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sectors: 1,
            defaultWeight: true,
            weights: [],
            grades: [],
            maxMarks: [],
            achievedMarks: [],
            finalGrades: null
        };
    }

    handleSectorChange = (event) => {
        this.setState({ sectors: Number(event.target.value) });
    };

    handleWeightChoice = (event) => {
        this.setState({ defaultWeight: event.target.value === "yes" });
    };

    calculateGrades = () => {
        const { sectors, defaultWeight, weights, maxMarks, achievedMarks } = this.state;
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
        
        this.setState({ finalGrades: { weightedFinalGrade, equalFinalGrade, simpleAverageGrade } });
    };

    render() {
        return (
            <div>
                <h1>Grade Calculator</h1>
                <label>Number of Sectors:</label>
                <input type="number" min="1" max="100" onChange={this.handleSectorChange} />
                <label>Equal Weight for Each Sector?</label>
                <select onChange={this.handleWeightChoice}>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                </select>
                <button onClick={this.calculateGrades}>Calculate</button>
                {this.state.finalGrades && (
                    <div>
                        <p>Weighted Final Grade: {this.state.finalGrades.weightedFinalGrade.toFixed(2)}%</p>
                        <p>Equal Weight Final Grade: {this.state.finalGrades.equalFinalGrade.toFixed(2)}%</p>
                        <p>Simple Average Grade: {this.state.finalGrades.simpleAverageGrade.toFixed(2)}%</p>
                    </div>
                )}
            </div>
        );
    }
}

ReactDOM.render(<GradeCalculator />, document.getElementById("root"));
