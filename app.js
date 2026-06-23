const API_URL = "https://script.google.com/macros/s/AKfycbzAQKSKVGTsCBOxPD9YCiXRm69J-B1bvlVcSSAKA-BRIAxXC8nCoz11M3XON9ze7RA4Sw/exec";

const tabla = document.getElementById("tabla-inventario");
const formulario = document.getElementById("form-inventario");
const botonRecargar = document.getElementById("btn-recargar");

const datosDemo = [
  {
    id: 1,
    nombre: "Monitor HDMI",
    categoria: "Pantallas",
    cantidad: 4,
    ubicacion: "Almacen A",
    fecha: "2026-06-23"
  },
  {
    id: 2,
    nombre: "Cable USB-C",
    categoria: "Cables",
    cantidad: 20,
    ubicacion: "Almacen B",
    fecha: "2026-06-23"
  },
  {
    id: 3,
    nombre: "Raspberry Pi",
    categoria: "Hardware",
    cantidad: 3,
    ubicacion: "Taller",
    fecha: "2026-06-23"
  }
];

function pintarTabla(items) {
  tabla.innerHTML = "";

  if (!items.length) {
    tabla.innerHTML = '<tr><td colspan="6">No hay datos.</td></tr>';
    return;
  }

  items.forEach((item) => {
    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${item.id}</td>
      <td>${item.nombre}</td>
      <td>${item.categoria}</td>
      <td>${item.cantidad}</td>
      <td>${item.ubicacion}</td>
      <td>${item.fecha}</td>
    `;

    tabla.appendChild(fila);
  });
}

async function cargarDatos() {
  if (!API_URL) {
    pintarTabla(datosDemo);
    return;
  }

  tabla.innerHTML = '<tr><td colspan="6">Cargando datos...</td></tr>';

  const respuesta = await fetch(API_URL);
  const datos = await respuesta.json();

  pintarTabla(datos);
}

formulario.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const nuevoItem = {
    nombre: document.getElementById("nombre").value,
    categoria: document.getElementById("categoria").value,
    cantidad: document.getElementById("cantidad").value,
    ubicacion: document.getElementById("ubicacion").value
  };

  if (!API_URL) {
    const itemDemo = {
      id: datosDemo.length + 1,
      ...nuevoItem,
      fecha: new Date().toISOString().slice(0, 10)
    };

    datosDemo.push(itemDemo);
    pintarTabla(datosDemo);
    formulario.reset();
    return;
  }

  await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(nuevoItem)
  });

  formulario.reset();
  cargarDatos();
});

botonRecargar.addEventListener("click", cargarDatos);

cargarDatos();
