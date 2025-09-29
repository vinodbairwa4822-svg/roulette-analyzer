// *******************************************************************
// 7. generatePrediction FUNCTION (Final Logic: Trend + Percentage Filtering)
// *******************************************************************

// Ensure these are defined globally or passed as parameters
// const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
// const blackNumbers = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];
// let lastPredictedColour = ''; // This should be initialized globally if it maintains state across calls

function generatePrediction(numbers, colourStats, dozenStats, oddEvenStats) {
    let prediction = [];
    
    if (numbers.length < 2) return []; 

    const lastNumber = numbers[numbers.length - 1];

    // --- 0. Zero Number Handling (Green Colour Recognition) ---
    // Zero ka colour green hai.
    // Par hum prediction green colours ki nahi kar rahe, toh iska trend kaise use karein?
    // Agar lastNumber 0 hai (green), toh hum pichle non-zero number ke trend ko follow karenge
    // ya percentage-based fallback.
    
    let effectiveLastNumber = lastNumber; // Default to last number
    let effectiveLastColour = ''; // To store the actual colour of the effectiveLastNumber

    if (lastNumber === 0) {
        // Agar last number 0 hai, toh iska colour green hai.
        // Hum abhi bhi pichle non-zero number ke trend par rely karenge
        // ya colour stats ka upyog karenge.
        effectiveLastColour = 'green'; // 0 ka colour green mark kar diya

        // Pichla non-zero number dhundho (agar 0 trend ko todta hai)
        let foundNonZero = false;
        for (let i = numbers.length - 2; i >= 0; i--) {
            if (numbers[i] !== 0) {
                effectiveLastNumber = numbers[i]; // Pichla non-zero number mila
                foundNonZero = true;
                break;
            }
        }
        // Agar saare numbers hi zero hon ya pichla non-zero na mile, toh prediction nahi de sakte.
        if (!foundNonZero) return [];
    } else {
        // Agar last number 0 nahi hai, toh uska actual colour determine karein.
        effectiveLastColour = redNumbers.includes(lastNumber) ? 'red' : (blackNumbers.includes(lastNumber) ? 'black' : 'zero');
        effectiveLastNumber = lastNumber; // Yahan lastNumber hi effectiveLastNumber hai
    }


    // --- 1. Colour Target (TREND PRIORITY) ---
    let targetColour = '';
    
    // Agar effectiveLastColour 'red' ya 'black' hai, toh usko target banao (Trend priority).
    if (effectiveLastColour === 'red' || effectiveLastColour === 'black') {
        targetColour = effectiveLastColour;
    } else {
        // Agar effectiveLastColour 'green' (yani 0 aaya) ya 'zero' (invalid non-green/red/black) hai,
        // toh pichle predicted colour ko continue karo.
        // Agar 'lastPredictedColour' bhi nahi hai, toh percentage se red/black chuno.
        targetColour = lastPredictedColour || (parseFloat(colourStats.red) >= parseFloat(colourStats.black) ? 'red' : 'black');
    }
    
    // Ensure targetColour is always red or black for prediction
    let targetColourNumbers = (targetColour === 'red') ? redNumbers : blackNumbers;
    // Update lastPredictedColour for the next round if it was a valid red/black prediction
    if (targetColour === 'red' || targetColour === 'black') {
        lastPredictedColour = targetColour;
    }


    // --- 2. Odd/Even Filtration (PERCENTAGE BASED: Pehla Filter) ---
    const targetIsOdd = parseFloat(oddEvenStats.odd) > parseFloat(oddEvenStats.even);
    
    let filteredByOddEven = [];
    for (const num of targetColourNumbers) {
        // 0 ko final prediction se hatao (Yeh check redundant ho sakta hai agar red/blackNumbers mein 0 nahi hai,
        // but it's a good safety measure)
        if (num === 0) continue; 

        const isCorrectOddEven = targetIsOdd ? num % 2 !== 0 : num % 2 === 0;
        if (isCorrectOddEven) {
            filteredByOddEven.push(num); 
        }
    }

    // --- 3. Dozen Selection Rules (Aapke SPECIAL RULES + Percentage Base) ---
    
    let topDozens = [];
    // Special Rules check: effectiveLastNumber par apply karein
    if (effectiveLastNumber >= 31 && effectiveLastNumber <= 36) {
        topDozens = [1, 3];
    } else if (effectiveLastNumber >= 19 && effectiveLastNumber <= 24) {
        topDozens = [2, 3]; 
    } else if (effectiveLastNumber >= 13 && effectiveLastNumber <= 18) {
        topDozens = [1, 2]; 
    } else if (effectiveLastNumber >= 1 && effectiveLastNumber <= 6) {
        topDozens = [1, 2]; 
    } 
    
    // Fallback: Agar upar koi rule nahi laga, toh Top 2 Percentage wale Dozens chuno.
    if (topDozens.length === 0) {
        let dozenPercentages = [
            {dozen: 1, percent: parseFloat(dozenStats.dozen1)},
            {dozen: 2, percent: parseFloat(dozenStats.dozen2)},
            {dozen: 3, percent: parseFloat(dozenStats.dozen3)}
        ];
        dozenPercentages.sort((a,b) => b.percent - a.percent);
        topDozens = [dozenPercentages[0].dozen, dozenPercentages[1].dozen];
    }

    // --- 4. Final Filtering (Doosra Filter) ---
    for (const num of filteredByOddEven) { 
        if (num === 0) continue; // Safety check

        let dozenOfNum;
        if (num >= 1 && num <= 12) dozenOfNum = 1;
        else if (num >= 13 && num <= 24) dozenOfNum = 2;
        else if (num >= 25 && num <= 36) dozenOfNum = 3;
        else continue; // Invalid number (like 0)

        const isTopDozen = topDozens.includes(dozenOfNum);

        if (isTopDozen) {
            prediction.push(num);
        }
    }

    // Fallback: Agar filtering ke baad koi number nahi mila
    if (prediction.length === 0) {
         for (const num of targetColourNumbers) {
              if (num === 0) continue; // Safety check

              let dozenOfNum;
              if (num >= 1 && num <= 12) dozenOfNum = 1;
              else if (num >= 13 && num <= 24) dozenOfNum = 2;
              else if (num >= 25 && num <= 36) dozenOfNum = 3;
              else continue; // Invalid number (like 0)

              if (topDozens.includes(dozenOfNum)) {
                  prediction.push(num);
              }
         }
    }

    // Numbers ko 10 tak limit karo
    prediction = prediction.slice(0, 10);
    
    return prediction; 
}
