export function mostrarNotificacion(mensaje, duracion = 3000) {
    const notification = document.getElementById("notification");
    notification.textContent = mensaje;
    notification.style.display = "block";
    setTimeout(() => {
        notification.style.display = "none";
    }, duracion);
}

export function guardarCarrito(carrito) {
    localStorage.setItem("carrito", JSON.stringify(carrito));
    let contadorCarrito = document.querySelector(".contadorCarrito");
    const cantidadTotal = carrito.reduce((total, producto) => total + producto.cantidad, 0);
    contadorCarrito.innerText = cantidadTotal;
}

export function cargarCarritoGuardado() {
    const carritoGuardado = localStorage.getItem("carrito");
    if (carritoGuardado) {
        return JSON.parse(carritoGuardado);
    }
    return [];
}

export function vaciarCarrito(carrito, actualizarVistaCarrito) {
    carrito.length = 0;
    guardarCarrito(carrito);
    actualizarVistaCarrito();
    mostrarNotificacion("Carrito vaciado correctamente");
}

export function cargarProductos(productos, agregarAlCarrito) {
    let contenedor = document.querySelector("#productos");
    productos.forEach((prod) => {
        let divProd = document.createElement("div");
        divProd.className = "producto";
        divProd.innerHTML = `
            <h3>${prod.nombre}</h3>
            <span>Precio: ${prod.precio}</span>
            <p>Ingredientes: ${prod.ingredientes.join(", ")}</p>
            <button class="btnAgregarCarrito" 
            data-nombre="${prod.nombre}" 
            data-precio="${prod.precio}">Agregar al Carrito</button>
        `;
        contenedor.appendChild(divProd);
    });

    const botonesAgregarCarrito = document.querySelectorAll(".btnAgregarCarrito");
    botonesAgregarCarrito.forEach((boton) => {
        boton.addEventListener("click", agregarAlCarrito);
    });
}

export function finalizarCompra(carrito, actualizarVistaCarrito) {
    if (carrito.length === 0) {
        mostrarNotificacion("El carrito está vacío");
        return;
    }

    const total = carrito.reduce((sum, producto) => sum + producto.precio * producto.cantidad, 0);
    const divConfirmacion = document.createElement("div");
    divConfirmacion.className = "confirmacion-compra";
    divConfirmacion.innerHTML = `
        <p>Total a pagar: $${total}</p>
        <div class="botones-confirmacion">
            <button class="btn-aceptar">Aceptar</button>
            <button class="btn-cancelar">Cancelar</button>
        </div>
    `;

    document.body.appendChild(divConfirmacion);

    const btnAceptar = divConfirmacion.querySelector(".btn-aceptar");
    const btnCancelar = divConfirmacion.querySelector(".btn-cancelar");

    btnAceptar.addEventListener("click", () => {
        carrito.length = 0;
        guardarCarrito(carrito);
        actualizarVistaCarrito();
        mostrarNotificacion("¡Gracias por su compra!");
        document.body.removeChild(divConfirmacion);
    });

    btnCancelar.addEventListener("click", () => {
        document.body.removeChild(divConfirmacion);
    });
}

export function actualizarVistaCarrito(carrito) {
    const contenedorCarrito = document.querySelector(".contenedor-carrito");
    contenedorCarrito.innerHTML = "";

    if (carrito.length === 0) {
        contenedorCarrito.innerHTML = "<p>El carrito está vacío</p>";
        return;
    }

    carrito.forEach((producto) => {
        const itemCarrito = document.createElement("div");
        itemCarrito.className = "item-carrito";
        itemCarrito.innerHTML = `
            <div class="item-info">
                <span class="item-nombre">${producto.nombre}</span>
                <span class="item-precio">$${producto.precio * producto.cantidad}</span>
            </div>
            <div class="item-cantidad">
                <button class="cantidad-btn restar" data-nombre="${producto.nombre}">-</button>
                <span>${producto.cantidad}</span>
                <button class="cantidad-btn sumar" data-nombre="${producto.nombre}">+</button>
            </div>
        `;
        contenedorCarrito.appendChild(itemCarrito);

        const btnRestar = itemCarrito.querySelector(".restar");
        const btnSumar = itemCarrito.querySelector(".sumar");

        btnRestar.addEventListener("click", () => actualizarCantidad(producto.nombre, -1, carrito));
        btnSumar.addEventListener("click", () => actualizarCantidad(producto.nombre, 1, carrito));
    });

    const total = carrito.reduce((sum, producto) => sum + producto.precio * producto.cantidad, 0);
    const totalElement = document.createElement("div");
    totalElement.innerHTML = `
        <div class="carrito-total">
            <div class="total-line">
                <span>Total:</span>
                <span>$${total}</span>
            </div>
        </div>
        <button class="btn-pagar">Finalizar Compra</button>
    `;
    contenedorCarrito.appendChild(totalElement);

    // Agregar el event listener al botón
    const btnPagar = totalElement.querySelector('.btn-pagar');
    btnPagar.addEventListener('click', () => finalizarCompra(carrito, () => actualizarVistaCarrito(carrito)));
}

export function actualizarCantidad(nombreProducto, cantidad, carrito) {
    const producto = carrito.find((item) => item.nombre === nombreProducto);
    if (producto) {
        producto.cantidad += cantidad;
        if (producto.cantidad <= 0) {
            const index = carrito.findIndex((item) => item.nombre === nombreProducto);
            carrito.splice(index, 1);
        }
        guardarCarrito(carrito);
        actualizarVistaCarrito(carrito);
    }
}

export class Producto {
    constructor(categoria, nombre, precio, ingredientes) {
        this.categoria = categoria;
        this.nombre = nombre;
        this.precio = precio;
        this.ingredientes = ingredientes;
    }
}
