(function() {
    let DB;
    let idCliente;

    const nombreInput = document.querySelector('#nombre');
    const emailInput = document.querySelector('#email');
    const telefonoInput = document.querySelector('#telefono');
    const empresaInput = document.querySelector('#empresa');

    const formulario = document.querySelector('#formulario');

    
    document.addEventListener('DOMContentLoaded', () => {
        conectarDB();

        //actualiza el registro
        formulario.addEventListener('submit', actualizaCliente);
        //verificar el id de la url
        const parametrosUrl = new URLSearchParams(window.location.search);
        idCliente = parametrosUrl.get('id');

        if(idCliente) {
            setTimeout(() => {
                obtenerCliente(idCliente);
            }, 100);
        }
    });

    function actualizaCliente(e) {
        e.preventDefault();

        if(nombreInput.value === '' || emailInput.value === '' || telefonoInput.value === '' || empresaInput.value === '' ) {
            imprimirAlerta('todos los campos son obligatorios', 'error');

            return;
        }

        //Actualizar cliente
        const clienteActualizado = {
            nombre: nombreInput.value,
            email: emailInput.value,
            telefono: telefonoInput.value,
            empresa: empresaInput.value,
            id: Number(idCliente)
        } 

        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');

        objectStore.put(clienteActualizado);

        transaction.onerror = () => console.log('hubo un error');
        transaction.oncomplete = () => {
            imprimirAlerta('Cliente Actualizado');

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);
        };
    }

    function obtenerCliente(id) {
        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');

        const cliente = objectStore.openCursor();
        cliente.onsuccess = (e) => {
            const cursor = e.target.result;

            if(cursor) {
                if(cursor.value.id === Number(id)) {
                    llenarFormulario(cursor.value);
                }
                cursor.continue();
            }
        }
    }

    function llenarFormulario(datosCliente) {
        const {nombre, email, telefono, empresa} = datosCliente;

        nombreInput.value = nombre;
        emailInput.value = email;
        telefonoInput.value = telefono;
        empresaInput.value = empresa;
    }

})();