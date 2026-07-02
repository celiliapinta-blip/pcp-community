/* ==========================================
   PCP COMMUNITY 2.0
========================================== */

// ---------- GOOGLE SHEETS ----------

const URL_RANKING =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vShb4DKAUEbkv1-6pi52xScA7MBtA0T5K78A2uwVGj0o5d70u2guNiE3VGpC2CZ5nnkmKgo-vcYairQ/pub?gid=1843627779&single=true&output=csv";

const URL_FAMA =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vShb4DKAUEbkv1-6pi52xScA7MBtA0T5K78A2uwVGj0o5d70u2guNiE3VGpC2CZ5nnkmKgo-vcYairQ/pub?gid=1002334291&single=true&output=csv";

const URL_HISTORIAL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vShb4DKAUEbkv1-6pi52xScA7MBtA0T5K78A2uwVGj0o5d70u2guNiE3VGpC2CZ5nnkmKgo-vcYairQ/pub?gid=1616382426&single=true&output=csv";

// ---------- VARIABLES ----------

let jugadores = [];
let salonFama = [];
let historial = [];
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
            equipo: datos[2]?.trim() || ""
        };

    }).filter(f => f.temporada !== "");

    mostrarSalonFama();

}

/* ==========================================
   CARGAR HISTORIAL
========================================== */

async function cargarHistorial() {

    const respuesta = await fetch(URL_HISTORIAL);
    const texto = await respuesta.text();

    const filas = texto.trim().split("\n").slice(1);

    historial = filas.map(fila => {

        const datos = fila.split(/,|;/);

        return {
            temporada: datos[0]?.trim() || "",
            campeon: datos[1]?.trim() || "",
            pais: datos[2]?.trim() || ""
        };

    }).filter(h => h.temporada !== "");

    mostrarHistorial();

}

/* ==========================================
   MOSTRAR RANKING
========================================== */

function mostrarRanking() {

    const tabla = document.getElementById("tablaRanking");

    if (!tabla) return;

    tabla.innerHTML = "";

    jugadores.forEach((jugador, index) => {

        tabla.innerHTML += `
        <tr>
            <td>${index + 1}</td>
            <td>${jugador.jugador}</td>
            <td>${jugador.puntos}</td>
        </tr>
        `;

    });

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
            <p><strong>Equipo:</strong> ${registro.equipo}</p>
        </div>
        `;

    });

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

    document.getElementById("promedioPuntos").textContent =
        jugadores.length ? (total / jugadores.length).toFixed(1) : 0;

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

}

/* ==========================================
   INICIAR AUTOMÁTICAMENTE
========================================== */

iniciar();

// Actualizar cada 10 segundos
setInterval(iniciar, 10000);

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

document.addEventListener("DOMContentLoaded", () => {

    const boton = document.getElementById("btnMusica");
    const musica = document.getElementById("bgMusic");

    if (!boton || !musica) return;

    boton.addEventListener("click", () => {

        if (musica.paused) {

            musica.volume = 0.3;
            musica.play();

            boton.textContent = "⏸ Pausar música";

        } else {

            musica.pause();

            boton.textContent = "▶ Música";

        }

    });

});

