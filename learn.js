const topicFiles = {
  "marine-diesel-engine": {
    file: "./learning/marine-diesel-engine.json",
    fallbackTitle: "Marine Diesel Engines"
  },

  "ballast-water": {
    file: "./learning/ballast-water.json",
    fallbackTitle: "Ballast Water and BWTS"
  },

  "bulk-carrier-design": {
    file: "./learning/bulk-carrier-design.json",
    fallbackTitle: "Bulk Carrier Design"
  },

  "maritime-insurance": {
    file: "./learning/maritime-insurance.json",
    fallbackTitle: "Maritime Insurance"
  },

  "important-parties-in-shipping": {
    file: "./learning/important-parties-in-shipping.json",
    fallbackTitle: "Important Parties in Shipping"
  },

  "marpol": {
    file: "./learning/marpol.json",
    fallbackTitle: "MARPOL"
  },

  "ship-security-plan": {
    file: "./learning/ship-security-plan.json",
    fallbackTitle: "Ship Security Plan and ISPS Code"
  },

  "navtex": {
    file: "./learning/navtex.json",
    fallbackTitle: "NAVTEX and Maritime Safety Information"
  },

  "ecdis": {
    file: "./learning/ecdis.json",
    fallbackTitle: "ECDIS and Electronic Navigation"
  },

  "radar-arpa": {
    file: "./learning/radar-arpa.json",
    fallbackTitle: "Marine Radar and ARPA"
  },

  "vessel-traffic-services": {
    file: "./learning/vessel-traffic-services.json",
    fallbackTitle: "Vessel Traffic Services"
  }
};

const parameters =
  new URLSearchParams(window.location.search);

const topicKey =
  parameters.get("topic");

const selectedTopic =
  topicFiles[topicKey];

const loadingMessage =
  document.getElementById("loading-message");

const learningPage =
  document.getElementById("learning-page");

const learningShell =
  document.getElementById("learning-shell");

const learningTitle =
  document.getElementById("learning-title");

const readingTime =
  document.getElementById("reading-time");

const introduction =
  document.getElementById("introduction");

const sectionList =
  document.getElementById("section-list");

const learningBoxes =
  document.getElementById("learning-boxes");

const keyPointBox =
  document.getElementById("key-point-box");

const keyPoint =
  document.getElementById("key-point");

const commonMistakeBox =
  document.getElementById("common-mistake-box");

const commonMistake =
  document.getElementById("common-mistake");

const summarySection =
  document.getElementById("summary-section");

const summaryList =
  document.getElementById("summary-list");

const sourceSection =
  document.getElementById("source-section");

const sourceTitle =
  document.getElementById("source-title");

const sourceLink =
  document.getElementById("source-link");

const quizButton =
  document.getElementById("quiz-button");

async function loadLearningMaterial() {
  if (!selectedTopic) {
    showError(
      "The selected learning topic could not be found. Return to the home page and choose a valid topic."
    );

    return;
  }

  learningTitle.textContent =
    selectedTopic.fallbackTitle;

  document.title =
    `${selectedTopic.fallbackTitle} | Maritime Learning Portal`;

  quizButton.href =
    `./quiz.html?quiz=${encodeURIComponent(topicKey)}`;

  try {
    const response =
      await fetch(
        selectedTopic.file,
        {
          cache: "no-store"
        }
      );

    if (!response.ok) {
      throw new Error(
        `The learning file returned HTTP status ${response.status}.`
      );
    }

    const data =
      await response.json();

    validateLearningMaterial(data);

    renderLearningMaterial(data);
  } catch (error) {
    console.error(
      "Learning material loading error:",
      error
    );

    showError(
      `The learning material could not be loaded. ${error.message}`
    );
  }
}

function validateLearningMaterial(data) {
  if (
    !data ||
    typeof data !== "object"
  ) {
    throw new Error(
      "The learning file does not contain a valid object."
    );
  }

  if (
    !Array.isArray(data.sections)
  ) {
    throw new Error(
      "The learning file does not contain a valid sections array."
    );
  }

  data.sections.forEach(
    (section, index) => {
      if (
        !section ||
        typeof section !== "object" ||
        typeof section.title !== "string" ||
        section.title.trim() === ""
      ) {
        throw new Error(
          `Section ${index + 1} has an invalid title.`
        );
      }

      if (
        section.paragraphs !== undefined &&
        !Array.isArray(section.paragraphs)
      ) {
        throw new Error(
          `Section ${index + 1} has an invalid paragraphs value.`
        );
      }

      if (
        section.points !== undefined &&
        !Array.isArray(section.points)
      ) {
        throw new Error(
          `Section ${index + 1} has an invalid points value.`
        );
      }
    }
  );
}

function renderLearningMaterial(data) {
  if (
    typeof data.title === "string" &&
    data.title.trim() !== ""
  ) {
    learningTitle.textContent =
      data.title;

    document.title =
      `${data.title} | Maritime Learning Portal`;
  }

  renderReadingTime(data);
  renderIntroduction(data);
  renderSections(data.sections);
  renderKeyPoint(data);
  renderCommonMistake(data);
  renderSummary(data);
  renderSource(data);

  loadingMessage.hidden = true;
  learningPage.hidden = false;

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function renderReadingTime(data) {
  if (
    typeof data.readingTime === "string" &&
    data.readingTime.trim() !== ""
  ) {
    readingTime.textContent =
      `⏱ Reading time: ${data.readingTime}`;
  } else {
    readingTime.textContent =
      "⏱ Short reading";
  }
}

function renderIntroduction(data) {
  if (
    typeof data.introduction === "string" &&
    data.introduction.trim() !== ""
  ) {
    introduction.textContent =
      data.introduction;

    introduction.hidden = false;
  } else {
    introduction.hidden = true;
  }
}

function renderSections(sections) {
  sectionList.innerHTML = "";

  sections.forEach(
    (section) => {
      const sectionElement =
        document.createElement("section");

      sectionElement.className =
        "learning-section";

      const title =
        document.createElement("h2");

      title.textContent =
        section.title;

      sectionElement.appendChild(title);

      if (
        Array.isArray(section.paragraphs)
      ) {
        section.paragraphs.forEach(
          (paragraph) => {
            if (
              typeof paragraph !== "string" ||
              paragraph.trim() === ""
            ) {
              return;
            }

            const paragraphElement =
              document.createElement("p");

            paragraphElement.textContent =
              paragraph;

            sectionElement.appendChild(
              paragraphElement
            );
          }
        );
      }

      if (
        Array.isArray(section.points) &&
        section.points.length > 0
      ) {
        const list =
          document.createElement("ul");

        list.className =
          "point-list";

        section.points.forEach(
          (point) => {
            if (
              typeof point !== "string" ||
              point.trim() === ""
            ) {
              return;
            }

            const item =
              document.createElement("li");

            item.textContent =
              point;

            list.appendChild(item);
          }
        );

        if (list.children.length > 0) {
          sectionElement.appendChild(list);
        }
      }

      sectionList.appendChild(
        sectionElement
      );
    }
  );
}

function renderKeyPoint(data) {
  if (
    typeof data.keyPoint === "string" &&
    data.keyPoint.trim() !== ""
  ) {
    keyPoint.textContent =
      data.keyPoint;

    keyPointBox.hidden = false;
  } else {
    keyPointBox.hidden = true;
  }

  updateLearningBoxesVisibility();
}

function renderCommonMistake(data) {
  if (
    typeof data.commonMistake === "string" &&
    data.commonMistake.trim() !== ""
  ) {
    commonMistake.textContent =
      data.commonMistake;

    commonMistakeBox.hidden = false;
  } else {
    commonMistakeBox.hidden = true;
  }

  updateLearningBoxesVisibility();
}

function updateLearningBoxesVisibility() {
  learningBoxes.hidden =
    keyPointBox.hidden &&
    commonMistakeBox.hidden;
}

function renderSummary(data) {
  summaryList.innerHTML = "";

  if (
    !Array.isArray(data.summary) ||
    data.summary.length === 0
  ) {
    summarySection.hidden = true;

    return;
  }

  data.summary.forEach(
    (item) => {
      if (
        typeof item !== "string" ||
        item.trim() === ""
      ) {
        return;
      }

      const listItem =
        document.createElement("li");

      listItem.textContent =
        item;

      summaryList.appendChild(
        listItem
      );
    }
  );

  summarySection.hidden =
    summaryList.children.length === 0;
}

function renderSource(data) {
  const source =
    data.source;

  if (
    !source ||
    typeof source !== "object" ||
    typeof source.url !== "string" ||
    source.url.trim() === ""
  ) {
    sourceSection.hidden = true;

    return;
  }

  if (
    typeof source.title === "string" &&
    source.title.trim() !== ""
  ) {
    sourceTitle.textContent =
      source.title;
  } else {
    sourceTitle.textContent =
      "Original source and further reading";
  }

  sourceLink.href =
    source.url;

  sourceSection.hidden = false;
}

function showError(message) {
  loadingMessage.hidden = true;
  learningPage.hidden = true;

  const errorElement =
    document.createElement("div");

  errorElement.className =
    "error-message";

  const heading =
    document.createElement("h2");

  heading.textContent =
    "Learning material unavailable";

  const paragraph =
    document.createElement("p");

  paragraph.textContent =
    message;

  const homeLink =
    document.createElement("a");

  homeLink.className =
    "home-button";

  homeLink.href =
    "./index.html";

  homeLink.textContent =
    "← Back to all topics";

  errorElement.appendChild(heading);
  errorElement.appendChild(paragraph);
  errorElement.appendChild(homeLink);

  learningShell.replaceChildren(
    errorElement
  );
}

loadLearningMaterial();
