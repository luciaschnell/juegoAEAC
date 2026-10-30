/**
 * RETO CASTILLOS DE ESPAÑA
 * Módulo de almacenamiento persistente local seguro (localStorage).
 * Con control de versiones, prevención de corrupción de datos y sin cookies invasivas.
 */

const STORAGE_KEY = "reto_castillos_v1_save";
const BACKUP_KEY = "reto_castillos_v1_backup";

const DEFAULT_STATE = {
  version: 1,
  puntosTotales: 0,
  partidasJugadas: 0,
  aciertosTotales: 0,
  preguntasRespondidas: 0,
  recordContrarreloj: 0,
  streakActual: 0,
  streakMaxima: 0,
  ultimaFechaJugada: null,
  retoDiario: {
    fecha: null,
    completado: false,
    puntos: 0,
    aciertos: 0
  },
  castillosDescubiertos: [], // array de castle IDs
  insigniasDesbloqueadas: [], // array de badge IDs
  historial: [], // últimas 15 partidas
  jugador: {
    registrado: false,
    nombre: "Invitado",
    email: null,
    avatar: "🛡️"
  }
};

class GameStorage {
  constructor() {
    this.state = this.load();
  }

  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return { ...DEFAULT_STATE };
      }
      const parsed = JSON.parse(raw);
      // Validar integridad mínima
      if (typeof parsed !== "object" || parsed === null) {
        throw new Error("Datos de guardado inválidos");
      }
      return {
        ...DEFAULT_STATE,
        ...parsed,
        retoDiario: {
          ...DEFAULT_STATE.retoDiario,
          ...(parsed.retoDiario || {})
        },
        castillosDescubiertos: Array.isArray(parsed.castillosDescubiertos) ? parsed.castillosDescubiertos : [],
        insigniasDesbloqueadas: Array.isArray(parsed.insigniasDesbloqueadas) ? parsed.insigniasDesbloqueadas : [],
        historial: Array.isArray(parsed.historial) ? parsed.historial : []
      };
    } catch (err) {
      console.warn("Error al cargar progreso principal, intentando backup...", err);
      try {
        const backupRaw = localStorage.getItem(BACKUP_KEY);
        if (backupRaw) {
          const backupParsed = JSON.parse(backupRaw);
          return { ...DEFAULT_STATE, ...backupParsed };
        }
      } catch (backupErr) {
        console.error("Backup inaccesible, restaurando estado por defecto.", backupErr);
      }
      return { ...DEFAULT_STATE };
    }
  }

  save() {
    try {
      const serial = JSON.stringify(this.state);
      localStorage.setItem(STORAGE_KEY, serial);
      // Guardar copia de seguridad redundante
      localStorage.setItem(BACKUP_KEY, serial);
      return true;
    } catch (err) {
      console.error("No se pudo guardar el progreso en localStorage:", err);
      return false;
    }
  }

  getState() {
    return this.state;
  }

  // Registrar resultado de una partida
  recordGame({ modo, puntos, aciertos, totalPreguntas, tiempoSegundos = null }) {
    this.state.partidasJugadas += 1;
    this.state.puntosTotales += Math.max(0, puntos);
    this.state.aciertosTotales += Math.max(0, aciertos);
    this.state.preguntasRespondidas += Math.max(0, totalPreguntas);

    if (modo === "contrarreloj" && puntos > (this.state.recordContrarreloj || 0)) {
      this.state.recordContrarreloj = puntos;
    }

    // Actualizar racha diaria
    this.updateDailyStreak();

    // Guardar en historial (máximo 15 elementos)
    const resumen = {
      fecha: new Date().toISOString(),
      modo,
      puntos,
      aciertos,
      totalPreguntas,
      tiempoSegundos
    };
    this.state.historial.unshift(resumen);
    if (this.state.historial.length > 15) {
      this.state.historial = this.state.historial.slice(0, 15);
    }

    this.save();
    return resumen;
  }

  // Desbloquear castillo en la colección
  unlockCastle(castleId) {
    if (!castleId) return false;
    if (!this.state.castillosDescubiertos.includes(castleId)) {
      this.state.castillosDescubiertos.push(castleId);
      this.save();
      return true; // nuevo descubrimiento!
    }
    return false;
  }

  isCastleUnlocked(castleId) {
    return this.state.castillosDescubiertos.includes(castleId);
  }

  // Desbloquear insignia
  unlockBadge(badgeId) {
    if (!badgeId) return false;
    if (!this.state.insigniasDesbloqueadas.includes(badgeId)) {
      this.state.insigniasDesbloqueadas.push(badgeId);
      this.save();
      return true; // recién desbloqueada!
    }
    return false;
  }

  isBadgeUnlocked(badgeId) {
    return this.state.insigniasDesbloqueadas.includes(badgeId);
  }

  // Reto del día estado
  getTodayString() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  hasCompletedDailyToday() {
    const today = this.getTodayString();
    return this.state.retoDiario && this.state.retoDiario.fecha === today && this.state.retoDiario.completado;
  }

  completeDailyChallenge(puntos, aciertos) {
    const today = this.getTodayString();
    this.state.retoDiario = {
      fecha: today,
      completado: true,
      puntos,
      aciertos
    };
    this.updateDailyStreak();
    this.save();
  }

  updateDailyStreak() {
    const today = this.getTodayString();
    const lastPlayed = this.state.ultimaFechaJugada;

    if (!lastPlayed) {
      this.state.streakActual = 1;
      this.state.streakMaxima = 1;
      this.state.ultimaFechaJugada = today;
      return;
    }

    if (lastPlayed === today) {
      // Ya jugó hoy, no cambia la racha
      return;
    }

    const lastDate = new Date(lastPlayed);
    const currentDate = new Date(today);
    const diffTime = currentDate.getTime() - lastDate.getTime();
    const diffDays = Math.round(diffTime / (1000 * 3600 * 24));

    if (diffDays === 1) {
      // Día consecutivo!
      this.state.streakActual += 1;
      if (this.state.streakActual > this.state.streakMaxima) {
        this.state.streakMaxima = this.state.streakActual;
      }
    } else if (diffDays > 1) {
      // Racha rota
      this.state.streakActual = 1;
    }

    this.state.ultimaFechaJugada = today;
  }

  loginUser(nombre, email = null) {
    this.state.jugador = {
      registrado: true,
      nombre: nombre.trim() || "Caballero",
      email: email ? email.trim() : null,
      avatar: "⚔️"
    };
    this.save();
    return this.state.jugador;
  }

  logoutUser() {
    this.state.jugador = {
      registrado: false,
      nombre: "Invitado",
      email: null,
      avatar: "🛡️"
    };
    this.save();
    return this.state.jugador;
  }

  getJugador() {
    return this.state.jugador || { registrado: false, nombre: "Invitado", email: null, avatar: "🛡️" };
  }

  resetProgress() {
    this.state = { ...DEFAULT_STATE };
    this.save();
  }
}

export const storage = new GameStorage();
export default storage;
