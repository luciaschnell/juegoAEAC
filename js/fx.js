/**
 * RETO CASTILLOS DE ESPAÑA
 * Motor de Efectos Visuales e Interactividad Neón Arcade
 * Bordes luminosos reactivos al ratón, estela de chispas neón, 3D Tilt y confeti.
 */

class InteractiveFX {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.confetti = [];
    this.mouseX = -1000;
    this.mouseY = -1000;
    this.lastSpawn = 0;
    this.isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Colores neón heráldicos y arcade
    this.neonPalette = [
      "#ffd166", // Oro brillante
      "#ffb703", // Ámbar dorado
      "#00f5d4", // Cian mágico
      "#ff5400", // Fuego heráldico
      "#ffffff", // Blanco centelleante
      "#e0aaff"  // Púrpura real
    ];

    if (!this.isReducedMotion) {
      this.init();
    }
  }

  init() {
    this.createDomElements();
    this.setupCanvas();
    this.bindMouseEvents();
    this.initCardTiltAndSpotlight();
    this.loop();
  }

  createDomElements() {
    // 1. Barras de neón en los 4 bordes
    const edges = ["left", "right", "top", "bottom"];
    edges.forEach(edge => {
      if (!document.getElementById(`neon-edge-${edge}`)) {
        const bar = document.createElement("div");
        bar.className = "neon-edge-bar";
        bar.id = `neon-edge-${edge}`;
        document.body.appendChild(bar);
      }
    });

    // 2. Aura ambiental de borde
    if (!document.getElementById("neon-ambient-glow")) {
      const glow = document.createElement("div");
      glow.className = "neon-ambient-glow";
      glow.id = "neon-ambient-glow";
      document.body.appendChild(glow);
    }

    // 3. Canvas de partículas de neón
    if (!document.getElementById("neon-fx-canvas")) {
      const canvas = document.createElement("canvas");
      canvas.id = "neon-fx-canvas";
      document.body.appendChild(canvas);
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
    } else {
      this.canvas = document.getElementById("neon-fx-canvas");
      this.ctx = this.canvas.getContext("2d");
    }
  }

  setupCanvas() {
    if (!this.canvas) return;
    const resize = () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });
  }

  bindMouseEvents() {
    const edgeLeft = document.getElementById("neon-edge-left");
    const edgeRight = document.getElementById("neon-edge-right");
    const edgeTop = document.getElementById("neon-edge-top");
    const edgeBottom = document.getElementById("neon-edge-bottom");
    const ambientGlow = document.getElementById("neon-ambient-glow");

    const edgeThreshold = 240; // Distancia en píxeles al borde para iluminarse

    window.addEventListener("pointermove", (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
      const w = window.innerWidth;
      const h = window.innerHeight;

      // --- CÁLCULO DE NEÓN EN LOS 4 BORDES ---
      // 1. Borde Izquierdo
      if (this.mouseX < edgeThreshold) {
        const factor = Math.pow(1 - (this.mouseX / edgeThreshold), 1.5);
        if (edgeLeft) {
          edgeLeft.style.opacity = factor.toFixed(3);
          edgeLeft.style.transform = `translateY(${this.mouseY - 110}px)`;
        }
      } else if (edgeLeft) {
        edgeLeft.style.opacity = "0";
      }

      // 2. Borde Derecho
      const distRight = w - this.mouseX;
      if (distRight < edgeThreshold) {
        const factor = Math.pow(1 - (distRight / edgeThreshold), 1.5);
        if (edgeRight) {
          edgeRight.style.opacity = factor.toFixed(3);
          edgeRight.style.transform = `translateY(${this.mouseY - 110}px)`;
        }
      } else if (edgeRight) {
        edgeRight.style.opacity = "0";
      }

      // 3. Borde Superior
      if (this.mouseY < edgeThreshold) {
        const factor = Math.pow(1 - (this.mouseY / edgeThreshold), 1.5);
        if (edgeTop) {
          edgeTop.style.opacity = factor.toFixed(3);
          edgeTop.style.transform = `translateX(${this.mouseX - 120}px)`;
        }
      } else if (edgeTop) {
        edgeTop.style.opacity = "0";
      }

      // 4. Borde Inferior
      const distBottom = h - this.mouseY;
      if (distBottom < edgeThreshold) {
        const factor = Math.pow(1 - (distBottom / edgeThreshold), 1.5);
        if (edgeBottom) {
          edgeBottom.style.opacity = factor.toFixed(3);
          edgeBottom.style.transform = `translateX(${this.mouseX - 120}px)`;
        }
      } else if (edgeBottom) {
        edgeBottom.style.opacity = "0";
      }

      // Aura ambiental si está muy cerca de cualquier borde
      const isNearEdge = this.mouseX < 120 || distRight < 120 || this.mouseY < 120 || distBottom < 120;
      if (ambientGlow) {
        if (isNearEdge) {
          ambientGlow.classList.add("active");
        } else {
          ambientGlow.classList.remove("active");
        }
      }

      // --- EMISIÓN DE CHISPAS NEÓN CON EL MOVIMIENTO ---
      const now = performance.now();
      if (now - this.lastSpawn > 28) {
        this.lastSpawn = now;
        this.spawnTrailSpark(this.mouseX, this.mouseY);
      }
    }, { passive: true });

    // Onda expansiva y chispas al hacer clic
    window.addEventListener("pointerdown", (e) => {
      this.createClickWave(e.clientX, e.clientY);
      this.spawnClickSparks(e.clientX, e.clientY, 10);
    }, { passive: true });

    // Limpieza al salir de la ventana
    document.addEventListener("mouseleave", () => {
      if (edgeLeft) edgeLeft.style.opacity = "0";
      if (edgeRight) edgeRight.style.opacity = "0";
      if (edgeTop) edgeTop.style.opacity = "0";
      if (edgeBottom) edgeBottom.style.opacity = "0";
      if (ambientGlow) ambientGlow.classList.remove("active");
    });
  }

  spawnTrailSpark(x, y) {
    if (this.particles.length > 80) return; // Límite de seguridad
    const color = this.neonPalette[Math.floor(Math.random() * this.neonPalette.length)];
    this.particles.push({
      x: x + (Math.random() * 8 - 4),
      y: y + (Math.random() * 8 - 4),
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5 - 0.3,
      size: Math.random() * 2.8 + 1.2,
      alpha: 1,
      decay: Math.random() * 0.035 + 0.02,
      color
    });
  }

  spawnClickSparks(x, y, count = 12) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() * 0.4);
      const speed = Math.random() * 4.5 + 2;
      const color = this.neonPalette[Math.floor(Math.random() * this.neonPalette.length)];
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 3.5 + 2,
        alpha: 1,
        decay: Math.random() * 0.03 + 0.02,
        color
      });
    }
  }

  createClickWave(x, y) {
    const wave = document.createElement("div");
    wave.className = "neon-click-wave";
    wave.style.left = `${x}px`;
    wave.style.top = `${y}px`;
    document.body.appendChild(wave);
    setTimeout(() => {
      if (wave && wave.parentNode) wave.parentNode.removeChild(wave);
    }, 600);
  }

  // --- CELEBRACIÓN DE CONFETI Y FUEGOS DE NEÓN ---
  burstConfetti(originX = window.innerWidth / 2, originY = window.innerHeight / 2, count = 40) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 3;
      const color = this.neonPalette[Math.floor(Math.random() * this.neonPalette.length)];
      this.confetti.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3.5, // Impulso vertical
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 15,
        width: Math.random() * 8 + 5,
        height: Math.random() * 4 + 2,
        alpha: 1,
        decay: Math.random() * 0.012 + 0.008,
        gravity: 0.18,
        color
      });
    }
  }

  // --- FOCO DE NEÓN Y EFECTO 3D TILT EN TARJETAS ---
  initCardTiltAndSpotlight() {
    const cardSelectors = [
      ".mode-card",
      ".aeac-invite-card",
      ".question-card",
      ".castle-card",
      ".conversion-box"
    ];

    const applyToCards = () => {
      const cards = document.querySelectorAll(cardSelectors.join(", "));
      cards.forEach(card => {
        if (card.dataset.neonInit) return;
        card.dataset.neonInit = "true";

        card.addEventListener("pointermove", (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          // Variables CSS para el degradado radial neón
          card.style.setProperty("--neon-x", `${x}px`);
          card.style.setProperty("--neon-y", `${y}px`);

          // 3D Tilt suave
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const rotateX = ((y - centerY) / centerY) * -4;
          const rotateY = ((x - centerX) / centerX) * 4;

          card.style.transform = `perspective(850px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.018, 1.018, 1.018)`;
        }, { passive: true });

        card.addEventListener("pointerleave", () => {
          card.style.transform = "";
          card.style.setProperty("--neon-x", "-500px");
          card.style.setProperty("--neon-y", "-500px");
        }, { passive: true });
      });
    };

    applyToCards();
    // Reaplicar cuando se cambie de pantalla o se carguen nuevos elementos
    const observer = new MutationObserver(() => applyToCards());
    observer.observe(document.body, { childList: true, subtree: true });
  }

  loop() {
    if (!this.ctx || !this.canvas) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 1. Renderizar chispas de estela y clics
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = p.alpha;
      this.ctx.fillStyle = p.color;
      this.ctx.shadowBlur = 10;
      this.ctx.shadowColor = p.color;

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }

    // 2. Renderizar confeti de neón
    for (let i = this.confetti.length - 1; i >= 0; i--) {
      const c = this.confetti[i];
      c.x += c.vx;
      c.y += c.vy;
      c.vy += c.gravity;
      c.rotation += c.rotSpeed;
      c.alpha -= c.decay;

      if (c.alpha <= 0 || c.y > window.innerHeight + 50) {
        this.confetti.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = c.alpha;
      this.ctx.translate(c.x, c.y);
      this.ctx.rotate((c.rotation * Math.PI) / 180);
      this.ctx.fillStyle = c.color;
      this.ctx.shadowBlur = 8;
      this.ctx.shadowColor = c.color;

      this.ctx.fillRect(-c.width / 2, -c.height / 2, c.width, c.height);
      this.ctx.restore();
    }

    requestAnimationFrame(this.loop.bind(this));
  }
}

export const fx = new InteractiveFX();
export default fx;
