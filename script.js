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