/**
 * RETO CASTILLOS DE ESPAÑA
 * Modo: EL AHORCADO DE LA FORTALEZA
 * Adivina el nombre de un castillo español o elemento defensivo letra a letra.
 */

import PALABRAS_CASTILLOS from "../data/words.js";
import storage from "../storage.js";
import sound from "../audio.js";
import fx from "../fx.js";

function stringToSeed(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

export class HangmanMode {
  constructor(containerElement, onComplete) {
    this.container = containerElement;
    this.onComplete = onComplete;
    this.maxMistakes = 6;
    this.currentWordItem = null;
    this.guessedLetters = new Set();
    this.mistakesCount = 0;
    this.isFinished = false;
    this.onKeydown = this.handleKeydown.bind(this);
  }

  init(dateStr = storage.getTodayString(), isDaily = true) {
    this.isDaily = isDaily;
    this.guessedLetters.clear();
    this.mistakesCount = 0;
    this.isFinished = false;

    if (isDaily) {
      const seed = stringToSeed(dateStr + "_ahorcado_castillos");
      const idx = seed % PALABRAS_CASTILLOS.length;
      this.currentWordItem = PALABRAS_CASTILLOS[idx];
    } else {
      const idx = Math.floor(Math.random() * PALABRAS_CASTILLOS.length);
      this.currentWordItem = PALABRAS_CASTILLOS[idx];
    }

    this.render();
    this.bindEvents();
  }

  render() {
    if (!this.container || !this.currentWordItem) return;

    const word = this.currentWordItem.palabra.toUpperCase();
    const isWon = !this.isFinished && [...word].every(char => this.guessedLetters.has(char));
    const isLost = this.mistakesCount >= this.maxMistakes;

    if (isWon || isLost) {
      this.isFinished = true;
    }

    // Generar casillas de letras
    const letterBoxes = [...word].map(char => {
      const revealed = this.guessedLetters.has(char) || isLost;
      return `
        <div class="hangman-letter-box ${revealed ? 'revealed' : ''} ${isLost && !this.guessedLetters.has(char) ? 'missed' : ''}">
          ${revealed ? char : ""}
        </div>
      `;
    }).join("");

    // Generar escudos restantes
    const remainingShields = Math.max(0, this.maxMistakes - this.mistakesCount);
    const shieldsHtml = Array.from({ length: this.maxMistakes }).map((_, i) => {
      return i < remainingShields ? `<span class="shield-icon active">🛡️</span>` : `<span class="shield-icon lost">💥</span>`;
    }).join("");

    // Teclado Virtual A-Z + Ñ
    const keyboardLetters = [
      ["A", "B", "C", "D", "E", "F", "G", "H", "I"],
      ["J", "K", "L", "M", "N", "Ñ", "O", "P", "Q"],
      ["R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
    ];

    const keyboardHtml = keyboardLetters.map(row => `
      <div class="hangman-kb-row">
        ${row.map(l => {
          const used = this.guessedLetters.has(l);
          const isCorrect = used && word.includes(l);
          const isWrong = used && !word.includes(l);
          let extraClass = "";
          if (isCorrect) extraClass = "correct";
          if (isWrong) extraClass = "wrong";

          return `
            <button type="button" class="hangman-key ${extraClass}" data-key="${l}" ${used || this.isFinished ? "disabled" : ""}>
              ${l}
            </button>
          `;
        }).join("")}
      </div>
    `).join("");

    this.container.innerHTML = `
      <div class="hangman-card">
        <div class="hangman-header">
          <div>
            <span class="mode-badge badge-fire">🏹 Adivinanza de la Fortaleza</span>
            <h3 style="font-size: 1.4rem; margin: 0.25rem 0 0.1rem 0;">El Ahorcado Medieval</h3>
            <p style="font-size: 0.85rem; color: var(--color-piedra-oscura); margin: 0;">
              Descubre la palabra secreta antes de que las defensas del castillo cedan.
            </p>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 0.78rem; color: var(--color-piedra); text-transform: uppercase; font-weight: 700;">Defensas</div>
            <div class="hangman-shields-bar">
              ${shieldsHtml}
            </div>
          </div>
        </div>

        <!-- Pista Cultural -->
        <div class="hangman-clue-box">
          <div class="hangman-clue-tag">
            <span>🏰 Tipo:</span> <strong>${this.currentWordItem.tipo}</strong>
          </div>
          <div class="hangman-clue-text">
            <span>✨ Pista:</span> "${this.currentWordItem.pista}"
          </div>
        </div>

        <!-- Palabra Secreta -->
        <div class="hangman-word-container">
          ${letterBoxes}
        </div>

        <!-- Teclado en Pantalla -->
        <div class="hangman-keyboard">
          ${keyboardHtml}
        </div>

        <!-- Mensajes Finales de Victoria o Derrota -->
        ${isWon ? `
          <div class="hangman-result-banner victory">
            <div style="font-size: 2.2rem; margin-bottom: 0.25rem;">🎉🛡️</div>
            <h4 style="font-size: 1.3rem; margin-bottom: 0.25rem;">¡Murallas Defendidas con Éxito!</h4>
            <p style="font-size: 0.9rem; margin-bottom: 1rem;">Has descubierto <strong>${word}</strong>. ¡+150 puntos de honor castellológico ganados!</p>
            <div style="display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap;">
              <button id="hm-btn-home" class="btn btn-primary" style="min-height: 42px;">Volver a los Juegos</button>
              <button id="hm-btn-again" class="btn btn-outline" style="min-height: 42px;">Jugar Otra Palabra</button>
            </div>
          </div>
        ` : ""}

        ${isLost ? `
          <div class="hangman-result-banner defeat">
            <div style="font-size: 2.2rem; margin-bottom: 0.25rem;">⚔️💥</div>
            <h4 style="font-size: 1.3rem; margin-bottom: 0.25rem;">¡Las Defensas han Caído!</h4>
            <p style="font-size: 0.9rem; margin-bottom: 1rem;">La palabra oculta era <strong>${word}</strong> (${this.currentWordItem.tipo}).</p>
            <div style="display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap;">
              <button id="hm-btn-home" class="btn btn-primary" style="min-height: 42px;">Volver a los Juegos</button>
              <button id="hm-btn-retry" class="btn btn-outline" style="min-height: 42px;">Intentar de Nuevo</button>
            </div>
          </div>
        ` : ""}

        <div style="margin-top: 1.25rem; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--color-pergamino-borde); padding-top: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
          <span style="font-size: 0.8rem; color: var(--color-piedra);">
            💡 Puedes pulsar en la pantalla o teclear directamente con tu teclado.
          </span>
          <button id="hm-btn-another-quick" class="btn btn-outline" style="min-height: 36px; padding: 0.3rem 0.8rem; font-size: 0.8rem;" type="button">
            🔄 Cambiar de Palabra
          </button>
        </div>
      </div>
    `;

    this.bindResultButtons();
  }

  bindEvents() {
    window.removeEventListener("keydown", this.onKeydown);
    window.addEventListener("keydown", this.onKeydown);

    if (!this.container) return;

    this.container.querySelectorAll(".hangman-key").forEach(btn => {
      btn.addEventListener("click", () => {
        const letter = btn.dataset.key;
        this.guessLetter(letter);
      });
    });

    const btnAnother = this.container.querySelector("#hm-btn-another-quick");
    if (btnAnother) {
      btnAnother.addEventListener("click", () => {
        sound.playClick();
        this.init(storage.getTodayString(), false);
      });
    }
  }

  bindResultButtons() {
    const btnHome = this.container.querySelector("#hm-btn-home");
    if (btnHome) {
      btnHome.addEventListener("click", () => {
        if (this.onComplete) this.onComplete();
      });
    }

    const btnAgain = this.container.querySelector("#hm-btn-again");
    if (btnAgain) {
      btnAgain.addEventListener("click", () => {
        sound.playClick();
        this.init(storage.getTodayString(), false);
      });
    }

    const btnRetry = this.container.querySelector("#hm-btn-retry");
    if (btnRetry) {
      btnRetry.addEventListener("click", () => {
        sound.playClick();
        this.init(storage.getTodayString(), false);
      });
    }
  }

  handleKeydown(e) {
    if (this.isFinished) return;
    const key = e.key.toUpperCase();
    if (/^[A-ZÑ]$/.test(key)) {
      this.guessLetter(key);
    }
  }

  guessLetter(letter) {
    if (this.isFinished || this.guessedLetters.has(letter)) return;

    this.guessedLetters.add(letter);
    const word = this.currentWordItem.palabra.toUpperCase();

    if (word.includes(letter)) {
      sound.playCorrect();
    } else {
      this.mistakesCount++;
      sound.playIncorrect();
    }

    const isWon = [...word].every(char => this.guessedLetters.has(char));
    const isLost = this.mistakesCount >= this.maxMistakes;

    if (isWon) {
      this.isFinished = true;
      sound.playFanfare();
      fx.burstConfetti(window.innerWidth / 2, window.innerHeight * 0.4, 45);
      storage.recordGame({
        modo: "ahorcado",
        puntos: 150,
        aciertos: 1,
        totalPreguntas: 1
      });
    } else if (isLost) {
      this.isFinished = true;
    }

    this.render();
    this.bindEvents();
  }

  destroy() {
    window.removeEventListener("keydown", this.onKeydown);
  }
}

export default HangmanMode;
