/**
 * RETO CASTILLOS DE ESPAÑA
 * Modo: BUSCAPALABRAS / SOPA DE LETRAS DE FORTALEZAS
 * Cuadrícula interactiva multidireccional:
 * Palabras en horizontal (normal e invertida), vertical (arriba/abajo) y diagonales.
 */

import PALABRAS_CASTILLOS from "../data/words.js";
import storage from "../storage.js";
import sound from "../audio.js";
import fx from "../fx.js";

function mulberry32(seed) {
  return function() {
    let t = (seed += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function stringToSeed(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

export class WordSearchMode {
  constructor(containerElement, onComplete) {
    this.container = containerElement;
    this.onComplete = onComplete;
    this.size = 10;
    this.grid = [];
    this.placedWords = [];
    this.foundWords = new Set();
    this.startCell = null;
    this.isCompleted = false;
  }

  init(dateStr = storage.getTodayString(), isDaily = true) {
    this.isDaily = isDaily;
    this.foundWords.clear();
    this.startCell = null;
    this.isCompleted = false;

    const seed = isDaily ? stringToSeed(dateStr + "_sopa_multidir_v2") : Math.floor(Math.random() * 1000000);
    const rng = mulberry32(seed);

    // Seleccionar palabras de longitud entre 4 y 8 letras para garantizar encaje en cualquier dirección
    const pool = PALABRAS_CASTILLOS.filter(p => p.palabra.length >= 4 && p.palabra.length <= 8);
    const castillos = pool.filter(p => p.tipo === "Castillo" || p.tipo === "Fortaleza" || p.tipo === "Fortaleza real");
    const elementos = pool.filter(p => p.tipo !== "Castillo" && p.tipo !== "Fortaleza" && p.tipo !== "Fortaleza real");

    const shuffle = (arr) => [...arr].sort(() => rng() - 0.5);
    const selCastillos = shuffle(castillos).slice(0, 2);
    const selElementos = shuffle(elementos).slice(0, 3);
    const targetWords = shuffle([...selCastillos, ...selElementos]);

    this.buildGrid(targetWords, rng);
    this.render();
  }

  buildGrid(targetWords, rng) {
    this.grid = Array.from({ length: this.size }, () => Array(this.size).fill(""));
    this.placedWords = [];

    // Las 8 direcciones posibles (Horizontal, Vertical, Diagonales en ambos sentidos)
    const allDirections = [
      { r: 0, c: 1, name: "Horizontal →" },
      { r: 0, c: -1, name: "Horizontal invertida ←" },
      { r: 1, c: 0, name: "Vertical ↓" },
      { r: -1, c: 0, name: "Vertical invertida ↑" },
      { r: 1, c: 1, name: "Diagonal descendente ↘" },
      { r: 1, c: -1, name: "Diagonal invertida ↙" },
      { r: -1, c: 1, name: "Diagonal ascendente ↗" },
      { r: -1, c: -1, name: "Diagonal ascendente izq ↖" }
    ];

    // Forzar variedad de orientaciones para que no salgan todas horizontales
    const directionSlots = [
      allDirections.filter(d => d.r !== 0 && d.c === 0), // Verticales (↓ o ↑)
      allDirections.filter(d => d.r !== 0 && d.c !== 0), // Diagonales (↘, ↙, ↗, ↖)
      allDirections.filter(d => d.c === -1 || d.r === -1), // Invertidas (←, ↑, ↙, ↖)
      allDirections.filter(d => d.r === 0),               // Horizontales (→ o ←)
      allDirections                                       // Libre
    ];

    targetWords.forEach((item, idx) => {
      const word = item.palabra.toUpperCase();
      let placed = false;
      let attempts = 0;

      const slotPool = directionSlots[idx % directionSlots.length];

      while (!placed && attempts < 250) {
        attempts++;
        // Probar primero el slot de dirección asignado; si cuesta encontrar hueco, probar todas
        const dirPool = attempts < 120 ? slotPool : allDirections;
        const dir = dirPool[Math.floor(rng() * dirPool.length)];

        const ranges = this.getValidStartRange(word.length, dir.r, dir.c);
        if (!ranges) continue;

        const startR = ranges.minR + Math.floor(rng() * (ranges.maxR - ranges.minR + 1));
        const startC = ranges.minC + Math.floor(rng() * (ranges.maxC - ranges.minC + 1));

        // Comprobar si cabe sin conflicto de letras
        let fits = true;
        for (let i = 0; i < word.length; i++) {
          const r = startR + (i * dir.r);
          const c = startC + (i * dir.c);
          const current = this.grid[r][c];
          if (current !== "" && current !== word[i]) {
            fits = false;
            break;
          }
        }

        if (fits) {
          const cells = [];
          for (let i = 0; i < word.length; i++) {
            const r = startR + (i * dir.r);
            const c = startC + (i * dir.c);
            this.grid[r][c] = word[i];
            cells.push({ r, c });
          }
          this.placedWords.push({
            palabra: word,
            tipo: item.tipo,
            pista: item.pista,
            dirName: dir.name,
            cells
          });
          placed = true;
        }
      }
    });

    // Rellenar huecos vacíos con letras castellanas
    const filler = "ABCDEFGHIJLMNOPRSTUVZ";
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (!this.grid[r][c]) {
          this.grid[r][c] = filler[Math.floor(rng() * filler.length)];
        }
      }
    }
  }

  getValidStartRange(length, dr, dc) {
    let minR = 0, maxR = this.size - 1;
    let minC = 0, maxC = this.size - 1;

    if (dr === 1) {
      maxR = this.size - length;
    } else if (dr === -1) {
      minR = length - 1;
    }

    if (dc === 1) {
      maxC = this.size - length;
    } else if (dc === -1) {
      minC = length - 1;
    }

    if (minR > maxR || minC > maxC) return null;
    return { minR, maxR, minC, maxC };
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="wordsearch-card">
        <div class="wordsearch-header">
          <div>
            <span class="mode-badge badge-gold">🧩 Pasatiempo de Palabras</span>
            <h3 style="font-size: 1.4rem; margin: 0.25rem 0 0.1rem 0;">Buscapalabras de Castillos</h3>
            <p style="font-size: 0.88rem; color: var(--color-piedra-oscura); margin: 0;">
              Encuentra las <strong>${this.placedWords.length} palabras ocultas</strong> en el tablero.
            </p>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 0.78rem; color: var(--color-piedra); text-transform: uppercase; font-weight: 700;">Progreso</div>
            <div style="font-size: 1.7rem; font-weight: 700; color: var(--color-verde-oscuro); font-family: var(--font-serif);">
              <span id="ws-found-count">${this.foundWords.size}</span> / <span>${this.placedWords.length}</span>
            </div>
          </div>
        </div>

        <!-- CUADRO DE INSTRUCCIONES CLARAS DE JUEGO Y DIRECCIONES -->
        <div class="ws-how-to-play">
          <div class="ws-instructions-head">
            <span class="ws-inst-icon">🧭</span>
            <strong>CÓMO SE JUEGA Y DÓNDE BUSCAR:</strong>
          </div>
          <div class="ws-instructions-grid">
            <div class="ws-inst-col">
              <div class="ws-inst-step">
                <span class="ws-badge-step">1</span>
                <span>Pulsa la <strong>primera letra</strong> de la palabra.</span>
              </div>
              <div class="ws-inst-step">
                <span class="ws-badge-step">2</span>
                <span>Pulsa la <strong>última letra</strong> para marcarla.</span>
              </div>
            </div>
            <div class="ws-directions-alert">
              <div class="ws-directions-title">⚡ ¡Atención: pueden estar en 8 direcciones!</div>
              <div class="ws-directions-tags">
                <span class="dir-tag">➡️ <strong>Horizontales:</strong> de izquierda a derecha o del revés (⬅️)</span>
                <span class="dir-tag">⬇️ <strong>Verticales:</strong> de arriba a abajo o de abajo hacia arriba (⬆️)</span>
                <span class="dir-tag">↘️ <strong>Diagonales:</strong> en diagonal descendente o ascendente (↗️ ↙️ ↖️)</span>
              </div>
            </div>
          </div>
        </div>

        <div class="wordsearch-layout">
          <!-- Cuadrícula 10x10 -->
          <div class="wordsearch-grid-wrapper">
            <div class="wordsearch-grid" id="ws-grid">
              ${this.grid.map((row, r) => 
                row.map((letter, c) => `
                  <button type="button" class="ws-cell" data-r="${r}" data-c="${c}">
                    ${letter}
                  </button>
                `).join("")
              ).join("")}
            </div>
          </div>

          <!-- Lista de Palabras a Encontrar -->
          <div class="wordsearch-sidebar">
            <div style="font-weight: 700; font-size: 0.95rem; color: var(--color-verde-oscuro); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.4rem;">
              <span>📜</span> Palabras a Encontrar:
            </div>
            <div class="ws-word-list" id="ws-word-list">
              ${this.placedWords.map(pw => `
                <div class="ws-word-item" id="ws-word-${pw.palabra}" title="${pw.pista}">
                  <span class="ws-word-icon">🛡️</span>
                  <div style="flex: 1;">
                    <strong class="ws-word-text">${pw.palabra}</strong>
                    <div style="font-size: 0.72rem; color: var(--color-piedra);">${pw.tipo}</div>
                  </div>
                  <span class="ws-word-dir-badge" id="ws-badge-${pw.palabra}" style="display: none; font-size: 0.68rem; padding: 0.15rem 0.4rem; border-radius: var(--radius-full); background: #c8e6c9; color: #1b5e20; font-weight: 700;"></span>
                </div>
              `).join("")}
            </div>

            <div style="margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid var(--color-pergamino-borde); display: flex; gap: 0.5rem; flex-wrap: wrap;">
              <button id="ws-btn-restart" class="btn btn-outline" style="min-height: 38px; font-size: 0.82rem; padding: 0.35rem 0.85rem; width: 100%;">
                🔄 Generar Otro Tablero (Con Diagonales y Verticales)
              </button>
            </div>
          </div>
        </div>

        <!-- Zona de Victoria -->
        <div id="ws-victory-box" style="display: none; margin-top: 1.5rem; padding: 1.25rem; background: #e8f5e9; border: 1px solid #81c784; border-radius: var(--radius-md); text-align: center;">
          <div style="font-size: 2.5rem; margin-bottom: 0.25rem;">🏆🏰</div>
          <h4 style="font-size: 1.3rem; color: #2e7d32; margin-bottom: 0.35rem;">¡Todas las Palabras Descubiertas!</h4>
          <p style="font-size: 0.9rem; color: #1b5e20; margin-bottom: 1rem;">Has resuelto el tablero completo encontrando palabras en todas sus orientaciones. ¡+250 puntos sumados a tu rango!</p>
          <div style="display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap;">
            <button id="ws-btn-victory-home" class="btn btn-primary" style="min-height: 42px;">Volver a los Juegos</button>
            <button id="ws-btn-victory-another" class="btn btn-outline" style="min-height: 42px;">Jugar Otro Tablero</button>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    const grid = this.container.querySelector("#ws-grid");
    if (!grid) return;

    grid.querySelectorAll(".ws-cell").forEach(cell => {
      cell.addEventListener("click", () => {
        const r = parseInt(cell.dataset.r, 10);
        const c = parseInt(cell.dataset.c, 10);
        sound.playClick();
        this.handleCellClick(r, c, cell);
      });
    });

    const btnRestart = this.container.querySelector("#ws-btn-restart");
    if (btnRestart) {
      btnRestart.addEventListener("click", () => {
        sound.playClick();
        this.init(storage.getTodayString(), false);
      });
    }

    const btnVictoryHome = this.container.querySelector("#ws-btn-victory-home");
    if (btnVictoryHome) {
      btnVictoryHome.addEventListener("click", () => {
        if (this.onComplete) this.onComplete();
      });
    }

    const btnVictoryAnother = this.container.querySelector("#ws-btn-victory-another");
    if (btnVictoryAnother) {
      btnVictoryAnother.addEventListener("click", () => {
        sound.playClick();
        this.init(storage.getTodayString(), false);
      });
    }
  }

  handleCellClick(r, c, cellEl) {
    if (this.isCompleted) return;

    if (!this.startCell) {
      // Primer clic: seleccionar letra inicial
      this.startCell = { r, c };
      cellEl.classList.add("selecting");
    } else {
      // Segundo clic: determinar si forma línea con la letra inicial
      const start = this.startCell;
      const end = { r, c };

      this.clearSelecting();

      const line = this.getLine(start, end);
      if (line && line.length > 1) {
        this.checkWord(line);
      }
      this.startCell = null;
    }
  }

  clearSelecting() {
    this.container.querySelectorAll(".ws-cell.selecting").forEach(el => el.classList.remove("selecting"));
  }

  getLine(p1, p2) {
    const dr = p2.r - p1.r;
    const dc = p2.c - p1.c;

    const stepR = dr === 0 ? 0 : dr / Math.abs(dr);
    const stepC = dc === 0 ? 0 : dc / Math.abs(dc);

    // Debe ser estrictamente horizontal, vertical o diagonal a 45º
    if (dr !== 0 && dc !== 0 && Math.abs(dr) !== Math.abs(dc)) {
      return null;
    }

    const length = Math.max(Math.abs(dr), Math.abs(dc)) + 1;
    const line = [];

    for (let i = 0; i < length; i++) {
      line.push({
        r: p1.r + (i * stepR),
        c: p1.c + (i * stepC)
      });
    }

    return line;
  }

  checkWord(line) {
    const forwardStr = line.map(pt => this.grid[pt.r][pt.c]).join("");
    const backwardStr = [...forwardStr].reverse().join("");

    for (const item of this.placedWords) {
      if (this.foundWords.has(item.palabra)) continue;

      if (item.palabra === forwardStr || item.palabra === backwardStr) {
        // ¡Palabra encontrada!
        this.foundWords.add(item.palabra);
        sound.playCorrect();

        // Marcar celdas en el tablero
        line.forEach(pt => {
          const el = this.container.querySelector(`.ws-cell[data-r="${pt.r}"][data-c="${pt.c}"]`);
          if (el) el.classList.add("found");
        });

        // Marcar en la lista lateral y mostrar en qué dirección estaba
        const wordItem = this.container.querySelector(`#ws-word-${item.palabra}`);
        if (wordItem) {
          wordItem.classList.add("completed");
          const icon = wordItem.querySelector(".ws-word-icon");
          if (icon) icon.textContent = "✓";

          const dirBadge = wordItem.querySelector(`#ws-badge-${item.palabra}`);
          if (dirBadge) {
            dirBadge.textContent = item.dirName;
            dirBadge.style.display = "inline-block";
          }
        }

        // Actualizar contador
        const counter = this.container.querySelector("#ws-found-count");
        if (counter) counter.textContent = this.foundWords.size;

        // Comprobar si se completaron todas
        if (this.foundWords.size >= this.placedWords.length) {
          this.triggerVictory();
        }
        return true;
      }
    }

    // Si no coincide, sonido de error leve
    sound.playIncorrect();
    return false;
  }

  triggerVictory() {
    this.isCompleted = true;
    sound.playFanfare();
    fx.burstConfetti(window.innerWidth / 2, window.innerHeight * 0.4, 50);

    storage.recordGame({
      modo: "sopa",
      puntos: 250,
      aciertos: this.placedWords.length,
      totalPreguntas: this.placedWords.length
    });

    const victoryBox = this.container.querySelector("#ws-victory-box");
    if (victoryBox) {
      victoryBox.style.display = "block";
      victoryBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }
}

export default WordSearchMode;
