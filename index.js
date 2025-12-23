let todosLosPlatos = []; 
let precioBase = 0;
let nombreProductoActual = "";

async function cargarProductos() {
    const contenedor = document.getElementById('contenedorPlatos');
    if (!contenedor) return;

    try {
        const response = await fetch('/productos.json');
        const data = await response.json();
        todosLosPlatos = data.platos.flatMap(cat => cat.variantes);
        mostrarPlatos(todosLosPlatos);
    } catch (error) {
        console.error("Error cargando productos:", error);
    }
}

function mostrarPlatos(lista) {
    const contenedor = document.getElementById('contenedorPlatos');
    contenedor.innerHTML = ""; 

    lista.forEach(plato => {
        const card = document.createElement('div');
        card.className = 'tarjeta-plato';
        card.innerHTML = `
            <img src="${plato.imagen}" alt="${plato.nombre}">
            <div class="info-plato">
                <h3>${plato.nombre}</h3>
                <p>${plato.descripcion}</p>
                <div class="precio-accion">
                    <span class="precio">S/ ${plato.precio.toFixed(2)}</span>
                    <button class="btn-agregar" onclick="agregarRapido(${plato.id}, '${plato.nombre}', ${plato.precio})">
                        <ion-icon name="add-outline"></ion-icon>
                    </button>
                </div>
            </div>
        `;
        contenedor.appendChild(card);
    });
}

async function inicializarDetallePedido() {
    const titulo = document.getElementById('titulo-producto');
    if (!titulo) return; 

    const urlParams = new URLSearchParams(window.location.search);
    const idProducto = urlParams.get('id');
    
    if (idProducto) {
        try {
            const response = await fetch('/productos.json');
            const data = await response.json();
            const productos = data.platos.flatMap(cat => cat.variantes);
            const plato = productos.find(p => p.id == idProducto);

            if (plato) {
                precioBase = plato.precio;
                nombreProductoActual = plato.nombre;
                
                document.getElementById('titulo-producto').innerText = plato.nombre;
                document.getElementById('resumen-nombre').innerText = plato.nombre;
                document.getElementById('foto-grande').src = plato.imagen;
                actualizarPrecioPantalla();
            }
        } catch (e) { console.error("Error al cargar detalle", e); }
    }
}

function actualizarPrecioPantalla() {
    if (!document.getElementById('precio-dinamico')) return;

    let extraAcompañamiento = 0;
    let extraBebidas = 0;

    const radioSelected = document.querySelector('input[name="acompañamiento"]:checked');
    if (radioSelected) extraAcompañamiento = parseFloat(radioSelected.dataset.precio || 0);

    const checkboxes = document.querySelectorAll('.extra-item:checked');
    checkboxes.forEach(chk => {
        extraBebidas += parseFloat(chk.dataset.precio || 0);
    });

    const total = precioBase + extraAcompañamiento + extraBebidas;
    document.getElementById('precio-dinamico').innerText = `S/ ${total.toFixed(2)}`;
}

function agregarAlCarritoFinal() {
    const totalActual = parseFloat(document.getElementById('precio-dinamico').innerText.replace('S/ ', ''));
    
    let extras = [];
    document.querySelectorAll('.extra-item:checked').forEach(el => {
        extras.push(el.parentElement.querySelector('span').innerText);
    });
    const acompañamiento = document.querySelector('input[name="acompañamiento"]:checked').parentElement.querySelector('span').innerText;

    const nuevoItem = {
        idInterno: Date.now(), 
        nombre: nombreProductoActual,
        acompañamiento: acompañamiento,
        extras: extras,
        precio: totalActual,
        cantidad: 1
    };

    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito.push(nuevoItem);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    
    actualizarContadorCarrito();
    alert("¡Añadido al pedido!");
    window.location.href = "index.html";
}

function actualizarContadorCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const countSpan = document.getElementById('cart-count');
    if (countSpan) {
        const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
        countSpan.innerText = totalItems;
    }
}


const inputBusca = document.getElementById('inputBuscador');
if (inputBusca) {
    inputBusca.addEventListener('input', (e) => {
        const busqueda = e.target.value.toLowerCase();
        const filtrados = todosLosPlatos.filter(plato => 
            plato.nombre.toLowerCase().includes(busqueda)
        );
        mostrarPlatos(filtrados);
    });
}


document.addEventListener("DOMContentLoaded", () => {
    actualizarContadorCarrito(); 
    cargarProductos();           
    inicializarDetallePedido();  


    document.body.addEventListener('change', (e) => {
        if (e.target.name === 'acompañamiento' || e.target.classList.contains('extra-item')) {
            actualizarPrecioPantalla();
        }
    });

    const btnAgregar = document.querySelector('.boton-pedir');
    if (btnAgregar) {
        btnAgregar.addEventListener('click', agregarAlCarritoFinal);
    }
});
function agregarRapido(id, nombre, precio) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    const existe = carrito.find(item => item.idOriginal === id && !item.extras);

    if (existe) {
        existe.cantidad++;
    } else {
        carrito.push({
            idInterno: Date.now(),
            idOriginal: id,
            nombre: nombre,
            acompañamiento: "Clásico",
            extras: [],
            precio: precio,
            cantidad: 1
        });
    }
    
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContadorCarrito();
    alert(`${nombre} añadido al carrito`);
}