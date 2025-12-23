function agregarAlCarrito(id, nombre, precio) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    // Buscar si ya existe para sumar cantidad
    const existe = carrito.find(item => item.id === id);
    if (existe) {
        existe.cantidad++;
    } else {
        carrito.push({ id, nombre, precio: parseFloat(precio), cantidad: 1 });
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    
    // Actualizar el numerito del carrito (ID: cart-count)
    const countSpan = document.getElementById('cart-count');
    if (countSpan) {
        const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
        countSpan.innerText = totalItems;
    }

    alert(`¡${nombre} añadido al pedido!`);
}

function actualizarContadorCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const countSpan = document.getElementById('cart-count');
    if (countSpan) countSpan.innerText = carrito.length;
}

// --- CARGAR RESUMEN EN PEDIDO.HTML ---
function cargarResumenPedido() {
    const listaContenedor = document.getElementById('lista-productos-carrito');
    if (!listaContenedor) return;

    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const totalContenedor = document.getElementById('total-final');
    
    listaContenedor.innerHTML = carrito.length === 0 ? "<p>Carrito vacío</p>" : "";
    let total = 0;

    carrito.forEach((item, index) => {
        total += item.precio;
        listaContenedor.innerHTML += `
            <div class="card-item-carrito">
                <span>${item.nombre}</span>
                <span>S/ ${item.precio.toFixed(2)}</span>
            </div>`;
    });
    if (totalContenedor) totalContenedor.innerText = `S/ ${total.toFixed(2)}`;
}

// --- BOTÓN CONFIRMAR PEDIDO ---
async function confirmarPedidoFinal() {
    const idUsuario = localStorage.getItem('usuario_id');
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    if (!idUsuario) {
        alert("¡Error! No detectamos tu sesión. Por favor inicia sesión de nuevo.");
        window.location.href = "login.html";
        return;
    }

    if (carrito.length === 0) return alert("El carrito está vacío.");

    // Guardar en historial
    const pedido = { fecha: new Date().toLocaleString(), total: document.getElementById('total-final').innerText, estado: "Pendiente" };
    let historial = JSON.parse(localStorage.getItem(`historial_${idUsuario}`)) || [];
    historial.push(pedido);
    localStorage.setItem(`historial_${idUsuario}`, JSON.stringify(historial));

    alert("Pedido realizado con éxito");
    localStorage.removeItem('carrito');
    window.location.href = "index.html";
}

// --- INICIO ---
document.addEventListener("DOMContentLoaded", () => {
    inicializarUsuario();
    cargarProductos();
    actualizarContadorCarrito();
    cargarResumenPedido();

    // Vincular botón confirmar si existe
    const btnConfirmar = document.getElementById('btn-confirmar-pedido');
    if (btnConfirmar) btnConfirmar.addEventListener('click', confirmarPedidoFinal);
});