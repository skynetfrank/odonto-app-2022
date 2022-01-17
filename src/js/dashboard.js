import dashstyle from '../css/dashboard.css';
import { db } from '../js/firebaseconfig';
import { collection, deleteDoc, orderBy, doc, query, where, getDocs, onSnapshot } from 'firebase/firestore';

const cardIngresos = document.getElementById('total-ingresos');
const cardActividad = document.getElementById('total-procedimientos');
const cardPacientes = document.getElementById('total-pacientes');
const cardCitas = document.getElementById('total-citas');
var pacientex = [];

//funcion para convertir fecha a formato AAAA-MM-DD
function convertirFecha(cfecha) {
  let year = cfecha.getFullYear(); // YYYY
  let month = ('0' + (cfecha.getMonth() + 1)).slice(-2); // MM
  let day = ('0' + cfecha.getDate()).slice(-2); // DD
  return year + '-' + month + '-' + day;
}

function formatearFecha(nfecha) {
  var info = nfecha.split('-').reverse().join('/');
  return info;
}

window.addEventListener('load', () => {
  getDatos();
  getAgenda();
  populateTabla();
});

function populateTabla() {
  const consulta = query(collection(db, 'pacientes'), orderBy('nombre', 'asc'));

  const allData = onSnapshot(consulta, snapshot => {
    document.querySelector('.preloader').style.display = 'grid';
    let table = document.getElementById('dash-pacientes-tbody');
    table.innerHTML = '';
    cardPacientes.innerHTML = snapshot.docs.length;
    snapshot.forEach(doc => {
      let data = doc.data();
      let row = `<tr> 
                        <td class="td-id-hidden">${doc.id}</td> 
                        <td><img src='../images/0f10931cfc0a3ee46188.png'/></td>
                        <td>${data.nombre}</td>
                        <td>${data.apellido}</td>
                        <td data-a-h="center">${data.edad}</td>
                        <td>${data.celular}</td>
                        <td class="ocultar-td">${data.tlflocal}</td>
                        <td class="ver-paciente" data-exclude="true">                       
                           <button class="td-btn" id="btn-control-paciente" data-id=${doc.id}  data-nom=${data.nombre} data-ape=${data.apellido}>
                               <i class="fas fa-search"></i>
                           </button>                        
                        </td>
                     </tr>`;

      table.innerHTML += row;
    });
    document.querySelector('.preloader').style.display = 'none';
  });
}

function getDatos() {
  onSnapshot(collection(db, 'pacientes'), snapshot => {
    snapshot.forEach(doc => {
      cardPacientes.innerHTML = snapshot.docs.length;
    });
  });

  onSnapshot(collection(db, 'citas'), snapshot => {
    snapshot.forEach(doc => {
      cardCitas.innerHTML = snapshot.docs.length;
    });
  });

  onSnapshot(collection(db, 'cntrolasistencias'), snapshot => {
    let ingresos = 0;
    snapshot.forEach(doc => {
      cardActividad.innerHTML = snapshot.docs.length;
      ingresos += doc.data().montoUSD;
      cardIngresos.innerHTML = ingresos.toLocaleString('en-US', { minimumFractionDigits: 2 });
    });
  });
}

function getAgenda() {
  let fecha = convertirFecha(new Date());
  const consultaAgenda = query(collection(db, 'citas'), where('fecha', '>=', fecha), orderBy('fecha', 'asc'));
  let divCitasPendientes = document.querySelector('.dash-card.customer');

  onSnapshot(consultaAgenda, querySnapshot => {
    divCitasPendientes.innerHTML = '<h1>AGENDA</h1> <h2>Citas Pendientes</h2>';
    querySnapshot.forEach(doc => {
      let data = doc.data();
      const found = pacientex.find(p => p.id === data.paciente);

      let divCita = `
           <div class="dash-customer-wrapper">
              <img class="dash-customer-image" src="images/watch-icon.png" alt="img">
              <div class="dash-customer-name">
              <h4>${found.nombre} ${found.apellido}</h4>
              <p>Dia: ${formatearFecha(data.fecha)}</p>
              <p>Hora: ${data.hora}</p>
              <p>${data.msg}</p>             
           </div>
        </div>          
          `;
      divCitasPendientes.innerHTML += divCita;
    });
  });
} //fin de getAgenda
