// ______________________________________________________________
// _________________ VISTA - PORTFOLIO __________________________

import { creaNodoTextoId, creaNodoId, setCookie } from "../librerias/libreriaMetodos.js";
import { crearCabeceraPrincipal, crearHeaderArtista } from "../librerias/libreriaComponentes.js";
import { datosGeneralesProyecto } from "../main.js";

export { mostrarPortfolio };

/**
 * Función que crea una tarjeta individual de encargo para el portfolio/gestión.
 * @param {object} encargo - Objeto Encargo
 * @returns {HTMLElement} - Devuelve la tarjeta del encargo
 */
function crearTarjetaEncargo(encargo) {

    // Creanos el contenedor principal de la tarjeta
    let tarjeta = creaNodoId("div");
    tarjeta.setAttribute("class", "tarjeta-portfolio");

    // Imagen
    let contenedorImg = creaNodoId("div");
    contenedorImg.setAttribute("class", "tarjeta-portfolio-imagen");

    let img = creaNodoId("img");
    img.src = "./servidor/imagenes/encargos/" + (encargo.imagenes ? encargo.imagenes[0] : "default.jpg");

    contenedorImg.appendChild(img); // → Enganchamos la imagen al contenedor de imagen

    // Etiqueta estado
    let etiqueta = creaNodoTextoId("span", encargo.estado.charAt(0).toUpperCase());
    let claseEstado = encargo.estado.toLowerCase().replace(" ", "-");
    etiqueta.setAttribute("class", "etiqueta-completado " + claseEstado);

    contenedorImg.appendChild(etiqueta); // → Enganchamos la etiqueta al contenedor de imagen

    // Info
    let info = creaNodoId("div");
    info.setAttribute("class", "tarjeta-portfolio-info");

    // Título/nombre del encargo
    let titulo = creaNodoTextoId("h4", encargo.nombre);

    // Nombre del cliente
    let clienteNom = creaNodoTextoId("p", encargo.nombre_cliente);
    clienteNom.setAttribute("class", "cliente-portfolio");

    // Descripción del encargo
    let descripcion = creaNodoTextoId("p", encargo.descripcion);
    descripcion.setAttribute("class", "descripcion-portfolio");

    // Enganchamos título, cliente, descripción y botones al contenedor de info
    info.appendChild(titulo);
    info.appendChild(clienteNom);
    info.appendChild(descripcion);

    // Enganchamos el contenedor de imagen y el de info a la tarjeta principal
    tarjeta.appendChild(contenedorImg);
    tarjeta.appendChild(info);

    return tarjeta;
}

/**
 * Función que dibuja el grid de encargos del artista actual.
 * @param {number} idArtista - Id del artista conectado
 * @param {string} filtroEstado - Estado para filtrar (vacío = todos)
 * @param {string} condicionBusqueda - Término de búsqueda
 * @returns {HTMLElement} - Devuelve el contenedor con el grid de tarjetas
 */
function dibujarTrajetasEncargos(idArtista, filtroEstado = "", condicionBusqueda = "") {

    // Filtramos los encargos del artista excluyendo los borrados (borrado = true)
    // Ordenamos por id descendente para que el más reciente aparezca primero
    let encargosArtista = datosGeneralesProyecto.encargos.filter(e => e.id_artista === idArtista && !e.borrado).sort((a, b) => b.id - a.id);

    // Aplicamos los filtros 

    // Filtramos por estado (si se ha seleccionado alguno en el select)
    if (filtroEstado && filtroEstado !== "todos") {
        encargosArtista = encargosArtista.filter(e => e.estado === filtroEstado);
    }

    // Filtramos por nombre del encargo (a meddida que se va escribiendo en el input de búsqueda)
    if (condicionBusqueda) {
        encargosArtista = encargosArtista.filter(e =>
            e.nombre.toLowerCase().includes(condicionBusqueda.toLowerCase())
        );
    }

    // Creamos el contenedor para las tarjetas de encargos
    let contenedor = creaNodoId("div");
    contenedor.setAttribute("class", "seccion-encargos");

    // Título de la sección
    let titulo = creaNodoTextoId("h2", "Mis Encargos");
    titulo.setAttribute("class", "titulo-galeria");

    // Enganchamos el título al contenedor
    contenedor.appendChild(titulo);

    // Contenedor del grid de tarjetas
    let contenTarjetasEncargos = creaNodoId("div");
    contenTarjetasEncargos.setAttribute("class", "grid-portfolio");
    contenTarjetasEncargos.setAttribute("id", "grid-encargos");

    // Dibujamos las tarjetas
    let mensaje = creaNodoTextoId("p", "No hay encargos que coincidan con los filtros.");

    if (encargosArtista.length === 0) { // → Si no hay encargos para mostrar, mostramos un mensaje
        mensaje.setAttribute("class", "sin-resultados");
        contenTarjetasEncargos.appendChild(mensaje);

    } else { // → Si hay encargos, los dibujamos con sus tarjetas
        encargosArtista.forEach((encargo, i) => {
            let tarjeta = crearTarjetaEncargo(encargo);
            tarjeta.style.setProperty("--delay", `${i * 0.09}s`);
            contenTarjetasEncargos.appendChild(tarjeta);
        });
    }

    contenedor.appendChild(contenTarjetasEncargos);
    return contenedor;
}

// ______ Pantalla principal de portfolio con filtros ______

/**
 * Función que muestra el portfolio del artista conectado, con su cabecera y un grid de tarjetas de sus encargos.
 *      - Permite filtrar los encargos por estado y por búsqueda de nombre, actualizando el grid dinamicamente.
 */
function mostrarPortfolio() {
    setCookie("ultima_vista", "portfolio", 1); // → Guardamos la última vista para volver a ella si se vuelve a iniciar sesión

    // Obtenemos el artista conectado usando el id guardado en sessionStorage parseandolo a número
    let idArtista = Number(sessionStorage.getItem("artistaConectado"));
    let artista   = datosGeneralesProyecto.artistas.find(a => a.id === idArtista);

    datosGeneralesProyecto.mainPrincipal.innerHTML = "";
    datosGeneralesProyecto.mainPrincipal.classList.remove("oculto");

    // Reemplazamos la cabecera por la del menu con el botón de portfolio activado
    let cabeceraAntigua = document.getElementById("cabecera-principal");
    if (cabeceraAntigua) {
        cabeceraAntigua.remove();
    }

    let cabeceraNav = crearCabeceraPrincipal('portfolio');
    document.body.insertBefore(cabeceraNav, datosGeneralesProyecto.mainPrincipal);

    // Creamos la cabecera del artista y la añadimos al main
    let header = crearHeaderArtista(artista);
    datosGeneralesProyecto.mainPrincipal.appendChild(header);

    // Recuperamos los filtros guardados en localStorage para que se mantengan entre vistas/sesiones
    let filtroGuardado   = localStorage.getItem("filtroPortfolio") || "todos";
    let busquedaGuardada = localStorage.getItem("busquedaPortfolio") || "";

    // Dibujamos las tarjetas de encargos del artista aplicando los filtros guardados
    let seccionEncargos = dibujarTrajetasEncargos(idArtista, filtroGuardado, busquedaGuardada);
    datosGeneralesProyecto.mainPrincipal.appendChild(seccionEncargos);

    /// ______ EVENTOS ________

    // Evento input para el campo de busqueda: 
    //  - Actualiza el grid de encargos segun lo que el usuario vaya escribiendo
    let inputBusquedaPortfolio = document.getElementById("input-busqueda-portfolio");
    let selectEstadoPortfolio = document.getElementById("select-filtro");

    // Pre-rellenamos los controles de la cabecera con los filtros guardados para que se mantengan entre vistas/sesiones
    if (inputBusquedaPortfolio) {
        inputBusquedaPortfolio.value = busquedaGuardada;
    }

    if (selectEstadoPortfolio) {
        selectEstadoPortfolio.value  = filtroGuardado;
    }

    if (inputBusquedaPortfolio) {
        inputBusquedaPortfolio.addEventListener("input", function () {
            let filtroEstado = selectEstadoPortfolio.value;
            let condicionBusqueda = this.value;

            // Guardamos el criterio de búsqueda en el localStorage para mantenerlo entre vistas/sesiones
            localStorage.setItem("busquedaPortfolio", condicionBusqueda); // → Guardamos la búsqueda en localStorage

            // Dibujamos un nuevo grid de encargos con los filtros actualizados y reemplazamos el antiguo
            let nuevoGrid = dibujarTrajetasEncargos(idArtista, filtroEstado, condicionBusqueda);
            document.getElementById("grid-encargos").replaceWith(nuevoGrid.querySelector("#grid-encargos"));
        });
    }

    // Evento change para el select de estado
    if (selectEstadoPortfolio) {
        selectEstadoPortfolio.addEventListener("change", function () {
            let filtroEstado = this.value;
            let condicionBusqueda = inputBusquedaPortfolio.value;

            // Guardamos el filtro de estado en el localStorage para mantenerlo entre vistas/sesiones
            localStorage.setItem("filtroPortfolio", filtroEstado); // → Guardamos el filtro en localStorage
            let nuevoGrid = dibujarTrajetasEncargos(idArtista, filtroEstado, condicionBusqueda);
            document.getElementById("grid-encargos").replaceWith(nuevoGrid.querySelector("#grid-encargos"));
        });
    }

}
