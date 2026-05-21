// ______________________________________________________________
// _________________ VISTA - AUTENTIFICACIÓN ____________________
//
// Contiene todo lo del login y registro

import { creaNodoTextoId, creaNodoId, crearCampoGrupo, generaImagenAleatoria, setCookie, getCookie} from "../librerias/libreriaMetodos.js";
import { Artista } from "../clases/Artista.js";
import { datosGeneralesProyecto } from "../main.js";
import { mostrarPortfolio } from "./portfolio.js";
import { mostrarGestion } from "./gestion.js";
import { mostrarPerfil } from "./perfil.js";

export { mostrarAutentificacion };

// _____________ PREPARACIÓN DE LA VISTA - AUTENTIFICACIÓN _____________

/**
 * Función que crea la estructura HTML del panel izquierdo del login y registro (imagen de fondo, cubierta, frase y subfrase).
 * @returns {HTMLElement} - Devuelve el panel izquierdo completo listo para montar
 */
function crearPanelIzquierdo() {

    // Panel izquierdo
    let panelIzquierdo = creaNodoId("div");
    panelIzquierdo.setAttribute("class", "login-panel-izquierdo");
    panelIzquierdo.style.backgroundImage = "url('./servidor/imagenes/inicio/" + generaImagenAleatoria() + "')";

    // Cubierta semitransparente con texto
    let cubierta = creaNodoId("div");
    cubierta.setAttribute("class", "login-cubierta");

    // Titulo
    let frase = creaNodoTextoId("h2", "Creando obras maestras llenas de inspiración.");
    frase.setAttribute("class", "login-frase");

    // Frase inspiradora
    let subfrase = creaNodoTextoId("p", "El espacio donde cada trazo cuenta y cada encargo es una historia.");
    subfrase.setAttribute("class", "login-subfrase");

    // Enganchamos los elementos al panel izquierdo
    cubierta.appendChild(frase);
    cubierta.appendChild(subfrase);
    panelIzquierdo.appendChild(cubierta);

    return panelIzquierdo;
}

/**
 * Función que crea la barra de pestañas con botones simples.
 * @returns {Object} - Devuelve los botones y la barra
 */
function crearBarraPestanias() {

    // Barra visual con botones
    let barra = creaNodoId("div");
    barra.setAttribute("class", "pestanias-barra");

    // Botón Login → Se activa por defecto
    let btnLogin = creaNodoTextoId("button", "Login");
    btnLogin.setAttribute("id", "btnPestaniaLogin");
    btnLogin.setAttribute("type", "button");
    btnLogin.setAttribute("class", "pestania-btn activo");

    // Botón Registro
    let btnRegistro = creaNodoTextoId("button", "Registro");
    btnRegistro.setAttribute("id", "btnPestaniaRegistro");
    btnRegistro.setAttribute("type", "button");
    btnRegistro.setAttribute("class", "pestania-btn");

    // Enganchamos los botones a la barra
    barra.appendChild(btnLogin);
    barra.appendChild(btnRegistro);

    return { btnLogin, btnRegistro, barra };
}

/**
 * Función que crea el formulario de login con sus campos, botón y mensaje de error.
 * @returns {object} - Devuelve el panel completo y los elementos necesarios para los eventos
 */
function crearFormularioLogin() {
    // Panel del formulario
    let panel = creaNodoId("div");
    panel.setAttribute("class", "auth-panel-formulario");

    // Subtítulo
    let subtitulo = creaNodoTextoId("p", "Bienvenido/a de nuevo, artista.");
    subtitulo.setAttribute("class", "login-subtitulo");

    // Nick y contraseña → los pre-rellena desde cookies si existen ("Recuérdame")
    let nick = crearCampoGrupo("Nick", "campoNickLogin", "text", "");
    nick.input.value = getCookie("nick_recordado") || "";

    let contrasenia = crearCampoGrupo("Contraseña", "campoContraseniaLogin", "password", "");
    contrasenia.input.value = getCookie("contrasenia_recordada") || "";

    // Checkbox "Recuérdame"
    let filaRecordar = creaNodoId("div");
    filaRecordar.setAttribute("class", "campo-recordar");

    // Checkbox
    let checkRecordar = creaNodoId("input", "checkRecordar");
    checkRecordar.setAttribute("type", "checkbox");
    checkRecordar.checked = getCookie("nick_recordado") !== null;

    // Etiqueta del checkbox
    let labelRecordar = creaNodoTextoId("label", "Recuérdame");
    labelRecordar.setAttribute("for", "checkRecordar");
    labelRecordar.setAttribute("class", "label-recordar");

    // Enganchamos el checkbox y su etiqueta
    filaRecordar.appendChild(checkRecordar);
    filaRecordar.appendChild(labelRecordar);

    //___
    // Mensaje de error general (inicialmente oculto)
    let errorLogin = creaNodoTextoId("p", "Nick o contraseña incorrectos", "errorLogin");
    errorLogin.setAttribute("class", "login-error oculto");

    // Botón Entrar
    let btnEntrar = creaNodoTextoId("button", "Entrar a la galería →", "btnEntrar");
    btnEntrar.setAttribute("type", "button");
    btnEntrar.setAttribute("class", "btn-login");

    // Enganchamos los elementos al panel
    panel.appendChild(subtitulo);
    panel.appendChild(nick.grupo);
    panel.appendChild(contrasenia.grupo);
    panel.appendChild(filaRecordar);
    panel.appendChild(errorLogin);
    panel.appendChild(btnEntrar);

    // Devolvemos el panel completo y los elementos que vamos a necesitar para los eventos
    return { panel, campoNickLogin: nick.input, campoContraseniaLogin: contrasenia.input, checkRecordar, errorLogin, btnEntrar };
}

/**
 * Función que crea el select de país con sus opciones.
 * @returns {object} - Devuelve el grupo, el select y el mensaje de error
 */
function crearSelectPais() {
    // Grupo del select
    let grupo = creaNodoId("div");
    grupo.setAttribute("class", "campo-grupo");

    // Etiqueta
    let etiqueta = creaNodoTextoId("label", "País");
    etiqueta.setAttribute("for", "selectPais");

    // Select de países
    let select = creaNodoId("select", "selectPais");
    select.setAttribute("class", "campo-select");

    // Opción por defecto
    let opcionDefecto = creaNodoTextoId("option", "- Elige tu país -");
    opcionDefecto.setAttribute("value", "");

    select.appendChild(opcionDefecto);

    // Rellenamos con array de países
    datosGeneralesProyecto.paises.forEach(p => {
        let opcion = creaNodoTextoId("option", p.nombre + " (" + p.simbolo + ")");
        opcion.setAttribute("value", p.nombre);
        select.appendChild(opcion);
    });

    // Mensaje de error
    let error = creaNodoTextoId("p", "", "errorPais");
    error.setAttribute("class", "error-mensaje oculto");

    // Enganchamos los elementos al grupo
    grupo.appendChild(etiqueta);
    grupo.appendChild(select);
    grupo.appendChild(error);

    return { grupo, select, error };
}

/**
 * Función que crea el formulario de registro con sus campos, botón y mensajes de error.
 * @returns {object} - Devuelve el panel completo y los elementos para los eventos
 */
function crearFormularioRegistro() {

    // Panel del formulario
    let panel = creaNodoId("div");
    panel.setAttribute("class", "auth-panel-formulario");

    // Subtítulo
    let subtitulo = creaNodoTextoId("p", "Crea tu cuenta de artista.");
    subtitulo.setAttribute("class", "login-subtitulo");

    // Campos de texto reutilizables
    let nick = crearCampoGrupo("Nick", "campoNick", "text", "");
    let nombre = crearCampoGrupo("Nombre", "campoNombre", "text", "");
    let email = crearCampoGrupo("Email", "campoEmail", "email", "ejemplo@email.com");
    let contrasenia = crearCampoGrupo("Contraseña", "campoContrasenia", "password", "Mínimo 6 caracteres");
    let confirmacion = crearCampoGrupo("Confirmar contraseña", "campoConfirmacion", "password", "Repite tu contraseña");

    // Select país separado
    let pais = crearSelectPais();

    // Botón registrar
    let btnRegistrar = creaNodoTextoId("button", "Registrarse →", "btnRegistrar");
    btnRegistrar.setAttribute("type", "button");
    btnRegistrar.setAttribute("class", "btn-login");

    // Enganchamos los elementos al panel
    panel.appendChild(subtitulo);

    // Nick y Nombre en la misma fila
    let filaNickNombre = creaNodoId("div");
    filaNickNombre.setAttribute("class", "registro-fila");

    // Enganchamos los campos
    filaNickNombre.appendChild(nick.grupo);
    filaNickNombre.appendChild(nombre.grupo);

    // Enganchamos la fila al panel
    panel.appendChild(filaNickNombre);

    // Email y País en la misma fila
    let filaEmailPais = creaNodoId("div");
    filaEmailPais.setAttribute("class", "registro-fila");

    // Enganchamos los campos
    filaEmailPais.appendChild(email.grupo);
    filaEmailPais.appendChild(pais.grupo);

    panel.appendChild(filaEmailPais);

    // Contraseña y Confirmación en la misma fila
    let filaContrasenas = creaNodoId("div");
    filaContrasenas.setAttribute("class", "registro-fila");

    // Enganchamos los campos
    filaContrasenas.appendChild(contrasenia.grupo);
    filaContrasenas.appendChild(confirmacion.grupo);

    panel.appendChild(filaContrasenas);
    panel.appendChild(btnRegistrar);

    // Devolvemos un objeto con el panel completo y los elementos que vamos a necesitar para los eventos
    return {
        panel,
        camposEntrada: {
            nick: nick.input,
            nombre: nombre.input,
            email: email.input,
            contrasenia: contrasenia.input,
            confirmacion: confirmacion.input,
            pais: pais.select
        },
        camposError: {
            nick: nick.error,
            nombre: nombre.error,
            email: email.error,
            contrasenia: contrasenia.error,
            confirmacion: confirmacion.error,
            pais: pais.error
        },
        btnRegistrar
    };
}

/**
 * Función que monta la estructura de autenticación con 2 paneles separados.
 * @returns {object} - Devuelve el contenedor principal y los elementos para los eventos
 */
function crearEstructuraAutentificacion() {

    let pantallaAuth = creaNodoId("div", "pantalla-auth");
    let estructura = creaNodoId("div");
    estructura.setAttribute("class", "login-estructura");

    // Panel izquierdo - siempre visible con imagen de fondo y texto
    let panelIzquierdo = crearPanelIzquierdo();
    let pestanias = crearBarraPestanias();
    let login = crearFormularioLogin();
    let registro = crearFormularioRegistro();

    // Panel derecho con los formularios de login y registro - (solo uno visible a la vez)
    let panelDerecho = creaNodoId("div");
    panelDerecho.setAttribute("class", "login-panel-derecho");

    // Logo-titulo de la aplicación
    let logoImg = creaNodoId("img");
    logoImg.src = "./servidor/imagenes/logo-mas-calidad.png";
    logoImg.setAttribute("class", "login-logo login-logo--img");

    // Contenedor de los formularios (con los 2 paneles)
    let contenedorFormularios = creaNodoId("div");
    contenedorFormularios.setAttribute("class", "auth-formularios");

    // Panel de login (visible por defecto)
    let panelLogin = login.panel;
    panelLogin.setAttribute("id", "pantalla-login");
    panelLogin.classList.add("deslizar-entrada");

    // Panel de registro (oculto por defecto)
    let panelRegistro = registro.panel;
    panelRegistro.setAttribute("id", "pantalla-registro");
    panelRegistro.classList.add("oculto");

    // Enganchamos los paneles al contenedor de formularios
    contenedorFormularios.appendChild(panelLogin);
    contenedorFormularios.appendChild(panelRegistro);

    // Enganchamos el logo, la barra de pestañas y el contenedor de formularios al panel derecho
    panelDerecho.appendChild(logoImg);
    panelDerecho.appendChild(pestanias.barra);
    panelDerecho.appendChild(contenedorFormularios);

    // Enganchamos el panel izquierdo y derecho a la estructura principal, y esta al main
    estructura.appendChild(panelIzquierdo);
    estructura.appendChild(panelDerecho);
    pantallaAuth.appendChild(estructura);

    // Devolvemos un objeto con los elementos que vamos a necesitar para los eventos
    return {
        btnPestaniaLogin: pestanias.btnLogin,
        pantallaAuth,
        btnPestaniaRegistro: pestanias.btnRegistro,
        panelLogin,
        panelRegistro,
        campoNickLogin: login.campoNickLogin,
        campoContraseniaLogin: login.campoContraseniaLogin,
        errorLogin: login.errorLogin,
        checkRecordar: login.checkRecordar,
        btnEntrar: login.btnEntrar,
        camposEntrada: registro.camposEntrada,
        camposError: registro.camposError,
        btnRegistrar: registro.btnRegistrar
    };
}

// _____________ AUTENTIFICACIÓN - Funciones principales _____________

/**
 * Crea la pantalla de carga con el lápiz animado que se muestra tras el login.
 * @returns {HTMLElement}
 */
function crearPantallaCarga() {
    let div = creaNodoId("div");
    div.setAttribute("class", "pantalla-carga");

    div.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" height="200px" width="200px" viewBox="0 0 200 200" class="pencil">
            <defs>
                <clipPath id="pencil-eraser">
                    <rect height="30" width="30" ry="5" rx="5"></rect>
                </clipPath>
            </defs>
            <circle transform="rotate(-113,100,100)" stroke-linecap="round" stroke-dashoffset="439.82" stroke-dasharray="439.82 439.82" stroke-width="2" stroke="currentColor" fill="none" r="70" class="pencil__stroke"></circle>
            <g transform="translate(100,100)" class="pencil__rotate">
                <g fill="none">
                    <circle transform="rotate(-90)" stroke-dashoffset="402" stroke-dasharray="402.12 402.12" stroke-width="30" stroke="hsl(223,90%,50%)" r="64" class="pencil__body1"></circle>
                    <circle transform="rotate(-90)" stroke-dashoffset="465" stroke-dasharray="464.96 464.96" stroke-width="10" stroke="hsl(223,90%,60%)" r="74" class="pencil__body2"></circle>
                    <circle transform="rotate(-90)" stroke-dashoffset="339" stroke-dasharray="339.29 339.29" stroke-width="10" stroke="hsl(223,90%,40%)" r="54" class="pencil__body3"></circle>
                </g>
                <g transform="rotate(-90) translate(49,0)" class="pencil__eraser">
                    <g class="pencil__eraser-skew">
                        <rect height="30" width="30" ry="5" rx="5" fill="hsl(223,90%,70%)"></rect>
                        <rect clip-path="url(#pencil-eraser)" height="30" width="5" fill="hsl(223,90%,60%)"></rect>
                        <rect height="20" width="30" fill="hsl(223,10%,90%)"></rect>
                        <rect height="20" width="15" fill="hsl(223,10%,70%)"></rect>
                        <rect height="20" width="5" fill="hsl(223,10%,80%)"></rect>
                        <rect height="2" width="30" y="6" fill="hsla(223,10%,10%,0.2)"></rect>
                        <rect height="2" width="30" y="13" fill="hsla(223,10%,10%,0.2)"></rect>
                    </g>
                </g>
                <g transform="rotate(-90) translate(49,-30)" class="pencil__point">
                    <polygon points="15 0,30 30,0 30" fill="hsl(33,90%,70%)"></polygon>
                    <polygon points="15 0,6 30,0 30" fill="hsl(33,90%,50%)"></polygon>
                    <polygon points="15 0,20 10,10 10" fill="hsl(223,10%,10%)"></polygon>
                </g>
            </g>
        </svg>
        <p class="carga-texto">Preparando tu galería...</p>
    `;

    return div;
}

/**
 * Función que controla el login:
 *  - Comprueba las credenciales, muestra los mensajes de error, etc.
 * @param {object} elementos
 */
function controlaLogin(elementos) {

    let nick = elementos.campoNickLogin.value.trim();
    let contrasenia = elementos.campoContraseniaLogin.value.trim();
    let artista = datosGeneralesProyecto.artistas.find(a => a.nick === nick && a.contrasenia === contrasenia);

    if (artista) {
        // Guardamos el id del artista conectado en sessionStorage para usarlo en otras pantallas
        sessionStorage.setItem("artistaConectado", artista.id);

        // Cookie "Recuérdame" - guardamos el nick 7 días o la eliminamos si se desmarca la opción
        if (elementos.checkRecordar.checked) {
            setCookie("nick_recordado", nick, 7);
            setCookie("contrasenia_recordada", contrasenia, 7);
        } else {
            setCookie("nick_recordado", "", -1);
            setCookie("contrasenia_recordada", "", -1);
        }

        elementos.pantallaAuth.remove();

        // Eliminamos la cabecera antigua para evitar duplicaciones
        let cabeceraAntigua = document.getElementById("cabecera");
        if (cabeceraAntigua) {
            cabeceraAntigua.remove();
        }

        // Mostramos la pantalla de carga con el lápiz animado
        let pantallaCarga = crearPantallaCarga();
        document.body.appendChild(pantallaCarga);

        // Guardamos la vista antes de entrar al timeout para que esté disponible dentro
        let ultimaVista = getCookie("ultima_vista");

        setTimeout(() => {
            pantallaCarga.classList.add("carga-salida"); // → Desaparece el lápiz
            setTimeout(() => {
                pantallaCarga.remove();
                if (ultimaVista === "gestion") {
                    mostrarGestion();
                } else if (ultimaVista === "perfil") {
                    mostrarPerfil();
                } else {
                    mostrarPortfolio();
                }
            }, 400);
        }, 1700);

    } else {
        elementos.errorLogin.classList.remove("oculto");
    }
}

/**
 * Función que controla el registro:
 * - Valida los campos, muestra los mensajes de error, registra el nuevo artista, etc.
 * @param {object} elementos 
 */
function controlaRegistro(elementos) {

    // Recogemos los datos de los campos
    let nick = elementos.camposEntrada.nick.value.trim();
    let nombre = elementos.camposEntrada.nombre.value.trim();
    let email = elementos.camposEntrada.email.value.trim();
    let contrasenia = elementos.camposEntrada.contrasenia.value.trim();
    let confirmacion = elementos.camposEntrada.confirmacion.value.trim();
    let pais = elementos.camposEntrada.pais.value.trim();

    // Ocultamos todos los posibles mensajes de error antes de validar
    Object.values(elementos.camposError).forEach(e => e.classList.add("oculto"));

    let hayErrores = false;

    // Validamos cada campo y mostramos su mensaje de error si no es válido
    let vNick = validarNick(nick);
    if (!vNick.valido) { 
        elementos.camposError.nick.textContent = vNick.mensaje; 
        elementos.camposError.nick.classList.remove("oculto"); 
        hayErrores = true; 
    }

    let vNombre = validarNombre(nombre);
    if (!vNombre.valido) { 
        elementos.camposError.nombre.textContent = vNombre.mensaje; 
        elementos.camposError.nombre.classList.remove("oculto"); 
        hayErrores = true; 
    }

    let vEmail = validarEmail(email);
    if (!vEmail.valido) { 
        elementos.camposError.email.textContent = vEmail.mensaje; 
        elementos.camposError.email.classList.remove("oculto"); 
        hayErrores = true; 
    }

    let vContrasenia = validarContrasenia(contrasenia);
    if (!vContrasenia.valido) { 
        elementos.camposError.contrasenia.textContent = vContrasenia.mensaje; 
        elementos.camposError.contrasenia.classList.remove("oculto"); 
        hayErrores = true; 
    }

    let vConfirmacion = validarConfirmacionContrasenia(contrasenia, confirmacion);
    if (!vConfirmacion.valido) { 
        elementos.camposError.confirmacion.textContent = vConfirmacion.mensaje; 
        elementos.camposError.confirmacion.classList.remove("oculto"); 
        hayErrores = true; 
    }

    if (pais === "") { 
        elementos.camposError.pais.textContent = "Por favor, elige un país."; 
        elementos.camposError.pais.classList.remove("oculto"); 
        hayErrores = true; 
    }

    if (!hayErrores) {
        registrarArtista(nick, nombre, email, contrasenia, pais);
    }
}

/**
 * Función que controla la visualización de las pestañas del Login y el Registro.
 * @param {object} elementos
 */
function controlaPestanias(elementos) {
    // Evento para mostrar el panel de Login
    elementos.btnPestaniaLogin.addEventListener("click", function () {
        elementos.panelLogin.classList.remove("oculto");
        elementos.panelLogin.classList.add("deslizar-entrada");
        elementos.panelRegistro.classList.add("oculto");
        elementos.btnPestaniaLogin.classList.add("activo");
        elementos.btnPestaniaRegistro.classList.remove("activo");
    });

    // Evento para mostrar el panel de Registro
    elementos.btnPestaniaRegistro.addEventListener("click", function () {
        elementos.panelLogin.classList.add("oculto");
        elementos.panelRegistro.classList.remove("oculto");
        elementos.panelRegistro.classList.add("deslizar-entrada");
        elementos.btnPestaniaLogin.classList.remove("activo");
        elementos.btnPestaniaRegistro.classList.add("activo");
    });
}

/**
 * Función que asigna los eventos a los botones y campos del panel de autentificación.
 * @param {object} elementos
 */
function aniadirEventosAutentificacion(elementos) {
    elementos.btnEntrar.addEventListener("click", () => controlaLogin(elementos));
    elementos.btnRegistrar.addEventListener("click", () => controlaRegistro(elementos));
    controlaPestanias(elementos);
}

// ___________________________________________________________________________________
// _________________ FUNCION PRINCIPAL DE LA VISTA - AUTENTIFICACIÓN _________________

/**
 * Función principal que muestra el panel de autentificación:
 *  - Crea la estructura HTML, la monta en el main y asigna los eventos.
 */
function mostrarAutentificacion() {
    let elementos = crearEstructuraAutentificacion(); // → Creamos la estructura y obtenemos los elementos para los eventos
    datosGeneralesProyecto.mainPrincipal.appendChild(elementos.pantallaAuth); // → Montamos la vista en el main
    aniadirEventosAutentificacion(elementos); // → Asignamos los eventos a los botones y campos
}

// ________________________ FUNCIONES AUXILIARES _________________________

/**
 * Función que genera un id único para un nuevo artista, incrementando el id más alto encontrado en el array de artistas.
 *   - Si el array de artistas está vacío, devuelve 1 como primer id.
 * @returns {number} - Devuelve un id único para el artista
 */
function generarIdArtista() {
    if (datosGeneralesProyecto.artistas.length === 0) {
        return 1; // → Si no hay artistas, el primer id será 1
    }

    let maxId = Math.max(...datosGeneralesProyecto.artistas.map(a => a.id)); // → Buscamos el id más alto
    return maxId + 1; // → Devolvemos el siguiente id
}

/**
 * Función que valida que el nick no exista ya en el json y cumpla el formato.
 * @param {string} nick - El nick a validar
 * @returns {object} - Devuelve un objeto con las propiedades 'valido' (boolean) y 'mensaje' (string)
 */
function validarNick(nick) {
    let regexNick = /^[a-zA-Z0-9._\-]{3,20}$/;

    if (!regexNick.test(nick)) {
        return { valido: false, mensaje: "El nick debe tener 3-20 caracteres, caracteres alfanuméricos, punto y guion bajo." };
    }

    // Verificamos que no exista ya en el json de artistas
    let nickExistente = datosGeneralesProyecto.artistas.find(a => a.nick === nick);
    if (nickExistente) {
        return { valido: false, mensaje: "Este nick no está disponible. Elige otro." };
    }

    return { valido: true, mensaje: "" };
}

/**
 * Función que valida que el nombre solo contenga letras y espacios.
 * @param {string} nombre - El nombre a validar
 * @returns {object} - Devuelve un objeto con las propiedades 'valido' (boolean) y 'mensaje' (string)
 */
function validarNombre(nombre) {
    let regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/;

    if (!regexNombre.test(nombre)) {
        return { valido: false, mensaje: "El nombre solo puede contener letras (entre 2 y 50 caracteres)." };
    }

    return { valido: true, mensaje: "" };
}

/**
 * Función que valida que el email sea una dirección válida (formato básico).
 * @param {string} email - El email a validar
 * @returns {object} - Devuelve un objeto con las propiedades 'valido' (boolean) y 'mensaje' (string)
 */
function validarEmail(email) {
    let regexEmail = /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!regexEmail.test(email)) {
        return { valido: false, mensaje: "Por favor, introduce un email válido (ejemplo: tu@email.com)." };
    }

    return { valido: true, mensaje: "" };
}

/**
 * Función que valida que la contraseña tenga al menos 6 caracteres con letras y números.
 * @param {string} contrasenia - La contraseña a validar
 * @returns {object} - Devuelve un objeto con las propiedades 'valido' (boolean) y 'mensaje' (string)
 */
function validarContrasenia(contrasenia) {
    let regexContrasenia = /^[a-zA-Z0-9@#$%^&*]{6,}$/;

    if (!regexContrasenia.test(contrasenia)) {
        return { valido: false, mensaje: "La contraseña debe tener al menos 6 caracteres (letras, números o símbolos)." };
    }

    return { valido: true, mensaje: "" };
}

/**
 * Función que verifica que las dos contraseñas sean iguales.
 * @param {string} contrasenia - La contraseña original
 * @param {string} confirmacion - La contraseña repetida para comparar y confirmar
 * @returns {object}
 */
function validarConfirmacionContrasenia(contrasenia, confirmacion) {
    if (contrasenia !== confirmacion) {
        return { valido: false, mensaje: "Las contraseñas no coinciden." };
    }

    return { valido: true, mensaje: "" };
}

// ____________________________________________________________
// _________________ REGISTRAR NUEVO ARTISTA _________________

/**
 * Función que registra un nuevo artista en el php (fetch POST).
 * Crea un objeto Artista con sus datos, lo envía al php y actualiza sessionStorage.
 * @param {string} nick 
 * @param {string} nombre 
 * @param {string} email 
 * @param {string} contrasenia 
 * @param {string} pais 
 */
function registrarArtista(nick, nombre, email, contrasenia, pais) {

    // Generamos un id para el nuevo artista
    let nuevoId = generarIdArtista();

    // Creamos el objeto Artista con los datos del formulario (algunos campos los dejamos vacíos)
    let nuevoArtista = new Artista(nuevoId, nick, nombre, contrasenia, email, "", "ImgPerfilDefault.png", "", pais, {});

    // Lo añadimos directamente al array en memoria
    datosGeneralesProyecto.artistas.push(nuevoArtista);

    sessionStorage.setItem("artistaConectado", nuevoId);

    // Eliminamos la pantalla de autenticación
    document.getElementById("pantalla-auth").remove();

    // Eliminamos la cabecera antigua si existe
    let cabeceraAntigua = document.getElementById("cabecera");
    if (cabeceraAntigua) {
        cabeceraAntigua.remove();
    }

    mostrarPortfolio();
}
