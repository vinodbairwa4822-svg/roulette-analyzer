// *******************************************************************
// 1. GLOBAL VARIABLES (Trend tracking ke liye)
// *******************************************************************
let lastPredictedColour = null; 
let consecutiveFails = 0; 

const redNumbers = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];
const blackNumbers = [2,4,6,8,10,11,13,15,17,20,22,24,26,28,29,31,33,35];


// *******************************************************************
// 2. calculatePrediction FUNCTION (Numbers array pass karne ke liye theek kiya gaya)
// *******************************************************************
function calculatePrediction() {
    const input = document.getElementById("numbersInput").value;
    const numbers = input.split(",").map(x => parseInt(x.trim())).filter(x => !isNaN(x)); 

    if (numbers.length < 20) {
        alert("Please enter at least 20 numbers.");
        return;
    }

    const colourStats = calculateColourStats(numbers);
    const dozenStats = calculateDozenStats(numbers);
    const oddEvenStats = calculateOddEvenStats(numbers);

    displayStats(colourStats, dozenStats, oddEvenStats);

    // Ab 'numbers' array naye function mein bhej rahe hain
    const predictedNumbers = generatePrediction(numbers, colourStats, dozenStats, oddEvenStats);
    
    if (predictedNumbers.length === 0) {
        document.getElementById("predictedNumbers").innerText = "No strong prediction found.";
    } else {
        document.getElementById("predictedNumbers").innerText = predictedNumbers.join(", ");
    }
}


// *******************************************************************
// 3. calculateColourStats FUNCTION
// *******************************************************************
function calculateColourStats(numbers) {
    let redCount = 0, blackCount = 0;
    numbers.forEach(n => {
        if (redNumbers.includes(n)) redCount++;
        if (blackNumbers.includes(n)) blackCount++;
    });
    const total = redCount + blackCount;
    return {
        red: ((redCount/total)*100).toFixed(2),
        black: ((blackCount/total)*100).toFixed(2)
    };
}


// *******************************************************************
// 4. calculateDozenStats FUNCTION
// *******************************************************************
function calculateDozenStats(numbers) {
    let dozenCounts = [0,0,0];
    numbers.forEach(n => {
        if (n >= 1 && n <= 12) dozenCounts[0]++;
        if (n >= 13 && n <= 24) dozenCounts[1]++;
        if (n >= 25 && n <= 36) dozenCounts[2]++;
    });
    const total = dozenCounts.reduce((a,b) => a+b,0);
    return {
        dozen1: ((dozenCounts[0]/total)*100).toFixed(2),
        dozen2: ((dozenCounts[1]/total)*100).toFixed(2),
        dozen3: ((dozenCounts[2]/total)*100).toFixed(2)
    };
}


// *******************************************************************
// 5. calculateOddEvenStats FUNCTION
// *******************************************************************
function calculateOddEvenStats(numbers) {
    let oddCount = 0, evenCount = 0;
    numbers.forEach(n => {
        if (n%2 === 0) evenCount++;
        else oddCount++;
    });
    const total = oddCount + evenCount;
    return {
        odd: ((oddCount/total)*100).toFixed(2),
        even: ((evenCount/total)*100).toFixed(2)
    };
}


// *******************************************************************
// 6. displayStats FUNCTION
// *******************************************************************
function displayStats(colourStats, dozenStats, oddEvenStats) {
    document.getElementById("colourStats").innerHTML = `<b>Colour %:</b> Red = ${colourStats.red}%, Black = ${colourStats.black}%`;
    document.getElementById("dozenStats").innerHTML = `<b>Dozen %:</b> 1st = ${dozenStats.dozen1}%, 2nd = ${dozenStats.dozen2}%, 3rd = ${dozenStats.dozen3}%`;
    document.getElementById("oddEvenStats").innerHTML = `<b>Odd/Even %:</b> Odd = ${oddEvenStats.odd}%, Even = ${oddEvenStats.even}%`;
}


// *******************************************************************
// 7. generatePrediction FUNCTION (Aapka Naya Trend Logic + Return Statement)
// *******************************************************************
function generatePrediction(numbers, colourStats, dozenStats, oddEvenStats) {
    let prediction = [];
    
    if (numbers.length < 2) return []; 

    // --- 1. Colour Trend Pakadna (Aapka Trend Follow Rule) ---
    const lastNumber = numbers[numbers.length - 1];
    let latestColour;
    if (redNumbers.includes(lastNumber)) latestColour = 'red';
    else if (blackNumbers.includes(lastNumber)) latestColour = 'black';
    else latestColour = 'zero';

    let targetColour = '';
    
    if (latestColour !== 'zero') {
        if (lastPredictedColour === null || consecutiveFails >= 2) {
            targetColour = parseFloat(colourStats.red) > parseFloat(colourStats.black) ? 'red' : 'black';
            consecutiveFails = 0;
        } else if (lastPredictedColour === latestColour) {
            targetColour = latestColour;
        } else {
            targetColour = lastPredictedColour;
            consecutiveFails++;
        }
    } else {
        targetColour = lastPredictedColour || (parseFloat(colourStats.red) > parseFloat(colourStats.black) ? 'red' : 'black');
    }
    
    let targetColourNumbers = (targetColour === 'red') ? redNumbers : blackNumbers;
    lastPredictedColour = targetColour;

    // --- 2. Number Filtering ---
    
    // A. Odd/Even Filtration
    const targetIsOdd = parseFloat(oddEvenStats.odd) > parseFloat(oddEvenStats.even);
    
    // B. Dozen Filtration: Top 2 Dozens chuno
    let dozenPercentages = [
        {dozen: 1, percent: parseFloat(dozenStats.dozen1)},
        {dozen: 2, percent: parseFloat(dozenStats.dozen2)},
        {dozen: 3, percent: parseFloat(dozenStats.dozen3)}
    ];
    dozenPercentages.sort((a,b) => b.percent - a.percent);
    const topDozens = [dozenPercentages[0].dozen, dozenPercentages[1].dozen];

    // C. Final Filtering (Trend, Dozen, Odd/Even teeno ko mila kar)
    for (const num of targetColourNumbers) {
        let dozenOfNum;
        if (num >= 1 && num <= 12) dozenOfNum = 1;
        else if (num >= 13 && num <= 24) dozenOfNum = 2;
        else if (num >= 25 && num <= 36) dozenOfNum = 3;

        const isTopDozen = topDozens.includes(dozenOfNum);
        const isCorrectOddEven = targetIsOdd ? num % 2 !== 0 : num % 2 === 0;

        if (isTopDozen && isCorrectOddEven) {
            prediction.push(num);
        }
    }

    // Agar filtering ke baad koi number nahi mila, toh sirf Top Colour aur Top 2 Dozen se numbers chuno
    if (prediction.length === 0) {
         for (const num of targetColourNumbers) {
              let dozenOfNum;
              if (num >= 1 && num <= 12) dozenOfNum = 1;
              else if (num >= 13 && num <= 24) dozenOfNum = 2;
              else if (num >= 25 && num <= 36) dozenOfNum = 3;
              if (topDozens.includes(dozenOfNum)) {
                  prediction.push(num);
              }
         }
    }

    // Numbers ko 10 tak limit karo
    prediction = prediction.slice(0, 10);
    
    // YEH HAI ZAROORI RETURN STATEMENT
    return prediction; 
}
