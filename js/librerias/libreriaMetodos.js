// ______________________________________________________________
// _____________________ CREACIÓN DE NODOS ______________________

export { creaNodoTextoId, creaNodoId, creaNodoConPadre, damePaises, generaImagenAleatoria, limpiaDatos, crearCampoGrupo, obtenerNombreFase, obtenerColorFase, obtenerEstadoPorFase, setCookie, getCookie };

/**
 * Función que crea un nodo simple
 * @param {string} tipoNodo --> Tipo de nodo a crear
 * @param {string} textoNodo --> Texto que le queremos meter
 * @param {string} id --> Id que le queremos asignar
 * @returns {HTMLElement} --> Devuelve el nodo creado listo para insertar
 */

function creaNodoTextoId(tipoNodo, textoNodo, id) {
    let nodo = "";
    let nodoText = "";
    switch (arguments.length) {
        case 0:
            throw "Se necesita al menos el tipo de elemento a crear.";
            break;
        case 1:
            nodo = document.createElement(tipoNodo);
            break;
        case 2:
            nodo = document.createElement(tipoNodo);
            nodoText = document.createTextNode(textoNodo);
            nodo.appendChild(nodoText);
            break;
        case 3:
            nodo = document.createElement(tipoNodo);
            nodoText = document.createTextNode(textoNodo);
            nodo.id = id;
            nodo.appendChild(nodoText);
            break;
    }
    return nodo;
}

/**
 * Función que crea un nodo simple con id
 * @param {string} tipoNodo --> Tipo de nodo a crear
 * @param {string} id --> Id que le queremos asignar
 * @returns {HTMLElement} --> Devuelve el nodo creado listo para insertar
 */
function creaNodoId(tipoNodo, id) {
    let nodo = "";
    switch (arguments.length) {
        case 0:
            throw "Se necesita al menos el tipo de elemento a crear.";
            break;

        case 1:
            nodo = document.createElement(tipoNodo);
            break;

        case 2:
            nodo = document.createElement(tipoNodo);
            nodo.id = id;
            break;
    }
    return nodo;
}

/**
 * Función que crea un nodo padre y un nodo hijo
 * @param {string} nodoPadre --> Tipo de nodo padre a crear
 * @param {string} textoPadre --> Texto que le queremos meter al nodo padre
 * @param {string} tipoNodo --> Tipo de nodo hijo a crear
 * @param {string} textoNodo --> Texto que le queremos meter al nodo hijo
 * @returns {HTMLElement} --> Devuelve el nodo padre con el nodo hijo integrado, listo para insertar
 */
function creaNodoConPadre(nodoPadre, textoPadre,tipoNodo, textoNodo) {
    let nodo = "";
    let nodoText = "";
    let nodoPa = "";
    let textoPa = "";

    switch (arguments.length) {
        case 0:
            throw "Se necesita al menos el tipo de elemento a crear.";
            break;

        case 1:
            nodo = document.createElement(tipoNodo);
            return nodo;
            break;

        case 2:
            nodo = document.createElement(tipoNodo);
            nodoText = document.createTextNode(textoNodo);
            nodo.appendChild(nodoText);
            return nodo;
            break;

        case 3:
            nodoPa = document.createElement(nodoPadre);
            nodo = document.createElement(tipoNodo);
            nodoText = document.createTextNode(textoNodo);

            nodo.appendChild(nodoText);
            nodoPa.appendChild(nodo);
            return nodoPa;
            break;

        case 4:
            nodoPa = document.createElement(nodoPadre);
            textoPa = document.createTextNode(textoPadre);

            nodo = document.createElement(tipoNodo);
            nodoText = document.createTextNode(textoNodo);

            nodo.appendChild(nodoText);

            nodoPa.appendChild(textoPa);
            nodoPa.appendChild(nodo);

            return nodoPa;
            break;
    }
}

/**
 * Función que crea un grupo de campo para los formularios
 * @param {string} labelTexto --> Texto de la etiqueta
 * @param {string} inputId --> Id
 * @param {string} inputTipo --> Tipo (text, email, password...)
 * @param {string} placeholder --> Placeholder
 * @returns {object} --> Devuelve los tres nodos para montar y para los eventos
 */
function crearCampoGrupo(labelTexto, inputId, inputTipo, placeholder) {

    // Crear el contenedor del grupo
    let grupo = creaNodoId("div");
    grupo.setAttribute("class", "campo-grupo");

    // Crear la etiqueta
    let etiqueta = creaNodoTextoId("label", labelTexto);
    etiqueta.setAttribute("for", inputId);

    // Crear el input
    let input = creaNodoId("input", inputId);
    input.setAttribute("type", inputTipo);
    input.setAttribute("placeholder", placeholder);
    input.setAttribute("class", "campo-input");

    // Crear el mensaje de error
    let error = creaNodoTextoId("p", "", "error-" + inputId);
    error.setAttribute("class", "error-mensaje oculto");

    // Enganchar los elementos al grupo
    grupo.appendChild(etiqueta);
    grupo.appendChild(input);
    grupo.appendChild(error);

    return { grupo, input, error };
}
// ______________________________________________________________
// _____________________ ELIMINACIÓN DE NODOS ______________________

/**
 * Función que elimina el contenido de un nodo padre, para evitar duplicados al cambiar entre vistas
 * @param {string} idContenedorPincipal --> Id del nodo padre que queremos limpiar
 * @param {string} idContenedorSecundario --> Id del nodo secundario que queremos eliminar del nodo padre
 * 
 */
function limpiaDatos(idContenedorPincipal, idContenedorSecundario) {

    if (document.getElementById(idContenedorPincipal)) {
        document.getElementById(idContenedorSecundario)
            .removeChild(document.getElementById(idContenedorPincipal));
    }
}

// _______________________________________________________________________
// ________________________ FUNCIONES AUXILIARES _________________________

// _________ COOKIES _________

/**
 * Función que guarda un dato en una cookie del navegador.
 * @param {string} nombre --> Nombre de la cookie
 * @param {string} valor --> Valor a guardar
 * @param {number} dias --> Tiempo de duración
 */
function setCookie(nombre, valor, dias) {
    let fechaExpira = new Date();
    fechaExpira.setDate(fechaExpira.getDate() + dias);
    document.cookie = nombre + "=" + valor + "; expires=" + fechaExpira.toUTCString() + "; path=/; SameSite=Lax";
}

/**
 * Función que lee el dat de una cookie por su nombre.
 * @param {string} nombre --> Nombre de la cookie
 * @returns {string|null} --> Dato almacenado en la cookie o null si no existe
 */
function getCookie(nombre) {
    let cookies = document.cookie.split("; ");
    let cookie = cookies.find(c => c.startsWith(nombre + "=")); // → Buscamos la cookie que empiece con el nombre indicado seguido de "="
    
    return cookie ? cookie.split("=")[1] : null;
}

// _________ OTRAS _________
/**
 * Función que devuelve un array con los países disponibles para elegir en el perfil, junto con su moneda y símbolo.
 * @returns {Array} --> Array de objetos con los países, su moneda y símbolo
 */
function damePaises() {
    let paises = [
    {
        nombre: "España",
        moneda: "EUR",
        simbolo: "€"
    },
    {
        nombre: "Italia",
        moneda: "EUR",
        simbolo: "€"
    },
    {
        nombre: "Francia",
        moneda: "EUR",
        simbolo: "€"
    },
    {
        nombre: "Portugal",
        moneda: "EUR",
        simbolo: "€"
    },
    {
        nombre: "Reino Unido",
        moneda: "GBP",
        simbolo: "£"
    },
    {
        nombre: "Estados Unidos",
        moneda: "USD",
        simbolo: "$"
    },
    {
        nombre: "Filipinas",
        moneda: "PHP",
        simbolo: "₱"
    },
    {
        nombre: "Japón",
        moneda: "JPY",
        simbolo: "¥"
    },
    {
        nombre: "China",
        moneda: "CNY",
        simbolo: "¥"
    }
];

    return paises;
}

/**
 * Función que genera un número aleatorio para elegir una imagen de fondo aleatoria de la carpeta /inicio/
 * @return --> Devuelve el nombre de la imagen aleatoria
 */
function generaImagenAleatoria() {

    let imagenes = [
        "celestial_body_359.jpg", "end_597.jpg","esencia_del_bosque_693.jpg",
        "fragmented_255.jpg", "Frog_boi.png","lunexus_982.jpg", "purplefox_548.jpg",
        "reflejo_espectral_628.jpg", "sea_monster_808.jpg","willow_311.jpg"
    ];

    return imagenes[Math.floor(Math.random() * imagenes.length)];
}

/**
 * Función que devuelve el nombre de una fase de encargo a partir de su número.
 * @param {number} num --> Número de fase (1-8)
 * @returns {string} --> Nombre de la fase
 */
function obtenerNombreFase(num) {
    const fases = {
        1: "Lluvia de ideas",
        2: "Pruebas",
        3: "Bocetado",
        4: "Revisión",
        5: "Corrección",
        6: "Desarrollo",
        7: "Detallado",
        8: "Finalizado"
    };
    return fases[num] || "Desconocida";
}

/**
 * Función que devuelve el color de fondo asociado a una fase de encargo.
 * @param {number} num --> Número de fase (1-8)
 * @returns {string} --> Color en formato hexadecimal
 */
function obtenerColorFase(num) {
    const colores = {
        1: "#ebbefd",    // Lluvia de ideas
        2: "#d07cf1",    // Pruebas
        3: "#bc46eb",    // Bocetado
        4: "#8937e7",    // Revisión
        5: "#6952eb",    // Corrección
        6: "#6696fd",    // Desarrollo
        7: "#9dd8ff",    // Detallado
        8: "#83ecff"     // Finalizado
    };
    return colores[num] || "#ebbefd";
}

/**
 * Devuelve el estado de un encargo a partir de su fase.
 * - Fase 1 (Lluvia de ideas) --> "pendiente"
 * - Fases 2-7                --> "en proceso"
 * - Fase 8 (Finalizado)      --> "completado"
 * 
 * @param {number} fase --> Número de fase (1-8)
 * @returns {string} --> Estado del encargo
 */
function obtenerEstadoPorFase(fase) {
    let estado = "";

    if (fase == 1) {
        estado = "pendiente";
    } else if (fase == 8) {
        estado = "completado";
    } else {
        estado = "en proceso";
    }

    return estado;
}
