# Yatzy (HTML template)

This repository contains a basic HTML template for building a Yatzy game with JavaScript.

Files

- `index.html` — The main HTML template with internal CSS. No JavaScript is included.

How to use

1. Open `index.html` in your browser to view the layout.
2. Add your JavaScript (e.g. `script.js`) and include it at the end of the `body` when ready.

Key data attributes and IDs for wiring JavaScript

- Dice buttons: `data-die-index="0..4"` — the five dice elements. Toggle `aria-pressed` to mark held dice.
- Roll button: `#roll-button` — trigger rolling of unlocked dice.
- End turn button: `#end-turn-button` — finalize the current player's turn.
- Rolls left: `#rolls-left` — numeric display that should be updated by JS.
- Game status (ARIA live): `#game-status` — use to announce changes for screen readers.
- Score fields: elements with `data-score-key` attributes (e.g. `ones`, `twos`, `chance`, `yatzy`, `total`) — set the inner text to update scores.
- Player scores: `data-player-score="0..n"` — where the value is the player index.

Accessibility notes

- `aria-live="polite"` is used for game status updates.
- Dice use `aria-pressed` to indicate toggle state for held dice.

Next steps (suggested)

- Add JavaScript to implement rolling, scoring, and player turns.
- Consider splitting CSS into a separate file if you prefer.
- Add unit tests for scoring logic.

Enjoy building your Yatzy game!
