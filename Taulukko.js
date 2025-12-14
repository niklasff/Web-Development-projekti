// ===============================
// Taulukko.js
// ===============================
//
// Tämä tiedosto vastaa pelin logiikasta:
// - kuka pelaa vuorossa
// - pistetaulukon klikkaukset
// - pisteiden yhteenlasku
// - bonukset ja kokonaispisteet
//

// currentPlayer kertoo, kuka pelaaja on vuorossa.
// 0 = Pelaaja 1, 1 = Pelaaja 2, jne.
let currentPlayer = 0;

// Pelaajien kokonaismäärä (tässä versiossa kiinteä 4)
const playerCount = 4;

/**
 * Hakee noppien arvot käyttöliittymästä.
 * Arvot luetaan data-value-attribuutista.
 * @returns {number[]} Taulukko, jossa on viisi lukua väliltä 1–6
 */
function getDiceValues() {
  return Array.from(document.querySelectorAll(".die"))
    // Muutetaan data-attribuutin arvo numeroksi
    .map(d => Number(d.dataset.value))
    // Suodatetaan pois virheelliset tai puuttuvat arvot
    .filter(v => v >= 1 && v <= 6);
}

/**
 * Aloittaa uuden vuoron ja päivittää käyttöliittymän
 * näyttämään, kuka pelaaja on vuorossa
 */
function startTurn() {
  document.getElementById("game-status").textContent =
    `Vuorossa: Pelaaja ${currentPlayer + 1}`;
  // +1, koska käyttäjälle näytetään pelaajat 1–4,
  // vaikka koodissa indeksit alkavat nollasta
}

/**
 * Lopettaa nykyisen vuoron ja siirtää vuoron
 * seuraavalle pelaajalle
 */
function endTurn() {
  // Lisätään yksi nykyiseen pelaajaan
  // Modulo (%) varmistaa, että viimeisen pelaajan jälkeen
  // palataan takaisin ensimmäiseen pelaajaan
  currentPlayer = (currentPlayer + 1) % playerCount;

  // Aloitetaan seuraavan pelaajan vuoro
  startTurn();
}

/**
 * Päivittää pelaajan kokonaispisteet:
 * - yläkerta
 * - bonus
 * - alakerta
 * - yhteispisteet
 *
 * @param {number} playerIndex - Pelaajan indeksi (0–3)
 */
function updatePlayerTotals(playerIndex) {

  // =====================
  // YLÄKERTA
  // =====================

  // Yläkerran pisteluokat
  const upperKeys = ["ones", "twos", "threes", "fours", "fives", "sixes"];
  let upperTotal = 0;

  // Käydään jokainen yläkerran pisteluokka läpi
  upperKeys.forEach(key => {
    const cell = document.querySelector(
      `.value[data-score-key="${key}"][data-player-index="${playerIndex}"]`
    );

    // Lasketaan mukaan vain käytetyt solut
    if (cell && cell.classList.contains("used")) {
      upperTotal += Number(cell.textContent) || 0;
    }
  });

  // Päivitetään yläkerran yhteispisteet taulukkoon
  const upperTotalCell = document.querySelector(
    `.value[data-score-key="upperTotal"][data-player-index="${playerIndex}"]`
  );
  if (upperTotalCell) {
    upperTotalCell.textContent = String(upperTotal);
  }

  // =====================
  // BONUS
  // =====================

  // Bonus on 35 pistettä, jos yläkerran summa on vähintään 63
  let bonus = 0;
  if (upperTotal >= 63) {
    bonus = 35;
  }

  // Päivitetään bonus taulukkoon
  const bonusCell = document.querySelector(
    `.value[data-score-key="bonus"][data-player-index="${playerIndex}"]`
  );
  if (bonusCell) {
    bonusCell.textContent = String(bonus);
  }

  // =====================
  // ALAKERTA
  // =====================

  // Alakerran pisteluokat
  const lowerKeys = [
    "pair",
    "twoPairs",
    "threeOfAKind",
    "fourOfAKind",
    "fiveOfAKind",
    "smallStraight",
    "largeStraight",
    "fullHouse",
    "chance",
    "yatzy"
  ];

  let lowerTotal = 0;

  // Lasketaan alakerran pisteet
  lowerKeys.forEach(key => {
    const cell = document.querySelector(
      `.value[data-score-key="${key}"][data-player-index="${playerIndex}"]`
    );

    if (cell && cell.classList.contains("used")) {
      lowerTotal += Number(cell.textContent) || 0;
    }
  });

  // =====================
  // KOKONAISPISTEET
  // =====================

  // Yhteispisteet = yläkerta + bonus + alakerta
  const total = upperTotal + bonus + lowerTotal;

  // Päivitetään kokonaispisteet pistetaulukkoon
  const totalCell = document.querySelector(
    `.value[data-score-key="total"][data-player-index="${playerIndex}"]`
  );
  if (totalCell) {
    totalCell.textContent = String(total);
  }

  // Päivitetään myös sivupalkin pistemäärä
  const sidebarScore = document.querySelector(
    `[data-player-score="${playerIndex}"]`
  );
  if (sidebarScore) {
    sidebarScore.textContent = String(total);
  }
}

// ===============================
// PISTETAULUKON KLIKKAUKSET
// ===============================
//
// Jokainen pistetaulukon solu on klikattava.
// Kun solua klikataan:
// - tarkistetaan vuoro
// - lasketaan pisteet
// - päivitetään summat
// - vaihdetaan vuoro
//
document.querySelectorAll(".score-row .value").forEach(cell => {
  cell.addEventListener("click", () => {

    // Haetaan solun pelaaja ja pisteluokka
    const playerIndex = Number(cell.dataset.playerIndex);
    const scoreKey = cell.dataset.scoreKey;

    // Vain aktiivinen pelaaja voi klikata
    if (playerIndex !== currentPlayer) return;

    // Sama pisteluokka voidaan käyttää vain kerran
    if (cell.classList.contains("used")) return;

    // Haetaan noppien arvot
    const dice = getDiceValues();

    // Varmistetaan, että kaikki viisi noppaa on heitetty
    if (dice.length !== 5) return;

    // Lasketaan pistemäärä
    const score = calculateScore(scoreKey, dice);

    // Näytetään pisteet taulukossa
    cell.textContent = score;

    // Merkitään solu käytetyksi
    cell.classList.add("used");

    // Päivitetään pelaajan kokonaispisteet
    updatePlayerTotals(playerIndex);

    // Lähetetään tapahtuma noppatoiminta.js-tiedostolle,
    // jotta nopat ja heitot voidaan nollata
    document.dispatchEvent(new CustomEvent("turnEnded"));

    // Vaihdetaan vuoro seuraavalle pelaajalle
    endTurn();
  });
});

// ===============================
// PELIN KÄYNNISTYS
// ===============================
//
// Kun sivu on ladattu, aloitetaan ensimmäisen
// pelaajan vuoro
//
document.addEventListener("DOMContentLoaded", startTurn);
