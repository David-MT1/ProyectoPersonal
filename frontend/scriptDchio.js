const platos = [
    { nombre: "Pizza D'CHIO", precio: 35.00, img: "Imágenes/pizza.png", link: "pedido.html", desc: "Mozzarella y Pepperoni" },
    { nombre: "Hamburguesa Royal", precio: 25.00, img: "Imágenes/hamburguesa.png", link: "pedido.html", desc: "Carne y huevo" },
    { nombre: "Tacos de Carne", precio: 18.00, img: "Imágenes/tacos.png", link: "pedido.html", desc: "Salsa especial" },
    { nombre: "Pasta Alfredo", precio: 28.00, img: "Imágenes/pasta.png", link: "pedido.html", desc: "Crema y jamón" }
];

const contenedor = document.getElementById('contenedorPlatos');
const buscador = document.getElementById('inputBuscador');

function mostrarPlatos(lista) {
    contenedor.innerHTML = '';
    
    lista.forEach(plato => {
            const card = `
                <div class="div-platos">
                    <div class="contenedor-img">
                        <img src="${plato.img}" alt="${plato.nombre}" class="img-plato">
                        <a href="${plato.link}" class="overlay-opciones">
                            <span>Más opciones</span>
                        </a>
                    </div>
                    
                    <h3>${plato.nombre}</h3>
                    <p>${plato.desc}</p>
                    <strong>S/ ${plato.precio.toFixed(2)}</strong>
                    
                    <button type="button" class="btn-agregar-carrito">
                        agregar al carrito
                    </button>
                </div>
            `;
        contenedor.innerHTML += card;
    });
}

buscador.addEventListener('input', (e) => {
    const texto = e.target.value.toLowerCase();
    const filtrados = platos.filter(plato => 
        plato.nombre.toLowerCase().includes(texto) || 
        plato.desc.toLowerCase().includes(texto)
    );
    mostrarPlatos(filtrados);
});

mostrarPlatos(platos);







const elementosOpcion = document.querySelectorAll('input');
    const visualizadorPrecio = document.getElementById('precio-dinamico');
    const precioBase = 35.00;

    function calcularTotal() {
        let extraTotal = 0;

        elementosOpcion.forEach(input => {
            if (input.checked) {
                extraTotal += parseFloat(input.dataset.precio || 0);
            }
        });

        const totalFinal = precioBase + extraTotal;
        
        // Efecto de conteo numérico
        visualizadorPrecio.innerText = totalFinal.toFixed(2);
    }

    // Escuchar cambios en cualquier opción
    elementosOpcion.forEach(input => {
        input.addEventListener('change', () => {
            // Animación al seleccionar
            calcularTotal();
        });
    });



