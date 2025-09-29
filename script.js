// *******************************************************************
// 7. generatePrediction FUNCTION (Final Logic: Trend + Percentage Filtering)
// *******************************************************************
function generatePrediction(numbers, colourStats, dozenStats, oddEvenStats) {
    let prediction = [];
    
    if (numbers.length < 2) return []; 

    // --- 1. Colour Target (TREND PRIORITY) ---
    // Rule: Latest result ka colour agla target hoga.
    const lastNumber = numbers[numbers.length - 1];
    let latestColour = redNumbers.includes(lastNumber) ? 'red' : (blackNumbers.includes(lastNumber) ? 'black' : 'zero');

    let targetColour = '';
    
    if (latestColour !== 'zero') {
        // 1st Point: Turant latest colour ko target banao (Trend priority).
        targetColour = latestColour;
    } else {
        // Zero aane par: Pichle target colour ko continue karo.
        targetColour = lastPredictedColour || (parseFloat(colourStats.red) >= parseFloat(colourStats.black) ? 'red' : 'black');
    }
    
    let targetColourNumbers = (targetColour === 'red') ? redNumbers : blackNumbers;
    lastPredictedColour = targetColour; 

    // --- 2. Odd/Even Filtration (PERCENTAGE BASED: Pehla Filter) ---
    // 2nd Point: Odd/Even ki % dekho, jiska zyada ho uske numbers chuno.
    const targetIsOdd = parseFloat(oddEvenStats.odd) > parseFloat(oddEvenStats.even);
    
    let filteredByOddEven = [];
    for (const num of targetColourNumbers) {
        const isCorrectOddEven = targetIsOdd ? num % 2 !== 0 : num % 2 === 0;
        if (isCorrectOddEven) {
            filteredByOddEven.push(num); // Ab yahan approx. 9 numbers bachenge
        }
    }

    // --- 3. Dozen Selection Rules (Aapke SPECIAL RULES + Percentage Base) ---
    
    let topDozens = [];
    // Special Rules check:
    if (lastNumber >= 31 && lastNumber <= 36) {
        topDozens = [1, 3];
    } else if (lastNumber >= 19 && lastNumber <= 24) {
        topDozens = [2, 3]; 
    } else if (lastNumber >= 13 && lastNumber <= 18) {
        topDozens = [1, 2]; 
    } else if (lastNumber >= 1 && lastNumber <= 6) {
        topDozens = [1, 2]; 
    } 
    
    // Fallback: Agar upar koi rule nahi laga, toh 3rd Point: Top 2 Percentage wale Dozens chuno.
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
    
    for (const num of filteredByOddEven) { // Odd/Even se filtered numbers par Dozen check
        let dozenOfNum;
        if (num >= 1 && num <= 12) dozenOfNum = 1;
        else if (num >= 13 && num <= 24) dozenOfNum = 2;
        else if (num >= 25 && num <= 36) dozenOfNum = 3;

        // Filtering: Final check Top Dozens se
        const isTopDozen = topDozens.includes(dozenOfNum);

        if (isTopDozen) {
            prediction.push(num);
        }
    }

    // Fallback: Agar filtering ke baad koi number nahi mila
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
    
    return prediction; 
}
