<?php

// _________________________________
// ___ Crear o modificar encargo ___

// Indicamos que la respuesta es JSON
header("Content-Type: application/json");

// Validamos los campos obligatorios
$errores = [];

// Validacion del Nombre del encargo
if (empty($_POST["nombre"])) {
    $errores[] = "El nombre del encargo es obligatorio";
}

// Validacion del id del artista
if (empty($_POST["id_artista"])) {
    $errores[] = "Falta el id del artista";
}

// Validacion del precio
if (empty($_POST["nombre_cliente"])) {
    $errores[] = "El nombre del cliente es obligatorio";
}

// Validacion del email del cliente
if (empty($_POST["email_cliente"])) {
    $errores[] = "El email del cliente es obligatorio";

} else if (!filter_var(trim($_POST["email_cliente"]), FILTER_VALIDATE_EMAIL)) {
    $errores[] = "El email del cliente no es válido";
}

// Validacion del presupuesto del cliente
if (!isset($_POST["precio"]) || $_POST["precio"] === "") {
    $errores[] = "El precio es obligatorio";

} else if (floatval($_POST["precio"]) < 0) {
    $errores[] = "El precio no puede ser negativo";
}


// Validacion de la fecha de entrega
if (empty($_POST["fechaEntrega"])) {
    $errores[] = "La fecha de entrega es obligatoria";

} else if (!DateTime::createFromFormat('Y-m-d', trim($_POST["fechaEntrega"]))) {
    $errores[] = "La fecha de entrega no tiene formato válido";
}

// Si hay errores de validación, respondemos con un error
if (!empty($errores)) {
    http_response_code(400);
    echo json_encode(["error" => implode(". ", $errores)]);
    exit;
}

// Recogemos los datos del encargo, usando valores por defecto si no se envían
$id = isset($_POST["id"]) ? intval($_POST["id"]) : null;
$nombre = trim($_POST["nombre"]);
$descripcion = isset($_POST["descripcion"]) ? trim($_POST["descripcion"]) : "";
$idArtista = intval($_POST["id_artista"]);
$precio = isset($_POST["precio"]) ? floatval($_POST["precio"]) : 0;
$fechaEntrega = isset($_POST["fechaEntrega"]) ? trim($_POST["fechaEntrega"]) : date("Y-m-d");
$estado = isset($_POST["estado"]) ? trim($_POST["estado"]) : "pendiente";
$fase = isset($_POST["fase"]) ? intval($_POST["fase"]) : 1;


// Recogemos los datos del cliente
$nombreCliente = isset($_POST["nombre_cliente"]) ? trim($_POST["nombre_cliente"]) : "";
$emailCliente = isset($_POST["email_cliente"]) ? trim($_POST["email_cliente"]) : "";
$direccionCliente = isset($_POST["direccion_cliente"])  ? trim($_POST["direccion_cliente"]) : "";
$paisCliente = isset($_POST["pais_cliente"]) ? trim($_POST["pais_cliente"]) : "";
$presupuestoCliente = isset($_POST["presupuesto_cliente"]) ? floatval($_POST["presupuesto_cliente"]) : 0;

// Guardamos la ruta de las imágenes de encargos y del json de encargos
$dirImagenes  = __DIR__ . "/../imagenes/encargos/";
$rutaEncargos = __DIR__ . "/../datos/Encargos.json";

// Validamos que el archivode encargos exista
if (!file_exists($rutaEncargos)) {
    http_response_code(500);
    echo json_encode(["error" => "Archivo no encontrado"]);
    exit;
}

// Leemos el json de encargos
$contenidoJson = file_get_contents($rutaEncargos);
$datos = json_decode($contenidoJson, true);

// Validamos que el json se haya leído correctamente
if ($datos === null || !isset($datos["encargos"])) {
    http_response_code(500);
    echo json_encode(["error" => "Error al leer el JSON: " . json_last_error_msg()]);
    exit;
}

// Si se ha subido una imagen, la guardamos. 
$nombreImagen = null;

// Validamos que se haya subido un archivo y que no haya errores en la subida
if (isset($_FILES["imagen"]) && $_FILES["imagen"]["error"] === UPLOAD_ERR_OK) {
    $archivo   = $_FILES["imagen"];
    $extension = strtolower(pathinfo($archivo["name"], PATHINFO_EXTENSION));

    // Validamos el tipo de archivo por su extensión
    $extensionesPermitidas = ["jpg", "jpeg", "png"];
    if (!in_array($extension, $extensionesPermitidas)) {
        http_response_code(400);
        echo json_encode(["error" => "Tipo de archivo no permitido"]);
        exit;
    }

    // Montamos un nombre único para la imagen para evitar errores
    $nombreImagen = "encargo_" . $idArtista . "_" . time() . "." . $extension;
    $rutaDestino  = $dirImagenes . $nombreImagen;

    // Movemos el archivo subido a la carpeta de imágenes de encargos
    if (!move_uploaded_file($archivo["tmp_name"], $rutaDestino)) {
        http_response_code(500);
        echo json_encode(["error" => "No se pudo guardar la imagen"]);
        exit;
    }
}

// _____ Creamos o actualizamos el encargo en el JSON _____

// Comprobamos si el id es nulo para saber si es un encargo nuevo o una modificación de uno existente
if ($id === null) {
    // Creamos un encargo nuevo
    $ids = array_column($datos["encargos"], "id");
    $nuevoId = count($ids) > 0 ? max($ids) + 1 : 1;

    // Creamos el nuevo encargo con los datos recibidos y el nombre de la imagen en caso de que se haya subido (si no pues la de la imagen por defecto)
    $encargo = [
        "id" => $nuevoId,
        "nombre" => $nombre,
        "descripcion" => $descripcion,
        "id_cliente" => null,
        "id_artista" => $idArtista,
        "precio" => $precio,
        "fechaEntrega" => $fechaEntrega,
        "estado" => $estado,
        "fase" => $fase,
        "imagenes" => [$nombreImagen ?? "EncargoDefault.png"],
        "nombre_cliente" => $nombreCliente,
        "email_cliente" => $emailCliente,
        "direccion_cliente" => $direccionCliente,
        "pais_cliente" => $paisCliente,
        "presupuesto_cliente" => $presupuestoCliente,
        "borrado" => false
    ];

    $datos["encargos"][] = $encargo;

} else {
    // Modificamos el encargo existente
    $index = -1;
    foreach ($datos["encargos"] as $i => $e) {
        if ($e["id"] == $id) { $index = $i; break; }
    }

    if ($index == -1) {
        http_response_code(404);
        echo json_encode(["error" => "Encargo no encontrado"]);
        exit;
    }

    // Actualizamos los campos del encargo con los datos recibidos
    $datos["encargos"][$index]["nombre"] = $nombre;
    $datos["encargos"][$index]["descripcion"] = $descripcion;
    $datos["encargos"][$index]["precio"] = $precio;
    $datos["encargos"][$index]["fechaEntrega"] = $fechaEntrega;
    $datos["encargos"][$index]["estado"] = $estado;
    $datos["encargos"][$index]["fase"] = $fase;
    $datos["encargos"][$index]["nombre_cliente"] = $nombreCliente;
    $datos["encargos"][$index]["email_cliente"] = $emailCliente;
    $datos["encargos"][$index]["direccion_cliente"] = $direccionCliente;
    $datos["encargos"][$index]["pais_cliente"] = $paisCliente;
    $datos["encargos"][$index]["presupuesto_cliente"] = $presupuestoCliente;

    // Solo actualizamos la imagen si se ha subido una nueva
    if ($nombreImagen !== null) {
        $datos["encargos"][$index]["imagenes"] = [$nombreImagen];
    }

    $encargo = $datos["encargos"][$index];
}

// Escribimos el json actualizado
$jsonActualizado = json_encode($datos, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
$bytesEscritos = file_put_contents($rutaEncargos, $jsonActualizado);

// Validamos que se haya escrito correctamente el json
if ($bytesEscritos === false) {
    http_response_code(500);
    echo json_encode(["error" => "No se pudo guardar el archivo JSON"]);
    exit;
}

http_response_code(200);
echo json_encode([
    "success" => true,
    "message" => $id === null ? "Encargo creado correctamente" : "Encargo actualizado correctamente",
    "encargo" => $encargo
]);
