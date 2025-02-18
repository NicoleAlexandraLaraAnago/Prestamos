<?php
session_start();
require_once "../modelos/Usuarios.php";

$usuarios = new Usuarios();

function limpiarEntrada($data)
{
	return htmlspecialchars(strip_tags(trim($data)), ENT_QUOTES, 'UTF-8');
}

$idusuario = isset($_POST["idusuario"]) ? limpiarEntrada($_POST["idusuario"]) : "";
$nombre = isset($_POST["nombre"]) ? limpiarEntrada($_POST["nombre"]) : "";
$direccion = isset($_POST["direccion"]) ? limpiarEntrada($_POST["direccion"]) : "";
$telefono = isset($_POST["telefono"]) ? limpiarEntrada($_POST["telefono"]) : "";
$login = isset($_POST["login"]) ? limpiarEntrada($_POST["login"]) : "";
$clave = isset($_POST["clave"]) ? limpiarEntrada($_POST["clave"]) : "";
$imagen = isset($_POST["imagen"]) ? limpiarEntrada($_POST["imagen"]) : "";

switch ($_GET["op"]) {
	case 'guardaryeditar':
		if (!file_exists($_FILES['imagen']['tmp_name']) || !is_uploaded_file($_FILES['imagen']['tmp_name'])) {
			$imagen = limpiarEntrada($_POST["imagenactual"]);
		} else {
			$ext = explode(".", $_FILES["imagen"]["name"]);
			if (in_array($_FILES['imagen']['type'], ["image/jpg", "image/jpeg", "image/png"])) {
				$imagen = round(microtime(true)) . '.' . end($ext);
				move_uploaded_file($_FILES["imagen"]["tmp_name"], "../files/usuarios/" . $imagen);
			}
		}

		// Si se proporciona una nueva contraseña, la encripta con bcrypt.
		$clavehash = !empty($clave) ? password_hash($clave, PASSWORD_BCRYPT) : $_POST["claveactual"];

		if (empty($idusuario)) {
			$rspta = $usuarios->insertar($nombre, $direccion, $telefono, $login, $clavehash, $imagen, $_POST['permiso']);
			echo $rspta ? "Usuario registrado" : "Usuario no se pudo registrar";
		} else {
			$rspta = $usuarios->editar($idusuario, $nombre, $direccion, $telefono, $login, $clavehash, $imagen, $_POST['permiso']);
			echo $rspta ? "Usuario actualizado" : "Usuario no se pudo actualizar";
		}
		break;

	case 'desactivar':
		echo $usuarios->desactivar($idusuario) ? "Usuario Desactivado" : "Usuario no se puede desactivar";
		break;

	case 'activar':
		echo $usuarios->activar($idusuario) ? "Usuario activado" : "Usuario no se puede activar";
		break;

	case 'mostrar':
		echo json_encode($usuarios->mostrar($idusuario));
		break;

	case 'listar':
		$rspta = $usuarios->listar();
		$data = [];
		while ($reg = $rspta->fetch_object()) {
			$data[] = [
				"0" => ($reg->estado) ? '<button class="btn btn-warning" onclick="mostrar(' . $reg->idusuario . ')"><i class="fa fa-pencil"></i></button>' .
					' <button class="btn btn-danger" onclick="desactivar(' . $reg->idusuario . ')"><i class="fa fa-close"></i></button>' :
					'<button class="btn btn-warning" onclick="mostrar(' . $reg->idusuario . ')"><i class="fa fa-pencil"></i></button>' .
					' <button class="btn btn-primary" onclick="activar(' . $reg->idusuario . ')"><i class="fa fa-check"></i></button>',
				"1" => limpiarEntrada($reg->nombre),
				"2" => limpiarEntrada($reg->direccion),
				"3" => limpiarEntrada($reg->telefono),
				"4" => limpiarEntrada($reg->login),
				"5" => "<img src='../files/usuarios/" . limpiarEntrada($reg->imagen) . "' height='50px' width='50px' >",
				"6" => ($reg->estado) ? '<span class="label bg-primary">Activado</span>' : '<span class="label bg-danger">Desactivado</span>'
			];
		}
		echo json_encode(["sEcho" => 1, "iTotalRecords" => count($data), "iTotalDisplayRecords" => count($data), "aaData" => $data]);
		break;

	case 'verificar':
		$logina = limpiarEntrada($_POST['logina']);
		$clavea = limpiarEntrada($_POST['clavea']);

		$rspta = $usuarios->verificar($logina); // Obtener el usuario sin verificar clave
		$fetch = $rspta->fetch_object();

		if ($fetch && password_verify($clavea, $fetch->clave)) {

			// Contraseña correcta, iniciar sesión
			$_SESSION['idusuario'] = $fetch->idusuario;
			$_SESSION['nombre'] = $fetch->nombre;
			$_SESSION['imagen'] = $fetch->imagen;
			$_SESSION['login'] = $fetch->login;

			$marcados = $usuarios->listarmarcados($fetch->idusuario);
			$valores = [];
			while ($per = $marcados->fetch_object()) {
				array_push($valores, $per->idpermiso);
			}

			$_SESSION['Escritorio'] = in_array(1, $valores) ? 1 : 0;
			$_SESSION['Clientes'] = in_array(2, $valores) ? 1 : 0;
			$_SESSION['Prestamos'] = in_array(3, $valores) ? 1 : 0;
			$_SESSION['Pagos'] = in_array(4, $valores) ? 1 : 0;
			$_SESSION['Usuarios'] = in_array(5, $valores) ? 1 : 0;
			$_SESSION['Gastos'] = in_array(6, $valores) ? 1 : 0;
			$_SESSION['Consultas'] = in_array(7, $valores) ? 1 : 0;

			echo json_encode($fetch);
		} else {
			echo json_encode(["error" => "Usuario o contraseña incorrectos"]);
		}
		break;

	case 'salir':
		session_unset();
		session_destroy();
		header("Location: ../index.php");
		break;
}
