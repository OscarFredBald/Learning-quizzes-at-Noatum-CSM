const quizzes = [
  {
    id: "marine-diesel-engine",
    title: "Marine Diesel Engines",
    category: "Marine Engineering",
    badge: "Engineering",
    description:
      "Learn about combustion, fuel systems, cooling, lubrication and the operation of marine diesel engines.",
    image: "./images/marine-diesel-engine.jpg",
    imageAlt: "Large marine diesel engine",
    icon: "⚙️",
    tags: [
      "Combustion",
      "Fuel systems",
      "Cooling",
      "Engine operation"
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
      "Learn about insurable interest, indemnity, proximate cause, warranties, subrogation and contribution.",
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
      "Understand the roles of shipowners, charterers, shippers, consignees, ship managers and freight forwarders.",
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
      "Test your knowledge of pollution prevention, operational controls and MARPOL Annexes I to VI.",
    image: "./images/marpol.jpg",
    imageAlt: "Vessel operating under marine environmental regulations",
    icon: "🌍",
    tags: [
      "Oil",
      "Garbage",
      "Sewage",
      "Air emissions"
    ]
  },

  {
    id: "ship-security-plan",
    title: "Ship Security Plan and ISPS",
    category: "Regulations",
    badge: "Ship security",
    description:
      "Learn about the Ship Security Plan, security levels, access control, SSAS and ISPS responsibilities.",
    image: "./images/ship-security-plan.jpg",
    imageAlt: "Security procedures onboard a commercial vessel",
    icon: "🔒",
    tags: [
      "ISPS",
      "SSP",
      "SSAS",
      "Security levels"
    ]
  },

  {
    id: "navtex",
    title: "NAVTEX and Maritime Safety Information",
    category: "Navigation & GMDSS",
    badge: "Communication",
    description:
      "Learn how NAVTEX distributes navigational warnings, weather warnings and search-and-rescue information.",
    image: "./images/navtex.jpg",
    imageAlt: "NAVTEX receiver onboard a ship",
    icon: "📡",
    tags: [
      "GMDSS",
      "MSI",
      "NAVTEX",
      "Warnings"
    ]
  },

  {
    id: "ecdis",
    title: "ECDIS and Electronic Navigation",
    category: "Navigation & GMDSS",
    badge: "Electronic navigation",
    description:
      "Learn electronic charts, safety settings, route planning, route monitoring, chart updates and sensor inputs.",
    image: "./images/ecdis.jpg",
    imageAlt: "ECDIS electronic navigation display",
    icon: "🗺️",
    tags: [
      "ECDIS",
      "ENC",
      "Route planning",
      "Safety contour"
    ]
  },

  {
    id: "radar-arpa",
    title: "Marine Radar and ARPA",
    category: "Navigation & GMDSS",
    badge: "Electronic navigation",
    description:
      "Learn radar operation, clutter controls, target tracking, CPA, TCPA and practical collision-risk assessment.",
    image: "./images/radar-arpa.jpg",
    imageAlt: "Marine radar and ARPA display onboard a ship",
    icon: "📡",
    tags: [
      "Radar",
      "ARPA",
      "CPA",
      "Collision avoidance"
    ]
  },

  {
    id: "vessel-traffic-services",
    title: "Vessel Traffic Services",
    category: "Navigation & Port Operations",
    badge: "Traffic management",
    description:
      "Learn VTS reporting, traffic information, navigational assistance and traffic organization in busy waterways.",
    image: "./images/vessel-traffic-services.jpg",
    imageAlt: "Vessel Traffic Services control centre monitoring ship traffic",
    icon: "🗼",
    tags: [
      "VTS",
      "VHF",
      "Traffic organization",
      "Port operations"
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
      `./data/${quizId}.json`,
      {
        cache: "no-store"
      }
    );

    if (!response.ok) {
      throw new Error(
        `HTTP status ${response.status}`
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

    throw new Error(
      "The JSON file has no valid questions array."
    );
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
          href="./quiz.html?quiz=${encodeURIComponent(quiz.id)}"
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
            "Quiz available";
        }
      }
    )
  );
}

function renderQuizzes() {
  if (!quizGrid) {
    console.error(
      'Could not find the element with id="quiz-grid".'
    );

    return;
  }

  quizGrid.innerHTML = "";

  quizzes.forEach(
    (quiz) => {
      const quizCard =
        createQuizCard(quiz);

      quizGrid.appendChild(
        quizCard
      );
    }
  );

  updateQuestionCounts();
}

function initializePage() {
  if (quizTotal) {
    quizTotal.textContent =
      `${quizzes.length} quizzes`;
  }

  renderQuizzes();
}

document.addEventListener(
  "DOMContentLoaded",
  initializePage
);
