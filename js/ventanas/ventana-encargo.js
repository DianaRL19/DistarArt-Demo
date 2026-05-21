// ______________________________________________________________
// _______________ VENTANA AUXILIAR - ENCARGO ___________________

import { obtenerEstadoPorFase, obtenerColorFase, obtenerNombreFase, damePaises } from "../librerias/libreriaMetodos.js";

// ______________________________________________________________
// PAR_METROS DE LA URL
// ______________________________________________________________

// Leemos los datos del encargo que gestion.js nos pasa por la URL
let params = new URLSearchParams(window.location.search);
let id = params.get("id"); // ? null si es un encargo nuevo
let idArtista = params.get("id_artista");
let esNuevo = id === null;
let faseSeleccionada = parseInt(params.get("fase")) || 1;

// ______________________________________________________________
// REFERENCIAS AL DOM
// ______________________________________________________________

let tituloVentana = document.getElementById("vencargo-titulo");
let inputNombre = document.getElementById("nombre");
let textareaDesc = document.getElementById("descripcion");
let imgVistaPrevia = document.getElementById("imagenPreview");
let inputImagen = document.getElementById("inputImagen");
let nombreArchivo = document.getElementById("nombreArchivo");
let contenedorFases = document.getElementById("vencargo-fases");
let selectEstado = document.getElementById("estado");
let inputFecha = document.getElementById("fecha");
let inputNombreCliente = document.getElementById("nombre_cliente");
let inputEmailCliente = document.getElementById("email_cliente");
let inputDireccion = document.getElementById("direccion_cliente");
let inputPais = document.getElementById("pais_cliente");
let inputPresupuesto = document.getElementById("presupuesto_cliente");
let inputPrecio = document.getElementById("precio");
let mensajeError = document.getElementById("vencargo-error");
let btnGuardar = document.getElementById("vencargo-guardar");

// ______________________________________________________________
// RELLENAMOS LOS CAMPOS CON LOS DATOS DEL ENCARGO
// ______________________________________________________________

tituloVentana.textContent = esNuevo ? "Nuevo Encargo" : "Editar Encargo";
inputNombre.value = params.get("nombre") || "";
textareaDesc.value = params.get("descripcion") || "";
inputFecha.value = params.get("fechaEntrega") || "";
inputNombreCliente.value = params.get("nombre_cliente") || "";
inputEmailCliente.value = params.get("email_cliente") || "";
inputDireccion.value = params.get("direccion_cliente") || "";
inputPresupuesto.value = params.get("presupuesto_cliente") || "";
inputPrecio.value = params.get("precio") || "";

// Vista previa de la imagen existente
let imagenActual = params.get("imagen");
if (imagenActual) {
    imgVistaPrevia.src = "../servidor/imagenes/encargos/" + imagenActual;
}

// Actualizamos la preview al seleccionar un archivo nuevo
inputImagen.addEventListener("change", function () {    
    let archivo = this.files[0];
    if (archivo) {
        imgVistaPrevia.src = URL.createObjectURL(archivo);
        nombreArchivo.textContent = archivo.name;
    }
});

// ______________________________________________________________
// BOTONES DE FASE

let btnsFase = [];

for (let i = 1; i <= 8; i++) {
    let btn = document.createElement("button");
    btn.textContent = obtenerNombreFase(i); // ? Etiqueta de la fase
    btn.setAttribute("type", "button");
    btn.setAttribute("class", "vencargo-btn-fase");
    btn.style.borderColor = obtenerColorFase(i);
    btn.style.color = faseSeleccionada === i ? "white" : obtenerColorFase(i);
    btn.style.backgroundColor = faseSeleccionada === i ? obtenerColorFase(i) : "transparent";

    btn.addEventListener("click", (function (num) {
        return function () {
            faseSeleccionada = num;
            btnsFase.forEach((b, idx) => {
                b.style.backgroundColor = idx + 1 === num ? obtenerColorFase(num) : "transparent";
                b.style.color = idx + 1 === num ? "white" : obtenerColorFase(idx + 1);
            });

            selectEstado.value = obtenerEstadoPorFase(num);
        };
    })(i));

    btnsFase.push(btn);
    contenedorFases.appendChild(btn);
}

// Estado inicial: derivado de la fase; si viene un estado expl_cito en la URL, lo respetamos
selectEstado.value = obtenerEstadoPorFase(faseSeleccionada);
let estadoParam = params.get("estado");
if (estadoParam) {
    selectEstado.value = estadoParam;
}

// ________________________________________
// ___________ SELECTOR DE PAÍS ___________


let paisActual = params.get("pais_cliente") || "";
damePaises().forEach(p => {
    let opt = document.createElement("option");
        opt.textContent = p.nombre + " (" + p.simbolo + ")";
        opt.setAttribute("value", p.nombre);
    if (p.nombre === paisActual) {
        opt.setAttribute("selected", "selected");
    }

    inputPais.appendChild(opt);
});

// ______________________________________________________________
// ___________ GUARDAR ENCARGO ___________

btnGuardar.addEventListener("click", function () {
    mensajeError.classList.add("oculto");
    mensajeError.textContent = "";

    let errores = [];

    if (!inputNombre.value.trim()) {
        errores.push("El nombre del encargo es obligatorio");
    }

    if (!inputNombreCliente.value.trim()) {
        errores.push("El nombre del cliente es obligatorio");
    }

    if (!inputEmailCliente.value.trim()) {
        errores.push("El email del cliente es obligatorio");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputEmailCliente.value.trim())) {
        errores.push("El email del cliente no es válido");
    }

    if (inputPrecio.value === "" || isNaN(inputPrecio.value)) {
        errores.push("El precio es obligatorio");
    } else if (parseFloat(inputPrecio.value) < 0) {
        errores.push("El precio no puede ser negativo");
    } else if (inputPresupuesto.value && parseFloat(inputPrecio.value) > parseFloat(inputPresupuesto.value)) {
        errores.push("El precio acordado no puede ser mayor que el presupuesto del cliente");
    }

    if (!inputFecha.value) {
        errores.push("La fecha de entrega es obligatoria");
    } else {
        let fechaEntrega = new Date(inputFecha.value);
        let fechaHoy = new Date();
        fechaHoy.setHours(0, 0, 0, 0);
        if (fechaEntrega < fechaHoy) {
            errores.push("La fecha de entrega no puede ser anterior a hoy");
        }
    }

    if (errores.length > 0) {
        mensajeError.textContent = errores.join(". ");
        mensajeError.classList.remove("oculto");
        return;
    }

    let fd = new FormData();

    if (!esNuevo) {
        fd.append("id", id);
    }

    fd.append("nombre", inputNombre.value.trim());
    fd.append("descripcion", textareaDesc.value.trim());
    fd.append("nombre_cliente", inputNombreCliente.value.trim());
    fd.append("email_cliente", inputEmailCliente.value.trim());
    fd.append("direccion_cliente", inputDireccion.value.trim());
    fd.append("pais_cliente", inputPais.value.trim());
    fd.append("presupuesto_cliente", inputPresupuesto.value || "0");
    fd.append("id_artista", idArtista);
    fd.append("precio", inputPrecio.value);
    fd.append("fechaEntrega", inputFecha.value);
    fd.append("estado", selectEstado.value);
    fd.append("fase", faseSeleccionada);

    let archivoImg = inputImagen.files[0];

    if (archivoImg) {
        fd.append("imagen", archivoImg);
    }

    btnGuardar.disabled = true;
    btnGuardar.textContent = "Guardando...";

    // Enviamos los datos al servidor; al terminar avisamos a la ventana principal y cerramos
    fetch("../servidor/php/guardarEncargo.php", { method: "POST", body: fd })
    .then(r => r.json())
    .then(data => {
        if (data.success) {
            if (window.opener && !window.opener.closed && window.opener.notificarEncargoGuardado) {
                window.opener.notificarEncargoGuardado(data.encargo); // ? Actualizamos en memoria
            }

            window.close();

            } else {
                mensajeError.textContent = data.error || "Error al guardar";
                mensajeError.classList.remove("oculto");
                btnGuardar.disabled = false;
                btnGuardar.textContent = "Guardar encargo";
            }
    }) .catch(() => {
        mensajeError.textContent = "Error de conexión con el servidor";
        mensajeError.classList.remove("oculto");
        btnGuardar.disabled = false;
        btnGuardar.textContent = "Guardar encargo";
    });
});

