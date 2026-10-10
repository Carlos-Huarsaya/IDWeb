let tareas = JSON.parse(localStorage.getItem('tareas_edu')) || [];
let filtroActual = 'todas';

const form = document.querySelector('#form-tarea');
const alertas = document.querySelector('#alertas');
const lista = document.querySelector('#lista-tareas');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  alertas.textContent = '';

  const titulo = document.querySelector('#titulo').value.trim();
  const curso = document.querySelector('#curso').value.trim();
  const fechaEntrega = document.querySelector('#fechaEntrega').value;

  if (!titulo || !curso || !fechaEntrega) {
    alertas.textContent = 'Todos los campos son obligatorios.';
    return;
  }


  const hoy = new Date().toISOString().split('T')[0];
  if (fechaEntrega <= hoy) {
    alertas.textContent = 'La fecha de entrega debe ser posterior a la fecha actual.';
    return;
  }

  const nuevaTarea = {
    id: Math.random().toString(36).substring(2, 9),
    titulo,
    curso,
    fechaEntrega,
    completada: false
  };

  tareas.push(nuevaTarea);
  guardarYRenderizar();
  form.reset();
});

function renderizar() {
  lista.innerHTML = '';

  const tareasFiltradas = tareas.filter(t => {
    if (filtroActual === 'pendientes') return !t.completada;
    if (filtroActual === 'completadas') return t.completada;
    return true;
  });

  lista.innerHTML = tareasFiltradas.map(t => `
    <li class="${t.completada ? 'completada' : ''}">
      <input type="checkbox" ${t.completada ? 'checked' : ''} onclick="alternarEstado(${t.id})">
      <span><strong>${t.titulo}</strong> (${t.curso}) - Entrega: ${t.fechaEntrega}</span>
      <button onclick="eliminarTarea(${t.id})">Eliminar</button>
    </li>
  `).join('');
}

function alternarEstado(id) {
  const tarea = tareas.find(t => t.id === id);
  if (tarea) tarea.completada = !tarea.completada;
  guardarYRenderizar();
}

function eliminarTarea(id) {
  tareas = tareas.filter(t => t.id !== id);
  guardarYRenderizar();
}

