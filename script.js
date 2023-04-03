const cantidadMaxima = 4

function Entrada(nombre, precio, precioMenores) {
    this.Nombre = nombre;
    this.Precio = precio;
    this.PrecioMenores = precioMenores;
}

let entradas = [
    new Entrada("Bad Bunny", 100, 50),
    new Entrada("Dua Lipa", 200, 100),
    new Entrada("Metallica", 200, 100),
]

let carrito = [];

function calcularPrecio(cantidadEntradas, entradasMenores, entrada) {
    let totalMayores = (cantidadEntradas - entradasMenores) * entrada.Precio
    let totalMenores = entradasMenores * entrada.PrecioMenores;
    return totalMayores + totalMenores;
}

alert("Bienvenido al simulador de compra de entradas para conciertos en Uruguay.")
let artistas = entradas.map(entrada => entrada.Nombre).join(", ");
do {
    do {
        let entradaSeleccionada;
        let artistaValido = false;
        alert(`Los conciertos disponibles actualmente son: ${artistas}`);
        do {
            let entradaSeleccionadaString = prompt("Escriba el artista que desea ver");
            artistaValido = entradas.some(entrada => entrada.Nombre.toLowerCase() === entradaSeleccionadaString.toLowerCase());

            if (!artistaValido) {
                alert(`Artista invalido. Los conciertos disponibles actualmente son: ${artistas}`);
            }
            entradaSeleccionada = entradas.find(entrada => entrada.Nombre.toLowerCase() === entradaSeleccionadaString.toLowerCase());

        } while (!artistaValido);

        let cantidadEntradas = 0;
        let entradasMenores = 0;

        do {
            cantidadEntradas = Number(prompt("El precio para mayores es " + entradaSeleccionada.Precio + ". Y el precio para menores es " + entradaSeleccionada.PrecioMenores + " \n Ingresa la cantidad de entradas que deseas (Máximo " + cantidadMaxima + ")"))
            if (isNaN(cantidadEntradas)) {
                alert("Debes ingresar un número")
            } else if (cantidadEntradas > cantidadMaxima) {
                alert("Solo se permiten " + cantidadMaxima + " entradas por persona")
            }

        } while (isNaN(cantidadEntradas) || cantidadEntradas > cantidadMaxima || cantidadEntradas < 1);

        if (cantidadEntradas > 1) {
            do {
                entradasMenores = Number(prompt("¿Cuantas entradas son para menores?"))
                if (isNaN(entradasMenores)) {
                    alert("Debes ingresar un número")
                } else if (entradasMenores > (cantidadEntradas - 1)) {
                    alert("Los menores deben ir acompañados de por lo menos 1 adulto.")
                }
            } while (isNaN(entradasMenores) || entradasMenores > (cantidadEntradas - 1));
        }

        let costoTotal = calcularPrecio(cantidadEntradas, entradasMenores, entradaSeleccionada);

        alert("El total sería " + costoTotal + " pesos uruguayos")

        carrito.push(costoTotal);

    } while (prompt("¿Desea seguir comprando? \n - Si \n - No").toLowerCase() == "si");

    console.log("carrito: ", carrito);
    alert("El total del carrito sería " + carrito.reduce((a, b) => a + b, 0) + " pesos uruguayos")

} while (prompt("¿Quieres realizar otra simulación? \n - Si \n - No").toLowerCase() == "si");