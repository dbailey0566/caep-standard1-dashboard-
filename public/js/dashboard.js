import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function saveData() {

  const program = document.getElementById("program").value;
  const standard = document.getElementById("standard").value;
  const skill = document.getElementById("skill").value;
  const semester = document.getElementById("semester").value;
  const n = Number(document.getElementById("n").value);
  const percent = Number(document.getElementById("percent").value);

  await addDoc(collection(db, "caep_data"), {
    program,
    standard,
    skill,
    semester,
    n,
    percent,
    timestamp: Date.now()
  });

  alert("Saved successfully.");
}

async function loadDashboard() {

  if (!document.getElementById("skillChart")) return;

  const snapshot = await getDocs(collection(db, "caep_data"));

  const skillMap = {};
  let overallSum = 0;
  let count = 0;

  snapshot.forEach(doc => {
    const data = doc.data();
    skillMap[data.skill] = data.percent;
    overallSum += data.percent;
    count++;
  });

  const average = count > 0 ? (overallSum / count) : 0;

  const statusCard = document.getElementById("statusCard");

  if (average >= 80) {
    statusCard.style.background = "#d4edda";
    statusCard.textContent = "Majority threshold met. Average proficiency: " + average.toFixed(1) + "%";
  } else {
    statusCard.style.background = "#f8d7da";
    statusCard.textContent = "Below majority threshold. Average proficiency: " + average.toFixed(1) + "%";
  }

  const ctx = document.getElementById("skillChart");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: Object.keys(skillMap),
      datasets: [{
        label: "% Met",
        data: Object.values(skillMap)
      }]
    }
  });
}

window.saveData = saveData;
loadDashboard();
