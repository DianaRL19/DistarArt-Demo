<?php

// _____________________________________________
// ___________ AÑADIR NUEVO ARTISTA ____________


// Recibimos los datos en formato json del fetch POST
$datosJSON = file_get_contents("php://input"); // → Recogemos el cuerpo de la petición (json)
$nuevoArtista = json_decode($datosJSON, true); // → Convertimos json a un array asociativo 

// Guardamos la ruta del archivo json de los artistas
$rutaArtistas = __DIR__ . "/../datos/Artistas.json"; 

// Verificamos que el archivo exista
if (!file_exists($rutaArtistas)) {
    http_response_code(404);
    echo json_encode(["error" => "Archivo Artistas.json no encontrado"]);
    exit;
}

// Leemos el contenido del json
$contenidoJSON = file_get_contents($rutaArtistas); // → Obtenemos el contenido como unstring
$artistas = json_decode($contenidoJSON, true); // → Convertimos a un array asociativo

// Validamos que los datos recibidos son correctos
if (!$nuevoArtista || empty($nuevoArtista)) {
    http_response_code(400);
    echo json_encode(["error" => "Datos inválidos o vacíos"]);
    exit;
}

// Añadimos el nuevo artista al array de artistas
$artistas["artistas"][] = $nuevoArtista; 

// ___ Guardamos el nuevo artista en el json ___

// Pasamos el array actualizado a json y lo guardamos
$jsonActualizado = json_encode($artistas, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

if (file_put_contents($rutaArtistas, $jsonActualizado) !== false) {
    // Si todo ha ido bien y en el archivo se ha escrito correctamente, respondemos con éxito
    http_response_code(200);
    echo json_encode([
        "exito" => true,
        "mensaje" => "Artista registrado correctamente",
        "artista" => $nuevoArtista
    ]);
} else {
    // Si ha habido algun error al escribir en el archivo json, respondemos con un error
    http_response_code(500);
    echo json_encode(["error" => "Error al guardar el artista en el servidor"]);
}
