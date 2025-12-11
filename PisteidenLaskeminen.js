
//Ylä kerran kategoriat
const UPPER_KEYS = ['ones','twos','threes','fours','fives','sixes'];

//Alakerran kategoriat
const LOWER_KEYS = [
  'pair','twoPairs',
  'threeOfAKind','fourOfAKind','fiveOfAKind',
  'smallStraight','largeStraight','fullHouse',
  'chance','yatzy'
];

//Ruudut, jotka päivitetään automaattisesti
const AUTO_KEYS = ['upperTotal','bonus','total'];

//Yläkerran Bonuksen piste raja 63

const UPPER_BONUS_LIMIT = 63;


function getScoreCell(scoreKey, playerIndex) {
  return document.querySelector(
    `.scorecard .value[data-score-key="${scoreKey}"][data-player-index="${playerIndex}"]`
  );
}

//Luetaan arvot turvallisesti, jos ruudut onkin vielä tyhjiä
function readCellNumber(scoreKey, playerIndex) {
  const cell = getScoreCell(scoreKey, playerIndex);
  if (!cell) return 0;
  const txt = (cell.textContent || '').trim();
  const num = Number(txt);
  return Number.isFinite(num) ? num : 0;
}


function writeCellNumber(scoreKey, playerIndex, value) {
  const cell = getScoreCell(scoreKey, playerIndex);
  if (!cell) return;
  cell.textContent = String(value);
}


function recomputeUpperAndBonusFor(playerIndex) {
  // Summaa yläkerran kategoriat
  const upperSum = UPPER_KEYS
    .map(k => readCellNumber(k, playerIndex))
    .reduce((a, b) => a + b, 0);

  // Päivitä "Yläkerran pisteet" solu
  writeCellNumber('upperTotal', playerIndex, upperSum);

  // Laskee bonusrajan
  const bonus = upperSum >= UPPER_BONUS_THRESHOLD ? UPPER_BONUS_POINTS : 0;
  writeCellNumber('bonus', playerIndex, bonus);

  
function recomputeTotalFor(playerIndex) {
  const upperTotal = readCellNumber('upperTotal', playerIndex);
  const bonus = readCellNumber('bonus', playerIndex);

  // Summaa alakerran valmiit pisteet
  const lowerSum = LOWER_KEYS
    .map(k => readCellNumber(k, playerIndex))
    .reduce((a, b) => a + b, 0);

  const total = upperTotal + bonus + lowerSum;
  writeCellNumber('total', playerIndex, total);

}}

