<?php
require_once "../modelos/Pagos.php";

$pago = new Pago();

// Función para limpiar las entradas
function limpiarCadena($data)
{
    return htmlspecialchars(strip_tags(trim($data)), ENT_QUOTES, 'UTF-8');
}

// Variables sanitizadas
$idpago = isset($_POST["idpago"]) ? limpiarCadena($_POST["idpago"]) : "";
$idprestamo = isset($_POST["idprestamo"]) ? limpiarCadena($_POST["idprestamo"]) : "";
$usuario = isset($_POST["usuario"]) ? limpiarCadena($_POST["usuario"]) : "";
$fecha = isset($_POST["fecha"]) ? limpiarCadena($_POST["fecha"]) : "";
$cuota = isset($_POST["cuota"]) ? limpiarCadena($_POST["cuota"]) : "";

switch ($_GET["op"]) {
    case 'guardaryeditar':
        // Validación de datos
        if (empty($idprestamo) || empty($usuario) || empty($fecha) || empty($cuota)) {
            echo "Todos los campos son requeridos.";
            exit;
        }

        // Validar fecha con expresión regular (ejemplo simple)
        if (!preg_match("/^\d{4}-\d{2}-\d{2}$/", $fecha)) {
            echo "Fecha no válida. El formato debe ser YYYY-MM-DD.";
            exit;
        }

        // Validar cuota como número (si es necesario)
        if (!is_numeric($cuota) || $cuota <= 0) {
            echo "La cuota debe ser un número positivo.";
            exit;
        }

        if (empty($idpago)) {
            // Insertar nuevo pago
            $rspta = $pago->insertar($idprestamo, $usuario, $fecha, $cuota);
            echo $rspta ? "Pago Registrado" : "Pago No se Pudo Registrar";
        } else {
            // Editar pago
            $rspta = $pago->editar($idpago, $idprestamo, $usuario, $fecha, $cuota);
            echo $rspta ? "Pago Actualizado" : "Pago no se pudo actualizar";
        }
        break;

    case 'eliminar':
        // Validar ID de pago antes de eliminar
        if (empty($idpago)) {
            echo "ID de pago no válido.";
            exit;
        }

        // Eliminar pago
        $rspta = $pago->eliminar($idpago);
        echo $rspta ? "Pago Eliminado" : "Pago no se puede eliminar";
        break;

    case 'mostrar':
        // Validar ID de pago
        if (empty($idpago)) {
            echo "ID de pago no válido.";
            exit;
        }

        // Mostrar pago
        $rspta = $pago->mostrar($idpago);
        echo json_encode($rspta);
        break;

    case 'listar':
        // Listar todos los pagos
        $rspta = $pago->listar();
        $data = array();

        while ($reg = $rspta->fetch_object()) {
            $data[] = array(
                "0" => '<button class="btn btn-warning" onclick="mostrar(' . $reg->idpago . ')"><i class="fa fa-pencil"></i></button>' .
                    ' <button class="btn btn-danger" onclick="eliminar(' . $reg->idpago . ')"><i class="fa fa-trash"></i></button>',
                "1" => limpiarCadena($reg->cliente),
                "2" => limpiarCadena($reg->usuario),
                "3" => limpiarCadena($reg->fecha),
                "4" => limpiarCadena($reg->cuota)
            );
        }

        $results = array(
            "sEcho" => 1,
            "iTotalRecords" => count($data),
            "iTotalDisplayRecords" => count($data),
            "aaData" => $data
        );
        echo json_encode($results);
        break;

    case 'selectPrestamo':
        require_once "../modelos/Prestamos.php";
        $prestamo = new Prestamo();
        $rspta = $prestamo->select();
        while ($reg = $rspta->fetch_object()) {
            echo '<option value=' . $reg->idprestamo . '>' . limpiarCadena($reg->nombre) . '</option>';
        }
        break;
}
?>