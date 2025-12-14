
// noppatoiminta.js

document.addEventListener("DOMContentLoaded", () => {
  const dice = Array.from(document.querySelectorAll(".die"));
  const rollBtn = document.getElementById("roll-button");
  const endTurnBtn = document.getElementById("end-turn-button");
  const rollsLeftEl = document.getElementById("rolls-left"); // match HTML
  let rollsLeft = 3;
  if (rollsLeftEl) {
    const parsed = parseInt(rollsLeftEl.textContent, 10);
    if (!Number.isNaN(parsed)) rollsLeft = parsed;
    rollsLeftEl.textContent = String(rollsLeft);
  }

  if (!rollBtn || dice.length === 0) {
    console.error("Noppia tai roll-nappia ei löytynyt");
    return;
  }

  // Nopan lukitseminen
  dice.forEach(die => {
    die.addEventListener("click", () => {
      const locked = die.getAttribute("aria-pressed") === "true";
      die.setAttribute("aria-pressed", String(!locked));
    });
  });

  // Roll-nappi
  rollBtn.addEventListener("click", () => {
    if (rollsLeft <= 0) return;

    rollsLeft--;
    if (rollsLeftEl) {
      rollsLeftEl.textContent = String(rollsLeft);
    }
    // Voit halutessasi myös disabloida napin:
    rollBtn.disabled = rollsLeft <= 0;

    dice.forEach(die => {
      if (die.getAttribute("aria-pressed") === "true") return; // lukittu

      die.classList.remove("rolling");
      void die.offsetWidth;      // resetoi animaation
      die.classList.add("rolling");

      setTimeout(() => {
        const value = Math.floor(Math.random() * 6) + 1;
        const pip = die.querySelector(".pip");
        if (pip) pip.textContent = value;
        die.dataset.value = value;
        die.classList.remove("rolling");
      }, 300);
    });
  });

  // End turn: reset rolls and unlock dice
  if (endTurnBtn) {
    endTurnBtn.addEventListener("click", () => {
      rollsLeft = 3;
      if (rollsLeftEl) rollsLeftEl.textContent = String(rollsLeft);
      if (rollBtn) rollBtn.disabled = false;
      dice.forEach(die => {
        die.setAttribute("aria-pressed", "false");
        const pip = die.querySelector(".pip");
        if (pip) pip.textContent = "—";
        delete die.dataset.value;
      });
      // Change player
      if (typeof endTurn === "function") endTurn();
    });
  }

  // Listen for turn ended event (from Taulukko.js)
  document.addEventListener("turnEnded", () => {
    rollsLeft = 3;
    if (rollsLeftEl) rollsLeftEl.textContent = String(rollsLeft);
    if (rollBtn) rollBtn.disabled = false;
    dice.forEach(die => {
      die.setAttribute("aria-pressed", "false");
      const pip = die.querySelector(".pip");
      if (pip) pip.textContent = "—";
      delete die.dataset.value;
    });
  });
});
