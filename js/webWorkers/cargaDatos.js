// ______________________________________________________________
// ___________ WEB WORKER - CARGA INICIAL DE DATOS ______________
//
// Este worker se encarga de descargar y parsear los 3 JSON del servidor (Artistas, Encargos y Logros) a la vez, 
// sin bloquear la aplicación.
// Cuando termina, manda los datos al main.js a través de postMessage.

self.onmessage = function () {

    Promise.all([
        fetch("http://localhost/DWEC/PROYECTO-FINAL-DISTARART-ENCARGOS/servidor/datos/Artistas.json").then(r => r.json()),
        fetch("http://localhost/DWEC/PROYECTO-FINAL-DISTARART-ENCARGOS/servidor/datos/Encargos.json").then(r => r.json()),
        fetch("http://localhost/DWEC/PROYECTO-FINAL-DISTARART-ENCARGOS/servidor/datos/Logros.json").then(r => r.json())
    ])
        .then(function ([datosArtistas, datosEncargos, datosLogros]) {

            // Mandamos los datos al main.js
            self.postMessage({
                artistas: datosArtistas.artistas,
                encargos: datosEncargos.encargos,
                logros:   datosLogros.logros
            });
        })
        .catch(function (err) {
            self.postMessage({ error: err.message });
        });
};
