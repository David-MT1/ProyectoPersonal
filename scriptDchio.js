

async function inicializarUsuario() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id') || localStorage.getItem('usuario_id');

    console.log("Intentando cargar usuario ID:", id); 

    if (id && id !== "null" && id !== "undefined") {
        try {
            const response = await fetch(`http://localhost:8000/obtener_perfil?id=${id}`);
            if (!response.ok) throw new Error("Usuario no encontrado en DB");
            
            const data = await response.json();

            localStorage.setItem('usuario_id', id);
            localStorage.setItem('usuario_nombre', data.nombre);

            const textoPerfil = document.getElementById('texto-perfil');
            const linkPerfil = document.getElementById('perfil-usuario');
            if (textoPerfil) textoPerfil.innerText = data.nombre;
            if (linkPerfil) linkPerfil.href = `perfil.html?id=${id}`;

            if (document.getElementById('db-nombre')) {
                document.getElementById('db-nombre').innerText = data.nombre;
                document.getElementById('db-apellido').innerText = data.apellido;
                document.getElementById('db-telefono').innerText = data.telefono;
                document.getElementById('db-correo').innerText = data.correo;
                document.getElementById('db-direccion').innerText = data.direccion;
            }

        } catch (error) {
            console.error("Error al sincronizar:", error);
            localStorage.clear();
        }
    } else {
        if (document.getElementById('db-nombre')) {
            window.location.href = "login.html";
        }
    }
}

document.addEventListener("DOMContentLoaded", inicializarUsuario);

function cerrarSesion() {
    localStorage.clear();
    window.location.href = "index.html";
}

