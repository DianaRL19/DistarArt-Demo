// ______________________________________________________________
// _________________ VISTA - GESTIÓN ____________________________

import {creaNodoTextoId, creaNodoId, setCookie, obtenerNombreFase, obtenerColorFase} from "../librerias/libreriaMetodos.js";
import { crearCabeceraPrincipal } from "../librerias/libreriaComponentes.js";
import { datosGeneralesProyecto } from "../main.js";

export { mostrarGestion };


/**
 * Función que dibuja las tarjetas de los encargos del artista con la sesión iniciada, aplicando filtros de estado y búsqueda por nombre.
 * @param {number} idArtista - ID del artista conectado
 * @param {string} filtroEstado - Filtro de estado de los encargos
 * @param {string} condicionBusqueda - Condición de búsqueda por nombre
 * @returns {HTMLElement} - Devuelve un contenedor con las tarjetas de los encargos
 */
function dibujarTarjetasGestion(idArtista, filtroEstado = "", condicionBusqueda = "") {
    // Ordenamos por id descendente para que el más reciente aparezca primero
    let encargosArtista = datosGeneralesProyecto.encargos.filter(e => e.id_artista === idArtista && !e.borrado).sort((a, b) => b.id - a.id);

    // Aplicamos el filtro de estado si se ha seleccionado uno
    if (filtroEstado && filtroEstado !== "todos") {
        encargosArtista = encargosArtista.filter(e => e.estado === filtroEstado);
    }

    // Aplicamos el filtro de búsqueda por nombre si se ha introducido una condición
    if (condicionBusqueda) {
        encargosArtista = encargosArtista.filter(e =>
            e.nombre.toLowerCase().includes(condicionBusqueda.toLowerCase())
        );
    }

    // Creamos el contenedor principal de las tarjetas
    let contenedor = creaNodoId("div");
    contenedor.setAttribute("class", "encargos-lista");
    contenedor.setAttribute("id", "encargos-lista-gestion");

    // Si no hay encargos que mostrar, mostramos un mensaje para el usuario
    if (encargosArtista.length == 0) {
        let mensaje = creaNodoTextoId("p", "No hay encargos que coincidan con los filtros.");
        mensaje.setAttribute("class", "sin-resultados");
        contenedor.appendChild(mensaje);
    } else {
        // Si hay encargos, creamos una tarjeta para cada uno y las enganchamos al contenedor
        encargosArtista.forEach((encargo, i) => {
            let tarjeta = crearTarjetaGestion(encargo);
            tarjeta.style.setProperty("--delay", `${i * 0.09}s`);
            contenedor.appendChild(tarjeta);
        });
    }

    return contenedor;
}

/**
 * Función que crea la columna izquierda de la tarjeta de gestión con la imagen del encargo.
 * @param {Encargo} encargo 
 * @returns {HTMLElement}
 */
function crearColumnaImagen(encargo) {
    let imagenConte = creaNodoId("div");
    imagenConte.setAttribute("class", "tarjeta-imagen");

    let img = creaNodoId("img");
    img.src = "./servidor/imagenes/encargos/" + (encargo.imagenes ? encargo.imagenes[0] : "default.jpg");

    imagenConte.appendChild(img);
    return imagenConte;
}

/**
 * Función que crea la sección de datos generales del encargo (descripción, fecha de entrega y precio).
 * @param {Encargo} encargo 
 * @returns {HTMLElement}
 */
function crearSeccionDatosGenerales(encargo) {
    // Creamos un contenedor para la descripción y debajo un bloque con la fecha de entrega y el precio, cada uno con su icono.
    let seccionGeneral = creaNodoId("div");
    seccionGeneral.setAttribute("class", "tarjeta-cuerpo-general");

    // Contenedor para la descripción
    let detalles = creaNodoId("div");
    detalles.setAttribute("class", "tarjeta-detalles");

    // Descripción
    let descripcion = creaNodoTextoId("p", encargo.descripcion);
    descripcion.setAttribute("class", "descripcion");

    // Enganchamos el componente
    detalles.appendChild(descripcion);

    // Contenedor para fecha de entrega y precio
    let infoInferior = creaNodoId("div");
    infoInferior.setAttribute("class", "info-inferior");

    // Fecha de entrega con icono
    let fecha = creaNodoId("span");
    fecha.setAttribute("class", "fecha");

    let imgFecha = creaNodoId("img");
    imgFecha.setAttribute("src", "servidor/imagenes/svg/calendar-week.svg");
    imgFecha.setAttribute("class", "icono-info icono-info-calendario");

    // Enganchamos los componentes
    fecha.appendChild(imgFecha);
    fecha.appendChild(document.createTextNode(encargo.fechaEntrega));

    infoInferior.appendChild(fecha);

    // Precio con icono
    let precio = creaNodoId("span");
    precio.setAttribute("class", "precio");

    let imgPrecio = creaNodoId("img");
    imgPrecio.setAttribute("src", "servidor/imagenes/svg/cash-coin.svg");
    imgPrecio.setAttribute("class", "icono-info");

    // Enganchamos los componentes
    precio.appendChild(imgPrecio);
    precio.appendChild(document.createTextNode(encargo.precio + "€"));
    infoInferior.appendChild(precio);

    detalles.appendChild(infoInferior);
    seccionGeneral.appendChild(detalles);

    return seccionGeneral;
}

/**
 * Función que crea la sección de datos del cliente (nombre, email, dirección y presupuesto).
 * @param {Encargo} encargo 
 * @returns {HTMLElement}
 */
function crearSeccionDatosCliente(encargo) {
    // Creamos un contenedor con los datos del cliente
    let datosCliente = creaNodoId("div");
    datosCliente.setAttribute("class", "tarjeta-cliente");

    // Nombre del cliente
    let datNombre = creaNodoId("div");
    datNombre.setAttribute("class", "cliente-dato");
    datNombre.appendChild(creaNodoTextoId("strong", "Nombre:"));
    datNombre.appendChild(document.createTextNode(" " + encargo.nombre_cliente));

    // Enganchamos el componente
    datosCliente.appendChild(datNombre);

    // Email del cliente
    let datEmail = creaNodoId("div");
    datEmail.setAttribute("class", "cliente-dato");
    datEmail.appendChild(creaNodoTextoId("strong", "Email:"));
    datEmail.appendChild(document.createTextNode(" " + encargo.email_cliente));

    // Enganchamos el componente
    datosCliente.appendChild(datEmail);

    // Dirección del cliente
    let datDireccion = creaNodoId("div");
    datDireccion.setAttribute("class", "cliente-dato");
    datDireccion.appendChild(creaNodoTextoId("strong", "Dirección:"));
    datDireccion.appendChild(document.createTextNode(" " + encargo.direccion_cliente));

    // Enganchamos el componente
    datosCliente.appendChild(datDireccion);

    // Presupuesto del cliente
    let datPresupuesto = creaNodoId("div");
    datPresupuesto.setAttribute("class", "cliente-dato presupuesto");
    let spanPresupuesto = creaNodoTextoId("span", encargo.presupuesto_cliente + "€");
    spanPresupuesto.setAttribute("class", "precio-presupuesto");
    datPresupuesto.appendChild(creaNodoTextoId("strong", "Presupuesto:"));
    datPresupuesto.appendChild(document.createTextNode(" "));
    datPresupuesto.appendChild(spanPresupuesto);

    // Enganchamos el componente
    datosCliente.appendChild(datPresupuesto);

    return datosCliente;
}

/**
 * Función que crea la columna de contenido de una tarjeta de encargo.
 * Con el título, los datos generales y los datos del cliente.
 * @param {Encargo} encargo 
 * @returns {HTMLElement}
 */
function crearColumnaContenido(encargo) {
    // Creamos un contenedor para el contenido que tendrá el título del encargo, los datos generales y los datos del cliente.
    let contenido = creaNodoId("div");
    contenido.setAttribute("class", "tarjeta-contenido");

    // Título del encargo
    let seccionTitulo = creaNodoId("div");
    seccionTitulo.setAttribute("class", "tarjeta-titulo");
    seccionTitulo.appendChild(creaNodoTextoId("h3", encargo.nombre));

    // Enganchamos el componente
    contenido.appendChild(seccionTitulo);

    // Sección con datos generales y datos del cliente
    let seccionCuerpo = creaNodoId("div");
    seccionCuerpo.setAttribute("class", "tarjeta-cuerpo");

    // Enganchamos los componentes
    seccionCuerpo.appendChild(crearSeccionDatosGenerales(encargo));
    seccionCuerpo.appendChild(crearSeccionDatosCliente(encargo));
    contenido.appendChild(seccionCuerpo);

    return contenido;
}

/**
 * Función que crea el selector de fase de un encargo.
 * @param {Encargo} encargo 
 * @returns {HTMLElement}
 */
function crearSelectorFase(encargo) {
    // Creamos un contenedor con 2 filas de 4 radios cada uno para representar las 8 fases del encargo. 
    // El radio correspondiente a la fase actual del encargo estará marcado y todos estaran deshabilitados para evitar cambios accidentales.
    let faseSelector = creaNodoId("div");
    faseSelector.setAttribute("class", "fase-selector");

    // Indicamos las fases agrupadas en 2 filas para facilitar la creación con un bucle
    let fases = [
        {   
            inicio: 1, 
            fin: 4, 
            clase: "fila-colores" 
        },
        {   
            inicio: 5, 
            fin: 8, 
            clase: "fila-colores fila-colores2" 
        }
    ];

    fases.forEach(({ inicio, fin, clase }) => {
        // Creamos una fila para cada grupo de fases
        let fila = creaNodoId("div");
        fila.setAttribute("class", clase);

        // Creamos un radio para cada fase dentro de la fila
        for (let i = inicio; i <= fin; i++) {

            let radio = creaNodoId("input");

            radio.setAttribute("type", "radio");
            radio.setAttribute("name", "fase-" + encargo.id);
            radio.setAttribute("value", i);
            radio.setAttribute("title", obtenerNombreFase(i)); // → Sacamos el nombre de la función
            if (encargo.fase == i) {
                radio.setAttribute("checked", "checked");
            }

            // Deshabilitamos los radios para evitar intentos de cambios
            radio.setAttribute("disabled", "disabled");

            // Enganchamos el componente
            fila.appendChild(radio);
        }
        // Enganchamos la fila al selector de fase
        faseSelector.appendChild(fila);
    });

    return faseSelector;
}

/**
 * Función que crea la columna derecha de una tarjeta de encargo.
 * Contiene la etiqueta de fase, el selector de fase y el botón de editar.
 * @param {Encargo} encargo 
 * @returns {HTMLElement}
 */
function crearColumnaDerecha(encargo) {
    // Creamos un contenedor para la columna derecha que tendrá la etiqueta de fase, el selector de fase y el botón de editar.
    let derecha = creaNodoId("div");
    derecha.setAttribute("class", "tarjeta-derecha");

    // Creamos la etiqueta de fase
    let etiquetaFase = creaNodoTextoId("span", obtenerNombreFase(encargo.fase));
    etiquetaFase.setAttribute("class", "etiqueta-fase");
    etiquetaFase.style.backgroundColor = obtenerColorFase(encargo.fase);

    // Enganchamos los componentes
    derecha.appendChild(etiquetaFase);
    derecha.appendChild(crearSelectorFase(encargo));

    // Creamos un contenedor para los botones de acción (editar, eliminar, etc)
    let botonesAccion = creaNodoId("div");
    botonesAccion.setAttribute("class", "botones-accion");

    // Botón de editar
    let btnEditar = creaNodoId("button");
    btnEditar.setAttribute("class", "btn-editar");
    btnEditar.setAttribute("title", "Editar");

    // Icono de lápiz para el botón de editar
    let imgEditar = creaNodoId("img");
    imgEditar.setAttribute("src", "servidor/imagenes/svg/pencil-square.svg");

    // Enganchamos los componentes
    btnEditar.appendChild(imgEditar);
    botonesAccion.appendChild(btnEditar);

    // Al hacer click en el botón de editar, se abrirá la ventana auxiliar para editar el encargo, pasando el objeto encargo 
    // y el id del artista conectado.
    let idArtista = Number(sessionStorage.getItem("artistaConectado"));
    btnEditar.addEventListener("click", function () {
        abrirVentanaAuxEncargo(encargo, idArtista);
    });

    // Botón de borrar encargo (papelera)
    let btnBorrar = creaNodoId("button");
    btnBorrar.setAttribute("class", "btn-borrar");
    btnBorrar.setAttribute("title", "Borrar encargo");
    btnBorrar.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 69 14" class="btn-borrar-bin-top"><path fill="black" d="M20.8232 2.62734L19.9948 4.21304C19.8224 4.54309 19.4808 4.75 19.1085 4.75H4.92857C2.20246 4.75 0 6.87266 0 9.5C0 12.1273 2.20246 14.25 4.92857 14.25H64.0714C66.7975 14.25 69 12.1273 69 9.5C69 6.87266 66.7975 4.75 64.0714 4.75H49.8915C49.5192 4.75 49.1776 4.54309 49.0052 4.21305L48.1768 2.62734C47.3451 1.00938 45.6355 0 43.7719 0H25.2281C23.3645 0 21.6549 1.00938 20.8232 2.62734ZM64.0023 20.0648C64.0397 19.4882 63.5822 19 63.0044 19H5.99556C5.4178 19 4.96025 19.4882 4.99766 20.0648L8.19375 69.3203C8.44018 73.0758 11.6746 76 15.5712 76H53.4288C57.3254 76 60.5598 73.0758 60.8062 69.3203L64.0023 20.0648Z"></path></svg><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 69 57" class="btn-borrar-bin-bottom"><path fill="black" d="M20.8232 -16.3727L19.9948 -14.787C19.8224 -14.4569 19.4808 -14.25 19.1085 -14.25H4.92857C2.20246 -14.25 0 -12.1273 0 -9.5C0 -6.8727 2.20246 -4.75 4.92857 -4.75H64.0714C66.7975 -4.75 69 -6.8727 69 -9.5C69 -12.1273 66.7975 -14.25 64.0714 -14.25H49.8915C49.5192 -14.25 49.1776 -14.4569 49.0052 -14.787L48.1768 -16.3727C47.3451 -17.9906 45.6355 -19 43.7719 -19H25.2281C23.3645 -19 21.6549 -17.9906 20.8232 -16.3727ZM64.0023 1.0648C64.0397 0.4882 63.5822 0 63.0044 0H5.99556C5.4178 0 4.96025 0.4882 4.99766 1.0648L8.19375 50.3203C8.44018 54.0758 11.6746 57 15.5712 57H53.4288C57.3254 57 60.5598 54.0758 60.8062 50.3203L64.0023 1.0648Z"></path></svg><svg viewBox="0 0 448 512" class="btn-borrar-svg"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path></svg>`;

    btnBorrar.addEventListener("click", function () {
        borrarEncargoServidor(encargo.id, idArtista);
    });

    botonesAccion.appendChild(btnBorrar);

    derecha.appendChild(botonesAccion);
    return derecha;
}

/**
 * Función que crea una tarjeta de encargo para la vista de Gestión.
 * Monta las 3 columnas: imagen , contenido , fase + botones
 * @param {Encargo} encargo - Objeto Encargo
 * @returns {HTMLElement} - Devuelve una tarjeta de encargo para gestión
 */
function crearTarjetaGestion(encargo) {
    // Creamos un contenedor para la tarjeta que tendrá 3 columnas: imagen, contenido y fase + botones.
    let tarjeta = creaNodoId("div");
    tarjeta.setAttribute("class", "tarjeta-encargo");
    tarjeta.setAttribute("data-idEncargo", encargo.id);

    // Enganchamos las 3 columnas a la tarjeta
    tarjeta.appendChild(crearColumnaImagen(encargo));
    tarjeta.appendChild(crearColumnaContenido(encargo));
    tarjeta.appendChild(crearColumnaDerecha(encargo));

    return tarjeta;
}

// _______________________________________________________________
// ___________ VENTANA AUXILIAR CREAR / EDITAR ENCARGO ___________

/**
 * Abre una ventana auxiliar flotante para crear o editar un encargo.
 * Usa window.open() para abrir ventana-encargo.html con parámetros en URL.
 * Cuando se cierra la ventana, recarga los datos de Encargos.json y redibuja las tarjetas.
 * @param {object|null} encargo - null para crear, objeto encargo para editar
 * @param {number} idArtista - Devuelve el id del artista conectado
 */
function abrirVentanaAuxEncargo(encargo, idArtista) {
    // Comprobamos si es un nuevo encargo o estamos editando uno existente para pasarle los datos 
    // correspondientes a la ventana auxiliar
    let esNuevo = encargo == null;

    // URL con parámetros
    let params = new URLSearchParams();

    // Si no es nuevo, añadimos los datos del encargo a los parámetros para que la ventana auxiliar los muestre y permita editarlos.
    if (!esNuevo) {
        params.append("id", encargo.id);
        params.append("nombre", encargo.nombre);
        params.append("descripcion", encargo.descripcion || "");
        params.append("nombre_cliente", encargo.nombre_cliente || "");
        params.append("email_cliente", encargo.email_cliente || "");
        params.append("direccion_cliente", encargo.direccion_cliente || "");
        params.append("pais_cliente", encargo.pais_cliente || "");
        params.append("presupuesto_cliente", encargo.presupuesto_cliente || "");
        params.append("precio", encargo.precio || "");
        params.append("fechaEntrega", encargo.fechaEntrega || "");
        params.append("estado", encargo.estado || "");
        params.append("fase", encargo.fase || 1);
        params.append("imagen", encargo.imagenes ? encargo.imagenes[0] : ""); // → Imagen actual del encargo
    }

    // Añadimos el id del artista para que la ventana auxiliar sepa a qué artista asignar el nuevo encargo
    params.append("id_artista", idArtista);

    // Calculamos posición centrada en pantalla
    let w = 1020, h = 720;
    let left = Math.round(window.screen.width / 2 - w / 2);
    let top = Math.round(window.screen.height / 2 - h / 2);

    // Abrimos la ventana flotante centrada
    let ventanaFlotante = window.open(
        `./ventanas/ventana-encargo.html?${params.toString()}`,
        "aux_encargo",
        `width=${w},height=${h},left=${left},top=${top},resizable=yes,scrollbars=yes`
    );

    // Al cerrar la ventana auxiliar, redibujamos las tarjetas con los datos que ya tenemos en memoria.
    // La ventana auxiliar nos avisa antes de cerrarse (via window.notificarEncargoGuardado) si hubo cambios,
    // así que el array ya estará actualizado cuando lleguemos aquí.
    let tiempoCierre = setInterval(() => {

        if (ventanaFlotante.closed) {
            clearInterval(tiempoCierre);

            let contenedorViejo = document.getElementById("encargos-lista-gestion");
            if (contenedorViejo) {
                contenedorViejo.replaceWith(dibujarTarjetasGestion(idArtista, "", ""));
            }
        }

    }, 500);
}

// _____________________________________________
// ________ SECCIÓN - CABECERA CON TÍTULO _______

/**
 * Crea la cabecera de la vista de gestión con el título y el botón de "+ Nuevo Encargo".
 * @param {number} idArtista - Id del artista conectado
 * @returns {HTMLElement} 
 */
function crearCabeceraTitulo(idArtista) {
    let encargosCabecera = creaNodoId("section");
    encargosCabecera.setAttribute("class", "encargos-header");

    let titulo = creaNodoTextoId("h2", "Mis Encargos");
    let btnNuevo = creaNodoTextoId("button", "+ Nuevo Encargo");
    btnNuevo.setAttribute("class", "btn-nuevo");

    // Al darle a crear nuevo encargo, abrimos una ventana auxiliar para crear un nuevo encargo, pasanole un null en el parametro "encargo" para 
    // indicar que es un encargo nuevo y le pasamos el id del artista conectado para asignarle el encargo a ese artista.
    btnNuevo.addEventListener("click", function () {
        abrirVentanaAuxEncargo(null, idArtista);
    });

    // Enganchamos los componentes
    encargosCabecera.appendChild(titulo);
    encargosCabecera.appendChild(btnNuevo);

    return encargosCabecera;
}

// _____________________________________________
// ________ SECCIÓN - INFO DE ENCARGOS _________

/**
 * Crea la sección con el contador de encargos disponibles y la goma de borrar.
 * @param {number} idArtista - Id del artista conectado
 * @returns {HTMLElement}
 */
function crearSeccionInfoEncargos(idArtista) {

    // Creamos un contenedor para mostrar un mensaje indicando el número de encargos disponibles
    let infoEncargos = creaNodoId("section");
    infoEncargos.setAttribute("class", "info-encargos");

    // Contamos el número de encargos disponibles para el artista conectado (que no estén borrados) y lo mostramos en un mensaje para el usuario.
    let encargosCuenta = datosGeneralesProyecto.encargos.filter(e => e.id_artista == idArtista && !e.borrado).length;

    let textoInfo = creaNodoTextoId("p", "Encargos disponibles: " + encargosCuenta);
    textoInfo.setAttribute("id", "texto-encargos-cuenta");

    infoEncargos.appendChild(textoInfo);

    return infoEncargos;
}

/**
 * Hace la petición al servidor para borrar un encargo y refresca la lista y el contador.
 * @param {number} encargoId - Id del encargo a borrar
 * @param {number} idArtista - Id del artista conectado
 */
function borrarEncargoServidor(encargoId, idArtista) {

    // Hacemos una petición al servidor para borrar el encargo
    fetch("./servidor/php/borrarEncargo.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: encargoId })
    })
        .then(r => r.json())
        .then(data => {
            if (data.success) {
                // Actualizamos los datos de los encargos en los datos generales del proyecto.
                let enc = datosGeneralesProyecto.encargos.find(e => e.id === encargoId);
                if (enc) {
                    enc.borrado = true;
                }

                // Redibujamos las tarjetas y actualizamos el contador de encargos disponibles.
                let nuevoListado = dibujarTarjetasGestion(idArtista, "", "");
                document.getElementById("encargos-lista-gestion").replaceWith(nuevoListado);

                let nuevaCuenta = datosGeneralesProyecto.encargos.filter(e => e.id_artista === idArtista && !e.borrado).length;
                let textoContador = document.getElementById("texto-encargos-cuenta");
                if (textoContador) {
                    textoContador.textContent = "Encargos disponibles: " + nuevaCuenta;
                }
            }
        })
        .catch(err => console.error("Error al borrar:", err));
}

// _____________________________________________
// ___________ CONTENEDOR DE TARJETAS __________

/**
 * Crea el contenedor de tarjetas aplicando los filtros guardados en localStorage.
 * @param {number} idArtista - Id del artista conectado
 * @returns {HTMLElement}
 */
function crearContenedorTarjetas(idArtista) {

    let contenedorTarjetas = creaNodoId("section");
    contenedorTarjetas.setAttribute("class", "encargos-contenedor");
    contenedorTarjetas.setAttribute("id", "contenedor-encargos-gestion");

    // Recuperamos los filtros guardados en localStorage para que se mantengan entre vistas/sesiones
    let filtroGuardado = localStorage.getItem("filtroGestion") || "todos";
    let busquedaGuardada = localStorage.getItem("busquedaGestion") || "";

    // Pre-rellenamos los controles de la cabecera con los valores guardados
    let inputBusquedaInicial = document.getElementById("input-busqueda-gestion");
    let selectFiltroInicial  = document.getElementById("select-filtro");
    if (inputBusquedaInicial) {
        inputBusquedaInicial.value = busquedaGuardada;
    }
    if (selectFiltroInicial) {
        selectFiltroInicial.value = filtroGuardado;
    }

    // Dibujamos las tarjetas iniciales aplicando los filtros guardados
    let tarjetasGestion = dibujarTarjetasGestion(idArtista, filtroGuardado, busquedaGuardada);
    contenedorTarjetas.appendChild(tarjetasGestion);

    return contenedorTarjetas;
}

// _____________________________________________
// ________ EVENTOS DE GESTIÓN (CABECERA) ______

/**
 * Engancha los eventos del input de búsqueda y del select de filtro de la cabecera,
 * guardando cada cambio en localStorage y refrescando el listado.
 * @param {number} idArtista - Id del artista conectado
 */
function activarEventosFiltros(idArtista) {

    // Evento búsqueda (en la cabecera)
    let inputBusquedaCabecera = document.getElementById("input-busqueda-gestion");
    if (inputBusquedaCabecera) {
        inputBusquedaCabecera.addEventListener("input", function () {
            let filterEstado = document.getElementById("select-filtro").value;
            let condicionBusqueda = this.value;

            // Guardamos el criterio de búsqueda en el localStorage para que se mantengan entre vistas/sesiones
            localStorage.setItem("busquedaGestion", condicionBusqueda); // → Guardamos la búsqueda en localStorage
            let nuevoListado = dibujarTarjetasGestion(idArtista, filterEstado, condicionBusqueda);
            document.getElementById("encargos-lista-gestion").replaceWith(nuevoListado);
        });
    }

    // Evento filtro (en la cabecera)
    let selectFiltroCabecera = document.getElementById("select-filtro");
    if (selectFiltroCabecera) {
        selectFiltroCabecera.addEventListener("change", function () {
            let filtroEstado = this.value;
            let condicionBusqueda = inputBusquedaCabecera.value;

            // Guardamos el criterio de filtro en el localStorage para que se mantengan entre vistas/sesiones
            localStorage.setItem("filtroGestion", filtroEstado); // → Guardamos el filtro en localStorage
            let nuevoListado = dibujarTarjetasGestion(idArtista, filtroEstado, condicionBusqueda);
            document.getElementById("encargos-lista-gestion").replaceWith(nuevoListado);
        });
    }
}

/**
 * Función que muestra la vista de gestión con los encargos del artista conectado. Permite:
 * - Filtrar por estado y buscar por nombre.
 * - Crear/Editar/Borrar encargos.
 * - Guarda la última vista(pantalla) en la que el usuario estaba en una cookie para que el usuario pueda volver a ella al volver a entrar.
 */
function mostrarGestion() {

    // Guardamos la última vista en una cookie 
    setCookie("ultima_vista", "gestion", 1);

    // Obtenemos el artista conectado
    let idArtista = Number(sessionStorage.getItem("artistaConectado"));

    // Limpiamos el main
    datosGeneralesProyecto.mainPrincipal.innerHTML = "";
    datosGeneralesProyecto.mainPrincipal.classList.remove("oculto");

    // Reemplazamos la cabecera antigua por la de gestión (con el botón de gestión activo)
    let cabeceraAntigua = document.getElementById("cabecera-principal");
    if (cabeceraAntigua) {
        cabeceraAntigua.remove();
    }

    let cabeceraMenu = crearCabeceraPrincipal('gestion');
    document.body.insertBefore(cabeceraMenu, datosGeneralesProyecto.mainPrincipal);

    // Enganchamos las tres secciones principales al main
    datosGeneralesProyecto.mainPrincipal.appendChild(crearCabeceraTitulo(idArtista));
    datosGeneralesProyecto.mainPrincipal.appendChild(crearSeccionInfoEncargos(idArtista));
    datosGeneralesProyecto.mainPrincipal.appendChild(crearContenedorTarjetas(idArtista));

    // Enganchamos los eventos de búsqueda y filtro de la cabecera
    activarEventosFiltros(idArtista);
}
