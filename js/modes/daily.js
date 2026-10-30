/**
 * RETO CASTILLOS DE ESPAÑA
 * Modo: RETO DEL DÍA
 * Selección determinista de 5 preguntas diarias idénticas para todos los usuarios.
 */

import PREGUNTAS from "../data/questions.js";
import storage from "../storage.js";
import sound from "../audio.js";

// Generador pseudoaleatorio basado en semilla (Mulberry32) para estabilidad diaria
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

export class DailyMode {
  constructor(onComplete) {
    this.onComplete = onComplete;
    this.questions = [];
    this.currentIndex = 0;
    this.puntos = 0;
    this.aciertos = 0;
    this.questionStartTime = 0;
    this.isAnswering = false;
  }

  // Obtener las 5 preguntas del día de forma determinista y variada
  getDailyQuestions(dateStr = storage.getTodayString()) {
    const seed = stringToSeed(dateStr);
    const rng = mulberry32(seed);

    // Agrupar preguntas por categoría para asegurar variedad didáctica
    const categories = ["identificacion", "arquitectura", "geografia", "historia", "curiosidad"];
    const poolByCategory = {};
    categories.forEach(cat => {
      poolByCategory[cat] = PREGUNTAS.filter(q => q.categoria === cat);
    });

    const selected = [];
    // 1 de cada categoría
    categories.forEach(cat => {
      const list = poolByCategory[cat];
      if (list && list.length > 0) {
        const idx = Math.floor(rng() * list.length);
        selected.push(list[idx]);
      }
    });

    // Si por alguna razón faltaran, rellenar del pozo general sin repetir
    if (selected.length < 5) {
      const remaining = PREGUNTAS.filter(q => !selected.includes(q));
      while (selected.length < 5 && remaining.length > 0) {
        const idx = Math.floor(rng() * remaining.length);
        selected.push(remaining.splice(idx, 1)[0]);
      }
    }

    // Barajar deterministamente las opciones de cada pregunta con Fisher-Yates
    // para que la respuesta correcta quede repartida de forma variada entre A, B, C y D
    return selected.slice(0, 5).map(q => {
      const correctText = q.opciones[q.correcta];
      const shuffledOptions = [...q.opciones];
      for (let i = shuffledOptions.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]];
      }
      return {
        ...q,
        opciones: shuffledOptions,
        correcta: shuffledOptions.indexOf(correctText)
      };
    });
  }

  start() {
    this.questions = this.getDailyQuestions();
    this.currentIndex = 0;
    this.puntos = 0;
    this.aciertos = 0;
    this.isAnswering = false;
    this.questionStartTime = Date.now();
    return this.getCurrentQuestion();
  }

  getCurrentQuestion() {
    if (this.currentIndex >= this.questions.length) {
      return null;
    }
    this.questionStartTime = Date.now();
    this.isAnswering = true;
    return {
      question: this.questions[this.currentIndex],
      index: this.currentIndex,
      total: this.questions.length
    };
  }

  answer(optionIndex) {
    if (!this.isAnswering) return null;
    this.isAnswering = false;

    const current = this.questions[this.currentIndex];
    const isCorrect = optionIndex === current.correcta;
    const elapsedSeconds = (Date.now() - this.questionStartTime) / 1000;

    let pointsGained = 0;
    if (isCorrect) {
      // 100 puntos base
      pointsGained = 100;
      // Bonificación justa por rapidez (hasta 30 pts si responde en menos de 10s)
      if (elapsedSeconds < 10) {
        pointsGained += Math.round((10 - elapsedSeconds) * 3);
      }
      this.puntos += pointsGained;
      this.aciertos += 1;
      sound.playCorrect();

      // Desbloquear castillo en la colección si la pregunta tiene castillo asociado
      if (current.castilloId) {
        storage.unlockCastle(current.castilloId);
      }
    } else {
      sound.playIncorrect();
    }

    const result = {
      isCorrect,
      selectedIndex: optionIndex,
      correctIndex: current.correcta,
      pointsGained,
      currentPoints: this.puntos,
      explanation: current.explicacion,
      source: current.fuente,
      isLast: this.currentIndex >= this.questions.length - 1
    };

    return result;
  }

  next() {
    this.currentIndex += 1;
    if (this.currentIndex >= this.questions.length) {
      // Fin del reto diario: registrar bonificación por completar
      const bonoPartidaCompleta = 50;
      const bonoPleno = this.aciertos === 5 ? 150 : 0;
      this.puntos += bonoPartidaCompleta + bonoPleno;

      storage.completeDailyChallenge(this.puntos, this.aciertos);
      storage.recordGame({
        modo: "diario",
        puntos: this.puntos,
        aciertos: this.aciertos,
        totalPreguntas: 5
      });

      if (this.onComplete) {
        this.onComplete({
          modo: "diario",
          puntos: this.puntos,
          aciertos: this.aciertos,
          totalPreguntas: 5,
          bonoPleno: bonoPleno > 0
        });
      }
      return null;
    }
    return this.getCurrentQuestion();
  }
}

export default DailyMode;
