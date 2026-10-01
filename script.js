const N8N_WEBHOOK =
  "https://eclipse-lyric-were-inner.trycloudflare.com/webhook/dcm-service"; 

const form = document.getElementById("chatForm");
const input = document.getElementById("question");
const chat = document.getElementById("chat");
const sendButton = document.getElementById("sendButton");
const themeToggle = document.getElementById("themeToggle");

const faqToggle = document.getElementById("faqToggle");
const faqSection = document.getElementById("faqSection");
const faqClose = document.getElementById("faqClose");

const questionPanel = document.getElementById("questionPanel");
const questionPanelTitle = document.getElementById("questionPanelTitle");
const questionList = document.getElementById("questionList");
const closeQuestions = document.getElementById("closeQuestions");

/* =========================
FAQ DATA
========================= */

const categoryNames = {
  curriculum: "หลักสูตร",
  subjects: "วิชาเรียน",
  career: "อาชีพ",
  study: "การเรียน",
  suitability: "ความเหมาะสม",
  contact: "ติดต่อ",
  greeting: "ทักทาย",
  other: "คำถามอื่น ๆ",
};

const questions = {
  curriculum: [
    "DCM คืออะไร?",
    "DCM เรียนเกี่ยวกับอะไร?",
    "DCM เกี่ยวข้องกับด้านไหนบ้าง?",
  ],

  subjects: [
    "DCM มีวิชาอะไรบ้าง?",
    "DCM เรียนเขียนเว็บไซต์ไหม?",
    "DCM เรียนกราฟิกไหม?",
    "DCM เรียนตัดต่อวิดีโอไหม?",
  ],

  career: [
    "จบ DCM แล้วทำงานอะไรได้บ้าง?",
    "จบ DCM เป็น Web Developer ได้ไหม?",
    "จบ DCM ทำงาน UX/UI ได้ไหม?",
    "จบ DCM ทำงานด้าน Graphic Design ได้ไหม?",
  ],

  study: [
    "DCM เรียนกี่ปี?",
    "DCM เรียนยากไหม?",
    "DCM ต้องเขียนโค้ดไหม?",
    "DCM มีโปรเจกต์ให้ทำไหม?",
  ],

  suitability: [
    "DCM เหมาะกับใคร?",
    "คนไม่มีพื้นฐานสามารถเรียน DCM ได้ไหม?",
    "คนไม่เก่งวาดรูปเรียน DCM ได้ไหม?",
  ],

  contact: [
    "Facebook — DCM มวล.",
    "Instagram — DCM Walailak",
    "เว็บไซต์หลักสูตร DCM",
  ],

  greeting: [
    "สวัสดี",
    "หวัดดีครับ",
  ],

  other: [
    "ขอข้อมูลเกี่ยวกับ DCM หน่อยครับ",
    "อยากรู้ข้อมูลหลักสูตร DCM",
  ],
};

/* =========================
CONTACT LINKS
========================= */

const contactLinks = {
  "Facebook — DCM มวล.": "https://www.facebook.com/dcm.wu",

  "Instagram — DCM Walailak":
    "https://www.instagram.com/dcm_walailak",

  "เว็บไซต์หลักสูตร DCM":
    "https://informatics.wu.ac.th/en/bachelors-degree-en/digital-content-and-media/",
};

/* =========================
FAQ OPEN / CLOSE
========================= */

function openFaq() {
  faqSection.classList.add("open");
  faqToggle.classList.add("active");

  faqToggle.setAttribute("aria-expanded", "true");
}

function closeFaq() {
  faqSection.classList.remove("open");
  faqToggle.classList.remove("active");

  faqToggle.setAttribute("aria-expanded", "false");

  questionPanel.classList.remove("open");
}

function toggleFaq() {
  const isOpen = faqSection.classList.contains("open");

  if (isOpen) {
    closeFaq();
  } else {
    openFaq();
  }
}

faqToggle.addEventListener("click", toggleFaq);
faqClose.addEventListener("click", closeFaq);

/* =========================
HTML ESCAPE
========================= */

function escapeHtml(text) {
  const div = document.createElement("div");

  div.textContent = String(text ?? "");

  return div.innerHTML;
}

/* =========================
MARKDOWN → HTML
========================= */

function markdownToHtml(text) {
  let safe = escapeHtml(text);

  safe = safe.replace(/\\([*_`])/g, "$1");

  const lines = safe.split(/\r?\n/);

  let html = "";
  let inList = false;

  lines.forEach((line) => {
    const trimmed = line.trim();

    const isBullet =
      trimmed.startsWith("* ") ||
      trimmed.startsWith("- ");

    if (isBullet) {
      if (!inList) {
        html += "<ul>";
        inList = true;
      }

      let item = trimmed.substring(2);

      item = item.replace(
        /`([^`]+)`/g,
        "<code>$1</code>"
      );

      item = item.replace(
        /\*\*([^*]+)\*\*/g,
        "<strong>$1</strong>"
      );

      item = item.replace(
        /__([^_]+)__/g,
        "<strong>$1</strong>"
      );

      item = item.replace(
        /(?<!\*)\*([^*]+)\*(?!\*)/g,
        "<em>$1</em>"
      );

      item = item.replace(
        /(https?:\/\/[^\s<]+)/g,
        '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
      );

      html += `<li>${item}</li>`;

      return;
    }

    if (inList) {
      html += "</ul>";
      inList = false;
    }

    if (!trimmed) {
      html += '<div class="message-space"></div>';
      return;
    }

    let content = line;

    content = content.replace(
      /`([^`]+)`/g,
      "<code>$1</code>"
    );

    content = content.replace(
      /\*\*([^*]+)\*\*/g,
      "<strong>$1</strong>"
    );

    content = content.replace(
      /__([^_]+)__/g,
      "<strong>$1</strong>"
    );

    content = content.replace(
      /(?<!\*)\*([^*]+)\*(?!\*)/g,
      "<em>$1</em>"
    );

    content = content.replace(
      /(https?:\/\/[^\s<]+)/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
    );

    html += `<div>${content}</div>`;
  });

  if (inList) {
    html += "</ul>";
  }

  return html;
}

/* =========================
ADD MESSAGE
========================= */

function addMessage(type, text) {
  const message = document.createElement("div");

  message.className = `message ${type}`;

  const avatar = document.createElement("div");

  avatar.className = "avatar";

  if (type === "bot") {
    avatar.innerHTML = `
      <img
        src="assets/dcm-logo.svg"
        alt="DCM Logo"
      >
    `;
  }

  const bubble = document.createElement("div");

  bubble.className = "bubble";

  if (type === "bot") {
    bubble.innerHTML = `
      <strong>DCM Assistant</strong>

      <div class="bot-answer">
        ${markdownToHtml(text)}
      </div>
    `;
  } else {
    bubble.innerHTML = `
      <p>
        ${escapeHtml(text)}
      </p>
    `;
  }

  message.appendChild(avatar);
  message.appendChild(bubble);

  chat.appendChild(message);

  chat.scrollTop = chat.scrollHeight;
}

/* =========================
LOADING
========================= */

function showLoading() {
  const message = document.createElement("div");

  message.className = "message bot";
  message.id = "loadingMessage";

  message.innerHTML = `
    <div class="avatar">
      <img
        src="assets/dcm-logo.svg"
        alt="DCM Logo"
      >
    </div>

    <div class="bubble">
      <strong>DCM Assistant</strong>

      <p class="typing">
        <span></span>
        <span></span>
        <span></span>
      </p>
    </div>
  `;

  chat.appendChild(message);

  chat.scrollTop = chat.scrollHeight;
}

function removeLoading() {
  const loading =
    document.getElementById("loadingMessage");

  if (loading) {
    loading.remove();
  }
}

/* =========================
SEND QUESTION
========================= */

async function sendQuestion(question) {
  const cleanQuestion = question.trim();

  if (!cleanQuestion || sendButton.disabled) {
    return;
  }

  addMessage("user", cleanQuestion);

  input.value = "";

  sendButton.disabled = true;

  sendButton.innerHTML = `
    <span>กำลังส่ง</span>
    <span class="send-icon">...</span>
  `;

  showLoading();

  try {
    const response = await fetch(
      N8N_WEBHOOK,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          question: cleanQuestion,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    const result =
      Array.isArray(data)
        ? data[0]
        : data;

    removeLoading();

    addMessage(
      "bot",
      result?.answer ||
        "ขออภัยครับ ไม่พบคำตอบสำหรับคำถามนี้"
    );
  } catch (error) {
    console.error("n8n Error:", error);

    removeLoading();

    addMessage(
      "bot",
      "ไม่สามารถเชื่อมต่อกับระบบ n8n ได้ กรุณาตรวจสอบว่า n8n และ Cloudflare Tunnel กำลังทำงานอยู่ครับ"
    );
  } finally {
    sendButton.disabled = false;

    sendButton.innerHTML = `
      <span>ส่ง</span>
      <span class="send-icon">➜</span>
    `;

    input.focus();
  }
}

/* =========================
FAQ QUESTION
========================= */

function askQuestion(question) {
  if (contactLinks[question]) {
    window.open(
      contactLinks[question],
      "_blank",
      "noopener,noreferrer"
    );

    return;
  }

  input.value = question;

  closeFaq();

  sendQuestion(question);
}

/* =========================
SHOW QUESTIONS
========================= */

function showQuestions(category) {
  const categoryQuestions =
    questions[category] || [];

  questionPanelTitle.textContent =
    categoryNames[category] || "คำถาม";

  questionList.innerHTML = "";

  categoryQuestions.forEach((question) => {
    const button =
      document.createElement("button");

    button.type = "button";

    button.className = "question-button";

    button.innerHTML = `
      <span>
        ${escapeHtml(question)}
      </span>

      <span>
        ➜
      </span>
    `;

    button.addEventListener(
      "click",
      () => {
        askQuestion(question);
      }
    );

    questionList.appendChild(button);
  });

  openFaq();

  questionPanel.classList.add("open");
}

/* =========================
CATEGORY BUTTONS
========================= */

document
  .querySelectorAll(".category-card")
  .forEach((card) => {
    card.addEventListener(
      "click",
      () => {
        const category =
          card.dataset.category;

        showQuestions(category);
      }
    );
  });

/* =========================
CLOSE QUESTIONS
========================= */

closeQuestions.addEventListener(
  "click",
  () => {
    questionPanel.classList.remove("open");
  }
);

/* =========================
FORM
========================= */

form.addEventListener(
  "submit",
  (event) => {
    event.preventDefault();

    sendQuestion(input.value);
  }
);

/* =========================
THEME
========================= */

function applyTheme(theme) {
  const isDark = theme === "dark";

  document.body.classList.toggle(
    "dark",
    isDark
  );

  themeToggle.textContent =
    isDark ? "☀️" : "🌙";

  themeToggle.title =
    isDark
      ? "เปลี่ยนเป็นโหมดสว่าง"
      : "เปลี่ยนเป็นโหมดมืด";
}

const savedTheme =
  localStorage.getItem("dcm-theme");

applyTheme(
  savedTheme === "dark"
    ? "dark"
    : "light"
);

themeToggle.addEventListener(
  "click",
  () => {
    const isDark =
      document.body.classList.contains(
        "dark"
      );

    const nextTheme =
      isDark ? "light" : "dark";

    localStorage.setItem(
      "dcm-theme",
      nextTheme
    );

    applyTheme(nextTheme);
  }
);