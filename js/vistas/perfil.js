// ______________________________________________________
// _________________ VISTA - PERFIL _____________________

import { creaNodoTextoId, creaNodoId, setCookie } from "../librerias/libreriaMetodos.js";
import { crearCabeceraPrincipal, crearHeaderArtista } from "../librerias/libreriaComponentes.js";
import { datosGeneralesProyecto } from "../main.js";

export { mostrarPerfil };

// _____ VENTANA AUXILIAR A CONFIRMACIÓN RED SOCIAL _____

/**
 * Función que muestra una ventana auxiliar estilo modal de confirmación antes de redirigir al usuario a una de las redes sociales.
 * @param {string} nombre - Nombre de la red social (ej: "Instagram")
 * @param {string|null} url - URL destino o null si no tiene cuenta configurada
 */
function mostrarConfirmacionRed(nombre, url) {
    
    // Creamos un contendor que tendrá un fondo borroso y oscurito para centrar la atención en la ventana de confirmación.
    let conteFondoBorrosoOscuro = creaNodoId("div");
    conteFondoBorrosoOscuro.setAttribute("class", "fondo-borroso-oscuro");

    // Craemos el contenedor de la ventana auxiliar
    let conteVAux = creaNodoId("div");
    conteVAux.setAttribute("class", "confirmacion-conteVAux");

    // Mensaje de confirmación
    let mensaje = creaNodoTextoId("p", '\u00bfDesea ir a \"' + nombre + '\"?');
    mensaje.setAttribute("class", "confirmacion-mensaje");

    // Botones de confirmar y cancelar
    let botones = creaNodoId("div");
    botones.setAttribute("class", "confirmacion-botones");

    let btnConfirmar = creaNodoTextoId("button", "Confirmar");
    btnConfirmar.setAttribute("class", "btn-confirmar-red");

    let btnCancelar = creaNodoTextoId("button", "Cancelar");
    btnCancelar.setAttribute("class", "btn-cancelar-red");

    // Evento de los botones
    btnConfirmar.addEventListener("click", function () {
        conteFondoBorrosoOscuro.remove();
        if (url) {
            window.open(url, "_blank", "noopener,noreferrer");
        }            
    });

    btnCancelar.addEventListener("click", function () {
        conteFondoBorrosoOscuro.remove();
    });

    // Cerrar al pulsar fuera del contenedor de la ventana auxiliar
    conteFondoBorrosoOscuro.addEventListener("click", function (e) {
        if (e.target == conteFondoBorrosoOscuro) {
            conteFondoBorrosoOscuro.remove();
        }
    });

    // Enganchamos los componentes
    botones.appendChild(btnConfirmar);
    botones.appendChild(btnCancelar);
    conteVAux.appendChild(mensaje);
    conteVAux.appendChild(botones);
    conteFondoBorrosoOscuro.appendChild(conteVAux);
    document.body.appendChild(conteFondoBorrosoOscuro);
}

// ____________________________________________
// ____ SECCIÓN 1 - INFORMACIÓN (editable) ____

/**
 * Crea la tarjeta de información editable del artista (campos + lógica de edición inline).
 * @param {object} artista - Objeto Artista
 * @param {number} idArtista - Id del artista conectado
 * @returns {HTMLElement}
 */
function crearTarjetaInformacion(artista, idArtista) {

    // Creamos el contenedor para la info
    let infotarjeta = creaNodoId("div");
    infotarjeta.setAttribute("class", "perfil-info-tarjeta");

    // Título de la sección
    let infoTitle = creaNodoTextoId("h3", "Información");

    // __ IMAGEN DE PERFIL (visible solo en diseño para móvil) ____________
    let fotoPerfil = creaNodoId("img");
    fotoPerfil.src = "./servidor/imagenes/perfiles/" + artista.imgPerfil;
    fotoPerfil.setAttribute("class", "info-foto-movil");
    fotoPerfil.setAttribute("alt", artista.nombre);
    //_____________________________________________________________________

    // Contenedor para los campos de la info
    let infoItems = creaNodoId("div");
    infoItems.setAttribute("class", "info-campos");

    // Creamos cada campo con su etiqueta y su valor, indicando si es editable o no y el tipo de campo que se usará para editarlo
    let campos = [
        { 
            label: "Email",
            valor: artista.email,
            editable: false,
            tag: "span" 
        },
        { 
            label: "Descripción",
            valor: artista.descripcion,
            editable: true,
            tag: "textarea"
        },
        { 
            label: "Especialidad",
            valor: artista.especialidad,
            editable: true,
            tag: "input"
        },
        { 
            label: "Ubicación",
            valor: artista.ubicacion,
            editable: true,
            tag: "select"
        }
    ];

    let camposHtml = {}; // → Guardamos los elementos HTML de los campos en un objeto para acceder a ellos fácilmente

    campos.forEach(campo => {

        // Creamos el contenedor del campo
        let item = creaNodoId("div");
        item.setAttribute("class", "info-campo");

        // Etiqueta del campo
        let labelEl = creaNodoTextoId("span", campo.label);
        labelEl.setAttribute("class", "info-etiqueta");

        // Valor del campo (si no tiene valor, mostramos un guión por mostrar algo)
        let valorElem = creaNodoTextoId("span", campo.valor || "-");
        valorElem.setAttribute("class", "info-valor");
        valorElem.dataset.campo = campo.label.toLowerCase();
        valorElem.dataset.tag = campo.tag;
        valorElem.dataset.editable = campo.editable;

        // Enganchamos los campos
        item.appendChild(labelEl);
        item.appendChild(valorElem);
        infoItems.appendChild(item);

        // Guardamos el valor del elemento en el objeto camposHtml para acceder a él fácilmente después al activar la edición.
        camposHtml[campo.label] = valorElem;
    });

    // Botón de editar info
    let btnEditarInfo = creaNodoId("button");
    btnEditarInfo.setAttribute("class", "btn-editar-info");

    // Icono de lápiz para el botón de editar
    let iconoLapiz = creaNodoId("img");
    iconoLapiz.setAttribute("src", "./servidor/imagenes/svg/pencil-square.svg");
    iconoLapiz.setAttribute("class", "btn-svg-icono");

    // Texto del botón de editar
    let textoEditarInfo = document.createTextNode(" Editar información");

    // Enganchamos el icono y el texto al botón
    btnEditarInfo.appendChild(iconoLapiz);
    btnEditarInfo.appendChild(textoEditarInfo);

    // Enganchamos los componentes a la tarjeta de info
    infotarjeta.appendChild(infoTitle);
    infotarjeta.appendChild(fotoPerfil);
    infotarjeta.appendChild(infoItems);
    infotarjeta.appendChild(btnEditarInfo);

    // _____ FUNCIONALIDAD DE EDITAR INFORMACIÓN ______

    let modoEdicion = false; // → Variable para controlar si estamos en modo edición o no
    let inputsEdicion = {}; // → Guarda los inputs creados al editar

    // Evento del botón de editar información
    btnEditarInfo.addEventListener("click", function () {

        // Si no estamos en modo edición, lo ponemos como verdadero (modoEdicion=true) y convertimos los campos 
        // en inputs para que el usuario pueda modificarlos.

        if (!modoEdicion) {
            modoEdicion = true;
            btnEditarInfo.textContent = " Guardar cambios";

            // Recorremos los campos editables y los convertimos en inputs o textarea según lo que corresponda, 
            // guardando el nuevo elemento en el objeto inputsEdicion para acceder facilmente después de guardar.
            campos.forEach(campo => {
                if (!campo.editable) { // → Si el campo no es editable, saltamos al siguiente
                    return;
                }

                let span = camposHtml[campo.label]; // → Pillamos el elemento span que contiene el valor del campo usando el objeto de los campos html
                let valorActual = span.textContent === "-" ? "" : span.textContent; // → Si el valor actual es un guión, lo ponemos vacío para que 
                                                                                    // el usuario no tenga que borrarlo

                // Según el tipo de campo que sea, lo convertimos en un input, textarea o select y lo enganchamos donde toca
                if (campo.tag === "textarea") {
                    let ta = creaNodoId("textarea");
                    ta.value = valorActual;

                    ta.setAttribute("class", "info-valor editando-area");
                    span.replaceWith(ta); // → Reemplazamos el span por el textarea para que el usuario pueda editarlo
                    inputsEdicion[campo.label] = ta;

                } else if (campo.tag === "select") {
                    let sel = creaNodoId("select");
                    sel.setAttribute("class", "info-valor editando");

                    let optDefecto = creaNodoTextoId("option", "- Elige tu país -");
                    optDefecto.setAttribute("value", "");
                    sel.appendChild(optDefecto);

                    // Sacamos lo paises de los datos generales del proyecto 
                    datosGeneralesProyecto.paises.forEach(p => {
                        let opt = creaNodoTextoId("option", p.nombre + " (" + p.simbolo + ")");
                        opt.setAttribute("value", p.nombre);

                        // Si el país del artista coincide con el país del bucle, seleccionamos esa opción por defecto
                        if (p.nombre === valorActual) {
                            opt.setAttribute("selected", "selected");
                        }

                        sel.appendChild(opt);
                    });

                    span.replaceWith(sel);
                    inputsEdicion[campo.label] = sel;

                } else {
                    let inp = creaNodoId("input");
                    inp.setAttribute("type", "text");
                    inp.value = valorActual;
                    inp.setAttribute("class", "info-valor editando");
                    span.replaceWith(inp);
                    
                    inputsEdicion[campo.label] = inp;
                }
            });

        } else {
            
            // Si ya estamos en modo edición, al pulsar el botón guardamos los cambios (hacemos un fetch a guardarPerfil.php) y 
            // volvemos al modo lectura.
            let datosActualizados = {
                id: idArtista,
                descripcion: (inputsEdicion["Descripción"] ? inputsEdicion["Descripción"].value.trim() : artista.descripcion), // → Si el input existe guardamos su valor, si no, guardamos el valor que ya tenía de antes
                especialidad: (inputsEdicion["Especialidad"] ? inputsEdicion["Especialidad"].value.trim() : artista.especialidad), 
                ubicacion: (inputsEdicion["Ubicación"] ? inputsEdicion["Ubicación"].value.trim() : artista.ubicacion),
                redesSociales: artista.redesSociales || {}
            };

            // Enviamos los datos actualizados al servidor para guardarlos en el JSON
            fetch("./servidor/php/guardarPerfil.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datosActualizados)
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // Actualizamos los datos en nuestro objeto del artista con los nuevos valores para tenerlos en el resto del proyecto
                        artista.descripcion = datosActualizados.descripcion;
                        artista.especialidad = datosActualizados.especialidad;
                        artista.ubicacion = datosActualizados.ubicacion;

                        // Volvemos al modo lectura
                        modoEdicion = false;
                        btnEditarInfo.innerHTML = "";

                        // Enganchamos los componentes
                        btnEditarInfo.appendChild(iconoLapiz);
                        btnEditarInfo.appendChild(document.createTextNode(" Editar información"));

                        // Volvemos a colocar la info como spans para que la info quede como solo lectura
                        campos.forEach(campo => {

                            // Si el campo no es editable, pasamos al siguiente
                            if (!campo.editable) {
                                return;
                            }

                            // Pillamos el input que hemos guardado en el objeto inputsEdicion usando el label del campo
                            let inp = inputsEdicion[campo.label];

                            if (!inp) {
                                return;
                            }

                            // Limpiamos el valor del input y lo ponemos como texto en un nuevo span
                            let nuevoValor = inp.value.trim() || "-";
                            let nuevoSpan = creaNodoTextoId("span", nuevoValor);
                            nuevoSpan.setAttribute("class", "info-valor");
                            nuevoSpan.dataset.campo = campo.label.toLowerCase(); // → dataset sirve para identificar el campo
                            inp.replaceWith(nuevoSpan); // → Reemplazamos el input por el nuevo span con el valor actualizado

                            camposHtml[campo.label] = nuevoSpan;
                        });

                        inputsEdicion = {};

                        // Actualizamos la cabecera del perfil
                        nombre.textContent = artista.nombre;
                        especialidadP.textContent = artista.especialidad || "Sin especialidad definida";

                        // Actualizamos solo el texto, el icono SVG lo dejamos como está.
                        ubicacionP.lastChild.textContent = datosActualizados.ubicacion || "Sin ubicación";
                    }
                })
                .catch(err => {
                    console.error("Error al guardar:", err);
                });
        }
    });

    return infotarjeta;
}

// __________________________________________
// _______ SECCIÓN 2 - REDES SOCIALES _______

/**
 * Crea la tarjeta de redes sociales del artista con sus enlaces y el botón de configuración.
 * @param {object} artista - Objeto Artista
 * @param {number} idArtista - Id del artista conectado
 * @returns {HTMLElement}
 */
function crearTarjetaRedes(artista, idArtista) {

    // Creamos el contenedor para las redes sociales
    let tarjetaRedes = creaNodoId("div");
    tarjetaRedes.setAttribute("class", "perfil-redes-tarjeta");

    // Título de la sección
    let redesTitle = creaNodoTextoId("h3", "Redes Sociales");

    // Contenedor para los enlaces de las redes sociales
    let redesEnlaces = creaNodoId("div");
    redesEnlaces.setAttribute("class", "redes-enlaces");

    // Definimos las redes con su icono e input guardado en artista
    let redesDef = [
        { 
            nombre: "Instagram", 
            icono: "./servidor/imagenes/redes/instagram.png", 
            clave: "instagram" 
        },
        { 
            nombre: "TikTok",    
            icono: "./servidor/imagenes/redes/tiktok.png",    
            clave: "tiktok" 
        },
        { 
            nombre: "Pinterest", 
            icono: "./servidor/imagenes/redes/pinterest.png", 
            clave: "pinterest" 
        },
        { 
            nombre: "X",         
            icono: "./servidor/imagenes/redes/x.png",         
            clave: "x" 
        }
    ];

    // Recorremos las redes para crear un enlace para cada una.
    // Usamos el valor guardado en artista.redesSociales para montar la url al perfil del usuario en cada red social y si no tiene pues nada.
    redesDef.forEach(red => {
        
        // Sacamos el nombre de usuario en esa red social de artista.redesSociales o null si no tiene nada guardado
        let valor = (artista.redesSociales && artista.redesSociales[red.clave]) ? artista.redesSociales[red.clave] : null;

        // Si el artista tiene un valor guardado para esa red social, montamos la url
        let urlDestino = valor ? "https://www." + red.clave + ".com/" + valor.replace("@", "") : null;

        // Usamos <button> para que no se vaya directamente (por si le dan sin querer)
        let enlace = creaNodoId("button");
        enlace.setAttribute("class", "red-enlace");
        enlace.setAttribute("type", "button");
        enlace.setAttribute("title", red.nombre);

        // Icono de la red social
        let icon = creaNodoId("img");
        icon.setAttribute("src", red.icono);
        icon.setAttribute("class", "red-iconoo");

        // Nombre de la red social o nick del usuario en esa red social
        let redName = creaNodoTextoId("span", valor ? valor : red.nombre);
        redName.setAttribute("class", "red-nombre");

        if (!valor) {
            redName.style.color = "var(--color-texto-claro)";
        }

        // Enganchamos los componentes
        enlace.appendChild(icon);
        enlace.appendChild(redName);
        redesEnlaces.appendChild(enlace);

        // Mostramos una ventana de confirmación antes de redirigir a la url de la red social
        enlace.addEventListener("click", function () {
            mostrarConfirmacionRed(red.nombre, urlDestino);
        });
    });

    // Botón de editar redes sociales
    let btnEditarRedes = creaNodoId("button");
    btnEditarRedes.setAttribute("class", "btn-editar-redes");

    // Icono de herramientas para el botón de editar redes
    let iconoTools = creaNodoId("img");
    iconoTools.setAttribute("src", "./servidor/imagenes/svg/tools.svg");
    iconoTools.setAttribute("alt", "Configurar");
    iconoTools.setAttribute("class", "btn-svg-icono");

    // Enganchamos el icono y el texto al botón
    btnEditarRedes.appendChild(iconoTools);
    btnEditarRedes.appendChild(document.createTextNode(" Configurar redes"));

    // Enganchamos los componentes a la tarjeta de redes sociales
    tarjetaRedes.appendChild(redesTitle);
    tarjetaRedes.appendChild(redesEnlaces);
    tarjetaRedes.appendChild(btnEditarRedes);

    // Función para guardar las redes sociales desde la ventana auxiliar de configuración de redes sociales. 
    // Recibe un objeto con las redes sociales actualizadas, lo envía al servidor para guardarlo en el JSON y actualiza la vista del perfil con los datos nuevos.
    window.guardarRedes = function (redesSociales) {
        let datosRedes = {
            id: idArtista,
            descripcion: artista.descripcion || "",
            especialidad: artista.especialidad || "",
            ubicacion: artista.ubicacion || "",
            redesSociales
        };

        // Hacemos un fetch al servidor para guardar las redes sociales actualizadas en el JSON. Si la respuesta es correcta, actualizamos el objeto del artista 
        // en los datos generales del proyecto para tener los datos actualizados en el resto del proyecto.
        fetch("./servidor/php/guardarPerfil.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datosRedes)
        })
            .then(r => r.json())
            .then(data => {
                if (data.success) {
                    artista.redesSociales = redesSociales; // → Actualizamos en memoria
                    mostrarPerfil(); // → Recargamos la vista del perfil
                }
            })
            .catch(err => console.error("Error al guardar redes:", err));
    };

    // Al darle a editar redes, se abre una ventana auxiliar con un formulario para editar las redes sociales. 
    // Le pasamos los datos actuales de las redes sociales por query params para que se muestren en el formulario.
    btnEditarRedes.addEventListener("click", function () {
        let rs = artista.redesSociales || {};

        let params = new URLSearchParams({
            instagram: rs.instagram || "",
            tiktok: rs.tiktok || "",
            pinterest: rs.pinterest || "",
            x: rs.x || ""
        });

        // Calculamos el tamaño y la posición de la ventana para que se abra centrada en pantalla
        let w = 580, h = 580;
        let left = Math.round(screen.availLeft + (screen.availWidth  - w) / 2);
        let top  = Math.round(screen.availTop  + (screen.availHeight - h) / 2);

        // Abrimos la ventana auxiliar para editar las redes sociales
        window.open(
            "./ventanas/ventana-redes.html?" + params.toString(),
            "ventana-redes",
            `width=${w},height=${h},left=${left},top=${top},resizable=no,scrollbars=no`
        );
    });

    return tarjetaRedes;
}

// _____________________________________________
// ____________ SECCIÓN 3 - LOGROS  ____________

/**
 * Crea la tarjeta de logros del artista con su estado de desbloqueo calculado al vuelo.
 * @param {number} numEncargosArtista - Total de encargos del artista
 * @param {number} numEncargosCompletados - Encargos completados
 * @param {number} numClientesArtista - Clientes únicos
 * @returns {HTMLElement}
 */
function crearTarjetaLogros(numEncargosArtista, numEncargosCompletados, numClientesArtista) {

    // Creamos el contenedor para los logros
    let logrostarjeta = creaNodoId("div");
    logrostarjeta.setAttribute("class", "perfil-logros-tarjeta");

    // Cabecera con título + icono de info
    let logrosCabecera = creaNodoId("div");
    logrosCabecera.setAttribute("class", "logros-cabecera");

    // Título de la sección
    let logrosTitle = creaNodoTextoId("h3", "Logros");

    // Botón de información de logros
    let btnInfoLogros = creaNodoId("button");
    btnInfoLogros.setAttribute("class", "btn-info-logros");
    btnInfoLogros.setAttribute("title", "Ver información de logros");

    // Icono de información para el botón de info de logros
    let iconoInfo = creaNodoId("img");
    iconoInfo.setAttribute("src", "./servidor/imagenes/svg/informacion.svg");

    // Enganchamos el icono al botón
    btnInfoLogros.appendChild(iconoInfo);

    // Enanchamos el resto de componentes
    logrosCabecera.appendChild(logrosTitle);
    logrosCabecera.appendChild(btnInfoLogros);

    // Contenedor para los logros en si (icono + título del logro)
    let logrosGrid = creaNodoId("div");
    logrosGrid.setAttribute("class", "perfil-logros-grid");

    // Construimos el array con los contadores por categoria para calcular que logros puede tener desbloqueados.
    let contadores = {
        encargos: numEncargosArtista,
        clientes: numClientesArtista,
        completados: numEncargosCompletados
    };

    // Construimos el array con la información de los logros y si están desbloqueados o no según los contadores y las referencias de cada logro.
    let logrosDef = datosGeneralesProyecto.logros.map(l => ({
        imagen: l.imagen,
        titulo: l.titulo,
        info: l.info,
        desbloqueado: contadores[l.categoria] >= l.referencia
    }));

    // Recorremos el array de logrosDef para mostrarlos en el perfil
    logrosDef.forEach((logro, i) => {

        // Creamos el contenedor del logro
        let item = creaNodoId("div");
        item.setAttribute("class", "perfil-logro-item " + (logro.desbloqueado ? "desbloqueado" : "bloqueado"));
        item.setAttribute("title", logro.info);
        item.style.setProperty("--delay", `${i * 0.06}s`);

        // Icono del logro
        let etiqueta = creaNodoId("img");
        etiqueta.setAttribute("src", "./servidor/imagenes/logros/" + logro.imagen);
        etiqueta.setAttribute("class", "logro-icono");

        // Título del logro
        let logroTitulo = creaNodoTextoId("div", logro.titulo);
        logroTitulo.setAttribute("class", "logro-titulo");

        // Enganchamos los componentes del logro
        item.appendChild(etiqueta);
        item.appendChild(logroTitulo);
        logrosGrid.appendChild(item);
    });

    // Enganchamos la cabecera y el grid de logros a la tarjeta de logros
    logrostarjeta.appendChild(logrosCabecera);
    logrostarjeta.appendChild(logrosGrid);

    // Al darle al iconito de info donde los logros, mostraremos una ventana auxiliar con la información de cada logro y si el artista lo tiene 
    // desbloqueado o no.
    btnInfoLogros.addEventListener("click", function () {
        let estadoLogros = {};
        logrosDef.forEach(l => { estadoLogros[l.titulo] = l.desbloqueado; });

        // Pasamos la información de los logros y su estado por los query params a la ventana auxiliar para mostrar esa información allí
        let params = new URLSearchParams({
            logros: JSON.stringify(datosGeneralesProyecto.logros),
            estado: JSON.stringify(estadoLogros)
        });

        // Calculamos el tamaño y la posición de la ventana para que se abra centrada en pantalla
        let w = 860, h = 540;
        let left = Math.round(screen.availLeft + (screen.availWidth  - w) / 2);
        let top  = Math.round(screen.availTop  + (screen.availHeight - h) / 2);

        // Abrimos la ventana auxiliar
        window.open(
            "./ventanas/ventana-logros.html?" + params.toString(),
            "ventana-logros",
            `width=${w},height=${h},left=${left},top=${top},resizable=no,scrollbars=yes`
        );
    });

    return logrostarjeta;
}

/**
 * Función que muestra la pantalla de Perfil del artista conectado.
 *  - Aquí el artista puede ver su información, editarla y acceder a sus redes sociales.
 */
function mostrarPerfil() {
    setCookie("ultima_vista", "perfil", 1); // → Guardamos esta pantalla /vista en la cookie para redirigir aquí al usuario si 
    // vuelve a entrar más tarde a la aplicación.

    // Obtenemos el artista conectado usando el id guardado en sessionStorage parseandolo a número
    let idArtista = Number(sessionStorage.getItem("artistaConectado"));
    let artista = datosGeneralesProyecto.artistas.find(a => a.id === idArtista);

    // Si no lo encontramos por o que sea, mostramos un error por consola
    if (!artista) {
        console.error("Artista no encontrado");
        return;
    }

    // Contadores asignarle los logros
    let numEncargosArtista = datosGeneralesProyecto.encargos.filter(e => e.id_artista === idArtista).length;
    let numEncargosCompletados = datosGeneralesProyecto.encargos.filter(e => e.id_artista === idArtista && e.estado === "completado").length;
    let numClientesArtista = new Set(datosGeneralesProyecto.encargos.filter(e => e.id_artista === idArtista).map(e => e.nombre_cliente)).size;

    // Limpiamos el main y la cabecera
    datosGeneralesProyecto.mainPrincipal.innerHTML = "";
    datosGeneralesProyecto.mainPrincipal.classList.remove("oculto");

    let cabeceraAntigua = document.getElementById("cabecera-principal");
    if (cabeceraAntigua) {
        cabeceraAntigua.remove();
    }

    let cabeceraMenu = crearCabeceraPrincipal('perfil');
    document.body.insertBefore(cabeceraMenu, datosGeneralesProyecto.mainPrincipal);

    // ________________________________________
    // __________ PERFIL DEL ARTISTA __________

    let perfilContent = creaNodoId("div");
    perfilContent.setAttribute("class", "perfil-content");

    // ______ CABECERA DEL PERFIL ______

    let perfilCabecera = crearHeaderArtista(artista);
    perfilCabecera.classList.add("perfil-artista-cabecera");

    // Enganchamos la cabecera del artista al perfil
    perfilContent.appendChild(perfilCabecera);

    // ______ ESTRUCTURA DE LAS SECCIONES DEL PERFIL ______

    let tarjetasGrid = creaNodoId("div");
    tarjetasGrid.setAttribute("class", "perfil-tarjetas-grid");

    // Enganchamos las tres secciones al grid del perfil
    let tarjetaInfo = crearTarjetaInformacion(artista, idArtista);
    let tarjetaRedes = crearTarjetaRedes(artista, idArtista);
    let tarjetaLogros = crearTarjetaLogros(numEncargosArtista, numEncargosCompletados, numClientesArtista);
    tarjetaInfo.style.setProperty("--delay", "0s");
    tarjetaRedes.style.setProperty("--delay", "0.12s");
    tarjetaLogros.style.setProperty("--delay", "0.24s");
    tarjetasGrid.appendChild(tarjetaInfo);
    tarjetasGrid.appendChild(tarjetaRedes);
    tarjetasGrid.appendChild(tarjetaLogros);

    // Enganchamos los componentes
    perfilContent.appendChild(tarjetasGrid);
    datosGeneralesProyecto.mainPrincipal.appendChild(perfilContent);
}