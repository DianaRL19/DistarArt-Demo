<?php

// _________________________________
// __ Guardar cambios del Perfil ___

// Indicamos que la respuesta es JSON
header("Content-Type: application/json");

// Recibimos los datos del PUT/POST
$input = json_decode(file_get_contents("php://input"), true);

// Validamos que recibamos los datos necesarios
if (!isset($input['id']) || !isset($input['descripcion'])) {
    http_response_code(400);
    echo json_encode(["error" => "Faltan datos requeridos"]);
    exit;
}

// Guardamos la ruta del archivo json de los artistas
$rutaArtistas = __DIR__ . "/../datos/Artistas.json";

// Leemos el JSON
$contenidoJSON = file_get_contents($rutaArtistas);
$datos = json_decode($contenidoJSON, true);

// Buscamos el artista con ese id
$artistaIndex = -1;
foreach ($datos['artistas'] as $index => $artista) {
    if ($artista['id'] == $input['id']) {
        $artistaIndex = $index;
        break;
    }
}

// Si no encontramos el artista, devolvemos error
if ($artistaIndex == -1) {
    http_response_code(404);
    echo json_encode(["error" => "Artista no encontrado"]);
    exit;
}

// Actualizamos los campos del artista
$datos['artistas'][$artistaIndex]['descripcion'] = $input['descripcion'];
$datos['artistas'][$artistaIndex]['especialidad'] = $input['especialidad'];
$datos['artistas'][$artistaIndex]['ubicacion'] = $input['ubicacion'];

// Si se han enviado redes sociales, las actualizamos y/o añadimos
if (isset($input['redesSociales'])) {
    if (!isset($datos['artistas'][$artistaIndex]['redesSociales'])) {
        $datos['artistas'][$artistaIndex]['redesSociales'] = [];
    }
    
    foreach ($input['redesSociales'] as $red => $valor) {
        $datos['artistas'][$artistaIndex]['redesSociales'][$red] = $valor;
    }
}

// Escribimos el json actualizado
$jsonActualizado = json_encode($datos, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
file_put_contents($rutaArtistas, $jsonActualizado);

// Devolvemos éxito
http_response_code(200);
echo json_encode([
    "success" => true,
    "message" => "Perfil guardado correctamente",
    "artista" => $datos['artistas'][$artistaIndex]
]);
