console.log("form.js loaded ✅");

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* =========================
   FIREBASE CONFIG
   ========================= */
const firebaseConfig = {
  apiKey: "AIzaSyADi-qNidJ_qjS74rwRwT3qg0IBHeUwTDk",
  authDomain: "gottapickemall-ae6da.firebaseapp.com",
  projectId: "gottapickemall-ae6da",
  storageBucket: "gottapickemall-ae6da.firebasestorage.app",
  messagingSenderId: "1065015387295",
  appId: "1:1065015387295:web:23b95466834f0ec27deeaa",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* ====== 2) EDIT THIS EACH WEEK ====== */
const weeklyPoll = {
  week: 1,

  // Header text
  title: "SB Champ",
  description: "Pick your favorite team to win the superbowl\n +1pt for each playoff win\n +1pt for SB win",

  // Question settings
  questionId: "featured_matchup",
  questionText: "Who wins the featured matchup?",

  // "multiple_choice" OR "short_answer"
  type: "multiple_choice",

  // Only used if type === "multiple_choice"
  choices: [
    { value: "MIN", label: "Vikings" },
    { value: "GB", label: "Packers" },
    { value: "DET", label: "Lions" },
    { value: "CHI", label: "Bears" }
  ],

  // Tiebreaker toggle (show/hide + required/optional)
  tiebreaker: {
    enabled: true,         // set false to hide it
    required: true,        // set false to make it optional
    label: "Tiebreaker (Total Points)",
    placeholder: "e.g. 47"
  }
};

/* ====== 3) Render poll UI ====== */
const form = document.getElementById("pickForm");
const statusEl = document.getElementById("status");
const nameEl = document.getElementById("name");
const tiebreakerEl = document.getElementById("tiebreaker");

document.getElementById("pollTitle").innerText = weeklyPoll.title;
document.getElementById("pollDesc").innerText = weeklyPoll.description;

const tiebreakerEl = document.getElementById("tiebreaker");
const tiebreakerLabelEl = document.getElementById("tiebreakerLabel");

// Build radio choices
const choicesWrap = document.getElementById("choices");
choicesWrap.innerHTML = `
  <div class="lbl" style="margin-top:0">${weeklyPoll.questionText}</div>
`;

weeklyPoll.choices.forEach((c, idx) => {
  const id = `choice_${idx}`;
  const tagHtml = c.tag ? `<span class="tag">${c.tag}</span>` : `<span class="tag" style="opacity:.0">.</span>`;
  const div = document.createElement("label");
  div.className = "choice";
  div.setAttribute("for", id);
  div.innerHTML = `
    <input type="radio" id="${id}" name="pick" value="${c.value}" ${idx === 0 ? "checked" : ""} />
    <span>${c.label}</span>
    ${tagHtml}
  `;
  choicesWrap.appendChild(div);
});

function applyTiebreakerUI() {
  const tb = weeklyPoll.tiebreaker || { enabled: true, required: true };

  // label/placeholder text
  if (tiebreakerLabelEl) tiebreakerLabelEl.innerText = tb.label || "Tiebreaker";
  if (tiebreakerEl) tiebreakerEl.placeholder = tb.placeholder || "";

  // show/hide
  const show = !!tb.enabled;
  if (tiebreakerEl) tiebreakerEl.style.display = show ? "" : "none";
  if (tiebreakerLabelEl) tiebreakerLabelEl.style.display = show ? "" : "none";

  // require/optional
  if (tiebreakerEl) tiebreakerEl.required = show && !!tb.required;

  // if hidden, clear it so it doesn't accidentally submit
  if (!show && tiebreakerEl) tiebreakerEl.value = "";
}

applyTiebreakerUI();

function getSelectedPick() {
  const selected = document.querySelector('input[name="pick"]:checked');
  return selected ? selected.value : null;
}

/* ====== 4) Submit to Firestore ====== */
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  statusEl.innerText = "Submitting...";

  const pickVal = getSelectedPick();
  if (!pickVal) {
    statusEl.innerText = "❌ Please choose an option.";
    return;
  }

  try {
    await addDoc(collection(db, "picks"), {
      week: weeklyPoll.week,
      name: nameEl.value.trim(),
      questionId: weeklyPoll.questionId,
      pick: pickVal,
      tiebreaker: Number(tiebreakerEl.value),
      createdAt: new Date()
    });

    statusEl.innerText = "✅ Picks submitted!";
    form.reset();
    // re-check first option after reset
    const first = document.querySelector('input[name="pick"]');
    if (first) first.checked = true;
  } catch (err) {
    console.error(err);
    statusEl.innerText = "❌ Error submitting. Check console.";
  }
});

