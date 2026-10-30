/**
 * RETO CASTILLOS DE ESPAÑA
 * Motor de viralidad, compartición y generación de tarjetas gráficas sociales en Canvas.
 * Web Share API, WhatsApp encode y descarga de tarjetas en alta resolución.
 */

export class ShareService {
  constructor() {
    this.baseUrl = window.location.origin + window.location.pathname;
  }

  getShareText({ modo, puntos, aciertos, totalPreguntas, rangoNombre }) {
    const modoTexto = modo === "diario" ? "el Reto del Día" : modo === "contrarreloj" ? "el Desafío Contrarreloj" : "Adivina el Castillo";
    return `🏰 He conseguido ${puntos} puntos en RETO CASTILLOS DE ESPAÑA (${aciertos}/${totalPreguntas} aciertos en ${modoTexto}) alcanzando el rango de "${rangoNombre}".\n\n¿Puedes superarme? Juega gratis y pon a prueba cuánto sabes sobre nuestro patrimonio fortificado:`;
  }

  getWhatsAppUrl(shareData) {
    const text = this.getShareText(shareData) + " " + this.baseUrl;
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  }

  async shareNative(shareData) {
    const text = this.getShareText(shareData);
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Reto Castillos de España",
          text: text,
          url: this.baseUrl
        });
        return { success: true, method: "native" };
      } catch (err) {
        if (err.name !== "AbortError") {
          console.warn("Fallo en Web Share API, recurriendo a portapapeles:", err);
        }
      }
    }
    // Fallback a portapapeles
    return this.copyToClipboard(text + " " + this.baseUrl);
  }

  async copyToClipboard(text) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return { success: true, method: "clipboard" };
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        return { success: true, method: "clipboard" };
      }
    } catch (err) {
      console.error("Error al copiar texto:", err);
      return { success: false, method: "none" };
    }
  }

  // Genera en un <canvas> de alta definición (1200x630 píxeles) una tarjeta gráfica lista para descargar o compartir
  async renderScoreCardCanvas(canvas, { modo, puntos, aciertos, totalPreguntas, rangoNombre, rangoIcono }) {
    const ctx = canvas.getContext("2d");
    const width = 1200;
    const height = 630;
    canvas.width = width;
    canvas.height = height;

    // 1. Fondo degradado verde noble heráldico (#202B26 a #141c19)
    const bgGradient = ctx.createLinearGradient(0, 0, width, height);
    bgGradient.addColorStop(0, "#202B26");
    bgGradient.addColorStop(1, "#121A16");
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // 2. Marco exterior dorado heráldico con filigrana
    ctx.lineWidth = 6;
    ctx.strokeStyle = "#C6A15B";
    ctx.strokeRect(24, 24, width - 48, height - 48);

    ctx.lineWidth = 1.5;
    ctx.strokeStyle = "rgba(198, 161, 91, 0.4)";
    ctx.strokeRect(36, 36, width - 72, height - 72);

    // Esquinas ornamentales
    const corners = [
      [36, 36],
      [width - 36, 36],
      [36, height - 36],
      [width - 36, height - 36]
    ];
    ctx.fillStyle = "#C6A15B";
    corners.forEach(([cx, cy]) => {
      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, Math.PI * 2);
      ctx.fill();
    });

    // 3. Marca superior: Vinculado a la Asociación Española de Amigos de los Castillos
    ctx.fillStyle = "#F3E8D3";
    ctx.font = "600 18px 'Plus Jakarta Sans', system-ui, sans-serif";
    ctx.letterSpacing = "2px";
    ctx.textAlign = "center";
    ctx.fillText("ASOCIACIÓN ESPAÑOLA DE AMIGOS DE LOS CASTILLOS", width / 2, 85);

    // Línea separadora dorada sutil
    ctx.beginPath();
    ctx.moveTo(width / 2 - 200, 105);
    ctx.lineTo(width / 2 + 200, 105);
    ctx.strokeStyle = "rgba(198, 161, 91, 0.6)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // 4. Título Principal
    ctx.fillStyle = "#FAF7F0";
    ctx.font = "bold 56px 'Cinzel', Georgia, serif";
    ctx.letterSpacing = "1px";
    ctx.fillText("RETO CASTILLOS DE ESPAÑA", width / 2, 175);

    // Subtítulo del modo
    const modoEtiqueta = modo === "diario" ? "• RETO DEL DÍA •" : modo === "contrarreloj" ? "• DESAFÍO CONTRARRELOJ 60s •" : "• ADIVINA EL CASTILLO •";
    ctx.fillStyle = "#C6A15B";
    ctx.font = "bold 22px 'Plus Jakarta Sans', system-ui, sans-serif";
    ctx.letterSpacing = "3px";
    ctx.fillText(modoEtiqueta, width / 2, 220);

    // 5. Contenedor central tipo Pergamino (#FAF7F0 con sombra)
    const cardX = 140;
    const cardY = 250;
    const cardW = width - 280;
    const cardH = 250;

    ctx.save();
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = 25;
    ctx.shadowOffsetY = 10;
    ctx.fillStyle = "#F8F4EA";
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, 16);
    ctx.fill();
    ctx.restore();

    // Borde pergamino
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#D8C7A3";
    ctx.stroke();

    // Cajas de estadísticas dentro del pergamino
    // Columna 1: Puntuación
    ctx.textAlign = "center";
    ctx.fillStyle = "#77756D";
    ctx.font = "bold 16px 'Plus Jakarta Sans', system-ui, sans-serif";
    ctx.letterSpacing = "2px";
    ctx.fillText("PUNTUACIÓN", cardX + 160, cardY + 70);

    ctx.fillStyle = "#202B26";
    ctx.font = "bold 68px 'Cinzel', Georgia, serif";
    ctx.fillText(`${puntos}`, cardX + 160, cardY + 145);

    ctx.fillStyle = "#C6A15B";
    ctx.font = "bold 18px 'Plus Jakarta Sans', system-ui, sans-serif";
    ctx.fillText("PUNTOS", cardX + 160, cardY + 185);

    // Divisor vertical 1
    ctx.beginPath();
    ctx.moveTo(cardX + 310, cardY + 40);
    ctx.lineTo(cardX + 310, cardY + 210);
    ctx.strokeStyle = "rgba(198, 161, 91, 0.35)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Columna 2: Aciertos
    ctx.fillStyle = "#77756D";
    ctx.font = "bold 16px 'Plus Jakarta Sans', system-ui, sans-serif";
    ctx.letterSpacing = "2px";
    ctx.fillText("RESPUESTAS", cardX + 460, cardY + 70);

    ctx.fillStyle = "#202B26";
    ctx.font = "bold 68px 'Cinzel', Georgia, serif";
    ctx.fillText(`${aciertos}/${totalPreguntas}`, cardX + 460, cardY + 145);

    ctx.fillStyle = "#2E7D32";
    ctx.font = "bold 18px 'Plus Jakarta Sans', system-ui, sans-serif";
    ctx.fillText("CORRECTAS", cardX + 460, cardY + 185);

    // Divisor vertical 2
    ctx.beginPath();
    ctx.moveTo(cardX + 610, cardY + 40);
    ctx.lineTo(cardX + 610, cardY + 210);
    ctx.strokeStyle = "rgba(198, 161, 91, 0.35)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Columna 3: Rango
    ctx.fillStyle = "#77756D";
    ctx.font = "bold 16px 'Plus Jakarta Sans', system-ui, sans-serif";
    ctx.letterSpacing = "2px";
    ctx.fillText("RANGO ALCANZADO", cardX + 760, cardY + 70);

    ctx.font = "40px system-ui";
    ctx.fillText(rangoIcono || "🛡️", cardX + 760, cardY + 125);

    ctx.fillStyle = "#202B26";
    ctx.font = "bold 20px 'Cinzel', Georgia, serif";
    ctx.fillText(rangoNombre, cardX + 760, cardY + 175);

    // 6. Pie de la tarjeta: Invitación viral
    ctx.fillStyle = "#F3E8D3";
    ctx.font = "italic 22px 'Plus Jakarta Sans', Georgia, serif";
    ctx.fillText("¿Puedes superar mi resultado? Juega gratis en www.castillosdeespaña.es", width / 2, 545);

    ctx.fillStyle = "rgba(198, 161, 91, 0.8)";
    ctx.font = "600 15px 'Plus Jakarta Sans', system-ui, sans-serif";
    ctx.letterSpacing = "1px";
    ctx.fillText("Salvaguardando nuestro patrimonio histórico fortificado desde 1952", width / 2, 578);

    return canvas;
  }

  // Descargar la tarjeta generada en el canvas como archivo PNG
  downloadCardPng(canvas, filename = "reto-castillos-resultado.png") {
    try {
      const link = document.createElement("a");
      link.download = filename;
      link.href = canvas.toDataURL("image/png");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return true;
    } catch (err) {
      console.error("Error al descargar tarjeta PNG:", err);
      return false;
    }
  }
}

export const share = new ShareService();
export default share;
