import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* =========================
   1) PASTE YOUR FIREBASE CONFIG HERE
   ========================= */
const firebaseConfig = {
  apiKey: "AIzaSyADi-qNidJ_qjS74rwRwT3qg0IBHeUwTDk",
  authDomain: "gottapickemall-ae6da.firebaseapp.com",
  projectId: "gottapickemall-ae6da",
  storageBucket: "gottapickemall-ae6da.firebasestorage.app",
  messagingSenderId: "1065015387295",
  appId: "1:1065015387295:web:23b95466834f0ec27deeaa",
};

/* =========================
   2) INIT FIREBASE
   ========================= */
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log("form.js loaded ✅");

/* =========================
   3) GRAB HTML ELEMENTS
   ========================= */
const form = document.getElementById("pickForm");
const statusEl = document.getElementById("status");

const nameEl = document.getElementById("name");
const pickEl = document.getElementById("pick");
const tiebreakerEl = document.getElementById("tiebreaker");

/* =========================
   4) SAFETY CHECK (helps debugging)
   ========================= */
console.log("form:", form);
console.log("name:", nameEl);
console.log("pick:", pickEl);
console.log("tiebreaker:", tiebreakerEl);
console.log("status:", statusEl);

if (!form || !nameEl || !pickEl || !tiebreakerEl || !statusEl) {
  console.error("❌ One or more HTML IDs do not match form.js");
}

/* =========================
   5) FORM SUBMIT HANDLER
   ========================= */
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  statusEl.innerText = "Submitting...";

  try {
    await addDoc(collection(db, "picks"), {
      name: nameEl.value.trim(),
      pick: pickEl.value,
      tiebreaker: Number(tiebreakerEl.value),
      week: 1,
      timestamp: new Date()
    });

    statusEl.innerText = "✅ Picks submitted!";
    form.reset();
  } catch (err) {
    console.error(err);
    statusEl.innerText = "❌ Error submitting. Check console.";
  }
});

