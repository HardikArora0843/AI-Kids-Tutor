export const normalizeSpeech = (value = "") =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();

export const checkPronunciation = (spokenText, expectedValues) => {
  const spoken = normalizeSpeech(spokenText);
  const expectedList = Array.isArray(expectedValues) ? expectedValues : [expectedValues];

  if (!spoken) {
    return {
      status: "incorrect",
      message: "Try speaking a little louder.",
    };
  }

  for (const expectedValue of expectedList) {
    const expected = normalizeSpeech(expectedValue);
    if (!expected) continue;

    if (spoken === expected || spoken.includes(expected) || expected.includes(spoken)) {
      return {
        status: "correct",
        message: "Great pronunciation!",
      };
    }

    const distance = levenshteinDistance(spoken, expected);
    const maxLength = Math.max(spoken.length, expected.length);
    const similarity = maxLength === 0 ? 1 : 1 - distance / maxLength;

    if (distance <= 1 || similarity >= 0.72) {
      return {
        status: "close",
        message: "So close! Nice speaking.",
      };
    }
  }

  return {
    status: "incorrect",
    message: "Let's try again!",
  };
};

function levenshteinDistance(a, b) {
  const matrix = Array.from({ length: b.length + 1 }, (_, row) => [row]);

  for (let col = 0; col <= a.length; col++) {
    matrix[0][col] = col;
  }

  for (let row = 1; row <= b.length; row++) {
    for (let col = 1; col <= a.length; col++) {
      const substitutionCost = a[col - 1] === b[row - 1] ? 0 : 1;
      matrix[row][col] = Math.min(
        matrix[row - 1][col] + 1,
        matrix[row][col - 1] + 1,
        matrix[row - 1][col - 1] + substitutionCost
      );
    }
  }

  return matrix[b.length][a.length];
}
