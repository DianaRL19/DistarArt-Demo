<?php

// ____________________________________________
// _______ ENDPOINT - Borrar encargo __________

// Indicamos que la respuesta es JSON
header("Content-Type: application/json");

// Recibimos los datos del encargo a borrar en formato json
$input = json_decode(file_get_contents("php://input"), true);

// Si no recibimos un id, respondemos con un error
if (!isset($input["id"])) {
    http_response_code(400);
    echo json_encode(["error" => "Falta el ID del encargo"]);
    exit;
}

// Guardamos el id del encargo a borrar y la ruta del json de encargos
$id = intval($input["id"]);
$rutaEncargos = __DIR__ . "/../datos/Encargos.json";

// Si el archivo json no existe, respondemos con un error
if (!file_exists($rutaEncargos)) {
    http_response_code(500);
    echo json_encode(["error" => "Archivo no encontrado"]);
    exit;
}

// Leemos el JSON de encargos
$datos = json_decode(file_get_contents($rutaEncargos), true);

// Si no podemos leer el json respondemos con un error
if ($datos === null || !isset($datos["encargos"])) {
    http_response_code(500);
    echo json_encode(["error" => "Error al leer el JSON"]);
    exit;
}

// Buscamos el encargo y lo marcamos como borrado (borrado lógico, no físico para las pruebas y si me  da tiempo que no creo, implementar una opcion de ver encargos borrados)
$index = -1;
foreach ($datos["encargos"] as $i => $e) {
    if ($e["id"] == $id) {
        $index = $i;
        break;
    }
}

// Si no encontramos el encargo, respondemos con un error
if ($index === -1) {
    http_response_code(404);
    echo json_encode(["error" => "Encargo no encontrado"]);
    exit;
}

// Marcamos el encargo como borrado sin eliminarlo del json
$datos["encargos"][$index]["borrado"] = true;

// Guardamos el json actualizado
file_put_contents($rutaEncargos, json_encode($datos, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

echo json_encode(["success" => true, "id" => $id]);
