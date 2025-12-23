async function cargarPromociones() {
    const contenedor = document.getElementById('contenedor-promociones');
    if (!contenedor) return; 

    try {
        const response = await fetch('/promociones.json');
        const data = await response.json();
        
        contenedor.innerHTML = ""; 

        data.promociones.forEach(promo => {
            const tarjeta = document.createElement('div');
            tarjeta.className = 'tarjeta-lista'; 
            
            tarjeta.innerHTML = `
                <div class="caja-img-lista">
                    <img src="${promo.imagen}" alt="${promo.nombre}">
                </div>
                <div class="info-lista">
                    <h3>${promo.nombre}</h3>
                    <p>${promo.descripcion}</p>
                    <p><strong>S/ ${promo.precio.toFixed(2)}</strong></p>
                    <button class="boton-pedido" onclick="agregarAlCarrito(${promo.id}, '${promo.nombre}', ${promo.precio})">
                        Pedir ahora
                    </button>
                </div>
            `;
            contenedor.appendChild(tarjeta);
        });

        // --- ESTO ASEGURA QUE SE VEAN APENAS CARGUEN ---
        // Forzamos el check de scroll una vez que las tarjetas ya existen en el HTML
        setTimeout(() => {
            window.dispatchEvent(new Event('scroll'));
        }, 100);

    } catch (error) {
        console.error("Error al cargar las promos:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    cargarPromociones();
});

/*-- LÓGICA DE SCROLL (Mantenla igual porque ya te funciona) --*/
window.addEventListener('scroll', function() {
    const tarjetas = document.querySelectorAll('.tarjeta-lista');
    const puntoActivacion = window.innerHeight / 1.1;

    tarjetas.forEach(tarjeta => {
        const distancia = tarjeta.getBoundingClientRect().top;

        if (distancia < puntoActivacion) {
            tarjeta.classList.add('aparecer');
        }
    });
});