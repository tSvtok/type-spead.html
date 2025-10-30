// ----- Elements -----
const sampleEl = document.getElementById('sample');
const inputBox = document.getElementById('inputBox');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const timeDisplay = document.getElementById('timeDisplay');
const wpmDisplay = document.getElementById('wpmDisplay');
const accDisplay = document.getElementById('accDisplay');
const charsTypedEl = document.getElementById('charsTyped');
const errorsEl = document.getElementById('errors');
const correctCharsEl = document.getElementById('correctChars');
const durationSelect = document.getElementById('duration');
const durationLabel = document.getElementById('durationLabel');

// ----- Data -----
const texts = [
  "The quick brown fox jumps over the lazy dog.",
  "Practice typing daily to improve your speed and accuracy.",
  "Small steps lead to great achievements.",
  "JavaScript controls the behavior of web pages."
];

// ----- State -----
let currentText = "";
let started = false;
let timer = null;
let timeLeft = parseInt(durationSelect.value);
let totalTyped = 0;
let correctChars = 0;
let errors = 0;

// ----- Functions -----
function randomText() {
  return texts[Math.floor(Math.random() * texts.length)];
}

function renderText(userInput = "") {
  sampleEl.innerHTML = "";
  for (let i = 0; i < currentText.length; i++) {
    const span = document.createElement("span");
    span.textContent = currentText[i];
    span.classList.add("char");
    if (i < userInput.length) {
      span.classList.add(userInput[i] === currentText[i] ? "correct" : "incorrect");
    } else if (i === userInput.length) {
      span.classList.add("next");
    }
    sampleEl.appendChild(span);
  }
}

function resetGame() {
  clearInterval(timer);
  started = false;
  inputBox.disabled = true;
  startBtn.textContent = "Start";
  timeLeft = parseInt(durationSelect.value);
  durationLabel.textContent = timeLeft;
  timeDisplay.textContent = timeLeft;
  inputBox.value = "";
  totalTyped = 0;
  correctChars = 0;
  errors = 0;
  updateStats();
  currentText = randomText();
  renderText();
}

function updateStats() {
  charsTypedEl.textContent = totalTyped;
  errorsEl.textContent = errors;
  correctCharsEl.textContent = correctChars;
  const minutes = (parseInt(durationSelect.value) - timeLeft) / 60;
  const wpm = Math.round((correctChars / 5) / (minutes || 1 / 60));
  const acc = totalTyped === 0 ? 100 : Math.round((correctChars / totalTyped) * 100);
  wpmDisplay.textContent = wpm;
  accDisplay.textContent = acc + "%";
}

function tick() {
  timeLeft--;
  timeDisplay.textContent = timeLeft;
  updateStats();
  if (timeLeft <= 0) finishGame();
}

function startGame() {
  if (started) return;
  started = true;
  inputBox.disabled = false;
  inputBox.focus();
  startBtn.textContent = "Stop";
  timer = setInterval(tick, 1000);
}

function finishGame() {
  clearInterval(timer);
  started = false;
  inputBox.disabled = true;
  startBtn.textContent = "Start";
  updateStats();
  alert(`Time's up! Your speed: ${wpmDisplay.textContent} WPM`);
}

// ----- Event listeners -----
startBtn.addEventListener("click", () => {
  if (!started) startGame();
  else finishGame();
});

resetBtn.addEventListener("click", resetGame);

durationSelect.addEventListener("change", resetGame);

inputBox.addEventListener("input", () => {
  if (!started) startGame();
  const value = inputBox.value;
  totalTyped = value.length;
  correctChars = 0;
  errors = 0;
  for (let i = 0; i < value.length; i++) {
    if (value[i] === currentText[i]) correctChars++;
    else errors++;
  }
  renderText(value);
  updateStats();
  if (value === currentText) {
    currentText += " " + randomText();
    renderText(value);
  }
});

// ----- Init -----
resetGame();
