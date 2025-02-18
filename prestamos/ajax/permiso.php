<?php
// Inicia la sesión y verifica si el usuario está autenticado
session_start();

// Verifica si el parámetro 'op' existe en la solicitud y si es válido
if (!isset($_GET['op']) || !in_array($_GET['op'], ['listar'])) {
	die('Acción no permitida');
}

// Verifica si el usuario tiene permisos para realizar la acción
if (!isset($_SESSION['usuario']) || $_SESSION['usuario']['rol'] != 'admin') {
	die('No tienes permisos para realizar esta acción');
}

require_once "../modelos/Permiso.php";
$permiso = new Permisos();

switch ($_GET["op"]) {
	case 'listar':
		try {
			// Limitación de resultados para evitar sobrecargar el servidor
			$limit = 100;  // Limitar a 100 resultados (esto depende de tu caso de uso)
			$rspta = $permiso->listar($limit);

			// Declarar un array para almacenar los datos
			$data = array();

			// Recorrer los resultados y preparar el array de salida
			while ($reg = $rspta->fetch_object()) {
				// Eliminar cualquier campo sensible antes de enviarlo al cliente
				unset($reg->password); // Si existiera un campo de contraseña, se eliminaría

				$data[] = array(
					"0" => $reg->idpermiso,
					"1" => htmlspecialchars($reg->permiso) // Escapar caracteres especiales para evitar XSS
				);
			}

			// Preparar los datos para el DataTable
			$results = array(
				"sEcho" => 1, // Información para el DataTable
				"iTotalRecords" => count($data), // Total registros para mostrar
				"iTotalDisplayRecords" => count($data), // Total registros disponibles
				"aaData" => $data
			);

			// Devolver la respuesta en formato JSON
			echo json_encode($results);
		} catch (Exception $e) {
			// Manejo de errores
			echo json_encode(["error" => "Hubo un problema con la solicitud"]);
		}
		break;
}
?>