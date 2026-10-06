// ============================================
//  WHO'S THAT POKÉMON?  -  game logic
// ============================================

// ---------- 1. The Pokémon database (20 Pokémon) ----------
// Each Pokémon has a name, one image file, and a difficulty label.
const allPokemon = [
  // Easy
  { name: "Pikachu",    image: "pikachu.png",    difficulty: "Easy" },
  { name: "Eevee",      image: "eevee.png",      difficulty: "Easy" },
  { name: "Bulbasaur",  image: "bulbasaur.png",  difficulty: "Easy" },
  { name: "Jigglypuff", image: "jigglypuff.png", difficulty: "Easy" },

  // Medium
  { name: "Charmander", image: "charmander.png", difficulty: "Medium" },
  { name: "Squirtle",   image: "squirtle.png",   difficulty: "Medium" },
  { name: "Meowth",     image: "meowth.png",     difficulty: "Medium" },
  { name: "Psyduck",    image: "psyduck.png",    difficulty: "Medium" },

  // Medium-Hard
  { name: "Lucario",    image: "lucario.png",    difficulty: "Medium-Hard" },
  { name: "Gengar",     image: "gengar.png",     difficulty: "Medium-Hard" },
  { name: "Arcanine",   image: "arcanine.png",   difficulty: "Medium-Hard" },
  { name: "Vulpix",     image: "vulpix.png",     difficulty: "Medium-Hard" },

  // Hard
  { name: "Gardevoir",  image: "gardevoir.png",  difficulty: "Hard" },
  { name: "Dragonite",  image: "dragonite.png",  difficulty: "Hard" },
  { name: "Absol",      image: "absol.png",      difficulty: "Hard" },
  { name: "Milotic",    image: "milotic.png",    difficulty: "Hard" },

  // Hardest / Legendary
  { name: "Mewtwo",     image: "mewtwo.png",     difficulty: "Legendary" },
  { name: "Rayquaza",   image: "rayquaza.png",   difficulty: "Legendary" },
  { name: "Lugia",      image: "lugia.png",      difficulty: "Legendary" },
  { name: "Ho-Oh",      image: "ho-oh.png",      difficulty: "Legendary" }
];

const TOTAL_ROUNDS = 20;   // one round for each of the 20 Pokémon

// ---------- 2. Game state (things that change while playing) ----------
let gamePokemon = [];   // all 20 Pokémon, in a random order for this game
let currentRound = 0;   // 0 = first round
let score = 0;
let answered = false;   // true once the player has picked an answer

// ---------- 3. Grab the HTML elements we need ----------
const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const endScreen = document.getElementById("end-screen");

const startBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");
const playAgainBtn = document.getElementById("play-again-btn");

const scoreEl = document.getElementById("score");
const roundEl = document.getElementById("round");
const pokemonImg = document.getElementById("pokemon-img");
const answersEl = document.getElementById("answers");

const resultBox = document.getElementById("result");
const resultTitle = document.getElementById("result-title");
const resultText = document.getElementById("result-text");

const finalScoreEl = document.getElementById("final-score");
const finalMessageEl = document.getElementById("final-message");

// ---------- 4. Helper: shuffle an array (Fisher-Yates) ----------
// Returns a NEW shuffled array and leaves the original untouched.
function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// ---------- 5. Helper: show only one screen ----------
function showScreen(screen) {
  startScreen.classList.add("hidden");
  gameScreen.classList.add("hidden");
  endScreen.classList.add("hidden");
  screen.classList.remove("hidden");
}

// ---------- 6. Start (or restart) the game ----------
function startGame() {
  score = 0;
  currentRound = 0;

  // Shuffle all 20 -> every Pokémon appears exactly once, in a new random order
  gamePokemon = shuffle(allPokemon).slice(0, TOTAL_ROUNDS);

  // Show the total number of rounds everywhere in the page
  document.querySelectorAll(".total-rounds").forEach(el => {
    el.textContent = TOTAL_ROUNDS;
  });

  showScreen(gameScreen);
  loadRound();
}

// ---------- 7. Set up one round ----------
function loadRound() {
  answered = false;
  const correct = gamePokemon[currentRound];

  // Update score and round counters
  scoreEl.textContent = score;
  roundEl.textContent = currentRound + 1;

  // Show the silhouette (turn it black BEFORE loading the new image)
  pokemonImg.classList.add("silhouette");
  pokemonImg.classList.remove("revealed");
  pokemonImg.alt = "Mystery Pokémon silhouette";
  pokemonImg.src = correct.image;

  // Hide the result box from the last round
  resultBox.classList.add("hidden");

  // Pick 3 wrong answers (never the correct one), add the correct one, shuffle
  const wrongChoices = shuffle(allPokemon.filter(p => p.name !== correct.name)).slice(0, 3);
  const choices = shuffle([correct, ...wrongChoices]);

  // Build the 4 answer buttons
  answersEl.innerHTML = "";
  choices.forEach(choice => {
    const button = document.createElement("button");
    button.className = "btn answer-btn";
    button.textContent = choice.name;
    button.addEventListener("click", () => handleAnswer(button, choice, correct));
    answersEl.appendChild(button);
  });
}

// ---------- 8. When the player clicks an answer ----------
function handleAnswer(clickedButton, chosen, correct) {
  if (answered) return;   // already answered this round
  answered = true;

  // Disable all answer buttons so only one answer counts
  const allButtons = answersEl.querySelectorAll(".answer-btn");
  allButtons.forEach(btn => {
    btn.disabled = true;
    // Highlight the correct button in green
    if (btn.textContent === correct.name) {
      btn.classList.add("correct");
    }
  });

  // Reveal the real Pokémon (remove the black silhouette)
  pokemonImg.classList.remove("silhouette");
  pokemonImg.classList.add("revealed");
  pokemonImg.alt = correct.name;

  // Check the answer
  if (chosen.name === correct.name) {
    score++;
    scoreEl.textContent = score;
    resultTitle.textContent = "✓ CORRECT!";
    resultTitle.className = "result-title good";
    resultText.textContent = "It's " + correct.name + "!";
  } else {
    clickedButton.classList.add("wrong");
    resultTitle.textContent = "✗ WRONG!";
    resultTitle.className = "result-title bad";
    resultText.textContent = "The Pokémon was " + correct.name + "!";
  }

  // On the last round the button says "SEE RESULTS" instead
  nextBtn.textContent = (currentRound === TOTAL_ROUNDS - 1) ? "SEE RESULTS" : "NEXT POKÉMON";
  resultBox.classList.remove("hidden");
}

// ---------- 9. Go to the next round (or the final screen) ----------
function nextRound() {
  currentRound++;

  if (currentRound >= TOTAL_ROUNDS) {
    showFinalScreen();
  } else {
    loadRound();
  }
}

// ---------- 10. Final screen ----------
function showFinalScreen() {
  finalScoreEl.textContent = score;
  finalMessageEl.textContent = getFinalMessage(score);
  showScreen(endScreen);
}

// Messages are based on the percentage of correct answers
function getFinalMessage(finalScore) {
  const percent = (finalScore / TOTAL_ROUNDS) * 100;
  if (percent >= 90) return "Pokémon Master!";      // 18-20
  if (percent >= 70) return "Great job, Trainer!";  // 14-17
  if (percent >= 40) return "Keep training!";       // 8-13
  return "Back to the Pokédex!";                    // 0-7
}

// ---------- 11. Connect the buttons ----------
startBtn.addEventListener("click", startGame);
nextBtn.addEventListener("click", nextRound);
playAgainBtn.addEventListener("click", startGame);