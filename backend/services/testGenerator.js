import { analyzePerformance, getDifficultyLevel } from "./learningEngine.js";

const TOPICS = ["alphabet", "numbers", "colors", "shapes"];

const QUESTION_BANK = {
  alphabet: {
    easy: [
      makeQuestion("Which letter starts Apple?", ["A", "B", "C"], "A", "identify"),
      makeQuestion("Which letter starts Ball?", ["B", "D", "P"], "B", "identify"),
      makeQuestion("Which letter starts Cat?", ["K", "C", "T"], "C", "identify"),
      makeQuestion("Find the letter D.", ["B", "D", "P"], "D", "identify"),
      makeQuestion("Which letter starts Elephant?", ["E", "F", "L"], "E", "identify"),
    ],
    medium: [
      makeQuestion("What comes after B?", ["A", "C", "D"], "C"),
      makeQuestion("What comes before D?", ["B", "C", "E"], "C"),
      makeQuestion("Which word starts with M?", ["Moon", "Sun", "Tree"], "Moon", "identify"),
      makeQuestion("Pick the lowercase match for G.", ["g", "q", "j"], "g", "match"),
      makeQuestion("What comes after L?", ["K", "M", "N"], "M"),
    ],
    hard: [
      makeQuestion("Which lowercase letter matches P?", ["p", "q", "b"], "p", "match"),
      makeQuestion("Which word starts with the same sound as Fish?", ["Fan", "Van", "Pan"], "Fan", "identify"),
      makeQuestion("What comes two letters after C?", ["D", "E", "F"], "E"),
      makeQuestion("Which letter is between H and J?", ["I", "L", "G"], "I"),
      makeQuestion("Which word does not start with B?", ["Bag", "Book", "Dog"], "Dog", "identify"),
    ],
  },
  numbers: {
    easy: [
      makeQuestion("How many stars: ★ ★ ★?", ["2", "3", "4"], "3", "identify"),
      makeQuestion("Which number is 5?", ["3", "5", "8"], "5", "identify"),
      makeQuestion("Count: ● ●", ["1", "2", "3"], "2", "identify"),
      makeQuestion("What comes after 4?", ["3", "5", "6"], "5"),
      makeQuestion("What comes before 7?", ["5", "6", "8"], "6"),
    ],
    medium: [
      makeQuestion("2 + 1 = ?", ["2", "3", "4"], "3"),
      makeQuestion("5 - 2 = ?", ["2", "3", "4"], "3"),
      makeQuestion("Which is bigger?", ["6", "3", "1"], "6"),
      makeQuestion("Count by twos after 2.", ["3", "4", "5"], "4"),
      makeQuestion("Which matches four objects?", ["● ●", "● ● ● ●", "● ● ●"], "● ● ● ●", "match"),
    ],
    hard: [
      makeQuestion("3 + 4 = ?", ["6", "7", "8"], "7"),
      makeQuestion("10 - 3 = ?", ["6", "7", "8"], "7"),
      makeQuestion("Which number is odd?", ["4", "6", "7"], "7"),
      makeQuestion("What comes between 8 and 10?", ["7", "9", "11"], "9"),
      makeQuestion("Which is smallest?", ["12", "9", "15"], "9"),
    ],
  },
  colors: {
    easy: [
      makeQuestion("What color is the sky on a sunny day?", ["Blue", "Green", "Red"], "Blue", "identify"),
      makeQuestion("What color is a banana?", ["Yellow", "Purple", "Blue"], "Yellow", "identify"),
      makeQuestion("Pick the red item.", ["Apple", "Leaf", "Cloud"], "Apple", "identify"),
      makeQuestion("Grass is usually...", ["Green", "Pink", "Black"], "Green", "identify"),
      makeQuestion("A strawberry is usually...", ["Red", "Blue", "Brown"], "Red", "identify"),
    ],
    medium: [
      makeQuestion("Red + Yellow makes...", ["Orange", "Green", "Purple"], "Orange"),
      makeQuestion("Blue + Yellow makes...", ["Green", "Orange", "Pink"], "Green"),
      makeQuestion("Which is a warm color?", ["Red", "Blue", "Green"], "Red"),
      makeQuestion("Which is a cool color?", ["Blue", "Orange", "Yellow"], "Blue"),
      makeQuestion("Pick the color of grapes.", ["Purple", "Yellow", "White"], "Purple", "identify"),
    ],
    hard: [
      makeQuestion("Red + Blue makes...", ["Purple", "Green", "Orange"], "Purple"),
      makeQuestion("Which color is closest to violet?", ["Purple", "Yellow", "Green"], "Purple"),
      makeQuestion("Which pair can make green?", ["Blue + Yellow", "Red + Blue", "Red + Yellow"], "Blue + Yellow"),
      makeQuestion("Which is not a rainbow color?", ["Red", "Blue", "Brown"], "Brown"),
      makeQuestion("Which color is made by mixing black and white?", ["Gray", "Pink", "Orange"], "Gray"),
    ],
  },
  shapes: {
    easy: [
      makeQuestion("Which shape has 3 sides?", ["Triangle", "Square", "Circle"], "Triangle", "identify"),
      makeQuestion("Which shape is round?", ["Circle", "Square", "Rectangle"], "Circle", "identify"),
      makeQuestion("Which shape has 4 equal sides?", ["Square", "Triangle", "Oval"], "Square", "identify"),
      makeQuestion("A ball looks like a...", ["Circle", "Triangle", "Star"], "Circle", "identify"),
      makeQuestion("A window often looks like a...", ["Rectangle", "Circle", "Triangle"], "Rectangle", "identify"),
    ],
    medium: [
      makeQuestion("Which shape has no corners?", ["Circle", "Square", "Triangle"], "Circle"),
      makeQuestion("Which shape has 4 sides but is long?", ["Rectangle", "Circle", "Triangle"], "Rectangle"),
      makeQuestion("How many sides does a square have?", ["3", "4", "5"], "4"),
      makeQuestion("Which shape looks like an egg?", ["Oval", "Square", "Star"], "Oval"),
      makeQuestion("Match the roof shape.", ["Triangle", "Circle", "Oval"], "Triangle", "match"),
    ],
    hard: [
      makeQuestion("How many corners does a rectangle have?", ["3", "4", "5"], "4"),
      makeQuestion("Which shape can tile a floor best?", ["Square", "Circle", "Oval"], "Square"),
      makeQuestion("Which shape has more sides than a triangle?", ["Square", "Circle", "Oval"], "Square"),
      makeQuestion("Which shape has exactly 5 sides?", ["Pentagon", "Triangle", "Circle"], "Pentagon"),
      makeQuestion("Which two shapes both have 4 corners?", ["Square and Rectangle", "Circle and Oval", "Triangle and Circle"], "Square and Rectangle"),
    ],
  },
};

export const generateTest = async (
  childId,
  topic,
  difficulty,
  numberOfQuestions,
  weakFocus = false
) => {
  const analysis = await analyzePerformance(childId);
  const selectedTopic = selectTopic(topic, analysis, weakFocus);
  const selectedDifficulty =
    difficulty === "adaptive"
      ? await getDifficultyLevel(childId, selectedTopic)
      : normalizeDifficulty(difficulty);

  const count = clampQuestionCount(numberOfQuestions);
  const questions = buildQuestions(selectedTopic, selectedDifficulty, count);

  return {
    topic: selectedTopic,
    difficulty: selectedDifficulty,
    numberOfQuestions: count,
    questions,
    focusAreas: analysis.weakTopics.map((item) => item.topic),
  };
};

function makeQuestion(question, options, correctAnswer, type = "mcq") {
  return { question, options, correctAnswer, type };
}

function selectTopic(topic, analysis, weakFocus) {
  const weakTopic = analysis.weakTopics.find((item) => TOPICS.includes(item.topic));
  if (weakFocus && weakTopic) return weakTopic.topic;
  if (TOPICS.includes(topic)) return topic;
  return weakTopic?.topic || "alphabet";
}

function normalizeDifficulty(difficulty) {
  return ["easy", "medium", "hard"].includes(difficulty) ? difficulty : "easy";
}

function clampQuestionCount(numberOfQuestions) {
  const parsed = Number(numberOfQuestions);
  if (!Number.isFinite(parsed)) return 5;
  return Math.max(1, Math.min(20, Math.round(parsed)));
}

function buildQuestions(topic, difficulty, count) {
  const pool = QUESTION_BANK[topic]?.[difficulty] || QUESTION_BANK.alphabet.easy;
  return Array.from({ length: count }, (_, index) => {
    const source = pool[index % pool.length];
    return {
      ...source,
      options: shuffleOptions(source.options),
    };
  });
}

function shuffleOptions(options) {
  return [...options].sort(() => Math.random() - 0.5);
}
