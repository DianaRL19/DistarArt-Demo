// ______________________________________________________________
// ____________ LIBRERÍA DE COMPONENTES REUTILIZABLES ___________

import { creaNodoId, creaNodoTextoId } from "./libreriaMetodos.js";
import { mostrarAutentificacion } from "../vistas/autentificacion.js";
import { datosGeneralesProyecto } from "../main.js";

export { crearCabeceraPrincipal, crearHeaderArtista };


/**
 * Función que crea la cabecera con el menú (Portfolio, Gestión, Perfil).
 * Por defecto mostraremos el "Portfolio" que como nuestro inicio.
 * Para el responsive menú de 3 líneas en móvil, menú horizontal en escritorio.
 * 
 * @param {string} vistaActiva --> Nombre de la vista activa (portfolio, gestion, perfil)
 * @returns {HTMLElement} --> Devuelve el nodo de la cabecera principal con el menú y funcionalidades
 */
function crearCabeceraPrincipal(vistaActiva = 'portfolio') {

    let cabecera = creaNodoId("header");
    cabecera.setAttribute("id", "cabecera-principal");
    cabecera.setAttribute("class", "cabecera-menu");

    // ____________ CONTENEDOR PRINCIPAL ____________

    let conteCompoHeader = creaNodoId("section");
    conteCompoHeader.setAttribute("class", "conte-compo-header");

    // __________ SECCIÓN IZQUIERDA __________

    let menuContenedor = creaNodoId("div");
    menuContenedor.setAttribute("class", "menu-contenedor");

    // Botón menú líneas (visible solo en móvil)
    let btnMenuMovil = creaNodoId("button");
    btnMenuMovil.setAttribute("id", "btn-menu-movil");
    btnMenuMovil.setAttribute("class", "btn-menu-movil");
    btnMenuMovil.setAttribute("aria-label", "Abrir menú");

    // 3 líneas que se animan a X cuando el menú está abierto
    let menuLineasIcono = creaNodoId("div");
    menuLineasIcono.setAttribute("class", "menu-lineas-icono");
    menuLineasIcono.appendChild(creaNodoId("span"));
    menuLineasIcono.appendChild(creaNodoId("span"));
    menuLineasIcono.appendChild(creaNodoId("span"));

    // Enganchamos el icono al botón y el botón al contenedor
    btnMenuMovil.appendChild(menuLineasIcono);
    menuContenedor.appendChild(btnMenuMovil);

    // Logo escritorio (izquierda, visible solo en escritorio)
    let logoEscritorio = creaNodoId("img");
    logoEscritorio.src = "./servidor/imagenes/Logo-DistarArt.png";
    logoEscritorio.setAttribute("class", "logo-cabecera logo-escritorio");

    // Enganchamos el logo al contenedor del menú
    menuContenedor.appendChild(logoEscritorio);

    // Menú de escritorio (oculto en el diseño móvil)
    let menu = creaNodoId("nav");
    menu.setAttribute("class", "menu-navegacion");

    // Opciones del menú
    let menuOpt = [
        { 
            texto: "Portfolio", 
            id: "btn-menu-portfolio" 
        },
        { 
            texto: "Gestión", 
            id: "btn-menu-gestion" 
        },
        { 
            texto: "Perfil", 
            id: "btn-menu-perfil" 
        }
    ];

    // Creamos los botones del menú de escritorio y les asignamos la clase "activo" según la vista que esté activa
    menuOpt.forEach(opcion => {
        let btn = creaNodoTextoId("button", opcion.texto);
        btn.setAttribute("id", opcion.id);
        btn.setAttribute("class", "btn-menu");

        if ((vistaActiva == 'portfolio' && opcion.id == 'btn-menu-portfolio') ||
            (vistaActiva == 'gestion' && opcion.id == 'btn-menu-gestion') ||
            (vistaActiva == 'perfil' && opcion.id == 'btn-menu-perfil')) {
            btn.classList.add("activo");
        }

        // Enganchamos cada botón al menú de escritorio
        menu.appendChild(btn);
    });

    // Enganchamos el menú al contenedor y el contenedor al header
    menuContenedor.appendChild(menu);
    conteCompoHeader.appendChild(menuContenedor);

    // __________ CENTRO __________

    let logoCentro = creaNodoId("img");
    logoCentro.src = "./servidor/imagenes/Logo-DistarArt.png";
    logoCentro.setAttribute("class", "logo-cabecera logo-centro");

    // Enganchamos el logo al centro del header
    conteCompoHeader.appendChild(logoCentro);

    // __________ SECCIÓN DERECHA __________

    let opcionesGestion = creaNodoId("div");
    opcionesGestion.setAttribute("class", "opciones-gestion");

    // Búsqueda y filtro solo en escritorio para gestión y portfolio
    if (vistaActiva == 'gestion' || vistaActiva == 'portfolio') {
        let busquedaContenedor = creaNodoId("div");
        busquedaContenedor.setAttribute("class", "busqueda-contenedor");

        // Icono de búsqueda
        let iconoSearch = creaNodoId("img");
        iconoSearch.setAttribute("src", "./servidor/imagenes/svg/search.svg");
        iconoSearch.setAttribute("class", "icono-search");

        // Input de búsqueda
        let inputBusqueda = creaNodoId("input");
        inputBusqueda.setAttribute("type", "text");
        inputBusqueda.setAttribute("class", "input-busqueda");
        inputBusqueda.setAttribute("placeholder", vistaActiva == 'gestion' ? "Buscar encargo..." : "Buscar trabajo...");
        inputBusqueda.setAttribute("id", vistaActiva == 'gestion' ? "input-busqueda-gestion" : "input-busqueda-portfolio");

        // Enganchamos los componentes
        busquedaContenedor.appendChild(iconoSearch);
        busquedaContenedor.appendChild(inputBusqueda);
        opcionesGestion.appendChild(busquedaContenedor);

        // __________ FILTRO __________

        let filtroContenedor = creaNodoId("div");
        filtroContenedor.setAttribute("class", "filtro-contenedor");

        // Icono de filtro
        let iconoFiltro = creaNodoId("img");
        iconoFiltro.setAttribute("src", "./servidor/imagenes/svg/funnel.svg");
        iconoFiltro.setAttribute("class", "icono-filtro");

        // Select de filtro
        let selectFiltro = creaNodoId("select");
        selectFiltro.setAttribute("class", "select-filtro");
        selectFiltro.setAttribute("id", "select-filtro");

        let opciones = [
            { texto: "Todos", value: "todos" },
            { texto: "Pendiente", value: "pendiente" },
            { texto: "En proceso", value: "en proceso" },
            { texto: "Completado", value: "completado" }
        ];

        opciones.forEach(opt => {
            let option = document.createElement("option");
            option.value = opt.value;
            option.textContent = opt.texto;

            // Enganchamos cada opción al select
            selectFiltro.appendChild(option);
        });

        // Enganchamos el icono y el select al contenedor de filtro, y el contenedor a la sección derecha
        filtroContenedor.appendChild(iconoFiltro);
        filtroContenedor.appendChild(selectFiltro);
        opcionesGestion.appendChild(filtroContenedor);
    }

    // ___ Botón Cerrar Sesión ___

    let btnCerrarSesion = creaNodoId("button");
    btnCerrarSesion.setAttribute("id", "btn-cerrar-sesion");
    btnCerrarSesion.setAttribute("class", "btn-menu btn-cerrar-sesion");

    // Icono cerrar sesión para móvil
    let iconoCerrarSesion = creaNodoId("img");
    iconoCerrarSesion.setAttribute("src", "./servidor/imagenes/svg/logout.svg");
    iconoCerrarSesion.setAttribute("class", "icono-cerrar-sesion");

    // Enganchamos los componentes
    btnCerrarSesion.appendChild(iconoCerrarSesion);

    opcionesGestion.appendChild(btnCerrarSesion);
    conteCompoHeader.appendChild(opcionesGestion);
    cabecera.appendChild(conteCompoHeader);

    // ___ Menú desplegable para móvil ___

    let menuMovilContenedor = creaNodoId("nav");
    menuMovilContenedor.setAttribute("id", "menu-movil-contenedor");
    menuMovilContenedor.setAttribute("class", "menu-movil");

    // Creamos los mismos botones del menú de escritorio pero para el menú para móvil
    menuOpt.forEach(opcion => {
        let btnMovil = creaNodoTextoId("button", opcion.texto);
        btnMovil.setAttribute("data-view", opcion.id.replace('btn-menu-', ''));
        btnMovil.setAttribute("class", "btn-menu-movil-opt");

        if ((vistaActiva == 'portfolio' && opcion.id == 'btn-menu-portfolio') ||
            (vistaActiva == 'gestion' && opcion.id == 'btn-menu-gestion') ||
            (vistaActiva == 'perfil' && opcion.id == 'btn-menu-perfil')) {
            btnMovil.classList.add("activo");
        }

        // Enganchamos cada botón al menú móvil
        menuMovilContenedor.appendChild(btnMovil);
    });

    // Enganchamos el menú móvil al header
    cabecera.appendChild(menuMovilContenedor);

    // __________ FUNCIONALIDADES DE LOS BOTONES __________

    // Botones menú escritorio
    const btnPortfolioEscritorio = cabecera.querySelector("#btn-menu-portfolio");
    const btnGestionEscritorio = cabecera.querySelector("#btn-menu-gestion");
    const btnPerfilEscritorio = cabecera.querySelector("#btn-menu-perfil");

    // Asignamos la funcionalidad a cada botón para mostrar la vista correspondiente al pulsae alguno, pero le añadimos un ? es para evitar errores si el botón 
    // no existe (por ejemplo, si estamos en una vista donde no se muestra ese botón), como en kotlin para que no se pete
    btnPortfolioEscritorio?.addEventListener("click", () => window.mostrarPortfolio());
    btnGestionEscritorio?.addEventListener("click", () => window.mostrarGestion());
    btnPerfilEscritorio?.addEventListener("click", () => window.mostrarPerfil());

    // Botones menú móvil
    const botonesMenuMovil = cabecera.querySelectorAll(".btn-menu-movil-opt");
    botonesMenuMovil.forEach(btn => {
        btn.addEventListener("click", function () {
            const vista = this.getAttribute("data-view");
            cerrarMenuMovil();

            if (vista === "portfolio") {
                window.mostrarPortfolio();
            } else if (vista === "gestion") {
                window.mostrarGestion();
            } else if (vista === "perfil") {
                window.mostrarPerfil();
            }
        });
    });

    // Función para abrir/cerrar el menú móvil
    const btnMenuMovilAccion = cabecera.querySelector("#btn-menu-movil");
    const menuMovil = cabecera.querySelector("#menu-movil-contenedor");

    btnMenuMovilAccion?.addEventListener("click", function () {
        menuMovil.classList.toggle("abierto");
        btnMenuMovilAccion.classList.toggle("abierto"); // → Activa la animación hamburguesa → X
    });

    // Función para cerrar el menú móvil
    function cerrarMenuMovil() {
        menuMovil?.classList.remove("abierto");
        btnMenuMovilAccion?.classList.remove("abierto"); // → Vuelve a las 3 líneas
    }

    // Cerrar menú móvil al presionar Escape
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
            cerrarMenuMovil();
        }
    });

    // Cerramos la sesión - limpiamos sessionStorage y volvemos al login
    btnCerrarSesion.addEventListener("click", function () {
        sessionStorage.removeItem("artistaConectado"); // → Limpiamos el artista conectado
        document.getElementById("cabecera-principal").remove(); // → Eliminamos la cabecera
        datosGeneralesProyecto.mainPrincipal.innerHTML = ""; // → Limpiamos el main
        mostrarAutentificacion(); // → Volvemos a mostrar la pantalla de autentificación
    });

    return cabecera;
}

/**
 * Función que crea la cabecera del artista con foto, nombre, especialidad y contadores.
 * @param {object} artista --> Objeto Artista con id, nombre, especialidad, etc.
 * @returns {HTMLElement} --> Devuelve el nodo de la cabecera del artista
 */
function crearHeaderArtista(artista) {
    let cabeceraArtista = creaNodoId("div");
    cabeceraArtista.setAttribute("class", "cabecera-artista");

    // Imagen circular
    let foto = creaNodoId("img");
    foto.src = "./servidor/imagenes/perfiles/" + artista.imgPerfil;
    foto.setAttribute("class", "foto-artista");
    foto.setAttribute("alt", artista.nombre);

    // Info derecha
    let info = creaNodoId("div");
    info.setAttribute("class", "info-artista");

    // Nombre
    let nombre = creaNodoTextoId("h1", artista.nombre);

    // Especialidad
    let especialidad = creaNodoTextoId("p", artista.especialidad);
    especialidad.setAttribute("class", "especialidad-artista");

    // Ubicación con icono
    let ubicacionP = creaNodoId("p");
    ubicacionP.setAttribute("class", "ubicacion");

    // Icono de ubicación
    let iconoUbicacion = creaNodoId("img");
    iconoUbicacion.setAttribute("src", "./servidor/imagenes/svg/globe-europe-africa.svg");
    iconoUbicacion.setAttribute("class", "ubicacion-icono icono-info-ubi");

    // Texto de ubicación (si no tiene, mostramos "Exploradorando el mundo")
    let textoUbicacion = document.createTextNode(artista.ubicacion || "Explorando el mundo");

    // Enganchamos el icono y el texto al párrafo de ubicación
    ubicacionP.appendChild(iconoUbicacion);
    ubicacionP.appendChild(textoUbicacion);

    // Enganchamos los elementos al contenedor de info
    info.appendChild(nombre);
    info.appendChild(especialidad);
    info.appendChild(ubicacionP);

    // Contadores de encargos
    let encargosCont = datosGeneralesProyecto.encargos.filter(e => e.id_artista === artista.id && !e.borrado).length;
    let completadosCont = datosGeneralesProyecto.encargos.filter(e => e.id_artista === artista.id && !e.borrado && e.estado === "completado").length;
    let pendientesCont = datosGeneralesProyecto.encargos.filter(e => e.id_artista === artista.id && !e.borrado && e.estado !== "completado").length;

    // Contenedor de contadores
    let contadores = creaNodoId("div");
    contadores.setAttribute("class", "conts-artista");

    // Contador de encargos
    let contEncargos = creaNodoId("div");
    contEncargos.setAttribute("class", "cont-item");

    // Número de encargos
    let numEncargos = creaNodoTextoId("p", String(encargosCont));
    numEncargos.setAttribute("class", "cont-numero");
    
    // Etiqueta de encargos
    let etEncargos = creaNodoTextoId("p", "Proyectos");
    etEncargos.setAttribute("class", "cont-etiqueta");

    // Enganchamos el número y la etiqueta al contenedor de encargos
    contEncargos.appendChild(numEncargos);
    contEncargos.appendChild(etEncargos);

    // Contador de completados
    let contCompletados = creaNodoId("div");
    contCompletados.setAttribute("class", "cont-item");

    // Número de completados
    let numCompletados = creaNodoTextoId("p", String(completadosCont));
    numCompletados.setAttribute("class", "cont-numero");

    // Etiqueta de completados
    let etCompletados = creaNodoTextoId("p", "Completados");
    etCompletados.setAttribute("class", "cont-etiqueta");

    // Enganchamos el número y la etiqueta al contenedor de completados
    contCompletados.appendChild(numCompletados);
    contCompletados.appendChild(etCompletados);

    // Contador de pendientes
    let contPendientes = creaNodoId("div");
    contPendientes.setAttribute("class", "cont-item");

    // Número de pendientes
    let numPendientes = creaNodoTextoId("p", String(pendientesCont));
    numPendientes.setAttribute("class", "cont-numero cont-numero-alerta");

    // Etiqueta de pendientes
    let etPendientes = creaNodoTextoId("p", "Pendientes");
    etPendientes.setAttribute("class", "cont-etiqueta");

    // Enganchamos el número y la etiqueta al contenedor de pendientes
    contPendientes.appendChild(numPendientes);
    contPendientes.appendChild(etPendientes);

    // Enganchamos los contadores al contenedor de contadores
    contadores.appendChild(contEncargos);
    contadores.appendChild(contCompletados);
    contadores.appendChild(contPendientes);

    // Enganchamos la foto, la info y los contadores a la cabeceraArtista principal
    cabeceraArtista.appendChild(foto);
    cabeceraArtista.appendChild(info);
    cabeceraArtista.appendChild(contadores);

    return cabeceraArtista;
}
