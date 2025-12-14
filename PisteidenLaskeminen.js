function calculateScore(scoreKey, dice) {

  // counts-olioon lasketaan, montako kertaa
  // kukin silmäluku (1–6) esiintyy nopissa
  // Esim. [2,2,5,6,6] → {2:2, 5:1, 6:2}
  const counts = {};
  dice.forEach(d => {
    counts[d] = (counts[d] || 0) + 1;
  });

  // Lasketaan kaikkien noppien summa.
  // Tätä käytetään esimerkiksi "chance" ja "fullHouse" -pisteissä.
  const sum = dice.reduce((a, b) => a + b, 0);

  // Järjestetään nopat nousevaan järjestykseen
  // ja muutetaan ne merkkijonoksi.
  // Tätä käytetään suorien tunnistamiseen.
  const sorted = [...dice]
    .sort((a, b) => a - b)
    .join(",");

  // Valitaan pistelaskenta pisteluokan (scoreKey) perusteella
  switch (scoreKey) {

    // =====================
    // YLÄKERTA
    // =====================

    // Jokaisessa yläkerran kohdassa:
    // - haetaan kuinka monta kertaa luku esiintyy
    // - kerrotaan se luvulla itsellään
    case "ones":
      return (counts[1] || 0) * 1;

    case "twos":
      return (counts[2] || 0) * 2;

    case "threes":
      return (counts[3] || 0) * 3;

    case "fours":
      return (counts[4] || 0) * 4;

    case "fives":
      return (counts[5] || 0) * 5;

    case "sixes":
      return (counts[6] || 0) * 6;

    // =====================
    // PARI
    // =====================

    case "pair":
      // Käydään silmäluvut läpi suurimmasta pienimpään,
      // jotta saadaan aina paras mahdollinen pari
      for (let i = 6; i >= 1; i--) {
        if ((counts[i] || 0) >= 2) {
          return i * 2;
        }
      }
      // Jos paria ei löydy, palautetaan 0 pistettä
      return 0;

    // =====================
    // KAKSI PARIA
    // =====================

    case "twoPairs":
      const pairs = [];

      // Etsitään kaikki parit
      for (let i = 6; i >= 1; i--) {
        if ((counts[i] || 0) >= 2) {
          pairs.push(i);
        }
      }

      // Jos pareja on vähintään kaksi,
      // lasketaan niiden yhteispisteet
      return pairs.length >= 2
        ? pairs[0] * 2 + pairs[1] * 2
        : 0;

    // =====================
    // KOLME SAMA
    // =====================

    case "threeOfAKind":
      // Etsitään kolmoset suurimmasta alkaen
      for (let i = 6; i >= 1; i--) {
        if ((counts[i] || 0) >= 3) {
          return i * 3;
        }
      }
      return 0;

    // =====================
    // NELJÄ SAMA
    // =====================

    case "fourOfAKind":
      // Etsitään neloset suurimmasta alkaen
      for (let i = 6; i >= 1; i--) {
        if ((counts[i] || 0) >= 4) {
          return i * 4;
        }
      }
      return 0;

    // =====================
    // SUORAT
    // =====================

    // Pieni suora: 1,2,3,4,5 → 15 pistettä
    case "smallStraight":
      return sorted === "1,2,3,4,5" ? 15 : 0;

    // Iso suora: 2,3,4,5,6 → 20 pistettä
    case "largeStraight":
      return sorted === "2,3,4,5,6" ? 20 : 0;

    // =====================
    // TÄYSKÄSI
    // =====================

    case "fullHouse":
      // Täyskäsi vaatii:
      // - yhden kolmosen
      // - yhden parin
      return Object.values(counts).includes(3) &&
             Object.values(counts).includes(2)
        ? sum
        : 0;

    // =====================
    // SATTUMA
    // =====================

    case "chance":
      // Sattumassa lasketaan kaikkien noppien summa
      return sum;

    // =====================
    // YATZY
    // =====================

    case "yatzy":
      // Yatzy saadaan, jos kaikki viisi noppaa ovat samaa lukua
      return Object.values(counts).includes(5) ? 50 : 0;

    // =====================
    // VIRHEELLINEN PISTELUOKKA
    // =====================

    default:
      return 0;
  }
}