const API_URL = "https://script.google.com/macros/s/AKfycbzAQKSKVGTsCBOxPD9YCiXRm69J-B1bvlVcSSAKA-BRIAxXC8nCoz11M3XON9ze7RA4Sw/exec";

const tabla = document.getElementById("tabla-inventario");
const formulario = document.getElementById("form-inventario");
const botonRecargar = document.getElementById("btn-recargar");

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
  tabla.innerHTML = '<tr><td colspan="6">Cargando datos...</td></tr>';

  try {
    const respuesta = await fetch(API_URL);

    if (!respuesta.ok) {
      throw new Error("Error HTTP: " + respuesta.status);
    }

    const datos = await respuesta.json();
    pintarTabla(datos);
  } catch (error) {
    console.error(error);

    tabla.innerHTML = `
      <tr>
        <td colspan="6">
          No se pudieron cargar los datos. Revisa la URL de Apps Script y los permisos.
        </td>
      </tr>
    `;
  }
}

formulario.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const nuevoItem = {
    nombre: document.getElementById("nombre").value,
    categoria: document.getElementById("categoria").value,
    cantidad: document.getElementById("cantidad").value,
    ubicacion: document.getElementById("ubicacion").value
  };

  try {
    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(nuevoItem)
    });

    formulario.reset();
    cargarDatos();
  } catch (error) {
    console.error(error);
    alert("No se pudo guardar el material.");
  }
});

botonRecargar.addEventListener("click", cargarDatos);

cargarDatos();
