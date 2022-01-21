import { db } from '../js/firebaseconfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const historia = document.getElementById('historia-form');
const inputs = document.querySelectorAll('.input');
const collectionRef = collection(db, 'pacientes');
const btnCerrar = document.querySelector('.volver');
const inputDolares = document.getElementById('montopagado');
const inputCambio = document.getElementById('cambiodia');
const inputBolivares = document.getElementById('montopagadobs');
const selectorEvaluacion = document.getElementById('selector-evaluacion');
const selectorTratamiento = document.getElementById('selector-tratamiento');
const textboxEvaluacion = document.getElementById('evaluaciongeneral');
const textboxTratamiento = document.getElementById('tratamientoaplicado');
const fechaNacimiento = document.getElementById('fnacimiento');
//trigger focus event on element
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

fechaNacimiento.addEventListener('blur', e => {
  e.preventDefault();
  const fechaActual = new Date();
  const anoActual = parseInt(fechaActual.getFullYear());
  const mesActual = parseInt(fechaActual.getMonth() + 1);
  const diaActual = parseInt(fechaActual.getDate());

  const anoNacimiento = parseInt(String(fechaNacimiento.value).substring(0, 4));
  const mesNacimiento = parseInt(String(fechaNacimiento.value).substring(5, 7));
  const diaNacimiento = parseInt(String(fechaNacimiento.value).substring(8, 10));

  let edad = 0;

  console.log('actual:', diaActual, mesActual, anoActual);
  console.log('Nacimiento:', diaNacimiento, mesNacimiento, anoNacimiento);
  console.log('edad en input', document.getElementById('fnacimiento').value);

  edad = anoActual - anoNacimiento;
  if (mesActual < mesNacimiento) {
    edad--;
  } else if (mesActual == mesNacimiento) {
    if (diaActual < diaNacimiento) {
      edad--;
    }
  }
  document.getElementById('edad').value = edad;
});

inputDolares.addEventListener('blur', e => {
  e.preventDefault();
  dolarToday();
});

localStorage.clear();
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

historia.addEventListener('submit', async e => {
  e.preventDefault();
  const nombre = autoCapital(historia['nombre'].value);
  const apellido = autoCapital(historia['apellido'].value);
  const cedula = historia['cedula'].value;
  const fnacimiento = historia['fnacimiento'].value;
  const celular = historia['celular'].value;
  const tlflocal = historia['tlflocal'].value;
  const email = historia['email'].value;
  const edad = historia['edad'].value;
  const genero = document.querySelector('input[name="checkgenero"]:checked').value;
  const edocivil = document.querySelector('input[name="checkedocivil"]:checked').value;
  const direccion1 = historia['direccion1'].value;
  const contacto = historia['contacto'].value;
  const estatura = historia['estatura'].value;
  const peso = historia['peso'].value;

  const tratadopormedico = document.querySelector('input[name="checktratadopormedico"]:checked').value;
  const tratadoporenfermedad = historia['tratadoporenfermedad'].value;
  const checktomamedicamento = document.querySelector('input[name="checktomamedicamento"]:checked').value;
  const cualesmedicamentos = historia['cualesmedicamentos'].value;
  const dosismeds = historia['dosismeds'].value;
  const checkaspirina = historia['checkaspirina'].checked ? 'aspirina' : '';
  const checkpenicilina = historia['checkpenicilina'].checked ? 'penicilina' : '';
  const checkanestecialocal = historia['checkanestecialocal'].checked ? 'Anestecia-Local' : '';
  const checkcodeina = historia['checkcodeina'].checked ? 'codeina' : '';
  const checklatex = historia['checklatex'].checked ? 'Latex' : '';
  const checkacrilico = historia['checkacrilico'].checked ? 'Acrilico' : '';
  const textalergicootros = historia['textalergicootros'].value;
  const checkcirugias = historia['checkcirugias'].checked ? 'Cirugias' : '';
  const checklesiones = historia['checklesiones'].checked ? 'Lesion-Cabeza' : '';
  const checkdieta = historia['checkdieta'].checked ? 'Tiene-Dieta' : '';
  const checkfumador = historia['checkfumador'].checked ? 'Es Fumador' : '';
  const checkcontroladas = historia['checkcontroladas'].checked ? 'Usa-Sustancias-Controladas' : '';
  const checkembarazada = historia['checkembarazada'].checked ? 'Embarazada' : '';
  const checkanticonceptivos = historia['checkanticonceptivos'].checked ? 'Usa-Anticonceptivos' : '';
  const checkamamantando = historia['checkamamantando'].checked ? 'Amamantando' : '';
  const checkcancer = historia['checkcancer'].checked ? 'Cancer' : '';
  const checktuberculosis = historia['checktuberculosis'].checked ? 'Tuberculosis' : '';
  const checkhiv = historia['checkhiv'].checked ? 'H.I.V.' : '';
  const checkdiabetes = historia['checkdiabetes'].checked ? 'Diabetes' : '';
  const checkcardiovasculares = historia['checkcardiovasculares'].checked ? 'Cardiovasculares' : '';
  const checkhemorragicas = historia['checkhemorragicas'].checked ? 'Hemorragicas' : '';
  const checkvenereas = historia['checkvenereas'].checked ? 'Venereas' : '';
  const otraenfermedad = historia['otraenfermedad'].value;
  const texthabitos = historia['texthabitos'].value;
  const motivoprincipalconsulta = historia['motivoprincipalconsulta'].value;
  const fechaultimaconsulta = historia['fechaultimaconsulta'].value;
  const motivoultimaconsulta = historia['motivoultimaconsulta'].value;
  const checkcomplicaciones = document.querySelector('input[name="checkcomplicaciones"]:checked').value;
  const cualescomplicaciones = historia['cualescomplicaciones'].value;
  //const texttratamiento = historia['texttratamiento'].value;
  const fechacontrolasistencia = historia['fechacontrolasistencia'].value;
  const evaluaciongeneral = historia['evaluaciongeneral'].value;
  const tratamientoaplicado = historia['tratamientoaplicado'].value;
  const formadepago = historia['formadepago'].value;
  const banco = historia['select-banco'].value;
  const tipopago = parseInt(historia['tipo-pago'].value).toFixed(2);
  const referenciapago = historia['referenciapago'].value;
  const montopagado = parseInt(historia['montopagado'].value).toFixed(2);
  const montopagadobs = parseInt(historia['montopagadobs'].value).toFixed(2);
  const cambiodia = parseInt(historia['cambiodia'].value).toFixed(2);
  //Crear Objeto para enviar a firebase con todos los campos

  const historiaPaciente = {
    nombre,
    apellido,
    cedula,
    fnacimiento,
    celular,
    tlflocal,
    email,
    edad,
    genero,
    edocivil,
    direccion1,
    contacto,
    estatura,
    peso,
    tratadopormedico,
    tratadoporenfermedad,
    checktomamedicamento,
    cualesmedicamentos,
    dosismeds,
    alergias: [checkaspirina, checkpenicilina, checkanestecialocal, checkcodeina, checklatex, checkacrilico],
    textalergicootros,
    antecedentesPersonales: [
      checkcirugias,
      checklesiones,
      checkdieta,
      checkfumador,
      checkcontroladas,
      checkembarazada,
      checkanticonceptivos,
      checkamamantando,
    ],
    antecedentesFamiliares: [
      checkcancer,
      checktuberculosis,
      checkhiv,
      checkdiabetes,
      checkcardiovasculares,
      checkhemorragicas,
      checkvenereas,
    ],
    otraenfermedad,
    texthabitos,
    motivoprincipalconsulta,
    fechaultimaconsulta,
    motivoultimaconsulta,
    checkcomplicaciones,
    cualescomplicaciones,
  };

  const { id } = await addDoc(collectionRef, historiaPaciente);
  localStorage.setItem('pacienteActual', JSON.stringify(id));

  const controlAsistencia = {
    idPaciente: id,
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

  addDoc(collection(db, 'controlasistencias'), controlAsistencia)
    .then(result => {
      console.log('SE HA AGREGADO UN NUEVO CONTROL DE ASISTENCIAS');
    })
    .catch(err => {
      console.log('Hubo un error al agregar control de asistencias', err.message);
    });

  alert('Paciente Agregado con exito!');
  historia.reset();
  window.scrollTo(0, 0);
}); //end of formulario submit

btnCerrar.addEventListener('click', () => {
  window.history.back();
});

//codigo para los custom inputs de la seccion contacto
inputs.forEach(input => {
  input.addEventListener('focus', focusFunc);
  input.addEventListener('blur', blurFunc);
});

function focusFunc() {
  let parent = this.parentNode;
  parent.classList.add('focus');
}

function blurFunc() {
  let parent = this.parentNode;
  if (this.value == '') {
    parent.classList.remove('focus');
  }
}
//fin del codigo para los custom inputs de la seccion contacto

selectorEvaluacion.addEventListener('change', () => {
  textboxEvaluacion.value += ' - ' + selectorEvaluacion.value + '\r\n';
});

selectorTratamiento.addEventListener('change', () => {
  textboxTratamiento.value += ' - ' + selectorTratamiento.value + '\r\n';
});
