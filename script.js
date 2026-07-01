/* ==========================================
   PCP COMMUNITY 2.0
========================================== */

// ---------- GOOGLE SHEETS ----------

const URL_RANKING =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vShb4DKAUEbkv1-6pi52xScA7MBtA0T5K78A2uwVGj0o5d70u2guNiE3VGpC2CZ5nnkmKgo-vcYairQ/pub?gid=1843627779&single=true&output=csv";

const URL_FAMA =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vShb4DKAUEbkv1-6pi52xScA7MBtA0T5K78A2uwVGj0o5d70u2guNiE3VGpC2CZ5nnkmKgo-vcYairQ/pub?gid=1002334291&single=true&output=csv";

// ---------- VARIABLES ----------

let jugadores = [];
let salonFama = [];
let rankingAnterior = [];

/* ==========================================
   CARGAR RANKING
========================================== */

async function cargarRanking() {

    const respuesta = await fetch(URL_RANKING);
    const texto = await respuesta.text();

    const filas = texto.trim().split("\n").slice(1);

    jugadores = filas.map(fila => {

        const datos = fila.split(/,|;/);

        return {
            jugador: datos[0]?.trim() || "",
            puntos: Number(datos[1]) || 0
        };

    }).filter(j => j.jugador !== "")
      .sort((a, b) => b.puntos - a.puntos);

    mostrarRanking();
    actualizarTop3();
    actualizarEstadisticas();
}

/* ==========================================
   CARGAR SALÓN DE LA FAMA
========================================== */

async function cargarSalonFama() {

    const respuesta = await fetch(URL_FAMA);
    const texto = await respuesta.text();

    const filas = texto.trim().split("\n").slice(1);

    salonFama = filas.map(fila => {

        const datos = fila.split(/,|;/);

        return {
            temporada: datos[0]?.trim() || "",
            campeon: datos[1]?.trim() || "",
            puntos: datos[2]?.trim() || ""
        };

    }).filter(f => f.temporada !== "");

    mostrarSalonFama();
}

/* ==========================================
   MOSTRAR SALÓN DE LA FAMA
========================================== */

function mostrarSalonFama() {

    const contenedor = document.getElementById("salonFama");

    if (!contenedor) return;

    contenedor.innerHTML = "";

    salonFama.forEach(registro => {

        contenedor.innerHTML += `
            <div class="fama-card">
                <h3>🏆 ${registro.temporada}</h3>
                <p><strong>Campeón:</strong> ${registro.campeon}</p>
                <p><strong>Puntos:</strong> ${registro.puntos}</p>
            </div>
        `;
    });
}

/* ==========================================
   MOSTRAR RANKING
========================================== */

function mostrarRanking() {

    const tabla = document.getElementById("tablaRanking");

    if (!tabla) return;

    tabla.innerHTML = "";

    jugadores.forEach((jugador, index) => {

        let cambio = "➖";

        const anterior = rankingAnterior.findIndex(
            j => j.jugador === jugador.jugador
        );

        if (anterior !== -1) {

            if (anterior > index) {
                cambio = "📈";
            } else if (anterior < index) {
                cambio = "📉";
            }

        }

        const clase =
            index === 0 ? "fila-oro" :
            index === 1 ? "fila-plata" :
            index === 2 ? "fila-bronce" :
            "";

        tabla.innerHTML += `
        <tr class="${clase}">
            <td>
                ${
                    index === 0 ? "🥇" :
                    index === 1 ? "🥈" :
                    index === 2 ? "🥉" :
                    index + 1
                }
                ${cambio}
            </td>
            <td>${jugador.jugador}</td>
            <td>${jugador.puntos}</td>
        </tr>
        `;
    });

    // guardar estado actual
    rankingAnterior = [...jugadores];
}

/* ==========================================
   TOP 3
========================================== */

function actualizarTop3() {

    if (jugadores.length < 3) return;

    document.getElementById("primeroNombre").textContent = jugadores[0].jugador;
    document.getElementById("primeroPuntos").textContent = jugadores[0].puntos + " pts";

    document.getElementById("segundoNombre").textContent = jugadores[1].jugador;
    document.getElementById("segundoPuntos").textContent = jugadores[1].puntos + " pts";

    document.getElementById("terceroNombre").textContent = jugadores[2].jugador;
    document.getElementById("terceroPuntos").textContent = jugadores[2].puntos + " pts";
}

/* ==========================================
   ESTADÍSTICAS
========================================== */

function actualizarEstadisticas() {

    document.getElementById("totalJugadores").textContent = jugadores.length;

    document.getElementById("liderActual").textContent =
        jugadores.length ? jugadores[0].jugador : "-";

    const total = jugadores.reduce((a, b) => a + b.puntos, 0);

    document.getElementById("totalPuntos").textContent = total;

    const promedio = jugadores.length ? (total / jugadores.length).toFixed(1) : 0;

    document.getElementById("promedioPuntos").textContent = promedio;
}

/* ==========================================
   BUSCADOR
========================================== */

const buscador = document.getElementById("buscarJugador");

if (buscador) {

    buscador.addEventListener("input", function () {

        const texto = this.value.toLowerCase();

        const filas = document.querySelectorAll("#tablaRanking tr");

        filas.forEach(fila => {

            const jugador = fila.children[1].textContent.toLowerCase();

            fila.style.display = jugador.includes(texto) ? "" : "none";
        });
    });
}

/* ==========================================
   INICIAR
========================================== */

async function iniciar() {

    await cargarRanking();
    await cargarSalonFama();

    const ahora = new Date();

    document.getElementById("ultimaActualizacion").textContent =
    "Última actualización: " + ahora.toLocaleString();

    // 🎵 MÚSICA
    const musica = document.getElementById("bgMusic");

    if (musica) {
        musica.volume = 0.3;
        musica.play().catch(() => {});
    }
}

/* ==========================================
   AUTO UPDATE
========================================== */

iniciar();

setInterval(iniciar, 10000);

/* ==========================================
   🎵 MÚSICA DE FONDO
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    const botonMusica = document.getElementById("btnMusica");
    const musica = document.getElementById("bgMusic");

    if (!botonMusica || !musica) return;

    botonMusica.addEventListener("click", () => {

        if (musica.paused) {

            musica.volume = 0.3;
            musica.play();

            botonMusica.textContent = "⏸ Pausar música";

        } else {

            musica.pause();

            botonMusica.textContent = "▶ Reanudar música";

        }

    });

});