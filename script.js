/* ===========================
   CONFIGURACIÓN GOOGLE SHEETS
=========================== */

const URL_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS4GqnlC8w4N2kKM2d6m-8Ebb9GdpAU7ij4k0u-h43OIDZ9mzMn_8ivXAt0R6t2Sj0sXbgOdIyTcOsV/pub?gid=84825016&single=true&output=csv";

let jugadores = [];

/* ===========================
   CARGAR DATOS DESDE SHEETS
=========================== */

async function cargarDatos(){

    try{

        const respuesta = await fetch(URL_CSV);
        const texto = await respuesta.text();

        const filas = texto.trim().split("\n").slice(1);

        jugadores = filas.map(fila => {

            const datos = fila.split(/,|;/);

            return {
                jugador: datos[0]?.trim(),
                puntos: Number(datos[1])
            };

        })
        .filter(j => j.jugador && !isNaN(j.puntos))
        .sort((a,b)=>b.puntos - a.puntos);

        cargarRanking();
        actualizarTop3();
        actualizarEstadisticas();

    } catch (error){

        console.error("Error cargando datos:", error);

    }

}

/* ===========================
   RANKING
=========================== */

function cargarRanking(){

    const tabla = document.getElementById("tablaRanking");

    if(!tabla) return;

    tabla.innerHTML = "";

    jugadores.forEach((j, index)=>{

        tabla.innerHTML += `
        <tr>
            <td>${index + 1}</td>
            <td>${j.jugador}</td>
            <td>${j.puntos}</td>
        </tr>
        `;

    });

}

/* ===========================
   TOP 3
=========================== */

function actualizarTop3(){

    const top = document.getElementById("top3");

    if(!top) return;

    top.innerHTML = "";

    jugadores.slice(0,3).forEach((j,i)=>{

        top.innerHTML += `
        <div>
            🏆 ${i+1} ${j.jugador} - ${j.puntos}
        </div>
        `;

    });

}

/* ===========================
   ESTADÍSTICAS
=========================== */

function actualizarEstadisticas(){

    const total = document.getElementById("totalJugadores");
    const lider = document.getElementById("lider");
    const puntos = document.getElementById("totalPuntos");

    if(total) total.innerText = jugadores.length;

    if(lider) lider.innerText = jugadores[0]?.jugador || "-";

    if(puntos){

        let suma = jugadores.reduce((acc,j)=>acc + j.puntos,0);

        puntos.innerText = suma;

    }

}

/* ===========================
   INICIO
=========================== */

cargarDatos();

setInterval(() => {
    cargarDatos();
}, 10000); // cada 10 segundos