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
    const oddEvenStats = calculateOddEvenStats(numbers);

    displayStats(colourStats, dozenStats, oddEvenStats);
    suggestDozens(dozenStats);
    displayPrediction(numbers, colourStats, dozenStats, oddEvenStats);
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

function calculateOddEvenStats(numbers) {
    let oddCount = 0, evenCount = 0;
    numbers.forEach(n => {
        if (n%2 === 0) evenCount++;
        else oddCount++;
    });
    const total = oddCount + evenCount;
    if (total === 0) return { odd: 0, even: 0 };

    return {
        odd: ((oddCount/total)*100).toFixed(2),
        even: ((evenCount/total)*100).toFixed(2)
    };
}

function displayStats(colourStats, dozenStats, oddEvenStats) {
    document.getElementById("colourStats").innerHTML = `<b>Colour %:</b> Red = ${colourStats.red}%, Black = ${colourStats.black}%`;
    document.getElementById("dozenStats").innerHTML = `<b>Dozen %:</b> 1st = ${dozenStats.dozen1}%, 2nd = ${dozenStats.dozen2}%, 3rd = ${dozenStats.dozen3}%`;
    document.getElementById("oddEvenStats").innerHTML = `<b>Odd/Even %:</b> Odd = ${oddEvenStats.odd}%, Even = ${oddEvenStats.even}%`;
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

function displayPrediction(numbers, colourStats, dozenStats, oddEvenStats) {
    let bestDozen = "1st";
    let dozenNumbers = [];

    if (dozenStats.dozen2 > dozenStats.dozen1 && dozenStats.dozen2 > dozenStats.dozen3) bestDozen = "2nd";
    else if (dozenStats.dozen3 > dozenStats.dozen1 && dozenStats.dozen3 > dozenStats.dozen2) bestDozen = "3rd";

    if (bestDozen === "1st") dozenNumbers = Array.from({length:12},(_,i)=>i+1);
    else if (bestDozen === "2nd") dozenNumbers = Array.from({length:12},(_,i)=>i+13);
    else dozenNumbers = Array.from({length:12},(_,i)=>i+25);

    let colour = (parseFloat(colourStats.red) > parseFloat(colourStats.black)) ? "Red" : "Black";
    let chosenColourNumbers = dozenNumbers.filter(n => (colour==="Red" ? redNumbers.includes(n) : blackNumbers.includes(n)));

    let oddEven = (parseFloat(oddEvenStats.odd) > parseFloat(oddEvenStats.even)) ? "Odd" : "Even";
    let finalNumbers = chosenColourNumbers.filter(n => (oddEven==="Odd" ? n%2!==0 : n%2===0));

    if (finalNumbers.length > 6) finalNumbers = finalNumbers.slice(0,6);
    while (finalNumbers.length < 6) finalNumbers.push(0);

    document.getElementById("prediction").innerHTML = `<b>🎯 Predicted Numbers:</b> ${finalNumbers.join(", ")}`;
}
