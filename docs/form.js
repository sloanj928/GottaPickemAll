console.log("form.js loaded");

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyADi-qNidJ_qjS74rwRwT3qg0IBHeUwTDk",
  authDomain: "gottapickemall-ae6da.firebaseapp.com",
  projectId: "gottapickemall-ae6da"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.getElementById("pickForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  await addDoc(collection(db, "picks"), {
    name: document.getElementById("name").value,
    pick: document.getElementById("pick").value,
    tiebreaker: document.getElementById("tiebreaker").value,
    week: 1,
    timestamp: new Date()
  });

  document.getElementById("status").innerText = "✅ Picks submitted!";
});

