$("#frmAcceso").on('submit', function(e) {
    e.preventDefault();

    // Obtener valores de los campos de entrada
    var logina = $("#logina").val();
    var clavea = $("#clavea").val();
    var csrf_token = $('#csrf_token').val();  // Token CSRF para prevenir ataques

    // Validar los campos de entrada (aquí puedes agregar validaciones personalizadas)
    if (!logina || !clavea) {
        bootbox.alert("Por favor, complete todos los campos.");
        return;
    }

    // Enviar la solicitud AJAX con el token CSRF y los datos
    $.post("../ajax/usuarios.php?op=verificar", {
        "logina": logina,
        "clavea": clavea,
        "csrf_token": csrf_token
    })
    .done(function(data) {
        if (data != "null") {
            // Redirigir si las credenciales son correctas
            $(location).attr("href", "concepto.php");
        } else {
            // Mensaje de error en caso de credenciales incorrectas
            bootbox.alert("Credenciales incorrectas");
        }
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        // Manejo de errores en caso de que la solicitud falle
        bootbox.alert("Error en la solicitud: " + textStatus);
    });
});
