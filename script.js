const lienzo = document.getElementById("lienzo");
const ctx = lienzo.getContext("2d");

// Fondo negro real (como MNIST: fondo negro, trazo blanco)
ctx.fillStyle = "black";
ctx.fillRect(0, 0, 280, 280);

const vista = document.getElementById("vista");
const ctxVista = vista.getContext("2d");
ctxVista.imageSmoothingQuality = "high";
const resultado = document.getElementById("resultado");

// Estilo del pincel
ctx.strokeStyle = "white";
ctx.lineWidth = 20;
ctx.lineCap = "round";

let dibujando = false;
let ultimo = null;

function posicion(evento) {
  const caja = lienzo.getBoundingClientRect();
  return { x: evento.clientX - caja.left, y: evento.clientY - caja.top };
}

lienzo.addEventListener("pointerdown", (e) => {
  dibujando = true;
  ultimo = posicion(e);
});

lienzo.addEventListener("pointermove", (e) => {
  if (!dibujando) return;
  const p = posicion(e);
  ctx.beginPath();
  ctx.moveTo(ultimo.x, ultimo.y);
  ctx.lineTo(p.x, p.y);
  ctx.stroke();
  ultimo = p;
});

function borrar() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, 280, 280);
  ctxVista.fillStyle = "black";
  ctxVista.fillRect(0, 0, 28, 28);
  resultado.textContent = "Dibuja un número y pulsa Predecir.";
}

function actualizarVista() {
  ctxVista.drawImage(lienzo, 0, 0, 28, 28);
}

function predecir() {
  actualizarVista();
  resultado.textContent = "Vista actualizada (la predicción llega en un próximo paso).";
}

function terminarTrazo() {
  if (!dibujando) return;
  dibujando = false;
  actualizarVista();
}

lienzo.addEventListener("pointerdown", (e) => {
  dibujando = true;
  ultimo = posicion(e);
});

lienzo.addEventListener("pointermove", (e) => {
  if (!dibujando) return;
  const p = posicion(e);
  ctx.beginPath();
  ctx.moveTo(ultimo.x, ultimo.y);
  ctx.lineTo(p.x, p.y);
  ctx.stroke();
  ultimo = p;
});

lienzo.addEventListener("pointerup", terminarTrazo);
lienzo.addEventListener("pointerleave", terminarTrazo);

document.getElementById("btn-borrar").addEventListener("click", borrar);
document.getElementById("btn-predecir").addEventListener("click", predecir);

borrar();

function obtenerPixeles() {
  const datos = ctxVista.getImageData(0, 0, 28, 28).data;
  const pixeles = [];
  for (let i = 0; i < datos.length; i += 4) {
    pixeles.push(datos[i]);
  }
  return pixeles;
}

function predecir() {
  actualizarVista();
  const pixeles = obtenerPixeles();
  console.log("Cantidad de números:", pixeles.length);

  // Para "ver" el dibujo en la consola: # = trazo, . = fondo
  for (let fila = 0; fila < 28; fila++) {
    const numeros = pixeles.slice(fila * 28, fila * 28 + 28);
    console.log(numeros.map((v) => (v > 128 ? "#" : ".")).join(""));
  }

  resultado.textContent = "Leí " + pixeles.length + " números. Mira la consola (F12).";
}
