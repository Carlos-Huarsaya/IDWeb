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
