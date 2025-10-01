const redNumbers = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];
const blackNumbers = [2,4,6,8,10,11,13,15,17,20,22,24,26,28,29,31,33,35];

function calculateStats() {
    const input = document.getElementById("numbersInput").value;
    const numbers = input.split(",").map(x => parseInt(x.trim())).filter(x => !isNaN(x));

    if (numbers.length < 5) {
        alert("Please enter at least 5 numbers separated by commas.");
        return;
    }

    const colourStats = calculateColourStats(numbers);
    const dozenStats = calculateDozenStats(numbers);

    displayStats(colourStats, dozenStats);
    suggestDozens(dozenStats);
    displayPrediction(numbers, colourStats, dozenStats);
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

function suggestDozens(dozenStats) {
    let dozenPercentages = [
        {dozen: "1st Dozen (1-12)", percent: parseFloat(dozenStats.dozen1)},
        {dozen: "2nd Dozen (13-24)", percent: parseFloat(dozenStats.dozen2)},
        {dozen: "3rd Dozen (25-36)", percent: parseFloat(dozenStats.dozen3)}
    ];
    dozenPercentages.sort((a,b) => b.percent - a.percent);

    let message = `✅ Best Bet: <b>${dozenPercentages[0].dozen}</b> (${dozenPercentages[0].percent}%) aur <b>${dozenPercentages[1].dozen}</b> (${dozenPercentages[1].percent}%)`;
    document.getElementById("dozenSuggestion").innerHTML = message;
}

function displayPrediction(numbers, colourStats, dozenStats) {
    let dozens = [
        {name:"1st", percent: parseFloat(dozenStats.dozen1), numbers: Array.from({length:12},(_,i)=>i+1)},
        {name:"2nd", percent: parseFloat(dozenStats.dozen2), numbers: Array.from({length:12},(_,i)=>i+13)},
        {name:"3rd", percent: parseFloat(dozenStats.dozen3), numbers: Array.from({length:12},(_,i)=>i+25)}
    ];
    dozens.sort((a,b) => b.percent - a.percent);

    let bestDozen = dozens[0];
    let colour = parseFloat(colourStats.red) > parseFloat(colourStats.black) ? "Red" : "Black";
    let chosenColourNumbers = bestDozen.numbers.filter(n => colour==="Red" ? redNumbers.includes(n) : blackNumbers.includes(n));

    let finalNumbers = chosenColourNumbers.slice(0,6);

    document.getElementById("prediction").innerHTML = `<b>🎯 Predicted Numbers:</b> ${finalNumbers.join(", ")}`;
    document.getElementById("bestBetPlace").innerHTML = `💡 Best Bet: ${bestDozen.name} Dozen (${bestDozen.percent}%), Colour: ${colour} (${colour==="Red" ? colourStats.red : colourStats.black}%)`;
}
