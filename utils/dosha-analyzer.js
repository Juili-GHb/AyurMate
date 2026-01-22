export const analyzeDosha = (answers) => {
  const doshaKeywordMap = {
    vata: [
      "dry skin",        // skin type
      "light sleep",     // sleep pattern
      "irregular hunger",// digestion/appetite
      "low stamina",     // physical stamina
      "cold hands",      // body temperature
      "anxiety",         // mental state
      "quick speech",    // speech pattern
      "restlessness",    // emotional nature
      "bloating",        // additional vata trait
      "forgetfulness",   // memory
      "cold body"        // updated unique body temperature option
    ],
    pitta: [
      "oily skin",
      "normal sleep",
      "sharp hunger",
      "strong stamina",
      "hot temper",
      "intense focus",
      "sharp speech",
      "irritability",
      "thirsty",
      "acid reflux"
    ],
    kapha: [
      "cool skin",
      "oversleeping",
      "slow digestion",
      "lethargy",
      "calm nature",
      "slow speech",
      "emotional attachment",
      "weight gain",
      "oily hair",
      "soft voice"
    ]
  };

  const score = { vata: 0, pitta: 0, kapha: 0 };

  answers.forEach((ans) => {
    const answerLower = ans.toLowerCase();
    Object.entries(doshaKeywordMap).forEach(([dosha, traits]) => {
      if (traits.includes(answerLower)) {
        score[dosha]++;
      }
    });
  });

  const maxScore = Math.max(score.vata, score.pitta, score.kapha);

  const topDoshas = Object.entries(score)
    .filter(([_, val]) => val === maxScore)
    .map(([dosha]) => dosha);

  const doshaType = topDoshas
    .map(d => d.charAt(0).toUpperCase() + d.slice(1))
    .join(" and ") + (topDoshas.length > 1 ? " doshas detected" : "");

  return {
    doshaType,
    scoreBreakdown: score
  };
};