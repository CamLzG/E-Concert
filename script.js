// Variables

const cantidadMaxima = 4
let blurFondo = document.getElementById("blur")
// Setea el carrito en función del localStorage
const carritoStorage = JSON.parse(localStorage.getItem("carrito"));
let carrito = carritoStorage != null ? carritoStorage : [];
// Setea la información del mail con el localStorage
const mailStorage = JSON.parse(localStorage.getItem("mailRegistro"));
let mailRegistro = mailStorage != null ? mailStorage : [];
let entradas = [];
let artista;

// Constructor para el carrito
function ItemCarrito(id, nombre, entradas, menores, total) {
    this.Id = id;
    this.Nombre = nombre;
    this.Entrada = entradas;
    this.Menores = menores;
    this.Total = total;
}

// Crea tarjetas a partir del archivo json
fetch("artistas.json")
    .then(datos => datos.json())
    .then(datos => {
        datos.forEach(artistas => {
            // Deconstructuring de artistas
            const { id, nombre, precio, precioMenores, URLimg, fecha } = artistas
            let contenedorEntradas = document.createElement("div")
            contenedorEntradas.className = "mostrarEntradas"
            contenedorEntradas.setAttribute("id", id)
            contenedorEntradas.innerHTML = `
        <img src="${URLimg}" alt="${nombre}">
                    <p>${nombre} - ${fecha}</p><p>Mayores: $${precio}</p><p>Menores: $${precioMenores}</p> `
            conciertos.appendChild(contenedorEntradas)
        })
        entradas = datos;
    })

// Evento para mostrar selector de entradas
let conciertos = document.getElementById("listaConciertos")

conciertos.addEventListener("click", (e) => {
    // Fuerza que el evento se dispare al tocar el div "mostrarEntradas"
    if (e.target.className === "mostrarEntradas" ||
        e.target.parentNode.className === "mostrarEntradas") {
        let divId = e.target.id ? e.target.id : e.target.parentNode.id
        artista = entradas.find(entrada => entrada.id === divId)
        let seleccionEntradas = document.getElementById("seleccionEntradas")
        let artistaSelecionado = document.getElementById("artistaElegido")
        artistaSelecionado.innerHTML = `Has seleccionado a ${artista.nombre} :`
        seleccionEntradas.classList.remove("hidden")
        // seleccionEntradas.classList.add("show")
    }
})

// Funcion para calcular el total
function calcularPrecio(cantidadEntradas, entradasMenores, entrada) {
    let totalMayores = (cantidadEntradas - entradasMenores) * entrada.precio
    let totalMenores = entradasMenores * entrada.precioMenores;
    return totalMayores + totalMenores;
}

// Scroll a formulario de registro
const registro = document.getElementById("registro")
registro.addEventListener("click", () => {
    const formNoticias = document.getElementById("formNoticias")
    formNoticias.scrollIntoView()
})

// Funciones de alerta

function mostrarToast(correcto, texto) {
    if (correcto === true) {
        Toastify({
            text: texto,
            duration: 2000,
            gravity: "bottom",
            position: "right",
            offset: {
                x: 50,
                y: 50
            }
        }).showToast();
    } else {
        Toastify({
            text: texto,
            duration: 2000,
            gravity: "bottom",
            position: "right",
            style: {
                background: "linear-gradient(to right, #522828, #fc2e2e)",
            },
            offset: {
                x: 50,
                y: 50
            }
        }).showToast();
    }
}

// Añadir items al carrito
let formularioEntradas = document.getElementById("formularioEntradas")

formularioEntradas.addEventListener("submit", (e) => {
    e.preventDefault()
    let entradasTotales = Number(formularioEntradas.cantidadEntradas.value)
    let entradasMenores = Number(formularioEntradas.entradasMenores.value)
    let entradasArtista = carrito.find(item => item.Id === artista.id)?.Entrada
    // Evalua que no se supere la cantidad máxima de entradas
    if ((entradasArtista !== undefined && entradasTotales + entradasArtista <= cantidadMaxima) ||
        entradasArtista === undefined) {
        let total = calcularPrecio(entradasTotales, entradasMenores, artista)
        if (entradasArtista != undefined) {
            let index = carrito.findIndex(item => item.Id === artista.id)
            carrito[index].Entrada += entradasTotales
            carrito[index].Menores += entradasMenores
            mostrarToast(true, `Se ha añadido la/las entrada/s para ${artista.nombre} al carrito`)
        } else {
            if (entradasMenores <= (entradasTotales - 1)) {
                carrito.push(new ItemCarrito(artista.id, artista.nombre, Number(entradasTotales), entradasMenores, total))
                mostrarToast(true, `Se ha añadido la/las entrada/s para ${artista.nombre} al carrito`)
            } else {
                mostrarToast(false, `Los menores deben ir acompañados de un adulto`)
            }
        }
        localStorage.setItem("carrito", JSON.stringify(carrito))
        formularioEntradas.cantidadEntradas.value = 1
        formularioEntradas.entradasMenores.value = 0

    } else {
        mostrarToast(false, `No puedes simular mas de 4 entradas por artista. Confirma tu carrito actual y realiza una nueva simulación de ser necesario.`)
    }
})

// Creacion del carrito
let carrito2 = document.getElementById("carritoImg")
let detalleCarrito = document.getElementById("detalleCarrito")
let contenderPadre = document.getElementById("contenedorCarrito")
let elementosTabla = document.getElementById("elementosTabla")
let totalCarrito = document.getElementById("totalCarrito")

carrito2.addEventListener("click", () => {
    blurFondo.classList.remove("hidden")
    // Previene que se dupliquen los elementos del carrito al ejecutarse el evento
    while (elementosTabla.hasChildNodes()) {
        elementosTabla.removeChild(elementosTabla.firstChild)
    }
    for (let index = 0; index < carrito.length; index++) {
        let fila = elementosTabla.insertRow()
        let nombreArtista = fila.insertCell(0)
        let entradasTS = fila.insertCell(1)
        let menoresT = fila.insertCell(2)
        let eliminarA = fila.insertCell(3)
        nombreArtista.innerHTML = `${carrito[index].Nombre}`
        entradasTS.innerHTML = `${carrito[index].Entrada}`
        menoresT.innerHTML = `${carrito[index].Menores}`
        eliminarA.innerHTML = `<i class="fa fa-times" aria-hidden="true" id="${carrito[index].Id}"></i>`
    }
    contenderPadre.classList.remove("hidden")
})

// Eliminar elemento carrito
detalleCarrito.addEventListener("click", (e) => {
    if (e.target.tagName == "I") {
        // Busca en el array y elimina el elemento a partir de la posición 1
        carrito.splice(carrito.findIndex(item => item.Id === e.target.id), 1)
        localStorage.setItem("carrito", JSON.stringify(carrito))
        // Se elimina del DOM el elemento
        elementosTabla.deleteRow(e.target.parentNode.parentNode)
    }
})

// Cerrar carrito
let cerrarCarrito = document.getElementById("cerrarCarrito")
cerrarCarrito.addEventListener("click", () => {
    blurFondo.classList.add("hidden")
    contenderPadre.classList.add("hidden")
})

let cerrarCarrito2 = document.getElementById("cerrarCarrito2")
cerrarCarrito2.addEventListener("click", () => {
    blurFondo.classList.add("hidden")
    totalCarrito.classList.add("hidden")
})

// Calcular total
let botonCarrito = document.getElementById("calculoTotal")
let mostrarTotal = document.getElementById("mostrarTotal")

botonCarrito.addEventListener("click", () => {
    // Realiza la suma de los totales en el carrito
    let calcularTotal = carrito.reduce((acc, item) => acc + item.Total, 0)
    totalCarrito.classList.remove("hidden")
    mostrarTotal.innerHTML = `El total de tu carrito es ${calcularTotal} pesos uruguayos.`
    contenderPadre.classList.add("hidden")
})

// Reseteo de carrito y localStorage
let formEnviar = document.getElementById("formEnviar")

formEnviar.addEventListener("submit", (e) => {
    e.preventDefault()
    let email = formEnviar.Email.value
    // Se evaluan los requisitos iniciales del formulario
    if (email != undefined && email != "") {
        swal("¡Hemos enviado la información a tu mail!", "Gracias por usar nuestros servicios", "success");
        blurFondo.classList.add("hidden")
        localStorage.clear()
        carrito = [];
        let totalCarrito = document.getElementById("totalCarrito")
        totalCarrito.classList.add("hidden")
    } else {
        swal("Debes ingresar un mail valido para el envío", "Ejemplo: ejemplo@ejemplo", "error");
    }
})

// Formulario de registro
let formularioRegistro = document.getElementById("formRegistro")

formularioRegistro.addEventListener("submit", (e) => {
    e.preventDefault()
    let email = formularioRegistro.Email.value
    // Se evaluan los requisitos iniciales del formulario
    if (email != undefined && email != "") {
        // Se evalua si el mail a registrar ya se encuentra registrado
        if (mailRegistro.some(mail => mail === email)) {
            swal("Tu mail ya se encuentra registrado", "", "error");
        } else {
            swal("¡Tu mail ha sido registrado con exito!", "", "success");
            mailRegistro.push(email)
            localStorage.setItem("mailRegistro", JSON.stringify(mailRegistro))
            formularioRegistro.Email.value = ""
        }
        // De no cumplirse el requisito inicial, se solicita ingresar nuevamente la información
    } else {
        swal("Debes ingresar un mail valido para el registro", "Ejemplo: ejemplo@ejemplo", "error");
    }
})