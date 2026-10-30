/**
 * RETO CASTILLOS DE ESPAÑA
 * Sistema de gamificación, rangos lúdicos e insignias patrimoniales.
 */

import storage from "./storage.js";
import CASTILLOS from "./data/castles.js";

export const RANGOS = [
  {
    id: "aprendiz",
    nombre: "Aprendiz de fortaleza",
    minPuntos: 0,
    maxPuntos: 499,
    icono: "🛡️",
    descripcion: "Tus primeros pasos en el apasionante universo de las fortificaciones españolas."
  },
  {
    id: "explorador",
    nombre: "Explorador de castillos",
    minPuntos: 500,
    maxPuntos: 1499,
    icono: "🧭",
    descripcion: "Reconoces torres, adarves y siluetas legendarias a lo largo de la geografía peninsular."
  },
  {
    id: "guardian",
    nombre: "Guardián del patrimonio",
    minPuntos: 1500,
    maxPuntos: 3499,
    icono: "⚔️",
    descripcion: "Custodias el saber arquitectónico y valoras la salvaguarda de nuestras fortalezas históricas."
  },
  {
    id: "maestro",
    nombre: "Maestro de fortalezas",
    minPuntos: 3500,
    maxPuntos: 6999,
    icono: "🏰",
    descripcion: "Distingues épocas, estilos y peculiaridades poliorcéticas con maestría documentada."
  },
  {
    id: "embajador",
    nombre: "Embajador de los castillos",
    minPuntos: 7000,
    maxPuntos: Infinity,
    icono: "👑",
    descripcion: "Máximo título lúdico: un referente divulgando el patrimonio fortificado español."
  }
];

export const INSIGNIAS = [
  {
    id: "primera_almena",
    nombre: "Primera Almena",
    icono: "🛡️",
    requisito: "Consigue tu primer acierto en cualquier modo de juego.",
    check: (st) => st.aciertosTotales >= 1
  },
  {
    id: "pleno_diario",
    nombre: "Pleno Real",
    icono: "👑",
    requisito: "Logra un pleno perfecto de 5/5 en el Reto del Día.",
    check: (st, event) => event && event.modo === "diario" && event.aciertos === 5
  },
  {
    id: "rayo_muralla",
    nombre: "Rayo de la Muralla",
    icono: "⚡",
    requisito: "Encadena 5 aciertos consecutivos en el Desafío Contrarreloj.",
    check: (st, event) => event && event.modo === "contrarreloj" && event.rachaMaximaRonda >= 5
  },
  {
    id: "erudito_20",
    nombre: "Erudito Fortificado",
    icono: "📜",
    requisito: "Responde correctamente a 20 preguntas en total.",
    check: (st) => st.aciertosTotales >= 20
  },
  {
    id: "gran_senor_15",
    nombre: "Gran Señor de la Colección",
    icono: "🏰",
    requisito: "Descubre al menos 12 castillos en tu Álbum de Fortalezas.",
    check: (st) => st.castillosDescubiertos.length >= 12
  },
  {
    id: "centinela_3dias",
    nombre: "Centinela Incansable",
    icono: "📅",
    requisito: "Mantén una racha de juego durante 3 días consecutivos.",
    check: (st) => st.streakActual >= 3 || st.streakMaxima >= 3
  },
  {
    id: "veterano_10",
    nombre: "Veterano del Asedio",
    icono: "⚔️",
    requisito: "Completa un total de 10 partidas en el juego.",
    check: (st) => st.partidasJugadas >= 10
  }
];

export class GamificationService {
  getRangoActual(puntosTotales) {
    const pts = Math.max(0, puntosTotales);
    for (let i = RANGOS.length - 1; i >= 0; i--) {
      if (pts >= RANGOS[i].minPuntos) {
        return RANGOS[i];
      }
    }
    return RANGOS[0];
  }

  getSiguienteRango(puntosTotales) {
    const pts = Math.max(0, puntosTotales);
    for (let i = 0; i < RANGOS.length; i++) {
      if (pts < RANGOS[i].maxPuntos && RANGOS[i].maxPuntos !== Infinity) {
        return RANGOS[i + 1] || null;
      }
    }
    return null;
  }

  getProgresoRango(puntosTotales) {
    const actual = this.getRangoActual(puntosTotales);
    const siguiente = this.getSiguienteRango(puntosTotales);
    if (!siguiente) {
      return { porcentaje: 100, puntosFaltantes: 0, actual, siguiente: null };
    }
    const rangoBase = actual.minPuntos;
    const rangoMeta = actual.maxPuntos + 1;
    const progreso = Math.min(100, Math.max(0, Math.round(((puntosTotales - rangoBase) / (rangoMeta - rangoBase)) * 100)));
    return {
      porcentaje: progreso,
      puntosFaltantes: rangoMeta - puntosTotales,
      actual,
      siguiente
    };
  }

  // Comprobar si se han desbloqueado nuevas insignias tras una acción
  checkBadges(event = null) {
    const state = storage.getState();
    const desbloqueadasNuevas = [];

    INSIGNIAS.forEach(badge => {
      if (!storage.isBadgeUnlocked(badge.id)) {
        if (badge.check(state, event)) {
          storage.unlockBadge(badge.id);
          desbloqueadasNuevas.push(badge);
        }
      }
    });

    return desbloqueadasNuevas;
  }

  getResumenEstadisticas() {
    const state = storage.getState();
    const rango = this.getRangoActual(state.puntosTotales);
    const progreso = this.getProgresoRango(state.puntosTotales);
    const tasaAcierto = state.preguntasRespondidas > 0
      ? Math.round((state.aciertosTotales / state.preguntasRespondidas) * 100)
      : 0;

    return {
      ...state,
      rango,
      progreso,
      tasaAcierto,
      totalCastillosDisponibles: CASTILLOS.length,
      castillosDescubiertosCount: state.castillosDescubiertos.length,
      insigniasCount: state.insigniasDesbloqueadas.length,
      totalInsignias: INSIGNIAS.length
    };
  }
}

export const gamification = new GamificationService();
export default gamification;
