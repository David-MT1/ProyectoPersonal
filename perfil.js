function cargarHistorialReal() {
    const id = localStorage.getItem('usuario_id');
    const contenedor = document.getElementById('contenedor-pedidos');
    
    if (!contenedor || !id) return;

    const historial = JSON.parse(localStorage.getItem(`historial_${id}`)) || [];

    if (historial.length > 0) {
        contenedor.innerHTML = ""; 
        
        historial.reverse().forEach(p => {
            contenedor.innerHTML += `
                <div class="item-historial-perfil">
                    <ion-icon name="fast-food-outline"></ion-icon>
                    <p>Pedido - ${p.total}</p>
                    <small>Fecha: ${p.fecha}</small>
                </div>
            `;
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    actualizarContadorCarrito();
    cargarHistorialReal();
    
    const btnPedido = document.getElementById('btn-confirmar-pedido');
    if (btnPedido) btnPedido.addEventListener('click', confirmarPedidoFinal);
});