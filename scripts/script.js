import {
    mostrarNotificacion,
    guardarCarrito,
    cargarCarritoGuardado,
    vaciarCarrito,
    cargarProductos,
    finalizarCompra,
    actualizarVistaCarrito,
    actualizarCantidad,
    Producto,
} from "./funciones.js";

// Variables
let productos = [];
let carrito = [];

// Cargar productos desde JSON
async function cargarProductosDesdeJSON() {
    try {
        const response = await fetch("./data/productos.json");
        const data = await response.json();
        productos = data.productos.map(
            (p) => new Producto(p.categoria, p.nombre, p.precio, p.ingredientes)
        );
        cargarProductos(productos, agregarAlCarrito);
    } catch (error) {
        console.error("Error al cargar los productos:", error);
    }
}

// Inicialización
carrito = cargarCarritoGuardado();
cargarProductosDesdeJSON();
actualizarVistaCarrito(carrito);

document.addEventListener("DOMContentLoaded", function () {
    const botonVaciar = document.querySelector(".btnVaciarCarrito");
    botonVaciar.addEventListener("click", () =>
        vaciarCarrito(carrito, () => actualizarVistaCarrito(carrito))
    );
});

function agregarAlCarrito(event) {
    const nombreProducto = event.target.dataset.nombre;
    const precioProducto = parseFloat(event.target.dataset.precio);

    const productoParaCarrito = {
        nombre: nombreProducto,
        precio: precioProducto,
        cantidad: 1,
    };

    const productoExistente = carrito.find((item) => item.nombre === nombreProducto);

    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        carrito.push(productoParaCarrito);
    }

    guardarCarrito(carrito);
    actualizarVistaCarrito(carrito);
}
