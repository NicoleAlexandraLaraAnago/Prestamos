var tabla;

//Funcion que se ejecuta al inicio
function init() {
    mostrarform(false);
    listar();

    // Asegurarse de que la validación y el CSRF token están presentes
    $("#formulario").on("submit", function (e) {
        e.preventDefault();
        guardaryeditar(e);
    });
}

//Funcion Limpiar
function limpiar() {
    $("#idcliente").val("");
    $("#cedula").val("");
    $("#nombre").val("");
    $("#direccion").val("");
    $("#telefono").val("");
}

//Mostrar Formulario
function mostrarform(flag) {
    limpiar();
    if (flag) {
        $("#listadoregistros").hide();
        $("#formularioregistros").show();
        $("#btnGuardar").prop("disabled", false);
        $("#btnagregar").hide();
    } else {
        $("#listadoregistros").show();
        $("#formularioregistros").hide();
        $("#btnagregar").show();
    }
}

function cancelarform() {
    limpiar();
    mostrarform(false);
}

function listar() {
    tabla = $('#tbllistado').dataTable({
        "aProcessing": true, //Activamos el procesamiento del datatables
        "aServerSide": true, //Paginación y filtrado realizados por el servidor
        dom: 'Bfrtip', //Definimos los elementos del control de tabla
        buttons: [
            'copyHtml5',
            'excelHtml5',
            'pdf'
        ],
        "ajax": {
            url: '../ajax/clientes.php?op=listar',
            type: "get",
            dataType: "json",
            error: function (e) {
                console.log(e.responseText);
            }
        },
        "bDestroy": true,
        "iDisplayLength": 10, //Paginación
        "order": [
            [2, "asc"]
        ]
    }).DataTable();
}

function guardaryeditar(e) {
    e.preventDefault();
    $("#btnGuardar").prop("disabled", true);
    var formData = new FormData($("#formulario")[0]);

    // Incluir token CSRF en la solicitud
    formData.append('csrf_token', $('#csrf_token').val());

    $.ajax({
        url: "../ajax/clientes.php?op=guardaryeditar",
        type: "POST",
        data: formData,
        contentType: false,
        processData: false,
        success: function (datos) {
            bootbox.alert(datos);
            mostrarform(false);
            tabla.ajax.reload();
        }
    });
    limpiar();
}

function mostrar(idcliente) {
    $.post("../ajax/clientes.php?op=mostrar", {
        idcliente: idcliente
    }, function (data, status) {
        data = JSON.parse(data);
        mostrarform(true);

        $("#cedula").val(data.cedula);
        $("#nombre").val(data.nombre);
        $("#direccion").val(data.direccion);
        $("#telefono").val(data.telefono);
        $("#idcliente").val(data.idcliente);
    })
}

//Función para desactivar registros
function desactivar(idcliente) {
    bootbox.confirm("¿Está Seguro de desactivar el Cliente?", function (result) {
        if (result) {
            $.post("../ajax/clientes.php?op=desactivar", {
                idcliente: idcliente
            }, function (e) {
                bootbox.alert(e);
                tabla.ajax.reload();
            });
        }
    })
}

//Función para activar registros
function activar(idcliente) {
    bootbox.confirm("¿Está Seguro de activar Cliente?", function (result) {
        if (result) {
            $.post("../ajax/clientes.php?op=activar", {
                idcliente: idcliente
            }, function (e) {
                bootbox.alert(e);
                tabla.ajax.reload();
            });
        }
    })
}

init();
