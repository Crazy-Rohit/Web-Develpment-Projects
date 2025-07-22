const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const result = document.getElementById("result");
const sound = document.getElementById("sound");
const btn = document.getElementById("search-btn");

btn.addEventListener("click", () => {
  const inpWord = document.getElementById("inp-word").value.trim();
  if (!inpWord) return;

  fetch(`${url}${inpWord}`)
    .then(res => res.json())
    .then(data => {
      const wordData = data[0];
      const meaning = wordData.meanings[0];
      const definition = meaning.definitions[0];
      const example = definition.example || "No example available.";
      const audioSrc = wordData.phonetics.find(p => p.audio)?.audio;

      result.innerHTML = `
        <div class="word">
          <h3>${wordData.word}</h3>
          <button onclick="playSound('${wordData.word}', '${audioSrc || ''}')">
            <i class="fas fa-volume-up"></i>
          </button>
        </div>
        <div class="details">
          <p><strong>Part of Speech:</strong> ${meaning.partOfSpeech}</p>
          <p><strong>Phonetics:</strong> /${wordData.phonetic || 'N/A'}/</p>
        </div>
        <p class="word-meaning">${definition.definition}</p>
        <p class="word-example">${example}</p>
      `;
    })
    .catch(() => {
      result.innerHTML = `<h3 class="error">Couldn't Find The Word</h3>`;
    });
});

function playSound(word, audioURL) {
  if (audioURL) {
    sound.setAttribute("src", audioURL);
    sound.play();
  } else {
    const utterance = new SpeechSynthesisUtterance(word);
    speechSynthesis.speak(utterance);
  }
}

// Theme toggle
const toggleBtn = document.getElementById("theme-toggle");
function setTheme(isDark) {
  document.body.classList.toggle("dark", isDark);
  toggleBtn.innerHTML = isDark
    ? `<i class="fas fa-sun"></i>`
    : `<i class="fas fa-moon"></i>`;
  localStorage.setItem("theme", isDark ? "dark" : "light");
}
window.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("theme") === "dark";
  setTheme(saved);
});
toggleBtn.addEventListener("click", () => {
  const isDark = !document.body.classList.contains("dark");
  setTheme(isDark);
});

// Star trail canvas
const canvas = document.getElementById("stars-bg");
const ctx = canvas.getContext("2d");
let stars = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function animateStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";

  for (let i = 0; i < stars.length; i++) {
    const star = stars[i];
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fill();

    star.size *= 0.95;
    if (star.size < 0.5) {
      stars.splice(i, 1);
      i--;
    }
  }

  requestAnimationFrame(animateStars);
}
animateStars();

// Star trail + cursor
document.addEventListener("mousemove", (e) => {
  const cursor = document.getElementById("cursor-star");
  cursor.style.top = `${e.clientY}px`;
  cursor.style.left = `${e.clientX}px`;

  stars.push({
    x: e.clientX + Math.random() * 4 - 2,
    y: e.clientY + Math.random() * 4 - 2,
    size: Math.random() * 2 + 1
  });

  if (stars.length > 100) {
    stars.splice(0, stars.length - 100);
  }
});
