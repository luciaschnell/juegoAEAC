/**
 * RETO CASTILLOS DE ESPAÑA
 * Modo: DESAFÍO CONTRARRELOJ (60 SEGUNDOS)
 * Responde el máximo número de preguntas antes de que el reloj marque cero.
 */

import PREGUNTAS from "../data/questions.js";
import storage from "../storage.js";
import sound from "../audio.js";

export class TimeAttackMode {
  constructor(onComplete, onTick) {
    this.onComplete = onComplete;
    this.onTick = onTick;
    this.duration = 60; // 60 segundos
    this.remainingTime = 60;
    this.timerId = null;
    this.puntos = 0;
    this.aciertos = 0;
    this.totalRespondidas = 0;
    this.currentStreak = 0;
    this.maxStreak = 0;
    this.isAnswering = false;
    this.questionPool = [];
    this.poolIndex = 0;
  }

  start() {
    this.remainingTime = this.duration;
    this.puntos = 0;
    this.aciertos = 0;
    this.totalRespondidas = 0;
    this.currentStreak = 0;
    this.maxStreak = 0;
    this.isAnswering = false;

    // Barajar banco de preguntas completo
    this.questionPool = [...PREGUNTAS].sort(() => 0.5 - Math.random());
    this.poolIndex = 0;

    // Iniciar temporizador
    if (this.timerId) clearInterval(this.timerId);
    this.timerId = setInterval(() => {
      this.remainingTime -= 1;
      if (this.remainingTime <= 5 && this.remainingTime > 0) {
        sound.playTick();
      }
      if (this.onTick) {
        this.onTick(this.remainingTime, this.duration);
      }
      if (this.remainingTime <= 0) {
        this.stop();
      }
    }, 1000);

    return this.nextQuestion();
  }

  nextQuestion() {
    if (this.remainingTime <= 0) return null;

    if (this.poolIndex >= this.questionPool.length) {
      // Si se agotan, rebarajar
      this.questionPool = [...PREGUNTAS].sort(() => 0.5 - Math.random());
      this.poolIndex = 0;
    }

    const rawQ = this.questionPool[this.poolIndex];
    this.poolIndex += 1;

    // Barajar opciones aleatoriamente con Fisher-Yates para repartir las letras A, B, C y D
    const correctText = rawQ.opciones[rawQ.correcta];
    const shuffledOptions = [...rawQ.opciones];
    for (let i = shuffledOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]];
    }

    const q = {
      ...rawQ,
      opciones: shuffledOptions,
      correcta: shuffledOptions.indexOf(correctText)
    };
    this.currentQuestion = q;
    this.isAnswering = true;

    return {
      question: q,
      puntos: this.puntos,
      aciertos: this.aciertos,
      streak: this.currentStreak,
      remainingTime: this.remainingTime
    };
  }

  answer(optionIndex) {
    if (!this.isAnswering || this.remainingTime <= 0) return null;
    this.isAnswering = false;
    this.totalRespondidas += 1;

    const isCorrect = optionIndex === this.currentQuestion.correcta;
    let pointsGained = 0;

    if (isCorrect) {
      this.currentStreak += 1;
      if (this.currentStreak > this.maxStreak) {
        this.maxStreak = this.currentStreak;
      }

      // Base 100 + Multiplicador de combo por racha
      let multiplier = 1;
      if (this.currentStreak >= 5) multiplier = 1.5;
      else if (this.currentStreak >= 3) multiplier = 1.25;

      pointsGained = Math.round(100 * multiplier);
      this.puntos += pointsGained;
      this.aciertos += 1;
      sound.playCorrect();

      if (this.currentQuestion.castilloId) {
        storage.unlockCastle(this.currentQuestion.castilloId);
      }
    } else {
      this.currentStreak = 0;
      sound.playIncorrect();
    }

    return {
      isCorrect,
      selectedIndex: optionIndex,
      correctIndex: this.currentQuestion.correcta,
      pointsGained,
      currentPoints: this.puntos,
      streak: this.currentStreak,
      explanation: this.currentQuestion.explicacion
    };
  }

  stop() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    this.isAnswering = false;

    // Registrar en almacenamiento
    storage.recordGame({
      modo: "contrarreloj",
      puntos: this.puntos,
      aciertos: this.aciertos,
      totalPreguntas: this.totalRespondidas,
      tiempoSegundos: this.duration - Math.max(0, this.remainingTime)
    });

    if (this.onComplete) {
      this.onComplete({
        modo: "contrarreloj",
        puntos: this.puntos,
        aciertos: this.aciertos,
        totalPreguntas: this.totalRespondidas,
        rachaMaximaRonda: this.maxStreak
      });
    }
  }

  destroy() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }
}

export default TimeAttackMode;
