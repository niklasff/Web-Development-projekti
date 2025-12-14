// =====================================
// noppatoiminta.js
// =====================================
//
// Tämä tiedosto vastaa noppien toiminnasta:
// - noppien heittämisestä
// - noppien lukitsemisesta
// - heittojen määrän hallinnasta
// - käyttöliittymän päivittämisestä
//
// Tämä tiedosto EI laske pisteitä eikä hallitse vuoroja,
// vaan keskittyy vain noppien käyttäytymiseen.
//

// Odotetaan, että koko HTML-sivu on ladattu ennen kuin
// aletaan hakea elementtejä tai lisätä tapahtumankuuntelijoita
document.addEventListener("DOMContentLoaded", () => {

  // Haetaan kaikki noppaelementit (5 kpl) ja muunnetaan ne taulukoksi
  // jotta niitä voidaan käsitellä forEach-silmukassa
  const dice = Array.from(document.querySelectorAll(".die"));

  // Haetaan Heitä!-painike
  const rollBtn = document.getElementById("roll-button");

  // Haetaan Päätä vuoro! -painike
  const endTurnBtn = document.getElementById("end-turn-button");

  // Haetaan elementti, jossa näytetään jäljellä olevat heitot
  const rollsLeftEl = document.getElementById("rolls-left");

  // Muuttuja, joka pitää kirjaa jäljellä olevista heitoista
  let rollsLeft = 3;

  // Jos HTML:ssä on jo jokin arvo heittojen määrälle,
  // luetaan se ja varmistetaan, että se on numero
  if (rollsLeftEl) {
    const parsed = parseInt(rollsLeftEl.textContent, 10);

    // Number.isNaN varmistaa, ettei arvo ole virheellinen
    if (!Number.isNaN(parsed)) {
      rollsLeft = parsed;
    }

    // Päivitetään näkyvä arvo käyttöliittymään
    rollsLeftEl.textContent = String(rollsLeft);
  }

  // Turvatarkistus:
  // Jos nopat tai heittopainike puuttuvat,
  // sovellus ei voi toimia oikein
  if (!rollBtn || dice.length === 0) {
    console.error("Noppia tai roll-nappia ei löytynyt");
    return;
  }

  // ==========================
  // NOPAN LUKITSEMINEN
  // ==========================
  //
  // Pelaaja voi klikata yksittäistä noppaa lukitakseen sen,
  // jolloin se ei muutu seuraavalla heitolla
  //
  dice.forEach(die => {
    die.addEventListener("click", () => {

      // Tarkistetaan, onko noppa lukittu
      // aria-pressed="true" tarkoittaa lukittua noppaa
      const locked = die.getAttribute("aria-pressed") === "true";

      // Vaihdetaan tila:
      // jos lukittu → avataan
      // jos avoin → lukitaan
      die.setAttribute("aria-pressed", String(!locked));
    });
  });

  // ==========================
  // HEITÄ!-PAINIKE
  // ==========================
  //
  // Kun pelaaja painaa Heitä!-painiketta,
  // arvotaan uudet arvot kaikille ei-lukituille nopille
  //
  rollBtn.addEventListener("click", () => {

    // Estetään heittäminen, jos heitot ovat loppuneet
    if (rollsLeft <= 0) return;

    // Vähennetään jäljellä olevien heittojen määrää yhdellä
    rollsLeft--;

    // Päivitetään heittojen määrä näkyviin käyttöliittymään
    if (rollsLeftEl) {
      rollsLeftEl.textContent = String(rollsLeft);
    }

    // Disabloidaan Heitä!-painike,
    // jos heittoja ei ole enää jäljellä
    rollBtn.disabled = rollsLeft <= 0;

    // Käydään jokainen noppa läpi
    dice.forEach(die => {

      // Ohitetaan lukitut nopat
      if (die.getAttribute("aria-pressed") === "true") return;

      // Resetoi animaation,
      // jotta sama animaatio voidaan toistaa uudelleen
      die.classList.remove("rolling");
      void die.offsetWidth; // pakottaa selaimen laskemaan layoutin uudelleen
      die.classList.add("rolling");

      // Pieni viive animaatiota varten
      setTimeout(() => {

        // Arvotaan satunnainen luku väliltä 1–6
        const value = Math.floor(Math.random() * 6) + 1;

        // Haetaan nopan sisällä oleva span-elementti
        const pip = die.querySelector(".pip");

        // Näytetään arvottu arvo käyttöliittymässä
        if (pip) pip.textContent = value;

        // Tallennetaan nopan arvo data-attribuuttiin,
        // jotta se voidaan myöhemmin lukea pistelaskennassa
        die.dataset.value = value;

        // Poistetaan animaatioluokka
        die.classList.remove("rolling");

      }, 300);
    });
  });

  // ==========================
  // PÄÄTÄ VUORO -PAINIKE
  // ==========================
  //
  // Kun vuoro päätetään:
  // - heitot nollataan
  // - nopat avataan
  // - nopat tyhjennetään
  // - vuoro siirretään seuraavalle pelaajalle
  //
  if (endTurnBtn) {
    endTurnBtn.addEventListener("click", () => {

      // Palautetaan heittojen määrä alkuarvoon
      rollsLeft = 3;

      // Päivitetään näkyvä arvo käyttöliittymään
      if (rollsLeftEl) rollsLeftEl.textContent = String(rollsLeft);

      // Aktivoidaan Heitä!-painike uudelleen
      if (rollBtn) rollBtn.disabled = false;

      // Nollataan kaikki nopat
      dice.forEach(die => {
        die.setAttribute("aria-pressed", "false");

        // Tyhjennetään nopan näkyvä arvo
        const pip = die.querySelector(".pip");
        if (pip) pip.textContent = "—";

        // Poistetaan nopan arvo datasta
        delete die.dataset.value;
      });

      // Kutsutaan vuoronvaihtofunktiota,
      // jos se on määritelty Taulukko.js-tiedostossa
      if (typeof endTurn === "function") endTurn();
    });
  }

  // ==========================
  // VUORON PÄÄTTYMINEN (TAPAHTUMA)
  // ==========================
  //
  // Kuunnellaan turnEnded-tapahtumaa,
  // joka voidaan lähettää toisesta tiedostosta (Taulukko.js).
  // Tämä mahdollistaa tiedostojen välisen viestinnän.
  //
  document.addEventListener("turnEnded", () => {

    // Palautetaan heittojen määrä
    rollsLeft = 3;
    if (rollsLeftEl) rollsLeftEl.textContent = String(rollsLeft);

    // Aktivoidaan Heitä!-painike
    if (rollBtn) rollBtn.disabled = false;

    // Nollataan nopat
    dice.forEach(die => {
      die.setAttribute("aria-pressed", "false");

      const pip = die.querySelector(".pip");
      if (pip) pip.textContent = "—";

      delete die.dataset.value;
    });
  });
});
