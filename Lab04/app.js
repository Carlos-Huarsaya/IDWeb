let tareas = JSON.parse(localStorage.getItem('tareas_edu')) || [];
let filtroActual = 'todas';

const form = document.querySelector('#form-tarea');
const alertas = document.querySelector('#alertas');
const lista = document.querySelector('#lista-tareas');

