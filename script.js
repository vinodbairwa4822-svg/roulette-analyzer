const redNumbers = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];
const blackNumbers = [2,4,6,8,10,11,13,15,17,20,22,24,26,28,29,31,33,35];

function calculateStats() {
    const input = document.getElementById("numbersInput").value;
    const numbers = input.split(",").map(x => parseInt(x.trim())).filter(x => !isNaN(x));

    if (numbers.length !== 5) {
        alert("Please enter exactly 5 numbers separated by commas.");
        return;
    }

    const colourStats = calculateColourStats(numbers);
    const dozenStats = calculateDozenStats(numbers);

    displayStats(colourStats, dozenStats);
    suggestDozen(dozenStats);
    displayPrediction(colourStats, dozenStats);
}

function calculateColourStats(numbers) {
    let redCount = 0, blackCount = 0;
    numbers.forEach(n => {
        if (redNumbers.includes(n)) redCount++;
        if (blackNumbers.includes(n)) blackCount++;
    });
    const total = redCount + blackCount;
    if (total === 0) return { red: 0, black: 0 };

    return {
        red: ((redCount/total)*100).toFixed(2),
        black: ((blackCount/total)*100).toFixed(2)
    };
}

function calculateDozenStats(numbers) {
    let dozenCounts = [0,0,0];
    numbers.forEach(n => {
        if (n >= 1 && n <= 12) dozenCounts[0]++;
        if (n >= 13 && n <= 24) dozenCounts[1]++;
        if (n >= 25 && n <= 36) dozenCounts[2]++;
    });
    const total = dozenCounts.reduce((a,b) => a+b,0);
    if (total === 0) return { dozen1: 0, dozen2: 0, dozen3: 0 };

    return {
        dozen1: ((dozenCounts[0]/total)*100).toFixed(2),
        dozen2: ((dozenCounts[1]/total)*100).toFixed(2),
        dozen3: ((dozenCounts[2]/total)*100).toFixed(2)
    };
}

function displayStats(colourStats, dozenStats) {
    document.getElementById("colourStats").innerHTML = `<b>Colour %:</b> Red = ${colourStats.red}%, Black = ${colourStats.black}%`;
    document.getElementById("dozenStats").innerHTML = `<b>Dozen %:</b> 1st = ${dozenStats.dozen1}%, 2nd = ${dozenStats.dozen2}%, 3rd = ${dozenStats.dozen3}%`;
}

function suggestDozen(dozenStats) {
    let dozenPercentages = [
        {dozen: "1st Dozen (1-12)", percent: parseFloat(dozenStats.dozen1)},
        {dozen: "2nd Dozen (13-24)", percent: parseFloat(dozenStats.dozen2)},
        {dozen: "3rd Dozen (25-36)", percent: parseFloat(dozenStats.dozen3)}
    ];
    dozenPercentages.sort((a,b) => b.percent - a.percent);
    let message = `✅ Best Dozen: <b>${dozenPercentages[0].dozen}</b> (${dozenPercentages[0].percent}%)`;
    document.getElementById("dozenSuggestion").innerHTML = message;
}

function displayPrediction(colourStats, dozenStats) {
    let bestDozenNumbers = [];
    let bestDozen = "1st";

    // Step 1: Find the highest dozen %
    if (dozenStats.dozen2 > dozenStats.dozen1 && dozenStats.dozen2 > dozenStats.dozen3) bestDozen = "2nd";
    else if (dozenStats.dozen3 > dozenStats.dozen1 && dozenStats.dozen3 > dozenStats.dozen2) bestDozen = "3rd";

    if (bestDozen === "1st") bestDozenNumbers = Array.from({length:12},(_,i)=>i+1);
    else if (bestDozen === "2nd") bestDozenNumbers = Array.from({length:12},(_,i)=>i+13);
    else bestDozenNumbers = Array.from({length:12},(_,i)=>i+25);

    // Step 2: Choose colour with highest %
    let colour = (parseFloat(colourStats.red) > parseFloat(colourStats.black)) ? "Red" : "Black";
    let chosenColourNumbers = bestDozenNumbers.filter(n => (colour==="Red" ? redNumbers.includes(n) : blackNumbers.includes(n)));

    // Step 3: Select first 6 numbers only
    let finalNumbers = chosenColourNumbers.slice(0,6);

    document.getElementById("prediction").innerHTML = `<b>🎯 Predicted Numbers:</b> ${finalNumbers.join(", ")}`;
}
