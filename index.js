const quizzes = [
  {
    id: "marine-diesel-engine",
    title: "Marine Diesel Engines",
    category: "Marine Engineering",
    badge: "Engineering",
    description:
      "Learn about combustion, fuel systems, cooling, lubrication and the design and operation of marine engines.",
    image: "./images/marine-diesel-engine.jpg",
    imageAlt: "Large marine diesel engine",
    icon: "⚙️",
    tags: [
      "Combustion",
      "Fuel systems",
      "Cooling",
      "Engine design"
    ]
  },

  {
    id: "ballast-water",
    title: "Ballast Water and BWTS",
    category: "Ship Operations",
    badge: "Vessel operations",
    description:
      "Explore ballast operations, stability, trim, structural loading and ballast water treatment systems.",
    image: "./images/ballast-waters.jpg",
    imageAlt: "Ship ballast water system",
    icon: "🌊",
    tags: [
      "Stability",
      "Trim",
      "BWM Convention",
      "BWTS"
    ]
  },

  {
    id: "bulk-carrier-design",
    title: "Bulk Carrier Design",
    category: "Naval Architecture",
    badge: "Ship design",
    description:
      "Learn about bulk carrier hull structure, cargo holds, longitudinal strength, hopper tanks and hatch openings.",
    image: "./images/bulk-carrier-design.jpg",
    imageAlt: "Bulk carrier ship design",
    icon: "🚢",
    tags: [
      "Hull structure",
      "Cargo holds",
      "Hopper tanks",
      "Ship strength"
    ]
  },

  {
    id: "maritime-insurance",
    title: "Maritime Insurance",
    category: "Commercial Shipping",
    badge: "Insurance and risk",
    description:
      "Learn insurable interest, indemnity, proximate cause, warranties, subrogation and contribution.",
    image: "./images/maritime-insurance.jpg",
    imageAlt: "Cargo vessel representing maritime insurance",
    icon: "🛡️",
    tags: [
      "Indemnity",
      "Subrogation",
      "Warranties",
      "Claims"
    ]
  },

  {
    id: "important-parties-in-shipping",
    title: "Important Parties in Shipping",
    category: "Commercial Shipping",
    badge: "Shipping roles",
    description:
      "Understand the roles of shipowners, charterers, shippers, consignees, ship managers, crew and freight forwarders.",
    image: "./images/important-parties-in-shipping.jpg",
    imageAlt: "Commercial shipping and logistics operations",
    icon: "🤝",
    tags: [
      "Shipowner",
      "Charterer",
      "Shipper",
      "Consignee"
    ]
  },

  {
    id: "marpol",
    title: "MARPOL",
    category: "Regulations",
    badge: "Environmental regulation",
    description:
      "Test your knowledge of MARPOL Annexes I–VI and the prevention of pollution from ships.",
    image: "./images/marpol.jpg",
    imageAlt: "Vessel operating under marine environmental regulations",
    icon: "🌍",
    tags: [
      "Oil",
      "Garbage",
      "Sewage",
      "Air emissions"
    ]
  }
];

const quizGrid =
  document.getElementById("quiz-grid");

const quizTotal =
  document.getElementById("quiz-total");

function escapeHtml(value) {
  const element =
    document.createElement("div");

  element.textContent =
    String(value);

  return element.innerHTML;
}

async function getQuestionCount(quizId) {
  try {
    const response = await fetch(
      `data/${quizId}.json`,
      {
        cache: "no-store"
      }
    );

    if (!response.ok) {
      throw new Error(
        `Status ${response.status}`
      );
    }

    const data =
      await response.json();

    if (Array.isArray(data)) {
      return data.length;
    }

    if (
      data &&
      Array.isArray(data.questions)
    ) {
      return data.questions.length;
    }

    return null;
  } catch (error) {
    console.warn(
      `Could not load question count for ${quizId}:`,
      error
    );

    return null;
  }
}

function createQuizCard(quiz) {
  const card =
    document.createElement("article");

  card.className =
    "quiz-card";

  const tagsHtml =
    quiz.tags
      .map(
        (tag) =>
          `<span class="topic-tag">${escapeHtml(tag)}</span>`
      )
      .join("");

  card.innerHTML = `
    <div class="card-image-wrapper">
      <img
        class="card-image"
        src="${escapeHtml(quiz.image)}"
        alt="${escapeHtml(quiz.imageAlt)}"
      >

      <div class="image-overlay"></div>

      <span class="difficulty">
        ${escapeHtml(quiz.badge)}
      </span>

      <div
        class="card-icon"
        aria-hidden="true"
      >
        ${escapeHtml(quiz.icon)}
      </div>
    </div>

    <div class="card-content">
      <div class="card-category">
        ${escapeHtml(quiz.category)}
      </div>

      <h3>
        ${escapeHtml(quiz.title)}
      </h3>

      <p class="card-description">
        ${escapeHtml(quiz.description)}
      </p>

      <div class="topic-tags">
        ${tagsHtml}
      </div>

      <div class="card-footer">
        <span
          class="question-count"
          data-question-count="${escapeHtml(quiz.id)}"
        >
          Loading questions...
        </span>

        <a
          class="start-button"
          href="quiz.html?quiz=${encodeURIComponent(quiz.id)}"
        >
          Start quiz
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  `;

  const image =
    card.querySelector(".card-image");

  image.addEventListener(
    "error",
    () => {
      image.style.display =
        "none";
    }
  );

  return card;
}

async function updateQuestionCounts() {
  await Promise.all(
    quizzes.map(
      async (quiz) => {
        const count =
          await getQuestionCount(
            quiz.id
          );

        const countElement =
          document.querySelector(
            `[data-question-count="${quiz.id}"]`
          );

        if (!countElement) {
          return;
        }

        if (Number.isInteger(count)) {
          countElement.textContent =
            `${count} questions`;
        } else {
          countElement.textContent =
            "Multiple difficulty levels";
        }
      }
    )
  );
}

function renderQuizzes() {
  if (!quizGrid) {
    console.error(
      'The element with id="quiz-grid" could not be found.'
    );

    return;
  }

  quizGrid.innerHTML = "";

  quizzes.forEach(
    (quiz) => {
      const card =
        createQuizCard(quiz);

      quizGrid.appendChild(card);
    }
  );

  updateQuestionCounts();
}

if (quizTotal) {
  quizTotal.textContent =
    `${quizzes.length} quizzes`;
}

renderQuizzes();
