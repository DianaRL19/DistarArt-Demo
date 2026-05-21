// ______________________________________________________________
// ______________ DISTARART - Gestor de Encargos ________________

// He elegido esta estructura de archivos porque creo que es lo que corresponde con el requisito de "organización modular". 
// Además, vengo de terminar el proyecto de PHP y no sabía ni cómo empezar, así que he medio copiado una estructura "similar" 
// a la del framework de Vicente, pero muchísimo más simple.
// He separado en carpetas los archivos de vistas, ventanas y librerías.


// ______________________________________________________________________
//              Cargamos los datos iniciales
// Importamos los datos directamente desde el archivo de datos iniciales, que tiene los arrays de artistas, 
// encargos y logros. También importamos las clases para convertir esos objetos planos en instancias con métodos.

import { damePaises } from "./librerias/libreriaMetodos.js";
import { Encargo } from "./clases/Encargo.js";
import { Artista } from "./clases/Artista.js";
import { mostrarAutentificacion } from "./vistas/autentificacion.js";
import { mostrarPortfolio } from "./vistas/portfolio.js";
import { mostrarGestion } from "./vistas/gestion.js";
import { mostrarPerfil } from "./vistas/perfil.js";
import { artistas as datosArtistas, encargos as datosEncargos, logros as datosLogros } from "./datos/datosIniciales.js";

// _____________ ESTADO COMPARTIDO _____________
// En lugar de tener variables sueltas por cada archivo, las junto todas aquí en un objeto (primero pensé en un array pero luego 
// caí en que un objeto era más fácil de manejar).
// Así cualquier vista puede importar este objeto "datosGeneralesProyecto" y acceder a los datos actualizados sin
// tener que estar pasándolos como parámetros en las funciones cada dos por tres.

// Convertimos los objetos planos de los arrays en instancias de sus clases para poder usar sus métodos.
export const datosGeneralesProyecto = {
    mainPrincipal: document.getElementById("main-principal"),
    artistas: datosArtistas.map(a =>
        new Artista(a.id, a.nick, a.nombre, a.contrasenia, a.email, a.especialidad, a.imgPerfil, a.descripcion, a.ubicacion, a.redesSociales)
    ),
    encargos: datosEncargos.map(e =>
        new Encargo(e.id, e.nombre, e.descripcion, e.id_cliente, e.id_artista, e.precio, e.fechaEntrega, e.estado, e.fase, e.imagenes, e.nombre_cliente, e.email_cliente, e.direccion_cliente, e.pais_cliente, e.presupuesto_cliente, e.borrado)
    ),
    logros: datosLogros,
    paises: damePaises()
};

// _____________ COMUNICACIÓN CON VENTANA AUXILIAR _____________
// Cuando la ventana auxiliar de encargo guarda un encargo (nuevo o editado), nos avisa con los datos
// para que los actualicemos en el array en memoria y la lista de gestión se refresque sin recargar.

window.notificarEncargoGuardado = function (encargo) {
    let idx = datosGeneralesProyecto.encargos.findIndex(e => e.id == encargo.id);
    let obj = new Encargo(
        encargo.id, encargo.nombre, encargo.descripcion, encargo.id_cliente,
        encargo.id_artista, encargo.precio, encargo.fechaEntrega, encargo.estado,
        encargo.fase, encargo.imagenes, encargo.nombre_cliente, encargo.email_cliente,
        encargo.direccion_cliente, encargo.pais_cliente, encargo.presupuesto_cliente, encargo.borrado || false
    );

    if (idx >= 0) {
        datosGeneralesProyecto.encargos[idx] = obj; // → Actualizamos el encargo existente
    } else {
        datosGeneralesProyecto.encargos.push(obj); // → Añadimos el nuevo encargo al array
    }
};

// ________________________ ENGANCHE DE VISTAS  _________________________
// Enganchamos las funciones de las vistas a los botones de la cabecera.
// Las enganchamos al obj window para que estén disponibles desde cualquier sitio.
window.mostrarPortfolio = mostrarPortfolio;
window.mostrarGestion = mostrarGestion;
window.mostrarPerfil = mostrarPerfil;

// _____________ SPLASH - CONTROL DE ENTRADA _____________
// Esperamos a que el usuario interactúe con el splash antes de mostrar la app.
// Al hacer click en cualquier parte del splash (o en el botón CTA), hacemos fade out y abrimos el login.

const splash = document.getElementById("splash");

function abrirApp() {
    splash.classList.add("splash-salida"); // → Disparamos el fade out del splash
    setTimeout(() => {
        splash.remove();
        datosGeneralesProyecto.mainPrincipal.classList.remove("oculto"); // → Mostramos el main
        mostrarAutentificacion(); // → Mostramos el login/registro
    }, 500);
}

splash.addEventListener("click", abrirApp);

document.getElementById("splash-btn-acceder").addEventListener("click", function (e) {
    e.stopPropagation(); // → Evitamos que el click del botón dispare también el del splash
    abrirApp();
});
