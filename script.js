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
