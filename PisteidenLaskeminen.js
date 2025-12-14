function calculateScore(scoreKey, dice) {
  const counts = {};
  dice.forEach(d => counts[d] = (counts[d] || 0) + 1);

  const sum = dice.reduce((a, b) => a + b, 0);
  const sorted = [...dice].sort((a, b) => a - b).join(",");

  switch (scoreKey) {
    case "ones": return (counts[1] || 0) * 1;
    case "twos": return (counts[2] || 0) * 2;
    case "threes": return (counts[3] || 0) * 3;
    case "fours": return (counts[4] || 0) * 4;
    case "fives": return (counts[5] || 0) * 5;
    case "sixes": return (counts[6] || 0) * 6;

    case "pair":
      for (let i = 6; i >= 1; i--) if ((counts[i] || 0) >= 2) return i * 2;
      return 0;

    case "twoPairs":
      const pairs = [];
      for (let i = 6; i >= 1; i--) if ((counts[i] || 0) >= 2) pairs.push(i);
      return pairs.length >= 2 ? pairs[0] * 2 + pairs[1] * 2 : 0;

    case "threeOfAKind":
      for (let i = 6; i >= 1; i--) if ((counts[i] || 0) >= 3) return i * 3;
      return 0;

    case "fourOfAKind":
      for (let i = 6; i >= 1; i--) if ((counts[i] || 0) >= 4) return i * 4;
      return 0;

    case "smallStraight": return sorted === "1,2,3,4,5" ? 15 : 0;
    case "largeStraight": return sorted === "2,3,4,5,6" ? 20 : 0;

    case "fullHouse":
      return Object.values(counts).includes(3) &&
             Object.values(counts).includes(2) ? sum : 0;

    case "chance": return sum;
    case "yatzy": return Object.values(counts).includes(5) ? 50 : 0;

    default: return 0;
  }
}
