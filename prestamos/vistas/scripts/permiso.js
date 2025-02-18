var tabla;

// Función que se ejecuta al inicio
function init() {
    mostrarform(false);
    listar();
}

// Función mostrar formulario
function mostrarform(flag) {
    if (flag) {
        $("#listadoregistros").hide();
        $("#formularioregistros").show();
        $("#btnGuardar").prop("disabled", false);
        $("#btnagregar").hide();
    } else {
        $("#listadoregistros").show();
        $("#formularioregistros").hide();
        $("#btnagregar").hide();
    }
}

// Función Listar
function listar() {
    tabla = $('#tbllistado').dataTable({
        "aProcessing": true,
        "aServerSide": true,
        dom: 'Bfrtip',
        buttons: [],
        "ajax": {
            url: '../ajax/permiso.php?op=listar',
            type: "get",
            dataType: "json",
            beforeSend: function(xhr) {
                // Agregar token CSRF en el encabezado
                var csrfToken = $("#csrf_token").val();
                if (csrfToken) {
                    xhr.setRequestHeader('X-CSRF-TOKEN', csrfToken);
                }
            },
            error: function(e) {
                console.log("Error al cargar los datos. Intente nuevamente.");
                bootbox.alert("Ocurrió un error al cargar los datos. Inténtalo de nuevo.");
            }
        },
        "bDestroy": true,
        "iDisplayLength": 10,
        "order": [[0, "asc"]]
    }).DataTable();
}

init();
