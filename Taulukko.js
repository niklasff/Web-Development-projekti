
// Alkuarvo: 2 pelaajaa aktiivisena
let activePlayerCount = 2;

function applyActivePlayerCount(n) {
  activePlayerCount = n;

  // Headerin sarakkeet
  document.querySelectorAll('.player-col').forEach(col => {
    const idx = Number(col.dataset.playerIndex);
    col.classList.toggle('inactive', idx >= n);
  });

  // Score-solut
  document.querySelectorAll('.score-row .value').forEach(cell => {
    const idx = Number(cell.dataset.playerIndex);
    cell.classList.toggle('inactive', idx >= n);
  });
}

// Dropdownin käsittely
const playerCountSelect = document.getElementById('player-count');
if (playerCountSelect) {
  playerCountSelect.addEventListener('change', (e) => {
    const n = Number(e.target.value);
    applyActivePlayerCount(n);
  });
}

// Nimen muokkaus (valinnainen)
document.querySelectorAll('.player-name').forEach(btn => {
  btn.addEventListener('click', () => {
    const next = prompt('Muokkaa pelaajan nimeä:', btn.textContent.trim());
    if (next) btn.textContent = next;
  });
});

// Alustus
document.addEventListener('DOMContentLoaded', () => {
  applyActivePlayerCount(Number(playerCountSelect?.value ?? 2));
});
