import { db } from '../js/firebaseconfig';
import { collection, doc, query, where, updateDoc, getDoc, getDocs, serverTimestamp } from 'firebase/firestore';
const idControlLocal = JSON.parse(localStorage.getItem('controltoupdate'));
const nombrePaciente = JSON.parse(localStorage.getItem('nombrePaciente'));
const apellidoPaciente = JSON.parse(localStorage.getItem('apellidoPaciente'));
const historia = document.getElementById('historia-form');
const inputs = document.querySelectorAll('.input');
const btnCerrar = document.querySelector('.volver');
const inputDolares = document.getElementById('montopagado');
const inputCambio = document.getElementById('cambiodia');
const inputBolivares = document.getElementById('montopagadobs');
const selectorEvaluacion = document.getElementById('selector-evaluacion');
const selectorTratamiento = document.getElementById('selector-tratamiento');
const textboxEvaluacion = document.getElementById('evaluaciongeneral');
const textboxTratamiento = document.getElementById('tratamientoaplicado');

document.getElementById('paciente').innerText = nombrePaciente + ' ' + apellidoPaciente;

function formatearFecha(nfecha) {
  var info = nfecha.split('-').reverse().join('/');
  return info;
}

const eventoFocus = new FocusEvent('focus', {
  view: window,
  bubbles: true,
  cancelable: true,
});

function dolarToday() {
  fetch('https://s3.amazonaws.com/dolartoday/data.json')
    .then(res => res.json())
    .then(data => {
      const cambio = data.USD.dolartoday;
      const dolares = document.getElementById('montopagado').value;
      inputCambio.dispatchEvent(eventoFocus);
      inputBolivares.dispatchEvent(eventoFocus);
      historia['cambiodia'].value = cambio;
      historia['montopagadobs'].value = parseFloat(cambio) * parseFloat(dolares);
    })
    .catch(err => {
      alert('La api de Dolar Today No esta disponible');
    });
}

inputDolares.addEventListener('blur', e => {
  e.preventDefault();
  dolarToday();
});

var date = new Date();
document.querySelector('.fechacontrolasistencia').value =
  date.getFullYear().toString() +
  '-' +
  (date.getMonth() + 1).toString().padStart(2, 0) +
  '-' +
  date.getDate().toString().padStart(2, 0);

function autoCapital(cadena) {
  return cadena.charAt(0).toUpperCase() + cadena.slice(1);
}

//GET DATA FOR CRUD: EDITAR HISTORIA DE PACIENTE **************************************************
window.addEventListener('DOMContentLoaded', () => {
  console.log('domContentLoadedlistener');
  const controlRef = doc(db, 'controlasistencias', idControlLocal);
  getDoc(controlRef).then(doc => {
    const data = doc.data();
    console.log('data a editar', data);
    document.querySelector('.fechacontrolasistencia').value = data.fecha;
    document.getElementById('evaluaciongeneral').value = data.evaluaciongeneral;
    document.getElementById('tratamientoaplicado').value = data.tratamientoaplicado;

    document.getElementById('formadepago').value = data.formadepago;
    document.getElementById('select-banco').value = data.banco;
    document.getElementById('tipo-pago').value = data.tipopago;
    document.getElementById('referenciapago').value = data.referencia;
    document.getElementById('montopagado').value = data.montoUsd;
    document.getElementById('cambiodia').value = data.cambiodia;
    document.getElementById('montopagadobs').value = data.montoBs;
  });
}); //getDoc promise end

//END OF :  GET DATA FOR CRUD: EDITAR HISTORIA DE PACIENTE **************************************************

historia.addEventListener('submit', e => {
  e.preventDefault();

  const fechacontrolasistencia = historia['fechacontrolasistencia'].value;
  const evaluaciongeneral = historia['evaluaciongeneral'].value;
  const tratamientoaplicado = historia['tratamientoaplicado'].value;
  const formadepago = historia['formadepago'].value;
  const banco = historia['select-banco'].value;
  const tipopago = historia['tipo-pago'].value;
  const referenciapago = historia['referenciapago'].value;
  const montopagado = historia['montopagado'].value;
  const montopagadobs = historia['montopagadobs'].value;
  const cambiodia = historia['cambiodia'].value;
  //Crear Objeto para enviar a firebase con todos los campos

  const controlAsistencia = {
    fecha: fechacontrolasistencia,
    esCita1: true,
    evaluaciongeneral: evaluaciongeneral,
    tratamientoaplicado: tratamientoaplicado,
    formadepago: formadepago,
    tipopago: tipopago,
    banco: banco,
    montoBs: montopagadobs,
    referencia: referenciapago,
    montoUsd: montopagado,
    cambiodia: cambiodia,
    createdAt: serverTimestamp(),
  };
  const updateControlRef = doc(db, 'controlasistencias', idControlLocal);
  updateDoc(updateControlRef, controlAsistencia).then(res => {
    historia.reset();
    alert('Control Actualizado con exito!');
    window.history.back();
  });
});

btnCerrar.addEventListener('click', e => {
  e.preventDefault();
  window.history.back();
});

selectorEvaluacion.addEventListener('change', () => {
  textboxEvaluacion.value += ' - ' + selectorEvaluacion.value + '\r\n';
});

selectorTratamiento.addEventListener('change', () => {
  textboxTratamiento.value += ' - ' + selectorTratamiento.value + '\r\n';
});
