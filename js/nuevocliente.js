(function() {
    let DB;
    const formulario = document.querySelector('#formulario');

    document.addEventListener('DOMContentLoaded', () => {
        conectarDB();

        formulario.addEventListener('submit', validarCliente);
    });

    function validarCliente(e) {
        e.preventDefault();
        console.log('validando...');
        //leer los inputs
        const nombre = document.querySelector('#nombre').value;
        const email = document.querySelector('#email').value;
        const telefono = document.querySelector('#telefono').value;
        const empresa = document.querySelector('#empresa').value;

        if(nombre === '' || email === '' || telefono === '' || empresa === '' ) {
            imprimirAlerta('Todos los campos son obligatorios', 'error');

            return;
        }

        //crear nuevo objetocon la informacion
        const cliente = { nombre, email, telefono, empresa };
        cliente.id = Date.now();
        
        crearNuevoCliente(cliente);
    }

    function crearNuevoCliente(cliente) {
        
        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');

        objectStore.add(cliente);

        transaction.onerror = () => {
            imprimirAlerta('hubo un error', 'error');
        }

        transaction.oncomplete = () => {
            imprimirAlerta('Cliente Agregado Correctamente');

            setTimeout(() => {
                window.location.href = 'index.html';
            },3000);
        }
    }

    function conectarDB() {
        const crmDB = window.indexedDB.open('crm', 1);
    
        crmDB.onerror = () => console.log('error al conectar con la base de datos');
        crmDB.onsuccess = () => DB = crmDB.result;
    }
    

})();