import asistencias from '../css/control-asistencias.css';
import historias from '../css/historia.css';
var slides;
var btns = document.querySelectorAll('.btn');
var inputs;

const test = [100, 200, 300, 400];

const eventoFocus = new FocusEvent('focus', {
  view: window,
  bubbles: true,
  cancelable: true,
});

test.forEach(n => {
  addElement(n);
});

// Javascript for image slider manual navigation
var manualNav = function (manual) {
  slides.forEach(slide => {
    slide.classList.remove('active');
    btns.forEach(btn => {
      btn.classList.remove('active');
    });
  });
  slides[manual].classList.add('active');
  btns[manual].classList.add('active');
};
btns.forEach((btn, i) => {
  let currentSlide = 1;
  btn.addEventListener('click', () => {
    manualNav(i);
    currentSlide = i;
  });
});

//codigo para los custom inputs de la seccion contacto

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
function addElement(nx) {
  // crea un nuevo div
  var controlSliderDiv = document.getElementById('control-slider');
  var slideDiv = document.createElement('div');
  var newContent = document.createTextNode('Control de Asistencia ');
  var infoDiv = document.createElement('div');
  var flexorDiv = document.createElement('div');
  var controlDiv = document.createElement('div');
  var titulo = document.createElement('h5');
  var inputFecha = document.createElement('input');
  var divh5 = document.createElement('div');
  var h52 = document.createElement('h5');
  var h52Content = document.createTextNode('Informacion del Pago');
  h52.appendChild(h52Content);
  divh5.classList.add('div-h5');
  divh5.appendChild(h52);

  var itemTextArea1 = document.createElement('div');
  var itemTextArea2 = document.createElement('div');
  itemTextArea1.classList.add('item');
  itemTextArea1.classList.add('textarea');
  itemTextArea2.classList.add('item');
  itemTextArea2.classList.add('textarea');

  var h61 = document.createElement('h6');
  var h61Content = document.createTextNode('Evaluacion General');
  var h62 = document.createElement('h6');
  var h62Content = document.createTextNode('Tratamiento Aplicado');

  h61.appendChild(h61Content);
  h62.appendChild(h62Content);
  var textEvaluacion = document.createElement('textarea');
  var textTratamiento = document.createElement('textarea');

  var selectEval = document.createElement('select');
  var selectTrat = document.createElement('select');
  selectEval.classList.add('selector-conceptos');
  var opcion1 = document.createElement('option');
  var opcion2 = document.createElement('option');
  var opcion3 = document.createElement('option');
  var opcion4 = document.createElement('option');
  var opcion5 = document.createElement('option');
  var opcion6 = document.createElement('option');

  opcion1.text = 'concepto de evaluacion de paciente #1';
  opcion2.text = 'concepto de evaluacion de paciente #1';
  opcion3.text = 'concepto de evaluacion de paciente #1';
  opcion4.text = 'concepto de evaluacion de paciente #1';
  opcion5.text = 'concepto de evaluacion de paciente #1';
  opcion6.text = 'concepto de evaluacion de paciente #1';

  selectEval.add(opcion1);
  selectEval.add(opcion2);
  selectEval.add(opcion3);
  selectEval.add(opcion4);
  selectEval.add(opcion5);
  selectEval.add(opcion6);

  selectTrat.classList.add('selector-conceptos');
  selectEval.classList.add('selector-evaluacion');
  selectTrat.classList.add('selector-tratamiento');

  controlSliderDiv.appendChild(slideDiv).classList.add('slide');
  slideDiv.appendChild(infoDiv).classList.add('info');
  infoDiv.appendChild(flexorDiv).classList.add('flexor');
  infoDiv.appendChild(controlDiv).classList.add('div-control-asistencia');
  titulo.appendChild(newContent);
  inputFecha.setAttribute('type', 'date');
  inputFecha.classList.add('fechacontrolasistencia');
  flexorDiv.appendChild(titulo);
  flexorDiv.appendChild(inputFecha);

  controlDiv.appendChild(h61);
  controlDiv.appendChild(itemTextArea1);
  controlDiv.appendChild(itemTextArea2);
  itemTextArea1.appendChild(textEvaluacion);
  itemTextArea1.appendChild(selectEval);
  controlDiv.insertBefore(h62, itemTextArea2);
  itemTextArea2.appendChild(textTratamiento);
  itemTextArea2.appendChild(selectTrat);
  controlDiv.appendChild(divh5);
  textEvaluacion.classList.add('evaluaciongeneral');
  textTratamiento.classList.add('tratamientoaplicado');

  textEvaluacion.setAttribute('rows', '6');
  textTratamiento.setAttribute('rows', '6');

  var itemDivPago = document.createElement('div');
  itemDivPago.classList.add('item');
  itemDivPago.classList.add('div-pago');
  controlDiv.appendChild(itemDivPago);

  var divSelectsPago = document.createElement('div');
  divSelectsPago.classList.add('div-selects-pago');

  var selectFormaPago = document.createElement('select');
  selectFormaPago.classList.add('formadepago');

  var selectBanco = document.createElement('select');
  selectBanco.classList.add('select-banco');

  var selectTipoPago = document.createElement('select');
  selectTipoPago.classList.add('tipo-pago');

  divSelectsPago.appendChild(selectFormaPago);
  divSelectsPago.appendChild(selectBanco);
  divSelectsPago.appendChild(selectTipoPago);

  itemDivPago.appendChild(divSelectsPago);

  var divInputsPago = document.createElement('div');
  divInputsPago.classList.add('div-inputs-pago');

  var inputContainer1 = document.createElement('div');
  inputContainer1.classList.add('input-container');

  var input1 = document.createElement('input');
  input1.classList.add('input');
  input1.classList.add('right');
  input1.classList.add('short');
  input1.classList.add('referenciapago');

  var labelcontent1 = document.createTextNode('Referencia');
  var spanContent1 = document.createTextNode('Referencia');
  var label1 = document.createElement('label');
  var span1 = document.createElement('span');
  label1.appendChild(labelcontent1);
  span1.appendChild(spanContent1);

  inputContainer1.appendChild(input1);
  inputContainer1.appendChild(label1);
  inputContainer1.appendChild(span1);
  divInputsPago.appendChild(inputContainer1);

  var inputContainer2 = document.createElement('div');
  inputContainer2.classList.add('input-container');
  var input2 = document.createElement('input');
  input2.classList.add('input');
  input2.classList.add('right');
  input2.classList.add('short');
  input2.classList.add('montopagado');
  input2.value = nx;

  var labelcontent2 = document.createTextNode('Monto US$');
  var spanContent2 = document.createTextNode('Monto US$');
  var label2 = document.createElement('label');
  var span2 = document.createElement('span');
  label2.appendChild(labelcontent2);
  span2.appendChild(spanContent2);

  inputContainer2.appendChild(input2);
  inputContainer2.appendChild(label2);
  inputContainer2.appendChild(span2);
  divInputsPago.appendChild(inputContainer2);

  var inputContainer3 = document.createElement('div');
  inputContainer3.classList.add('input-container');
  var input3 = document.createElement('input');

  input3.classList.add('input');
  input3.classList.add('right');
  input3.classList.add('short');
  input3.classList.add('cambiodia');

  var labelcontent3 = document.createTextNode('Cambio Dia');
  var spanContent3 = document.createTextNode('Cambio Dia');
  var label3 = document.createElement('label');
  var span3 = document.createElement('span');
  label3.appendChild(labelcontent3);
  span3.appendChild(spanContent3);

  inputContainer3.appendChild(input3);
  inputContainer3.appendChild(label3);
  inputContainer3.appendChild(span3);
  divInputsPago.appendChild(inputContainer3);

  var inputContainer4 = document.createElement('div');
  inputContainer4.classList.add('input-container');

  var input4 = document.createElement('input');
  input4.classList.add('input');
  input4.classList.add('right');
  input4.classList.add('short');
  input4.classList.add('montopagadobs');

  var labelcontent4 = document.createTextNode('Monto Bs.');
  var spanContent4 = document.createTextNode('Monto Bs.');
  var label4 = document.createElement('label');
  var span4 = document.createElement('span');
  label4.appendChild(labelcontent4);
  span4.appendChild(spanContent4);

  inputContainer4.appendChild(input4);
  inputContainer4.appendChild(label4);
  inputContainer4.appendChild(span4);
  divInputsPago.appendChild(inputContainer4);

  itemDivPago.appendChild(divInputsPago);

  slides = document.querySelectorAll('.slide');
  inputs = document.querySelectorAll('.input');
  inputs.forEach(input => {
    input.addEventListener('focus', focusFunc);
    input.addEventListener('blur', blurFunc);
  });

  input2.dispatchEvent(eventoFocus);
}
