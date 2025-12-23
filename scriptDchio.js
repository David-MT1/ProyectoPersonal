

// Función para actualizar TODO (Header y Datos de Perfil)
async function inicializarUsuario() {
    const urlParams = new URLSearchParams(window.location.search);
    // Prioridad 1: ID de la URL (recién logueado)
    // Prioridad 2: ID de la memoria (navegando normal)
    const id = urlParams.get('id') || localStorage.getItem('usuario_id');

    console.log("Intentando cargar usuario ID:", id); // Para depurar en F12

    if (id && id !== "null" && id !== "undefined") {
        try {
            const response = await fetch(`http://localhost:8000/obtener_perfil?id=${id}`);
            if (!response.ok) throw new Error("Usuario no encontrado en DB");
            
            const data = await response.json();

            // 1. GUARDAR inmediatamente en memoria para asegurar el resto de pestañas
            localStorage.setItem('usuario_id', id);
            localStorage.setItem('usuario_nombre', data.nombre);

            // 2. RELLENAR HEADER (El "Ingresar")
            const textoPerfil = document.getElementById('texto-perfil');
            const linkPerfil = document.getElementById('perfil-usuario');
            if (textoPerfil) textoPerfil.innerText = data.nombre;
            if (linkPerfil) linkPerfil.href = `perfil.html?id=${id}`;

            // 3. RELLENAR DATOS DEL PERFIL (Los campos blancos de tu imagen)
            if (document.getElementById('db-nombre')) {
                document.getElementById('db-nombre').innerText = data.nombre;
                document.getElementById('db-apellido').innerText = data.apellido;
                document.getElementById('db-telefono').innerText = data.telefono;
                document.getElementById('db-correo').innerText = data.correo;
                document.getElementById('db-direccion').innerText = data.direccion;
            }

        } catch (error) {
            console.error("Error al sincronizar:", error);
            // Si hay un error real, limpiamos para no dejar datos "zombies"
            localStorage.clear();
        }
    } else {
        // Si no hay ID en ningún lado y estamos en perfil.html, mandamos a login
        if (document.getElementById('db-nombre')) {
            window.location.href = "login.html";
        }
    }
}

// Ejecutar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", inicializarUsuario);

// Función Cerrar Sesión (Simple y limpia)
function cerrarSesion() {
    localStorage.clear();
    window.location.href = "index.html";
}

