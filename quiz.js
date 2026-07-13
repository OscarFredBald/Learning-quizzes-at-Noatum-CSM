const params = new URLSearchParams(window.location.search);
const quizName = params.get("quiz");

let questions = [];
let currentQuestion = 0;
let score = 0;
let answered = false;

const quizTitle = document.getElementById("quiz-title");
const quizBox = document.getElementById("quiz-box");
const loadingMessage = document.getElementById("loading-message");
const errorMessage = document.getElementById("error-message");
const nextButton = document.getElementById("next-btn");

if (!quizName) {
  showError("No quiz was selected.");
} else {
  loadQuiz();
}

async function loadQuiz() {
  try {
    const response = await fetch(`data/${quizName}.json`);

    if (!response.ok) {
      throw new Error(`Quiz file could not be found: data/${quizName}.json`);
    }

    const data = await response.json();

    if (!data.title || !Array.isArray(data.questions) || data.questions.length === 0) {
      throw new Error("The quiz file does not contain valid quiz data.");
    }

    quizTitle.textContent = data.title;
    questions = data.questions;

    loadingMessage.style.display = "none";
    quizBox.style.display = "block";

    loadQuestion();
  } catch (error) {
    console.error(error);
    showError(
      "The quiz could not be loaded. Check that the JSON filename and content are correct."
    );
  }
}

function loadQuestion() {
  answered = false;

  const questionData = questions[currentQuestion];

  document.getElementById("progress").textContent =
    `Question ${currentQuestion + 1} of ${questions.length}`;

  document.getElementById("question").textContent =
    questionData.question;

  const optionsContainer = document.getElementById("options");
  optionsContainer.innerHTML = "";

  const explanation = document.getElementById("explanation");
  explanation.style.display = "none";
  explanation.innerHTML = "";

  nextButton.style.display = "none";

  questionData.options.forEach((optionText, index) => {
    const option = document.createElement("button");

    option.type = "button";
    option.className = "option";
    option.textContent = optionText;
    option.addEventListener("click", () => selectAnswer(option, index));

    optionsContainer.appendChild(option);
  });
}

function selectAnswer(selectedOption, selectedIndex) {
  if (answered) {
    return;
  }

  answered = true;

  const questionData = questions[currentQuestion];
  const optionElements = document.querySelectorAll(".option");

  optionElements.forEach((option, index) => {
    option.disabled = true;

    if (index === questionData.answer) {
      option.classList.add("correct");
    }
  });

  if (selectedIndex === questionData.answer) {
    score++;
  } else {
    selectedOption.classList.add("wrong");
  }

  const explanation = document.getElementById("explanation");
  explanation.style.display = "block";
  explanation.innerHTML =
    `<strong>Explanation:</strong><br>${questionData.explanation}`;

  nextButton.textContent =
    currentQuestion === questions.length - 1
      ? "See Result"
      : "Next Question";

  nextButton.style.display = "inline-block";
}

nextButton.addEventListener("click", () => {
  currentQuestion++;

  if (currentQuestion < questions.length) {
    loadQuestion();
  } else {
    showResult();
  }
});

function showResult() {
  const percentage = Math.round((score / questions.length) * 100);

  quizBox.innerHTML = `
    <div class="result">
      <h2>Quiz completed</h2>
      <p>You answered <strong>${score}</strong> of
      <strong>${questions.length}</strong> questions correctly.</p>
      <p>Your result is <strong>${percentage}%</strong>.</p>

      <button
        type="button"
        class="result-button"
        onclick="window.location.reload()">
        Restart Quiz
      </button>

      <a class="result-link" href="index.html">
        Back to topics
      </a>
    </div>
  `;
}

function showError(message) {
  loadingMessage.style.display = "none";
  quizBox.style.display = "none";
  quizTitle.textContent = "Unable to load quiz";

  errorMessage.style.display = "block";
  errorMessage.innerHTML = `
    <p>${message}</p>
    <p><a href="index.html">Return to the quiz portal</a></p>
  `;
}
