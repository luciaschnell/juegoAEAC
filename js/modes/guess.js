/**
 * RETO CASTILLOS DE ESPAÑA
 * Modo: ADIVINA EL CASTILLO (Modo Diario y Práctica)
 * Identificación visual a partir de fotografías reales de fortalezas españolas.
 * En modo diario rota de forma determinista cada medianoche para todos los jugadores.
 */

import CASTILLOS from "../data/castles.js";
import storage from "../storage.js";
import sound from "../audio.js";

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

export class GuessMode {
  constructor(onComplete, totalRounds = 5) {
    this.onComplete = onComplete;
    this.totalRounds = totalRounds;
    this.currentRound = 0;
    this.puntos = 0;
    this.aciertos = 0;
    this.usedCastleIds = [];
    this.currentCastle = null;
    this.currentOptions = [];
    this.isAnswering = false;
    this.isDaily = true;
    this.dailyCastles = [];
    this.rng = Math.random;
  }

  start(isDaily = true) {
    this.isDaily = isDaily;
    this.currentRound = 0;
    this.puntos = 0;
    this.aciertos = 0;
    this.usedCastleIds = [];

    if (this.isDaily) {
      const seed = stringToSeed(storage.getTodayString() + "_adivina_diario");
      this.rng = mulberry32(seed);

      const pool = [...CASTILLOS];
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(this.rng() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
      this.dailyCastles = pool.slice(0, this.totalRounds);
    } else {
      this.rng = Math.random;
      this.dailyCastles = [];
    }

    return this.nextRound();
  }

  nextRound() {
    if (this.currentRound >= this.totalRounds) {
      storage.recordGame({
        modo: "adivina",
        puntos: this.puntos,
        aciertos: this.aciertos,
        totalPreguntas: this.totalRounds
      });

      if (this.onComplete) {
        this.onComplete({
          modo: "adivina",
          puntos: this.puntos,
          aciertos: this.aciertos,
          totalPreguntas: this.totalRounds
        });
      }
      return null;
    }

    let target;
    if (this.isDaily && this.dailyCastles.length > this.currentRound) {
      target = this.dailyCastles[this.currentRound];
    } else {
      const available = CASTILLOS.filter(c => !this.usedCastleIds.includes(c.id));
      const targetPool = available.length > 0 ? available : CASTILLOS;
      target = targetPool[Math.floor(this.rng() * targetPool.length)];
    }

    this.usedCastleIds.push(target.id);
    this.currentCastle = target;

    // Generar 3 opciones distractoras con Fisher-Yates
    const otherCastles = CASTILLOS.filter(c => c.id !== target.id);
    const shuffledOthers = [...otherCastles];
    for (let i = shuffledOthers.length - 1; i > 0; i--) {
      const j = Math.floor(this.rng() * (i + 1));
      [shuffledOthers[i], shuffledOthers[j]] = [shuffledOthers[j], shuffledOthers[i]];
    }
    const distractors = shuffledOthers.slice(0, 3).map(c => c.nombre);

    // Mezclar las 4 opciones con Fisher-Yates para asegurar distribución uniforme (25% en cada letra A, B, C, D)
    const options = [...distractors, target.nombre];
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(this.rng() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    this.currentOptions = options;
    this.correctIndex = options.indexOf(target.nombre);

    this.currentRound += 1;
    this.isAnswering = true;

    return {
      round: this.currentRound,
      totalRounds: this.totalRounds,
      castle: target,
      options: this.currentOptions,
      correctIndex: this.correctIndex
    };
  }

  answer(optionIndex) {
    if (!this.isAnswering) return null;
    this.isAnswering = false;

    const isCorrect = optionIndex === this.correctIndex;
    let pointsGained = 0;

    if (isCorrect) {
      this.aciertos += 1;
      pointsGained = 100;
      this.puntos += pointsGained;
      sound.playCorrect();
    } else {
      sound.playIncorrect();
    }

    // Desbloquear castillo en la colección
    storage.unlockCastle(this.currentCastle.id);

    return {
      isCorrect,
      correctIndex: this.correctIndex,
      pointsGained,
      totalPoints: this.puntos,
      aciertos: this.aciertos,
      castle: this.currentCastle,
      explicacion: `Se trata del <strong>${this.currentCastle.nombre}</strong> (${this.currentCastle.provincia}, ${this.currentCastle.comunidad}). ${this.currentCastle.descripcion}<br><br><strong>Dato histórico:</strong> ${this.currentCastle.curiosidad}`
    };
  }
}

export default GuessMode;
