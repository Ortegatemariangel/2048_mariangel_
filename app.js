
const tablero = document.getElementById("tablero");
const puntuacion = document.getElementById("score");
const nuevoJuego = document.getElementById("nuevo-juego");
const mensaje = document.getElementById("mensaje");
const intentarNuevamente = document.getElementById("intentar-nuevamente");

let tableroJuego = [];
let score = 0;

// Crear un tablero vacío
function crearTablero() {
    tableroJuego = [];

    for (let i = 0; i < 4; i++) {
        tableroJuego.push([0, 0, 0, 0]);
    }
}

// Agregar una nueva ficha
function agregarFicha() {
    const espacios = [];

    for (let fila = 0; fila < 4; fila++) {
        for (let columna = 0; columna < 4; columna++) {
            if (tableroJuego[fila][columna] === 0) {
                espacios.push({
                    fila: fila,
                    columna: columna
                });
            }
        }
    }

    if (espacios.length === 0) {
        return;
    }

    const posicion =
        espacios[Math.floor(Math.random() * espacios.length)];

    tableroJuego[posicion.fila][posicion.columna] =
        Math.random() < 0.9 ? 2 : 4;
}

// Mostrar el tablero
function mostrarTablero() {

    tablero.innerHTML = "";

    for (let fila = 0; fila < 4; fila++) {

        for (let columna = 0; columna < 4; columna++) {

            const casilla = document.createElement("div");

            casilla.classList.add("casilla");

            const valor = tableroJuego[fila][columna];

            if (valor !== 0) {
                casilla.textContent = valor;
                casilla.classList.add(`numero-${valor}`);
            }

            tablero.appendChild(casilla);
        }
    }

    puntuacion.textContent = score;
}

// Iniciar el juego
function iniciarJuego() {

    crearTablero();

    score = 0;

    mensaje.classList.add("oculto");

    agregarFicha();
    agregarFicha();

    mostrarTablero();
}

// Eliminar espacios vacíos de una fila
function quitarCeros(fila) {

    return fila.filter(numero => numero !== 0);
}

// Combinar números iguales
function combinarFila(fila) {

    const nuevaFila = quitarCeros(fila);

    for (let i = 0; i < nuevaFila.length - 1; i++) {

        if (nuevaFila[i] === nuevaFila[i + 1]) {

            nuevaFila[i] *= 2;

            score += nuevaFila[i];

            nuevaFila[i + 1] = 0;
        }
    }

    return quitarCeros(nuevaFila);
}

// Completar una fila hasta tener cuatro posiciones
function completarFila(fila) {

    while (fila.length < 4) {
        fila.push(0);
    }

    return fila;
}

// Mover hacia la izquierda
function moverIzquierda() {

    let cambio = false;

    for (let fila = 0; fila < 4; fila++) {

        const original = [...tableroJuego[fila]];

        let nuevaFila = combinarFila(tableroJuego[fila]);

        nuevaFila = completarFila(nuevaFila);

        tableroJuego[fila] = nuevaFila;

        if (JSON.stringify(original) !== JSON.stringify(nuevaFila)) {
            cambio = true;
        }
    }

    if (cambio) {
        agregarFicha();
    }

    mostrarTablero();

    comprobarFin();
}

// Rotar el tablero
function rotarTablero() {

    const nuevoTablero = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

    for (let fila = 0; fila < 4; fila++) {

        for (let columna = 0; columna < 4; columna++) {

            nuevoTablero[columna][3 - fila] =
                tableroJuego[fila][columna];
        }
    }

    tableroJuego = nuevoTablero;
}

// Mover hacia la derecha
function moverDerecha() {

    rotarTablero();
    rotarTablero();

    moverIzquierda();

    rotarTablero();
    rotarTablero();
}

// Mover hacia arriba
function moverArriba() {

    rotarTablero();
    rotarTablero();
    rotarTablero();

    moverIzquierda();

    rotarTablero();
}

// Mover hacia abajo
function moverAbajo() {

    rotarTablero();

    moverIzquierda();

    rotarTablero();
    rotarTablero();
    rotarTablero();
}

// Comprobar si todavía se puede jugar
function comprobarFin() {

    for (let fila = 0; fila < 4; fila++) {

        for (let columna = 0; columna < 4; columna++) {

            if (tableroJuego[fila][columna] === 2048) {
                return;
            }

            if (tableroJuego[fila][columna] === 0) {
                return;
            }

            if (
                columna < 3 &&
                tableroJuego[fila][columna] ===
                tableroJuego[fila][columna + 1]
            ) {
                return;
            }

            if (
                fila < 3 &&
                tableroJuego[fila][columna] ===
                tableroJuego[fila + 1][columna]
            ) {
                return;
            }
        }
    }

    mensaje.classList.remove("oculto");
}

// Detectar las teclas del teclado
document.addEventListener("keydown", function(event) {

    if (event.key === "ArrowLeft") {

        event.preventDefault();
        moverIzquierda();

    } else if (event.key === "ArrowRight") {

        event.preventDefault();
        moverDerecha();

    } else if (event.key === "ArrowUp") {

        event.preventDefault();
        moverArriba();

    } else if (event.key === "ArrowDown") {

        event.preventDefault();
        moverAbajo();
    }
});

// Botón de nuevo juego
nuevoJuego.addEventListener("click", function() {
    iniciarJuego();
});

// Botón de intentar nuevamente
intentarNuevamente.addEventListener("click", function() {
    iniciarJuego();
});

// Comenzar automáticamente
iniciarJuego();
