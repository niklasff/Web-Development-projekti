


// Merkitään aktiiviset/inaktiiviset sarakkeet
function applyActivePlayerCount(n) {
  activePlayerCount = n;

  // Header-sarakkeet (pelaajanimet)
  document.querySelectorAll('.player-col').forEach(col => {
    const idx = Number(col.dataset.playerIndex);
    const inactive = idx >= n;
    col.classList.toggle('inactive', inactive);
  });

  // Kaikki piste-solut (score-rivit)
  document.querySelectorAll('.score-row .value').forEach(cell => {
    const idx = Number(cell.dataset.playerIndex);
    const inactive = idx >= n;
    cell.classList.toggle('inactive', inactive);
  });

  console.log(`Aktiivinen pelaajamäärä: ${n}`);
}

// Kytketään dropdowniin muutoskuuntelija ja alustetaan sivun latauksessa
document.addEventListener('DOMContentLoaded', () => {
  const playerCountSelect = document.getElementById('player-count');
  if (!playerCountSelect) {
    console.warn('player-count selectiä ei löytynyt!');
    return;
  }

  // Alkuarvo selectistä
  applyActivePlayerCount(Number(playerCountSelect.value || 2));

  // Reagoi muutoksiin
  playerCountSelect.addEventListener('change', (e) => {
    const n = Number(e.target.value);
    applyActivePlayerCount(n);
  });
});
