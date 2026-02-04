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
  title: "Weekly Poll",
  description: "Pick the winner for this week’s featured matchup. Commissioner can edit this text weekly.",
  questionId: "featured_matchup",           // stable key for your script
  questionText: "Featured Matchup Winner",  // shown above options
  choices: [
    { value: "MIN", label: "Vikings", tag: "Skol" },
    { value: "GB",  label: "Packers", tag: "Rival" },
    { value: "DET", label: "Lions",   tag: "" },
    { value: "CHI", label: "Bears",   tag: "" }
  ]
};

/* ====== 3) Render poll UI ====== */
const form = document.getElementById("pickForm");
const statusEl = document.getElementById("status");
const nameEl = document.getElementById("name");
const tiebreakerEl = document.getElementById("tiebreaker");

document.getElementById("pollTitle").innerText = weeklyPoll.title;
document.getElementById("pollDesc").innerText = weeklyPoll.description;

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

