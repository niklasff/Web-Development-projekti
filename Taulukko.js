let currentPlayer = 0;
const playerCount = 4;

function getDiceValues() {
  return Array.from(document.querySelectorAll(".die"))
    .map(d => Number(d.dataset.value))
    .filter(v => v >= 1 && v <= 6);
}

function startTurn() {
  document.getElementById("game-status").textContent =
    `Vuorossa: Pelaaja ${currentPlayer + 1}`;
}

function endTurn() {
  currentPlayer = (currentPlayer + 1) % playerCount;
  startTurn();
}

// Update totals for a player
function updatePlayerTotals(playerIndex) {
  // Upper section score
  const upperKeys = ["ones", "twos", "threes", "fours", "fives", "sixes"];
  let upperTotal = 0;
  upperKeys.forEach(key => {
    const cell = document.querySelector(`.value[data-score-key="${key}"][data-player-index="${playerIndex}"]`);
    if (cell && cell.classList.contains("used")) {
      upperTotal += Number(cell.textContent) || 0;
    }
  });

  // Update upper total
  const upperTotalCell = document.querySelector(`.value[data-score-key="upperTotal"][data-player-index="${playerIndex}"]`);
  if (upperTotalCell) {
    upperTotalCell.textContent = String(upperTotal);
  }

  // Bonus: 35 points if upper total >= 63
  let bonus = 0;
  if (upperTotal >= 63) {
    bonus = 35;
  }
  const bonusCell = document.querySelector(`.value[data-score-key="bonus"][data-player-index="${playerIndex}"]`);
  if (bonusCell) {
    bonusCell.textContent = String(bonus);
  }

  // Lower section total
  const lowerKeys = ["pair", "twoPairs", "threeOfAKind", "fourOfAKind", "fiveOfAKind", "smallStraight", "largeStraight", "fullHouse", "chance", "yatzy"];
  let lowerTotal = 0;
  lowerKeys.forEach(key => {
    const cell = document.querySelector(`.value[data-score-key="${key}"][data-player-index="${playerIndex}"]`);
    if (cell && cell.classList.contains("used")) {
      lowerTotal += Number(cell.textContent) || 0;
    }
  });

  // Grand total
  const totalCell = document.querySelector(`.value[data-score-key="total"][data-player-index="${playerIndex}"]`);
  if (totalCell) {
    totalCell.textContent = String(upperTotal + bonus + lowerTotal);
  }

  // Update sidebar player score
  const sidebarScore = document.querySelector(`[data-player-score="${playerIndex}"]`);
  if (sidebarScore) {
    sidebarScore.textContent = String(upperTotal + bonus + lowerTotal);
  }
}

document.querySelectorAll(".score-row .value").forEach(cell => {
  cell.addEventListener("click", () => {
    const playerIndex = Number(cell.dataset.playerIndex);
    const scoreKey = cell.dataset.scoreKey;

    if (playerIndex !== currentPlayer) return;
    if (cell.classList.contains("used")) return;

    const dice = getDiceValues();
    if (dice.length !== 5) return;

    const score = calculateScore(scoreKey, dice);
    cell.textContent = score;
    cell.classList.add("used");

    // Update totals
    updatePlayerTotals(playerIndex);

    // Emit event for noppatoiminta.js to reset rolls
    document.dispatchEvent(new CustomEvent("turnEnded"));

    endTurn();
  });
});

document.addEventListener("DOMContentLoaded", startTurn);
