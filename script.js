/* ==========================================
   PCP COMMUNITY
   SCRIPT.JS
========================================== */

let jugadores = [];

/* ===========================
   DATOS DE PRUEBA
   (Luego se reemplazan por Google Sheets)
=========================== */

const URL_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS4GqnlC8w4N2kKM2d6m-8Ebb9GdpAU7ij4k0u-h43OIDZ9mzMn_8ivXAt0R6t2Sj0sXbgOdIyTcOsV/pub?gid=84825016&single=true&output=csv";

async function cargarDatos(){

    const respuesta = await fetch(URL_CSV);

    const texto = await respuesta.text();

    const filas = texto.trim().split("\n").slice(1);

    jugadores = filas.map(fila=>{
    const datos = fila.split(",");
    return{
        jugador:datos[0],
        puntos:Number(datos[1])
    };
}).sort((a,b)=>b.puntos - a.puntos);

    });

    cargarRanking();

    actualizarTop3();

    actualizarEstadisticas();

}

cargarDatos();

/* ===========================
   CARGAR RANKING
=========================== */

function cargarRanking(){

    const tabla = document.getElementById("tablaRanking");

    tabla.innerHTML="";

    jugadores.sort((a,b)=>b.puntos-a.puntos);

    jugadores.forEach((j,index)=>{

        tabla.innerHTML += `
            <tr>
                <td>${index+1}</td>
                <td>${j.jugador}</td>
                <td>${j.puntos}</td>
            </tr>
        `;

    });

}

cargarRanking();

/* ===========================
   TOP 3
=========================== */

function actualizarTop3(){

    if(jugadores.length < 3) return;

    document.getElementById("primeroNombre").textContent = jugadores[0].jugador;
    document.getElementById("primeroPuntos").textContent = jugadores[0].puntos + " pts";

    document.getElementById("segundoNombre").textContent = jugadores[1].jugador;
    document.getElementById("segundoPuntos").textContent = jugadores[1].puntos + " pts";

    document.getElementById("terceroNombre").textContent = jugadores[2].jugador;
    document.getElementById("terceroPuntos").textContent = jugadores[2].puntos + " pts";

}

/* ===========================
   ESTADÍSTICAS
=========================== */

function actualizarEstadisticas(){

    const totalJugadores = jugadores.length;

    const totalPuntos = jugadores.reduce((suma,j)=>suma+j.puntos,0);

    const promedio = Math.round(totalPuntos/totalJugadores);

    document.getElementById("totalJugadores").textContent = totalJugadores;

    document.getElementById("liderActual").textContent = jugadores[0].jugador;

    document.getElementById("totalPuntos").textContent = totalPuntos;

    document.getElementById("promedioPuntos").textContent = promedio;

}

/* ===========================
   BÚSQUEDA
=========================== */

document
.getElementById("buscarJugador")
.addEventListener("input",function(){

    const texto=this.value.toLowerCase();

    const filas=document.querySelectorAll("#tablaRanking tr");

    filas.forEach(fila=>{

        const jugador=fila.children[1].textContent.toLowerCase();

        fila.style.display=jugador.includes(texto) ? "" : "none";

    });

});

/* ===========================
   INICIAR
=========================== */

actualización del script
