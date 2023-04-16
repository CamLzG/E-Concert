const cantidadMaxima = 4
let blurFondo = document.getElementById("blur")

function Entrada(id, nombre, precio, precioMenores) {
    this.Id = id;
    this.Nombre = nombre;
    this.Precio = precio;
    this.PrecioMenores = precioMenores;
}

function ItemCarrito(nombre, entradas, menores, total) {
    this.Nombre = nombre;
    this.Entrada = entradas;
    this.Menores = menores;
    this.Total = total;
}

let entradas = [
    new Entrada("badBunny", "Bad Bunny", 100, 50),
    new Entrada("duaLipa", "Dua Lipa", 200, 100),
    new Entrada("metallica", "Metallica", 200, 100),
]

let carritoStorage = JSON.parse(localStorage.getItem("carrito"));
let carrito = carritoStorage != null ? carritoStorage : [];

function calcularPrecio(cantidadEntradas, entradasMenores, entrada) {
    let totalMayores = (cantidadEntradas - entradasMenores) * entrada.Precio
    let totalMenores = entradasMenores * entrada.PrecioMenores;
    return totalMayores + totalMenores;
}


let registro = document.getElementById("registro")
registro.addEventListener("click", () => {
    let formNoticias = document.getElementById("formNoticias")
    formNoticias.scrollIntoView()
})

let artista;

let seleccionConcierto = document.getElementsByClassName("mostrarEntradas")
for (let index = 0; index < seleccionConcierto.length; index++) {
    seleccionConcierto[index].addEventListener("click", () => {
        artista = entradas.find(entrada => entrada.Id === seleccionConcierto[index].id)
        let seleccionEntradas = document.getElementById("seleccionEntradas")
        let artistaSelecionado = document.getElementById("artistaElegido")
        artistaSelecionado.innerHTML = `Has seleccionado a ${artista.Nombre} :`
        seleccionEntradas.classList.remove("hidden")
    })
}

let formularioEntradas = document.getElementById("formularioEntradas")
formularioEntradas.addEventListener("submit", (e) => {
    e.preventDefault()
    let entradasTotales = formularioEntradas.cantidadEntradas.value
    let entradasMenores = formularioEntradas.entradasMenores.value
    let total = calcularPrecio(entradasTotales, entradasMenores, artista)
    carrito.push(new ItemCarrito(artista.Nombre, entradasTotales, entradasMenores, total))
    localStorage.setItem("carrito", JSON.stringify(carrito))
    formularioEntradas.cantidadEntradas.value = 1
    formularioEntradas.entradasMenores.value = 0
    let contendorMsg = document.getElementById("añadido")
    contendorMsg.innerHTML = `Se ha añadido la/las entrada/s para ${artista.Nombre} al carrito`
    contendorMsg.classList.toggle("hidden")
    setTimeout(function () {
        contendorMsg.classList.toggle("hidden");
    }, 1000);
})

let carrito2 = document.getElementById("carritoImg")
carrito2.addEventListener("click", () => {
    blurFondo.classList.remove("hidden")
    let contenedorCarrito = document.getElementById("contenedorCarrito")
    for (let index = 0; index < carrito.length; index++) {
        let contenido = document.createElement("p")
        contenido.innerHTML = `${carrito[index].Nombre} - ${carrito[index].Entrada} Entradas - ${carrito[index].Menores} Menores`
        contenedorCarrito.prepend(contenido)
    }
    contenedorCarrito.classList.remove("hidden")
})

let botonCarrito = document.getElementById("calculoTotal")
botonCarrito.addEventListener("click", () => {
    let calcularTotal = carrito.reduce((acc, item) => acc + item.Total, 0)
    let totalCarrito = document.getElementById("totalCarrito")
    totalCarrito.classList.remove("hidden")
    let total = document.createElement("p")
    total.innerHTML = `El total de tu carrito es ${calcularTotal} pesos uruguayos.`
    totalCarrito.prepend(total)
    totalCarrito.className = "divEmergente"
    let sectionCarrito = document.getElementById("contenedorCarrito")
    sectionCarrito.classList.add("hidden")
})

let reset = document.getElementById("reset")
reset.addEventListener("click", () => {
    blurFondo.classList.add("hidden")
    localStorage.clear()
    carrito = [];
    let totalCarrito = document.getElementById("totalCarrito")
    totalCarrito.classList.add("hidden")
    location.reload()
})


let botonRegistro = document.getElementById("formRegistro")
botonRegistro.addEventListener("submit", (e) => {
    e.preventDefault()
    blurFondo.classList.remove("hidden")
    let formNoticias = document.getElementById("registroCompleto")
    formNoticias.classList.remove("hidden")
    let alerta = document.createElement("p")
    alerta.innerHTML = `¡Tu registro se completó con exito!`
    formNoticias.prepend(alerta)
})

let resetForm = document.getElementById("resetForm")
resetForm.addEventListener("click", () => {
    blurFondo.classList.add("hidden")
    location.reload()
    let formNoticias = document.getElementById("registroCompleto")
    formNoticias.classList.add("hidden")
})