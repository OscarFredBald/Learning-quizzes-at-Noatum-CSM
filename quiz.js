const quizFiles = {
  "marine-diesel-engine": {
    file: "./data/marine-diesel-engine.json",
    fallbackTitle: "Marine Diesel Engines"
  },

  "ballast-water": {
    file: "./data/ballast-water.json",
    fallbackTitle: "Ballast Water and BWTS"
  },

  "bulk-carrier-design": {
    file: "./data/bulk-carrier-design.json",
    fallbackTitle: "Bulk Carrier Design"
  },

  "maritime-insurance": {
    file: "./data/maritime-insurance.json",
    fallbackTitle: "Maritime Insurance"
  },

  "important-parties-in-shipping": {
    file: "./data/important-parties-in-shipping.json",
    fallbackTitle: "Important Parties in Shipping"
  },

  "marpol": {
    file: "./data/marpol.json",
    fallbackTitle: "MARPOL"
  },

  "ship-security-plan": {
    file: "./data/ship-security-plan.json",
    fallbackTitle: "Ship Security Plan and ISPS Code"
  },

  "navtex": {
    file: "./data/navtex.json",
    fallbackTitle: "NAVTEX and Maritime Safety Information"
  },

  "ecdis": {
    file: "./data/ecdis.json",
    fallbackTitle: "ECDIS and Electronic Navigation"
  },

  "radar-arpa": {
    file: "./data/radar-arpa.json",
    fallbackTitle: "Marine Radar and ARPA"
  },

  "vessel-traffic-services": {
    file: "./data/vessel-traffic-services.json",
    fallbackTitle: "Vessel Traffic Services (VTS)"
  }, 
  
  "bridge-workstations": {
  file: "./data/bridge-workstations.json",
  fallbackTitle: "Ship Navigation Bridge and Workstations"
}
};

const parameters =
  new URLSearchParams(window.location.search);

const quizKey =
  parameters.get("quiz");

const selectedQuiz =
  quizFiles[quizKey];

const quizContent =
  document.getElementById("quiz-content");

const quizTitle =
  document.getElementById("quiz-title");

const questionCounter =
  document.getElementById("question-counter");

const progressPercentage =
  document.getElementById("progress-percentage");

const scoreCounter =
  document.getElementById("score-counter");

const progressFill =
  document.getElementById("progress-fill");

const questionKicker =
  document.getElementById("question-kicker");

const difficultyBadge =
  document.getElementById("difficulty-badge");

const questionText =
  document.getElementById("question-text");

const questionImage =
  document.getElementById("question-image");

const answersContainer =
  document.getElementById("answers");

const feedback =
  document.getElementById("feedback");

const previousButton =
  document.getElementById("previous-button");

const nextButton =
  document.getElementById("next-button");

const resultCard =
  document.getElementById("result-card");

const resultScore =
  document.getElementById("result-score");

const resultMessage =
  document.getElementById("result-message");

const reviewButton =
  document.getElementById("review-button");

const restartButton =
  document.getElementById("restart-button");

let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let userAnswers = [];

async function loadQuiz() {
  if (!selectedQuiz) {
    showError(
      "The selected quiz could not be found. Return to the home page and choose a valid quiz."
    );

    return;
  }

  quizTitle.textContent =
    selectedQuiz.fallbackTitle;

  document.title =
    `${selectedQuiz.fallbackTitle} | Maritime Learning Portal`;

  try {
    const response = await fetch(
      selectedQuiz.file,
      {
        cache: "no-store"
      }
    );

    if (!response.ok) {
      throw new Error(
        `The quiz file returned HTTP status ${response.status}.`
      );
    }

    const data =
      await response.json();

    if (Array.isArray(data)) {
      questions = data;
    } else if (
      data &&
      Array.isArray(data.questions)
    ) {
      questions = data.questions;

      if (data.title) {
        quizTitle.textContent =
          data.title;

        document.title =
          `${data.title} | Maritime Learning Portal`;
      }
    } else {
      throw new Error(
        "The JSON file does not contain a valid questions array."
      );
    }

    if (questions.length === 0) {
      throw new Error(
        "The quiz contains no questions."
      );
    }

    validateQuestions();

    userAnswers =
      new Array(questions.length).fill(null);

    showQuestion();
  } catch (error) {
    console.error(
      "Quiz loading error:",
      error
    );

    showError(
      `The quiz could not be loaded. ${error.message}`
    );
  }
}

function validateQuestions() {
  questions.forEach(
    (question, index) => {
      const answers =
        getAnswers(question);

      const correctIndex =
        getCorrectIndex(question);

      if (
        typeof question.question !== "string" ||
        question.question.trim() === "" ||
        !Array.isArray(answers) ||
        answers.length < 2 ||
        !Number.isInteger(correctIndex) ||
        correctIndex < 0 ||
        correctIndex >= answers.length
      ) {
        throw new Error(
          `Question ${index + 1} has an invalid format.`
        );
      }
    }
  );
}

function getAnswers(question) {
  if (Array.isArray(question.options)) {
    return question.options;
  }

  return question.answers;
}

function getCorrectIndex(question) {
  if (Number.isInteger(question.answer)) {
    return question.answer;
  }

  return question.correct;
}

function getDifficulty(question, index) {
  if (
    typeof question.difficulty === "string"
  ) {
    const value =
      question.difficulty.toLowerCase();

    if (value.includes("easy")) {
      return {
        label: "Easy",
        className: "easy"
      };
    }

    if (value.includes("medium")) {
      return {
        label: "Medium",
        className: "medium"
      };
    }

    return {
      label: "Hard",
      className: "hard"
    };
  }

  const position =
    (index + 1) / questions.length;

  if (position <= 0.25) {
    return {
      label: "Easy",
      className: "easy"
    };
  }

  if (position <= 0.5) {
    return {
      label: "Medium",
      className: "medium"
    };
  }

  return {
    label: "Hard",
    className: "hard"
  };
}

function showQuestion() {
  const question =
    questions[currentQuestionIndex];

  const answers =
    getAnswers(question);

  const correctIndex =
    getCorrectIndex(question);

  const selectedAnswer =
    userAnswers[currentQuestionIndex];

  const questionHasBeenAnswered =
    selectedAnswer !== null;

  const questionNumber =
    currentQuestionIndex + 1;

  const totalQuestions =
    questions.length;

  const completedPercentage =
    Math.round(
      (questionNumber / totalQuestions) * 100
    );

  const difficulty =
    getDifficulty(
      question,
      currentQuestionIndex
    );

  questionCounter.textContent =
    `Question ${questionNumber} of ${totalQuestions}`;

  progressPercentage.textContent =
    `${completedPercentage}%`;

  scoreCounter.textContent =
    score;

  progressFill.style.width =
    `${completedPercentage}%`;

  questionKicker.textContent =
    `Question ${questionNumber}`;

  difficultyBadge.textContent =
    difficulty.label;

  difficultyBadge.className =
    `difficulty-badge ${difficulty.className}`;

  questionText.textContent =
    question.question;

  previousButton.disabled =
    currentQuestionIndex === 0;

  showQuestionImage(question);

  answersContainer.innerHTML = "";

  feedback.className =
    "feedback";

  feedback.innerHTML = "";

  answers.forEach(
    (answer, index) => {
      const answerButton =
        document.createElement("button");

      answerButton.type =
        "button";

      answerButton.className =
        "answer-button";

      answerButton.dataset.letter =
        String.fromCharCode(65 + index);

      answerButton.textContent =
        answer;

      if (questionHasBeenAnswered) {
        answerButton.disabled = true;

        if (index === correctIndex) {
          answerButton.classList.add(
            "correct"
          );
        }

        if (
          index === selectedAnswer &&
          selectedAnswer !== correctIndex
        ) {
          answerButton.classList.add(
            "incorrect"
          );
        }
      } else {
        answerButton.addEventListener(
          "click",
          () => selectAnswer(index)
        );
      }

      answersContainer.appendChild(
        answerButton
      );
    }
  );

  if (questionHasBeenAnswered) {
    showFeedback(
      question,
      selectedAnswer,
      correctIndex,
      answers
    );

    nextButton.style.display =
      "inline-flex";

    updateNextButtonText();
  } else {
    nextButton.style.display =
      "none";
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function showQuestionImage(question) {
  if (
    typeof question.image === "string" &&
    question.image.trim() !== ""
  ) {
    questionImage.src =
      question.image;

    questionImage.alt =
      question.imageAlt ||
      "Maritime quiz illustration";

    questionImage.style.display =
      "block";

    questionImage.onerror = () => {
      questionImage.style.display =
        "none";
    };
  } else {
    questionImage.style.display =
      "none";

    questionImage.removeAttribute(
      "src"
    );

    questionImage.alt = "";
  }
}

function selectAnswer(selectedIndex) {
  if (
    userAnswers[currentQuestionIndex] !== null
  ) {
    return;
  }

  const question =
    questions[currentQuestionIndex];

  const answers =
    getAnswers(question);

  const correctIndex =
    getCorrectIndex(question);

  userAnswers[currentQuestionIndex] =
    selectedIndex;

  if (selectedIndex === correctIndex) {
    score += 1;
  }

  scoreCounter.textContent =
    score;

  const answerButtons =
    answersContainer.querySelectorAll(
      ".answer-button"
    );

  answerButtons.forEach(
    (button) => {
      button.disabled = true;
    }
  );

  answerButtons[
    correctIndex
  ].classList.add("correct");

  if (selectedIndex !== correctIndex) {
    answerButtons[
      selectedIndex
    ].classList.add("incorrect");
  }

  showFeedback(
    question,
    selectedIndex,
    correctIndex,
    answers
  );

  updateNextButtonText();

  nextButton.style.display =
    "inline-flex";
}

function showFeedback(
  question,
  selectedIndex,
  correctIndex,
  answers
) {
  const explanation =
    question.explanation ||
    `The correct answer is: ${answers[correctIndex]}`;

  if (selectedIndex === correctIndex) {
    feedback.className =
      "feedback correct";

    feedback.innerHTML =
      `<strong>Correct answer</strong>${escapeHtml(explanation)}`;
  } else {
    feedback.className =
      "feedback incorrect";

    feedback.innerHTML =
      `<strong>Incorrect answer</strong>${escapeHtml(explanation)}`;
  }
}

function updateNextButtonText() {
  if (
    currentQuestionIndex ===
    questions.length - 1
  ) {
    nextButton.textContent =
      "View results →";
  } else {
    nextButton.textContent =
      "Next question →";
  }
}

function previousQuestion() {
  if (currentQuestionIndex === 0) {
    return;
  }

  currentQuestionIndex -= 1;

  showQuestion();
}

function nextQuestion() {
  if (
    userAnswers[currentQuestionIndex] === null
  ) {
    return;
  }

  if (
    currentQuestionIndex <
    questions.length - 1
  ) {
    currentQuestionIndex += 1;

    showQuestion();
  } else {
    showResults();
  }
}

function showResults() {
  quizContent.style.display =
    "none";

  resultCard.style.display =
    "block";

  const percentage =
    Math.round(
      (score / questions.length) * 100
    );

  resultScore.textContent =
    `${score} of ${questions.length} correct · ${percentage}%`;

  if (percentage >= 90) {
    resultMessage.textContent =
      "Excellent result. You demonstrated strong knowledge across the easy, medium and hard questions.";
  } else if (percentage >= 75) {
    resultMessage.textContent =
      "Very good result. You understand the main principles and handled several difficult questions well.";
  } else if (percentage >= 60) {
    resultMessage.textContent =
      "Good foundation. Review the explanations from the more difficult questions and try again.";
  } else if (percentage >= 40) {
    resultMessage.textContent =
      "You understand some of the fundamentals, but the medium and hard sections need more review.";
  } else {
    resultMessage.textContent =
      "This topic needs further review. Read the explanations carefully and try the quiz again.";
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function reviewAnswers() {
  resultCard.style.display =
    "none";

  quizContent.style.display =
    "block";

  currentQuestionIndex = 0;

  showQuestion();
}

function restartQuiz() {
  currentQuestionIndex = 0;
  score = 0;

  userAnswers =
    new Array(questions.length).fill(null);

  resultCard.style.display =
    "none";

  quizContent.style.display =
    "block";

  showQuestion();
}

function showError(message) {
  quizTitle.textContent =
    "Quiz unavailable";

  const quizBody =
    document.querySelector(".quiz-body");

  if (quizBody) {
    quizBody.innerHTML =
      `<div class="error-message">${escapeHtml(message)}</div>`;
  }
}

function escapeHtml(value) {
  const temporaryElement =
    document.createElement("div");

  temporaryElement.textContent =
    String(value);

  return temporaryElement.innerHTML;
}

previousButton.addEventListener(
  "click",
  previousQuestion
);

nextButton.addEventListener(
  "click",
  nextQuestion
);

reviewButton.addEventListener(
  "click",
  reviewAnswers
);

restartButton.addEventListener(
  "click",
  restartQuiz
);

loadQuiz();
