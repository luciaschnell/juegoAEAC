/**
 * RETO CASTILLOS DE ESPAÑA
 * Orquestador principal de la aplicación interactiva.
 * Gestión de estados, rutas hash, interactividad accesible y vinculación con la AEAC.
 */

import CASTILLOS from "./data/castles.js";
import PREGUNTAS from "./data/questions.js";
import storage from "./storage.js";
import gamification, { RANGOS, INSIGNIAS } from "./gamification.js";
import sound from "./audio.js";
import share from "./share.js";
import DailyMode from "./modes/daily.js";
import GuessMode from "./modes/guess.js";
import TimeAttackMode from "./modes/timeattack.js";
import WordSearchMode from "./modes/wordsearch.js";
import HangmanMode from "./modes/hangman.js";
import fx from "./fx.js";

class CastillosApp {
  constructor() {
    this.currentModeInstance = null;
    this.sopaInstance = null;
    this.ahorcadoInstance = null;
    this.activeModeName = null;
    this.lastGameResults = null;
    this.activeFilter = "todos";
    this.activeRegionFilter = "todas";

    // Elementos DOM principales
    this.dom = {
      navTabs: document.querySelectorAll(".tab-btn"),
      screens: document.querySelectorAll(".screen-view"),
      sopaMount: document.getElementById("sopa-mount-point"),
      ahorcadoMount: document.getElementById("ahorcado-mount-point"),
      btnMute: document.getElementById("btn-mute"),
      btnAuthHeader: document.getElementById("btn-auth-header"),
      authHeaderLabel: document.getElementById("auth-header-label"),
      authHeaderIcon: document.getElementById("auth-header-icon"),
      authGuestNotice: document.getElementById("auth-guest-notice"),
      btnOpenAuthNotice: document.getElementById("btn-open-auth-notice"),
      authNoticeTitle: document.getElementById("auth-notice-title"),
      authNoticeDesc: document.getElementById("auth-notice-desc"),
      authModal: document.getElementById("auth-modal"),
      tabAuthLogin: document.getElementById("tab-auth-login"),
      tabAuthRegister: document.getElementById("tab-auth-register"),
      authForm: document.getElementById("auth-form"),
      authUsername: document.getElementById("auth-username"),
      authPassword: document.getElementById("auth-password"),
      btnSubmitAuth: document.getElementById("btn-submit-auth"),
      authLoggedInBox: document.getElementById("auth-logged-in-box"),
      loggedPlayerName: document.getElementById("logged-player-name"),
      btnLogout: document.getElementById("btn-logout"),
      rankPill: document.getElementById("header-rank-pill"),
      rankPillText: document.getElementById("header-rank-text"),
      rankPillIcon: document.getElementById("header-rank-icon"),
      // Modales
      castleModal: document.getElementById("castle-modal"),
      castleModalContent: document.getElementById("castle-modal-details"),
      socioModal: document.getElementById("socio-modal"),
      socioModalUsername: document.getElementById("socio-modal-username"),
      modalCloseBtns: document.querySelectorAll(".modal-close-btn"),
      // Áreas de Juego
      gameStage: document.getElementById("game-active-area"),
      gamePrompt: document.getElementById("game-question-prompt"),
      gameImgBox: document.getElementById("game-img-box"),
      gameImg: document.getElementById("game-question-img"),
      gameImgCredit: document.getElementById("game-img-credit"),
      optionsContainer: document.getElementById("game-options-container"),
      feedbackSheet: document.getElementById("game-feedback-sheet"),
      feedbackStatus: document.getElementById("feedback-status-text"),
      feedbackPoints: document.getElementById("feedback-points-gain"),
      feedbackText: document.getElementById("feedback-explanation-text"),
      feedbackSource: document.getElementById("feedback-source-text"),
      btnNextQuestion: document.getElementById("btn-next-question"),
      // Cabecera de Partida
      stageModeBadge: document.getElementById("stage-mode-badge"),
      stageCounterText: document.getElementById("stage-counter-text"),
      stageScoreText: document.getElementById("stage-score-text"),
      stageComboPill: document.getElementById("stage-combo-pill"),
      stageComboVal: document.getElementById("stage-combo-val"),
      timeBarWrap: document.getElementById("stage-time-bar-wrap"),
      timeText: document.getElementById("stage-time-text"),
      progressFill: document.getElementById("stage-progress-fill"),
      // Pantalla de Resultados
      resultsScreen: document.getElementById("screen-resultados"),
      resScoreVal: document.getElementById("results-score-val"),
      resCorrectVal: document.getElementById("results-correct-val"),
      resRankIcon: document.getElementById("results-rank-icon"),
      resRankName: document.getElementById("results-rank-name"),
      resNewRecordBadge: document.getElementById("results-new-record-badge"),
      resBadgesAlert: document.getElementById("results-badges-alert"),
      resBadgesList: document.getElementById("results-badges-list"),
      scoreCanvas: document.getElementById("score-card-canvas"),
      btnDownloadCard: document.getElementById("btn-download-card"),
      btnShareNative: document.getElementById("btn-share-native"),
      btnShareWhatsapp: document.getElementById("btn-share-whatsapp"),
      btnCopySummary: document.getElementById("btn-copy-summary"),
      btnPlayAgain: document.getElementById("btn-play-again"),
      // Colección
      collectionGrid: document.getElementById("collection-castles-grid"),
      colCountUnlocked: document.getElementById("col-count-unlocked"),
      colCountTotal: document.getElementById("col-count-total"),
      colProgressFill: document.getElementById("col-progress-fill"),
      filterPills: document.querySelectorAll(".filter-pill"),
      regionSelect: document.getElementById("collection-region-select"),
      // Perfil
      profileTotalPoints: document.getElementById("profile-total-points"),
      profileRankName: document.getElementById("profile-rank-name"),
      profileRankIcon: document.getElementById("profile-rank-icon"),
      profileRankProgressFill: document.getElementById("profile-rank-progress-fill"),
      profileRankNextText: document.getElementById("profile-rank-next-text"),
      profileGamesPlayed: document.getElementById("profile-games-played"),
      profileAccuracyRate: document.getElementById("profile-accuracy-rate"),
      profileStreakCurrent: document.getElementById("profile-streak-current"),
      profileStreakMax: document.getElementById("profile-streak-max"),
      profileBadgesGrid: document.getElementById("profile-badges-grid"),
      profileHistoryList: document.getElementById("profile-history-list"),
      btnResetProgress: document.getElementById("btn-reset-progress"),
      // Toast
      toastContainer: document.getElementById("toast-container")
    };
  }

  init() {
    this.updateHeaderUI();
    this.updateAuthUI();
    this.bindEvents();
    this.handleRouting();
    this.renderCollection();
    this.renderProfile();

    // Comprobar estado del reto diario en portada
    this.updateDailyHomeCard();
  }

  updateHeaderUI() {
    const stats = gamification.getResumenEstadisticas();
    if (this.dom.rankPillText) {
      this.dom.rankPillText.textContent = stats.rango.nombre;
    }
    if (this.dom.rankPillIcon) {
      this.dom.rankPillIcon.textContent = stats.rango.icono;
    }
    if (this.dom.btnMute) {
      this.dom.btnMute.textContent = sound.isMuted() ? "🔇" : "🔔";
      this.dom.btnMute.setAttribute("aria-label", sound.isMuted() ? "Activar sonido" : "Silenciar sonido");
    }
    this.updateAuthUI();
  }

  updateAuthUI() {
    const jugador = storage.getJugador();
    const stats = gamification.getResumenEstadisticas();

    if (jugador && jugador.registrado) {
      if (this.dom.authHeaderLabel) {
        this.dom.authHeaderLabel.textContent = `${jugador.nombre} 🔥`;
      }
      if (this.dom.authHeaderIcon) {
        this.dom.authHeaderIcon.textContent = jugador.avatar || "⚔️";
      }
      if (this.dom.btnAuthHeader) {
        this.dom.btnAuthHeader.classList.add("logged-in");
        this.dom.btnAuthHeader.title = `Perfil activo: ${jugador.nombre} (Racha protegida)`;
      }
      if (this.dom.authNoticeTitle) {
        this.dom.authNoticeTitle.textContent = `Racha protegida con tu perfil (${jugador.nombre})`;
      }
      if (this.dom.authNoticeDesc) {
        this.dom.authNoticeDesc.textContent = `Tienes una racha de ${stats.streakActual} días y ${stats.puntosTotales} puntos vinculados a tu cuenta.`;
      }
      if (this.dom.btnOpenAuthNotice) {
        this.dom.btnOpenAuthNotice.textContent = "Ver Perfil";
      }
      if (this.dom.authLoggedInBox) {
        this.dom.authLoggedInBox.style.display = "block";
      }
      if (this.dom.loggedPlayerName) {
        this.dom.loggedPlayerName.textContent = jugador.nombre;
      }
      if (this.dom.authForm) {
        this.dom.authForm.style.display = "none";
      }
    } else {
      if (this.dom.authHeaderLabel) {
        this.dom.authHeaderLabel.textContent = "Guardar Racha";
      }
      if (this.dom.authHeaderIcon) {
        this.dom.authHeaderIcon.textContent = "👤";
      }
      if (this.dom.btnAuthHeader) {
        this.dom.btnAuthHeader.classList.remove("logged-in");
        this.dom.btnAuthHeader.title = "Guardar racha o iniciar sesión (Opcional)";
      }
      if (this.dom.authNoticeTitle) {
        this.dom.authNoticeTitle.textContent = "Racha guardada localmente (Modo Invitado)";
      }
      if (this.dom.authNoticeDesc) {
        this.dom.authNoticeDesc.textContent = "No es obligatorio registrarse para jugar. Si deseas asegurar tu racha con tu apodo, pulsa aquí.";
      }
      if (this.dom.btnOpenAuthNotice) {
        this.dom.btnOpenAuthNotice.textContent = "Guardar Racha";
      }
      if (this.dom.authLoggedInBox) {
        this.dom.authLoggedInBox.style.display = "none";
      }
      if (this.dom.authForm) {
        this.dom.authForm.style.display = "block";
      }
    }
  }

  openAuthModal() {
    this.closeModals();
    this.updateAuthUI();
    if (this.dom.authModal) {
      this.dom.authModal.classList.add("active");
    }
  }

  openSocioModal(username) {
    this.closeModals();
    if (this.dom.socioModalUsername && username) {
      this.dom.socioModalUsername.textContent = username;
    }
    if (this.dom.socioModal) {
      this.dom.socioModal.classList.add("active");
    }
  }

  showToast(message, icon = "🏰") {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    this.dom.toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(8px)";
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  bindEvents() {
    // Sonido Mute
    if (this.dom.btnMute) {
      this.dom.btnMute.addEventListener("click", () => {
        const isMuted = sound.toggleMute();
        this.dom.btnMute.textContent = isMuted ? "🔇" : "🔔";
        this.showToast(isMuted ? "Sonido desactivado" : "Sonido activado", isMuted ? "🔇" : "🔔");
      });
    }

    // Rank pill click abre perfil
    if (this.dom.rankPill) {
      this.dom.rankPill.addEventListener("click", () => {
        this.navigateTo("perfil");
      });
    }

    // Modal de Autenticación / Guardar Racha
    if (this.dom.btnAuthHeader) {
      this.dom.btnAuthHeader.addEventListener("click", () => {
        sound.playClick();
        this.openAuthModal();
      });
    }

    if (this.dom.btnOpenAuthNotice) {
      this.dom.btnOpenAuthNotice.addEventListener("click", (e) => {
        e.stopPropagation();
        sound.playClick();
        this.openAuthModal();
      });
    }

    if (this.dom.authGuestNotice) {
      this.dom.authGuestNotice.addEventListener("click", () => {
        sound.playClick();
        this.openAuthModal();
      });
    }

    // Tabs del formulario de autenticación
    let authMode = "login";
    if (this.dom.tabAuthLogin && this.dom.tabAuthRegister) {
      this.dom.tabAuthLogin.addEventListener("click", () => {
        authMode = "login";
        this.dom.tabAuthLogin.classList.add("active");
        this.dom.tabAuthRegister.classList.remove("active");
        if (this.dom.btnSubmitAuth) this.dom.btnSubmitAuth.textContent = "Iniciar Sesión y Cargar Racha";
      });

      this.dom.tabAuthRegister.addEventListener("click", () => {
        authMode = "register";
        this.dom.tabAuthRegister.classList.add("active");
        this.dom.tabAuthLogin.classList.remove("active");
        if (this.dom.btnSubmitAuth) this.dom.btnSubmitAuth.textContent = "Guardar Racha y Crear Cuenta";
      });
    }

    // Envío del formulario de autenticación (Opcional)
    if (this.dom.authForm) {
      this.dom.authForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const username = this.dom.authUsername ? this.dom.authUsername.value.trim() : "";
        if (!username) return;

        storage.loginUser(username);
        sound.playFanfare();
        fx.burstConfetti(window.innerWidth / 2, window.innerHeight * 0.35, 40);
        this.showToast(`¡Racha vinculada al jugador ${username}!`, "🔥");
        this.updateAuthUI();
        this.closeModals();

        // Tras registrarse para guardar la racha, mostrar el cartel de "¿Quieres ser socio?" de la AEAC
        setTimeout(() => {
          this.openSocioModal(username);
        }, 320);
      });
    }

    // Cerrar sesión
    if (this.dom.btnLogout) {
      this.dom.btnLogout.addEventListener("click", () => {
        storage.logoutUser();
        sound.playClick();
        this.showToast("Has vuelto al Modo Invitado", "🛡️");
        this.updateAuthUI();
        this.closeModals();
      });
    }

    // Navegación por Tabs
    this.dom.navTabs.forEach(tab => {
      tab.addEventListener("click", () => {
        const targetScreen = tab.dataset.screen;
        if (!tab.dataset.action) {
          sound.playClick();
          if (tab.classList.contains("active")) {
            this.navigateTo("inicio");
          } else {
            this.navigateTo(targetScreen);
          }
        }
      });
    });

    // Enlace del logo y botones para volver a la pantalla de juegos
    const brandBadge = document.querySelector(".brand-badge");
    if (brandBadge) {
      brandBadge.addEventListener("click", (e) => {
        e.preventDefault();
        sound.playClick();
        this.navigateTo("inicio");
      });
    }

    document.querySelectorAll("[data-action='go-home']").forEach(btn => {
      btn.addEventListener("click", () => {
        sound.playClick();
        this.navigateTo("inicio");
      });
    });

    // Hash routing
    window.addEventListener("hashchange", () => this.handleRouting());

    // Botones de inicio de modos
    document.querySelectorAll("[data-action='start-mode']").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const mode = btn.dataset.mode;
        sound.playClick();
        this.startMode(mode);
      });
    });

    // Botones de Pasatiempos (Sopa de Letras y Ahorcado)
    document.querySelectorAll("[data-action='open-sopa']").forEach(btn => {
      btn.addEventListener("click", () => {
        sound.playClick();
        this.openSopaMode();
      });
    });

    document.querySelectorAll("[data-action='open-ahorcado']").forEach(btn => {
      btn.addEventListener("click", () => {
        sound.playClick();
        this.openAhorcadoMode();
      });
    });

    // Botón siguiente pregunta
    if (this.dom.btnNextQuestion) {
      this.dom.btnNextQuestion.addEventListener("click", () => {
        sound.playClick();
        this.handleNextQuestion();
      });
    }

    // Filtros de colección
    this.dom.filterPills.forEach(pill => {
      pill.addEventListener("click", () => {
        this.dom.filterPills.forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
        this.activeFilter = pill.dataset.filter;
        this.renderCollection();
      });
    });

    if (this.dom.regionSelect) {
      this.dom.regionSelect.addEventListener("change", (e) => {
        this.activeRegionFilter = e.target.value;
        this.renderCollection();
      });
    }

    // Cerrar Modales
    this.dom.modalCloseBtns.forEach(btn => {
      btn.addEventListener("click", () => this.closeModals());
    });

    document.querySelectorAll(".modal-close-action").forEach(btn => {
      btn.addEventListener("click", () => this.closeModals());
    });

    if (this.dom.castleModal) {
      this.dom.castleModal.addEventListener("click", (e) => {
        if (e.target === this.dom.castleModal) this.closeModals();
      });
    }

    if (this.dom.authModal) {
      this.dom.authModal.addEventListener("click", (e) => {
        if (e.target === this.dom.authModal) this.closeModals();
      });
    }

    if (this.dom.socioModal) {
      this.dom.socioModal.addEventListener("click", (e) => {
        if (e.target === this.dom.socioModal) this.closeModals();
      });
    }

    // Acciones de Compartición
    if (this.dom.btnDownloadCard) {
      this.dom.btnDownloadCard.addEventListener("click", () => {
        sound.playClick();
        share.downloadCardPng(this.dom.scoreCanvas);
        this.showToast("¡Tarjeta descargada con éxito!", "📥");
      });
    }

    if (this.dom.btnShareNative) {
      this.dom.btnShareNative.addEventListener("click", async () => {
        sound.playClick();
        if (this.lastGameResults) {
          const res = await share.shareNative(this.lastGameResults);
          if (res.method === "clipboard") {
            this.showToast("¡Resultado copiado al portapapeles!", "📋");
          }
        }
      });
    }

    if (this.dom.btnShareWhatsapp) {
      this.dom.btnShareWhatsapp.addEventListener("click", () => {
        sound.playClick();
        if (this.lastGameResults) {
          const waUrl = share.getWhatsAppUrl(this.lastGameResults);
          window.open(waUrl, "_blank", "noopener,noreferrer");
        }
      });
    }

    if (this.dom.btnCopySummary) {
      this.dom.btnCopySummary.addEventListener("click", async () => {
        sound.playClick();
        if (this.lastGameResults) {
          const text = share.getShareText(this.lastGameResults) + " " + share.baseUrl;
          const res = await share.copyToClipboard(text);
          if (res.success) {
            this.showToast("¡Resumen copiado para pegar!", "📋");
          }
        }
      });
    }

    if (this.dom.btnPlayAgain) {
      this.dom.btnPlayAgain.addEventListener("click", () => {
        sound.playClick();
        if (this.activeModeName) {
          this.startMode(this.activeModeName);
        } else {
          this.navigateTo("inicio");
        }
      });
    }

    // Restablecer progreso
    if (this.dom.btnResetProgress) {
      this.dom.btnResetProgress.addEventListener("click", () => {
        if (confirm("¿Seguro que deseas reiniciar tu progreso y estadísticas locales? Esta acción no se puede deshacer.")) {
          storage.resetProgress();
          this.updateHeaderUI();
          this.renderCollection();
          this.renderProfile();
          this.updateDailyHomeCard();
          this.showToast("Progreso reiniciado correctamente", "🔄");
        }
      });
    }

    // Soporte de Teclado Accesible (1, 2, 3, 4, A, B, C, D, Espacio, Enter)
    window.addEventListener("keydown", (e) => {
      // Ignorar si hay un input activo o modal abierto
      if (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA") return;

      const key = e.key.toLowerCase();
      // Opciones de respuesta
      const keyMap = { "1": 0, "a": 0, "2": 1, "b": 1, "3": 2, "c": 2, "4": 3, "d": 3 };

      if (key in keyMap) {
        const optionIndex = keyMap[key];
        const buttons = this.dom.optionsContainer.querySelectorAll(".option-btn");
        if (buttons[optionIndex] && !buttons[optionIndex].disabled) {
          buttons[optionIndex].click();
        }
      } else if (e.key === "Enter" || e.key === " ") {
        // Avanzar si el botón de siguiente está visible y activo
        if (this.dom.feedbackSheet.classList.contains("active") && this.dom.btnNextQuestion) {
          e.preventDefault();
          this.dom.btnNextQuestion.click();
        }
      } else if (e.key === "Escape") {
        this.closeModals();
      }
    });
  }

  handleRouting() {
    const hash = window.location.hash.replace("#", "") || "inicio";
    this.navigateTo(hash, false);
  }

  navigateTo(screenId, updateHash = true) {
    if (updateHash) {
      window.location.hash = screenId;
    }

    // Si salimos de una partida activa que tenga temporizador (Contrarreloj), detenerla
    if (this.currentModeInstance && this.currentModeInstance.destroy && screenId !== "juego") {
      this.currentModeInstance.destroy();
    }

    if (this.ahorcadoInstance && screenId !== "ahorcado") {
      this.ahorcadoInstance.destroy();
    }

    this.dom.screens.forEach(s => s.classList.remove("active"));
    const target = document.getElementById(`screen-${screenId}`);
    if (target) {
      target.classList.add("active");
    } else {
      document.getElementById("screen-inicio").classList.add("active");
    }

    // Actualizar tabs
    this.dom.navTabs.forEach(tab => {
      tab.classList.toggle("active", tab.dataset.screen === screenId);
    });

    window.scrollTo({ top: 0, behavior: "smooth" });

    if (screenId === "coleccion") this.renderCollection();
    if (screenId === "perfil") this.renderProfile();
    if (screenId === "inicio") this.updateDailyHomeCard();
  }

  updateDailyHomeCard() {
    const dailyCard = document.getElementById("home-daily-status");
    if (!dailyCard) return;

    if (storage.hasCompletedDailyToday()) {
      const state = storage.getState();
      dailyCard.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap;">
          <div>
            <span class="mode-badge badge-emerald">✓ Completado Hoy</span>
            <h4 style="margin: 0.35rem 0 0.2rem 0; font-size: 1.1rem;">¡Reto del Día superado!</h4>
            <p style="font-size: 0.85rem; color: var(--color-piedra-oscura);">Conseguiste <strong>${state.retoDiario.puntos} pts</strong> (${state.retoDiario.aciertos}/5 aciertos). ¡Vuelve mañana para un nuevo desafío!</p>
          </div>
          <button class="btn btn-outline" style="min-height: 40px; padding: 0.4rem 1rem; font-size: 0.88rem;" data-action="start-mode" data-mode="adivina">Practicar Adivina el Castillo →</button>
        </div>
      `;
      // Re-enlazar evento
      const btn = dailyCard.querySelector("button");
      if (btn) {
        btn.addEventListener("click", () => this.startMode("adivina"));
      }
    }
  }

  // Iniciar un modo de juego
  startMode(modeName) {
    this.activeModeName = modeName;
    this.feedbackSheetActive(false);
    this.navigateTo("juego");

    if (modeName === "diario") {
      this.dom.stageModeBadge.textContent = "Reto del Día";
      this.dom.timeBarWrap.style.display = "none";
      this.dom.stageComboPill.style.display = "none";

      this.currentModeInstance = new DailyMode((results) => this.handleGameOver(results));
      const firstQ = this.currentModeInstance.start();
      this.renderQuestion(firstQ.question, firstQ.index, firstQ.total, 0);

    } else if (modeName === "adivina") {
      this.dom.stageModeBadge.textContent = "Adivina el Castillo Diario";
      this.dom.timeBarWrap.style.display = "none";
      this.dom.stageComboPill.style.display = "none";

      this.currentModeInstance = new GuessMode((results) => this.handleGameOver(results), 5);
      const firstRound = this.currentModeInstance.start(true); // true = Selección determinista diaria que rota cada día
      this.renderGuessRound(firstRound);

    } else if (modeName === "contrarreloj") {
      this.dom.stageModeBadge.textContent = "Contrarreloj 60s";
      this.dom.timeBarWrap.style.display = "flex";
      this.dom.stageComboPill.style.display = "none";
      this.dom.timeText.classList.remove("danger");
      this.dom.progressFill.className = "progress-fill";

      this.currentModeInstance = new TimeAttackMode(
        (results) => this.handleGameOver(results),
        (remaining, total) => this.updateTimeBar(remaining, total)
      );
      const firstQ = this.currentModeInstance.start();
      this.renderTimeAttackQuestion(firstQ);
    }
  }

  // Abrir Sopa de Letras / Buscapalabras de Castillos
  openSopaMode() {
    this.navigateTo("sopa");
    if (!this.sopaInstance) {
      this.sopaInstance = new WordSearchMode(this.dom.sopaMount, () => {
        this.navigateTo("inicio");
      });
    }
    this.sopaInstance.init(storage.getTodayString(), true);
  }

  // Abrir El Ahorcado de la Fortaleza
  openAhorcadoMode() {
    this.navigateTo("ahorcado");
    if (!this.ahorcadoInstance) {
      this.ahorcadoInstance = new HangmanMode(this.dom.ahorcadoMount, () => {
        this.navigateTo("inicio");
      });
    }
    this.ahorcadoInstance.init(storage.getTodayString(), true);
  }

  updateTimeBar(remaining, total) {
    const pct = Math.max(0, (remaining / total) * 100);
    this.dom.progressFill.style.width = `${pct}%`;
    this.dom.timeText.textContent = `${remaining}s`;

    if (remaining <= 10) {
      this.dom.timeText.classList.add("danger");
      this.dom.progressFill.className = "progress-fill danger";
    } else if (remaining <= 25) {
      this.dom.progressFill.className = "progress-fill warning";
    }
  }

  formatRichText(text) {
    if (!text) return "";
    let str = String(text);
    // Convertir **texto** a negrita HTML
    str = str.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    // Convertir *texto* a negrita HTML (en vez de asteriscos, siempre negrita)
    str = str.replace(/\*([^*]+)\*/g, "<strong>$1</strong>");
    return str;
  }

  renderQuestion(question, index, total, score) {
    this.dom.stageCounterText.textContent = `Pregunta ${index + 1} de ${total}`;
    this.dom.stageScoreText.textContent = `${score} pts`;
    this.dom.gamePrompt.innerHTML = this.formatRichText(question.enunciado);

    // Imagen
    if (question.imagen) {
      this.dom.gameImgBox.style.display = "block";
      this.dom.gameImg.src = question.imagen;
      this.dom.gameImg.alt = question.enunciado;
      this.dom.gameImgCredit.textContent = question.fuente || "Archivo Fotográfico AEAC";

      // Fallback seguro anti-bloqueo y anti-caja negra
      this.dom.gameImg.onerror = () => {
        this.dom.gameImg.onerror = () => {
          this.dom.gameImgBox.style.display = "none";
        };
        const c = CASTILLOS.find(cast => cast.id === question.castilloId);
        if (c && c.imagenFallback && this.dom.gameImg.src !== c.imagenFallback) {
          this.dom.gameImg.src = c.imagenFallback;
        } else {
          this.dom.gameImgBox.style.display = "none";
        }
      };
    } else {
      this.dom.gameImgBox.style.display = "none";
    }

    // Opciones
    this.renderOptions(question.opciones, (optionIndex) => {
      const answerResult = this.currentModeInstance.answer(optionIndex);
      this.handleAnswerResult(answerResult, answerResult.isLast);
    });

    this.feedbackSheetActive(false);
  }

  renderGuessRound(roundData) {
    this.dom.stageCounterText.textContent = `Castillo ${roundData.round} de ${roundData.totalRounds}`;
    this.dom.stageScoreText.textContent = `${this.currentModeInstance.puntos} pts`;
    this.dom.gamePrompt.textContent = "¿Qué castillo o fortaleza española es la que se muestra en la fotografía?";

    this.dom.gameImgBox.style.display = "block";
    this.dom.gameImg.src = roundData.castle.imagen;
    this.dom.gameImg.alt = "Castillo misterioso";
    this.dom.gameImgCredit.textContent = roundData.castle.creditos || "Fotografía de archivo";

    this.dom.gameImg.onerror = () => {
      this.dom.gameImg.onerror = () => {
        this.dom.gameImgBox.style.display = "none";
      };
      if (roundData.castle.imagenFallback && this.dom.gameImg.src !== roundData.castle.imagenFallback) {
        this.dom.gameImg.src = roundData.castle.imagenFallback;
      } else {
        this.dom.gameImgBox.style.display = "none";
      }
    };

    this.renderOptions(roundData.options, (optionIndex) => {
      const answerResult = this.currentModeInstance.answer(optionIndex);
      const explanation = `Se trata del <strong>${answerResult.castle.nombre}</strong> (${answerResult.castle.municipio}, ${answerResult.castle.provincia}). ${answerResult.castle.descripcion}<br><br><strong>Dato histórico:</strong> ${answerResult.castle.curiosidad}`;
      answerResult.explanation = explanation;
      answerResult.source = answerResult.castle.creditos;
      this.handleAnswerResult(answerResult, answerResult.isLast);
    });

    this.feedbackSheetActive(false);
  }

  renderTimeAttackQuestion(qData) {
    if (!qData) return;
    this.dom.stageCounterText.textContent = `Respondidas: ${this.currentModeInstance.totalRespondidas}`;
    this.dom.stageScoreText.textContent = `${qData.puntos} pts`;
    this.dom.gamePrompt.innerHTML = this.formatRichText(qData.question.enunciado);

    // Racha combo
    if (qData.streak >= 2) {
      this.dom.stageComboPill.style.display = "inline-flex";
      this.dom.stageComboVal.textContent = `x${qData.streak >= 5 ? "1.5" : qData.streak >= 3 ? "1.25" : "1.1"} (${qData.streak} seguidas)`;
    } else {
      this.dom.stageComboPill.style.display = "none";
    }

    if (qData.question.imagen) {
      this.dom.gameImgBox.style.display = "block";
      this.dom.gameImg.src = qData.question.imagen;
      this.dom.gameImg.alt = qData.question.enunciado;
      this.dom.gameImgCredit.textContent = qData.question.fuente || "Archivo Fotográfico AEAC";
      this.dom.gameImg.onerror = () => {
        this.dom.gameImgBox.style.display = "none";
      };
    } else {
      this.dom.gameImgBox.style.display = "none";
    }

    this.renderOptions(qData.question.opciones, (optionIndex) => {
      const res = this.currentModeInstance.answer(optionIndex);
      if (!res) return;

      // En contrarreloj, avanzar instantáneamente sin detenerse a leer la ficha larga
      this.flashOptionImmediate(optionIndex, res.isCorrect, res.correctIndex);
      setTimeout(() => {
        if (this.currentModeInstance && this.currentModeInstance.remainingTime > 0) {
          const nextQ = this.currentModeInstance.nextQuestion();
          if (nextQ) this.renderTimeAttackQuestion(nextQ);
        }
      }, 320);
    });
  }

  renderOptions(optionsArray, onSelectCallback) {
    this.dom.optionsContainer.innerHTML = "";
    const letters = ["A", "B", "C", "D"];

    optionsArray.forEach((text, idx) => {
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.setAttribute("type", "button");
      btn.innerHTML = `
        <div class="option-content-wrap">
          <span class="option-letter-badge">${letters[idx]}</span>
          <span class="option-text">${this.formatRichText(text)}</span>
        </div>
        <span class="option-key-hint">Tecla ${idx + 1}</span>
      `;
      btn.addEventListener("click", () => {
        onSelectCallback(idx);
      });
      this.dom.optionsContainer.appendChild(btn);
    });
  }

  flashOptionImmediate(selectedIndex, isCorrect, correctIndex) {
    const buttons = this.dom.optionsContainer.querySelectorAll(".option-btn");
    buttons.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === selectedIndex) {
        btn.classList.add(isCorrect ? "correct" : "wrong");
      }
      if (!isCorrect && idx === correctIndex) {
        btn.classList.add("correct");
      }
    });
  }

  handleAnswerResult(res, isLast) {
    if (!res) return;

    // Resaltar botones
    const buttons = this.dom.optionsContainer.querySelectorAll(".option-btn");
    buttons.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === res.selectedIndex) {
        btn.classList.add(res.isCorrect ? "correct" : "wrong");
      }
      if (!res.isCorrect && idx === res.correctIndex) {
        btn.classList.add("correct");
      }
    });

    // Actualizar puntuación en cabecera
    this.dom.stageScoreText.textContent = `${res.currentPoints} pts`;

    // Rellenar ficha didáctica
    if (res.isCorrect) {
      fx.burstConfetti(window.innerWidth / 2, window.innerHeight * 0.45, 25);
    }
    this.dom.feedbackStatus.textContent = res.isCorrect ? "¡Respuesta Correcta!" : "Respuesta Incorrecta";
    this.dom.feedbackStatus.className = `feedback-status ${res.isCorrect ? "correct" : "wrong"}`;
    this.dom.feedbackPoints.textContent = res.isCorrect ? `+${res.pointsGained} pts` : "+0 pts";
    this.dom.feedbackText.innerHTML = this.formatRichText(res.explanation);
    this.dom.feedbackSource.innerHTML = this.formatRichText(res.source ? `Referencia: ${res.source}` : "Fuente: Documentación AEAC");
    this.dom.btnNextQuestion.textContent = isLast ? "Ver Resultados Finales 🏆" : "Siguiente Desafío →";

    this.feedbackSheetActive(true);
  }

  feedbackSheetActive(active) {
    if (active) {
      this.dom.feedbackSheet.classList.add("active");
      this.dom.btnNextQuestion.focus();
    } else {
      this.dom.feedbackSheet.classList.remove("active");
    }
  }

  handleNextQuestion() {
    this.feedbackSheetActive(false);

    if (this.activeModeName === "diario") {
      const nextQ = this.currentModeInstance.next();
      if (nextQ) {
        this.renderQuestion(nextQ.question, nextQ.index, nextQ.total, this.currentModeInstance.puntos);
      }
    } else if (this.activeModeName === "adivina") {
      const nextRound = this.currentModeInstance.nextRound();
      if (nextRound) {
        this.renderGuessRound(nextRound);
      }
    }
  }

  // Fin de partida y pantalla de resultados
  async handleGameOver(results) {
    sound.playFanfare();
    fx.burstConfetti(window.innerWidth / 2, window.innerHeight * 0.35, 60);
    this.updateHeaderUI();

    // Comprobar nuevas insignias
    const nuevasInsignias = gamification.checkBadges(results);
    const stats = gamification.getResumenEstadisticas();

    const shareData = {
      modo: results.modo,
      puntos: results.puntos,
      aciertos: results.aciertos,
      totalPreguntas: results.totalPreguntas,
      rangoNombre: stats.rango.nombre,
      rangoIcono: stats.rango.icono
    };
    this.lastGameResults = shareData;

    // Rellenar pantalla de resultados
    this.dom.resScoreVal.textContent = results.puntos;
    this.dom.resCorrectVal.textContent = `${results.aciertos}/${results.totalPreguntas}`;
    this.dom.resRankIcon.textContent = stats.rango.icono;
    this.dom.resRankName.textContent = stats.rango.nombre;

    // Notificación de insignias
    if (nuevasInsignias.length > 0) {
      this.dom.resBadgesAlert.style.display = "flex";
      this.dom.resBadgesList.innerHTML = nuevasInsignias
        .map(b => `<span style="display:inline-flex; align-items:center; gap:0.3rem;">${b.icono} <strong>${b.nombre}</strong></span>`)
        .join(" • ");
      nuevasInsignias.forEach(b => {
        this.showToast(`¡Insignia desbloqueada: ${b.nombre}!`, b.icono);
      });
    } else {
      this.dom.resBadgesAlert.style.display = "none";
    }

    // Renderizar Canvas HD de la tarjeta
    await share.renderScoreCardCanvas(this.dom.scoreCanvas, shareData);

    this.navigateTo("resultados");
  }

  // Renderizar la Colección de Castillos
  renderCollection() {
    const state = storage.getState();
    const unlockedIds = state.castillosDescubiertos;

    // Actualizar barra de progreso
    if (this.dom.colCountUnlocked) {
      this.dom.colCountUnlocked.textContent = unlockedIds.length;
    }
    if (this.dom.colCountTotal) {
      this.dom.colCountTotal.textContent = CASTILLOS.length;
    }
    if (this.dom.colProgressFill) {
      const pct = Math.round((unlockedIds.length / CASTILLOS.length) * 100);
      this.dom.colProgressFill.style.width = `${pct}%`;
    }

    // Filtrar castillos
    let filtered = CASTILLOS;
    if (this.activeFilter === "descubiertos") {
      filtered = filtered.filter(c => unlockedIds.includes(c.id));
    } else if (this.activeFilter === "bloqueados") {
      filtered = filtered.filter(c => !unlockedIds.includes(c.id));
    }

    if (this.activeRegionFilter !== "todas") {
      filtered = filtered.filter(c => c.comunidad === this.activeRegionFilter);
    }

    this.dom.collectionGrid.innerHTML = "";

    if (filtered.length === 0) {
      this.dom.collectionGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 2.5rem 1rem; color: var(--color-piedra-oscura);">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🔍</div>
          <h4>No hay fortalezas con el filtro seleccionado</h4>
          <p style="font-size: 0.85rem;">Prueba con otros criterios o juega más partidas para desbloquear nuevos castillos.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(castle => {
      const isUnlocked = unlockedIds.includes(castle.id);
      const card = document.createElement("div");
      card.className = `castle-card ${isUnlocked ? "unlocked" : "locked"}`;
      card.setAttribute("role", "button");
      card.setAttribute("tabindex", "0");

      if (isUnlocked) {
        card.innerHTML = `
          <div class="castle-card-thumb-wrap">
            <img src="${castle.imagen}" alt="${castle.nombre}" class="castle-card-thumb" onerror="this.src='${castle.imagenFallback}'">
            <span class="castle-unlocked-badge">✓ Descubierto</span>
          </div>
          <div class="castle-card-body">
            <h4 class="castle-card-title">${castle.nombre}</h4>
            <div class="castle-card-location">📍 ${castle.municipio} (${castle.provincia})</div>
            <div class="castle-card-epoch">🏛️ ${castle.epoca}</div>
          </div>
        `;
        card.addEventListener("click", () => this.openCastleModal(castle, true));
      } else {
        card.innerHTML = `
          <div class="castle-card-thumb-wrap">
            <span>🛡️</span>
          </div>
          <div class="castle-card-body">
            <h4 class="castle-card-title">Fortaleza Misteriosa</h4>
            <div class="castle-card-location">📍 Provincia de ${castle.provincia}</div>
            <div class="castle-lock-hint">Juega para descubrirla</div>
          </div>
        `;
        card.addEventListener("click", () => this.openCastleModal(castle, false));
      }

      this.dom.collectionGrid.appendChild(card);
    });
  }

  openCastleModal(castle, isUnlocked) {
    if (!this.dom.castleModalContent) return;

    if (isUnlocked) {
      this.dom.castleModalContent.innerHTML = `
        <img src="${castle.imagen}" alt="${castle.nombre}" class="castle-modal-img" onerror="this.src='${castle.imagenFallback}'">
        <div style="display:flex; align-items:center; justify-content:space-between; gap:1rem; margin-bottom:0.5rem; flex-wrap:wrap;">
          <h3 style="font-size:1.5rem; margin:0;">${castle.nombre}</h3>
          <span class="mode-badge badge-emerald">✓ Descubierto en el juego</span>
        </div>
        <p style="font-size:0.85rem; color:var(--color-piedra); margin-bottom:1rem;">📍 ${castle.municipio}, ${castle.provincia} (${castle.comunidad})</p>
        
        <div class="castle-modal-meta-grid">
          <div>
            <div class="meta-item-label">Cronología</div>
            <div class="meta-item-value">${castle.epoca}</div>
          </div>
          <div>
            <div class="meta-item-label">Estilo y Tipología</div>
            <div class="meta-item-value">${castle.estilo}</div>
          </div>
        </div>

        <h4 style="font-size:1rem; margin-bottom:0.4rem;">Descripción Histórica y Arquitectónica</h4>
        <p style="font-size:0.92rem; line-height:1.6; color:var(--color-verde-oscuro); margin-bottom:1rem;">${this.formatRichText(castle.descripcion)}</p>

        <div class="curiosity-box">
          <div class="curiosity-title">✨ Peculiaridad Documentada</div>
          <p>${this.formatRichText(castle.curiosidad)}</p>
        </div>

        <div style="font-size:0.75rem; color:var(--color-piedra); margin-bottom:1rem;">
          Fotografía: ${castle.creditos}
        </div>

        <div style="background: var(--color-pergamino-claro); border: 1px solid var(--color-pergamino-borde); border-radius: var(--radius-md); padding: 0.75rem 1rem; margin-bottom: 1.25rem; font-size: 0.82rem; color: var(--color-verde-oscuro); display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; flex-wrap: wrap;">
          <span>🛡️ <em>¿Te apasionan los castillos? Puedes colaborar en su defensa y disfrutar de viajes exclusivos:</em></span>
          <a href="https://www.xn--castillosdeespaa-lub.es/es/content/asociate-como-asociarse-la-aeac" target="_blank" rel="noopener" style="font-weight: 700; color: var(--color-dorado-oscuro); text-decoration: underline;">
            Conoce cómo asociarte a la AEAC ↗
          </a>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; gap:1rem; flex-wrap:wrap;">
          <a href="${castle.aeacUrl}" target="_blank" rel="noopener" class="btn btn-secondary" style="font-size:0.85rem; min-height:42px; padding:0.4rem 1rem;">
            Ver en Castillos de España (AEAC) ↗
          </a>
          <button class="btn btn-outline modal-close-action" style="font-size:0.85rem; min-height:42px; padding:0.4rem 1rem;">Cerrar Ficha</button>
        </div>
      `;
    } else {
      this.dom.castleModalContent.innerHTML = `
        <div style="text-align:center; padding:2rem 1rem;">
          <div style="font-size:4rem; margin-bottom:1rem;">🏰❓</div>
          <h3 style="font-size:1.5rem; margin-bottom:0.5rem;">Fortaleza aún por descubrir</h3>
          <p style="font-size:0.95rem; color:var(--color-piedra-oscura); max-width:440px; margin:0 auto 1.5rem auto;">
            Esta impresionante fortificación se sitúa en la provincia de <strong>${castle.provincia}</strong> (${castle.comunidad}).
            Pon a prueba tus conocimientos en el <strong>Reto del Día</strong> o <strong>Adivina el Castillo</strong> para desvelar su fotografía e historia completa.
          </p>
          <div style="display:flex; justify-content:center; gap:1rem;">
            <button class="btn btn-primary" data-action="quick-play" style="min-height:44px;">Jugar Ahora para Desbloquear</button>
            <button class="btn btn-outline modal-close-action" style="min-height:44px;">Volver</button>
          </div>
        </div>
      `;
      const quickBtn = this.dom.castleModalContent.querySelector("[data-action='quick-play']");
      if (quickBtn) {
        quickBtn.addEventListener("click", () => {
          this.closeModals();
          this.startMode("adivina");
        });
      }
    }

    const closeBtn = this.dom.castleModalContent.querySelector(".modal-close-action");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => this.closeModals());
    }

    this.dom.castleModal.classList.add("active");
  }

  closeModals() {
    document.querySelectorAll(".modal-overlay").forEach(m => m.classList.remove("active"));
  }

  // Renderizar la pantalla de Perfil, Estadísticas e Insignias
  renderProfile() {
    const stats = gamification.getResumenEstadisticas();

    if (this.dom.profileTotalPoints) this.dom.profileTotalPoints.textContent = stats.puntosTotales;
    if (this.dom.profileRankName) this.dom.profileRankName.textContent = stats.rango.nombre;
    if (this.dom.profileRankIcon) this.dom.profileRankIcon.textContent = stats.rango.icono;
    if (this.dom.profileRankProgressFill) this.dom.profileRankProgressFill.style.width = `${stats.progreso.porcentaje}%`;
    if (this.dom.profileRankNextText) {
      this.dom.profileRankNextText.textContent = stats.progreso.siguiente
        ? `Faltan ${stats.progreso.puntosFaltantes} puntos para "${stats.progreso.siguiente.nombre}"`
        : "¡Has alcanzado el rango máximo de Embajador!";
    }
    if (this.dom.profileGamesPlayed) this.dom.profileGamesPlayed.textContent = stats.partidasJugadas;
    if (this.dom.profileAccuracyRate) this.dom.profileAccuracyRate.textContent = `${stats.tasaAcierto}%`;
    if (this.dom.profileStreakCurrent) this.dom.profileStreakCurrent.textContent = `${stats.streakActual} días`;
    if (this.dom.profileStreakMax) this.dom.profileStreakMax.textContent = `${stats.streakMaxima} días`;

    // Renderizar Insignias
    if (this.dom.profileBadgesGrid) {
      this.dom.profileBadgesGrid.innerHTML = "";
      INSIGNIAS.forEach(badge => {
        const isUnlocked = storage.isBadgeUnlocked(badge.id);
        const el = document.createElement("div");
        el.className = `score-box ${isUnlocked ? "unlocked" : "locked"}`;
        el.style.opacity = isUnlocked ? "1" : "0.5";
        el.style.border = isUnlocked ? "1px solid var(--color-dorado)" : "1px dashed var(--color-pergamino-borde)";
        el.innerHTML = `
          <div style="font-size:2rem; margin-bottom:0.35rem;">${badge.icono}</div>
          <div style="font-weight:700; font-size:0.92rem; color:var(--color-verde-oscuro);">${badge.nombre}</div>
          <div style="font-size:0.75rem; color:var(--color-piedra-oscura); margin-top:0.25rem;">${badge.requisito}</div>
          <div style="margin-top:0.5rem; font-size:0.7rem; font-weight:700; color:${isUnlocked ? "var(--color-acierto)" : "var(--color-piedra)"};">
            ${isUnlocked ? "✓ CONSEGUIDA" : "BLOQUEADA"}
          </div>
        `;
        this.dom.profileBadgesGrid.appendChild(el);
      });
    }

    // Historial de Partidas
    if (this.dom.profileHistoryList) {
      this.dom.profileHistoryList.innerHTML = "";
      if (stats.historial.length === 0) {
        this.dom.profileHistoryList.innerHTML = `
          <li style="padding:1rem; text-align:center; color:var(--color-piedra); font-style:italic;">
            Aún no has jugado ninguna partida. ¡Elige un modo y ponte a prueba!
          </li>
        `;
      } else {
        stats.historial.forEach(h => {
          const date = new Date(h.fecha).toLocaleDateString("es-ES", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
          const modoTitle = h.modo === "diario" ? "Reto del Día" : h.modo === "contrarreloj" ? "Contrarreloj" : "Adivina";
          const li = document.createElement("li");
          li.style.cssText = "display:flex; justify-content:space-between; align-items:center; padding:0.75rem 1rem; border-bottom:1px solid var(--color-pergamino-borde); font-size:0.88rem;";
          li.innerHTML = `
            <div>
              <strong>${modoTitle}</strong> <span style="font-size:0.75rem; color:var(--color-piedra); margin-left:0.5rem;">${date}</span>
              <div style="font-size:0.8rem; color:var(--color-piedra-oscura);">Aciertos: ${h.aciertos}/${h.totalPreguntas}</div>
            </div>
            <div style="font-weight:800; font-family:var(--font-serif); font-size:1.1rem; color:var(--color-dorado-oscuro);">
              +${h.puntos} pts
            </div>
          `;
          this.dom.profileHistoryList.appendChild(li);
        });
      }
    }
  }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  const app = new CastillosApp();
  app.init();
  window.retoApp = app;
});
