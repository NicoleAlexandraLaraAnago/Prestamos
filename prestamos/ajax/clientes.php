<?php
require_once "../modelos/Clientes.php";

$cliente = new Clientes();

// Función para limpiar entradas
function limpiarCadena($data)
{
	return htmlspecialchars(strip_tags(trim($data)), ENT_QUOTES, 'UTF-8');
}

// Limpiamos las entradas
$idcliente = isset($_POST["idcliente"]) ? limpiarCadena($_POST["idcliente"]) : "";
$cedula = isset($_POST["cedula"]) ? limpiarCadena($_POST["cedula"]) : "";
$nombre = isset($_POST["nombre"]) ? limpiarCadena($_POST["nombre"]) : "";
$direccion = isset($_POST["direccion"]) ? limpiarCadena($_POST["direccion"]) : "";
$telefono = isset($_POST["telefono"]) ? limpiarCadena($_POST["telefono"]) : "";

switch ($_GET["op"]) {
	case 'guardaryeditar':
		// Verificación de datos antes de insertar o actualizar
		if (empty($cedula) || empty($nombre) || empty($direccion) || empty($telefono)) {
			echo "Todos los campos son requeridos.";
			exit;
		}

		if (empty($idcliente)) {
			// Insertar nuevo cliente
			$rspta = $cliente->insertar($cedula, $nombre, $direccion, $telefono);
			echo $rspta ? "Cliente registrado" : "Cliente no se pudo registrar";
		} else {
			// Editar cliente
			$rspta = $cliente->editar($idcliente, $cedula, $nombre, $direccion, $telefono);
			echo $rspta ? "Cliente actualizado" : "Cliente no se pudo actualizar";
		}
		break;

	case 'desactivar':
		// Verificación de existencia del cliente antes de desactivar
		if (empty($idcliente)) {
			echo "ID de cliente no válido.";
			exit;
		}
		$rspta = $cliente->desactivar($idcliente);
		echo $rspta ? "Cliente Desactivado" : "Cliente no se puede desactivar";
		break;

	case 'activar':
		// Verificación de existencia del cliente antes de activar
		if (empty($idcliente)) {
			echo "ID de cliente no válido.";
			exit;
		}
		$rspta = $cliente->activar($idcliente);
		echo $rspta ? "Cliente activado" : "Cliente no se puede activar";
		break;

	case 'mostrar':
		// Verificación de existencia del cliente antes de mostrar
		if (empty($idcliente)) {
			echo "ID de cliente no válido.";
			exit;
		}
		$rspta = $cliente->mostrar($idcliente);
		echo json_encode($rspta);
		break;

	case 'listar':
		// Listar todos los clientes con protección de datos
		$rspta = $cliente->listar($idcliente);
		$data = array();

		while ($reg = $rspta->fetch_object()) {
			$data[] = array(
				"0" => ($reg->estado) ?
					'<button class="btn btn-warning" onclick="mostrar(' . $reg->idcliente . ')"><i class="fa fa-pencil"></i></button>' .
					' <button class="btn btn-danger" onclick="desactivar(' . $reg->idcliente . ')"><i class="fa fa-close"></i></button>' :
					'<button class="btn btn-warning" onclick="mostrar(' . $reg->idcliente . ')"><i class="fa fa-pencil"></i></button>' .
					' <button class="btn btn-primary" onclick="activar(' . $reg->idcliente . ')"><i class="fa fa-check"></i></button>',
				"1" => limpiarCadena($reg->cedula),
				"2" => limpiarCadena($reg->nombre),
				"3" => limpiarCadena($reg->direccion),
				"4" => limpiarCadena($reg->telefono),
				"5" => ($reg->estado) ? '<span class="label bg-primary">Activado</span>' : '<span class="bg-warning">Desactivado</span>'
			);
		}

		$results = array(
			"sEcho" => 1, // Información para el datatable
			"iTotalRecords" => count($data), // Total de registros
			"iTotalDisplayRecords" => count($data), // Registros a mostrar
			"aaData" => $data
		);

		echo json_encode($results);
		break;
}
?>