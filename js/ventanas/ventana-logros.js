// _____________________________________________________________
// _______________ VENTANA AUXILIAR - LOGROS ___________________

// ——————————————————————————————————————————————————————————————
//               PARÁMETROS DE LA URL
// ——————————————————————————————————————————————————————————————

// Leemos los datos de los logros que perfil.js nos pasa por la URL
let params = new URLSearchParams(window.location.search);
let logros = JSON.parse(params.get("logros") || "[]");
let estado = JSON.parse(params.get("estado") || "{}");

// ——————————————————————————————————————————————————————————————
//               GENERAMOS LA LISTA DE LOGROS
// ——————————————————————————————————————————————————————————————

let listaLogros = document.getElementById("lista-logros");

logros.forEach((logrito, i) => {
    let desbloqueado = estado[logrito.titulo] === true;

    let fila = document.createElement("div");
    fila.setAttribute("class", "vlogros-fila");
    fila.style.setProperty("--delay", `${i * 0.08}s`);

    let icono = document.createElement("img");
    icono.setAttribute("src", "../servidor/imagenes/logros/" + logrito.imagen);
    icono.setAttribute("class", "vlogros-icono");

    let info = document.createElement("div");
    info.setAttribute("class", "vlogros-info");

    let nombre = document.createElement("span");
    nombre.setAttribute("class", "vlogros-nombre");
    nombre.textContent = logrito.titulo;

    let descripcion = document.createElement("span");
    descripcion.setAttribute("class", "vlogros-descripcion");
    descripcion.textContent = logrito.info;

    let etiqueta = document.createElement("span");
    etiqueta.setAttribute("class", desbloqueado ? "vlogros-etiqueta" : "vlogros-etiqueta bloqueado");
    etiqueta.textContent = desbloqueado ? "✓ Desbloqueado" : "Bloqueado";

    info.appendChild(nombre);
    info.appendChild(descripcion);
    info.appendChild(etiqueta);

    fila.appendChild(icono);
    fila.appendChild(info);
    listaLogros.appendChild(fila);
});
