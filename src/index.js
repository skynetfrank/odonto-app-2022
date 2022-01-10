import { db, auth } from './js/firebaseconfig';
import {
  addDoc,
  doc,
  getDoc,
  query,
  getDocs,
  deleteDoc,
  where,
  onSnapshot,
  orderBy,
  collection,
  serverTimestamp,
} from 'firebase/firestore';
import { onAuthStateChanged, signInWithEmailAndPassword, sendPasswordResetEmail, signOut } from 'firebase/auth';

import estilos from './css/index.css';

const hamburguesa = document.getElementById('hamburguesa');
const barraMenu = document.getElementById('barra__menu');
const menu = document.querySelectorAll('nav ul li');
const menuLinks = document.querySelectorAll('nav ul li a');
const sesion = document.getElementById('sesion');
const formSesion = document.getElementById('form-sesion');
const spinner = document.querySelector('.spinner');
const logout = document.getElementById('logout-link');
const forgotPassword = document.getElementById('forgot-pw');
const seccionPacientes = document.getElementById('seccion__pacientes');
const seccionInicio = document.getElementById('seccion__inicio');
const seccionAgenda = document.getElementById('seccion__agenda');
const seccionDashboard = document.getElementById('seccion__dashboard');
const imgLogo = document.querySelector('.img-logo');
const buscador = document.querySelector('.search__input');
const tablaContainer = document.querySelector('.tabla-container');
const infoContainer = document.querySelector('.info-container');
const tablaInfo = document.getElementById('tabla-info-paciente');
const btnCerrarInfo = document.querySelector('.volver-info');
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');
const navOverlay = document.querySelector('.nav-overlay');
const closeNav = document.querySelector('.close');
const fechaAgenda = document.querySelector('.head > p');
let nombreCita;
var pacientex = [];

//funcion para convertir fecha a formato DD-MM-AAAA
function formatearFecha(nfecha) {
  var info = nfecha.split('-').reverse().join('-');
  return info;
}

//funcion para convertir fecha a formato AAAA-MM-DD
function convertirFecha(cfecha) {
  let year = cfecha.getFullYear(); // YYYY
  let month = ('0' + (cfecha.getMonth() + 1)).slice(-2); // MM
  let day = ('0' + cfecha.getDate()).slice(-2); // DD
  return year + '-' + month + '-' + day;
}

function autoCapital(cadena) {
  return cadena.charAt(0).toUpperCase() + cadena.slice(1);
}

window.addEventListener('load', () => {
  /*  spinner.style.display = 'none';
  seccionInicio.style.display = 'none';
  imgLogo.click();
  console.log('Loaded window Auth:', auth?.currentUser);
  //seccionPacientes.style.display = 'block';
  menuLinks[0].style.color = 'lime';
  infoContainer.style.display = 'none';
 */
});

onAuthStateChanged(auth, user => {
  if (user) {
    sesion.style.display = 'none';
    logout.style.display = 'inline-block';
    document.getElementById('usuario').innerText = user.email;
    menuLinks.forEach(link => {
      link.style.pointerEvents = 'all';
      link.style.color = 'white';
    });
    //    imgLogo.click();
    menuLinks[0].click();
    populateTabla();
  } else {
    imgLogo.click();
    sesion.style.display = 'flex';
    logout.style.display = 'none';
    document.getElementById('usuario').innerText = '';
    menuLinks.forEach(link => {
      link.style.pointerEvents = 'none';
      link.style.color = 'rgb(170, 168, 168)';
    });
  }
});

formSesion.addEventListener('submit', e => {
  e.preventDefault();
  const email = formSesion.email.value;
  const pw = formSesion.password.value;
  signInWithEmailAndPassword(auth, email, pw)
    .then(cred => {
      formSesion.reset();
    })
    .catch(err => {
      if (err.message == 'auth/network-request-failed') {
        alert('No esta conectado a Internet...conectese');
      } else alert(err.message);
    });
});

forgotPassword.addEventListener('click', e => {
  const email = formSesion.email.value;
  e.preventDefault();
  sendPasswordResetEmail(auth, email)
    .then(() => {
      alert('Se ha enviado un correo de restablecimiento de contraseña al email: ' + email);
    })
    .catch(error => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
    });
});

hamburguesa.addEventListener('click', () => {
  barraMenu.classList.toggle('mostrar');
});

menu.forEach(item => {
  item.addEventListener('click', () => {
    barraMenu.classList.toggle('mostrar');
  });
});

//nav menu Pacientes
menuLinks[0].addEventListener('click', () => {
  seccionInicio.style.display = 'none';
  seccionAgenda.style.display = 'none';
  seccionDashboard.style.display = 'none';
  seccionPacientes.style.display = 'block';
  infoContainer.style.display = 'none';
  tablaContainer.style.display = 'block';
  menuLinks[0].style.color = 'lime';
  menuLinks[1].style.color = 'white';
  menuLinks[2].style.color = 'white';
});

//nav menu Dashboard
menuLinks[2].addEventListener('click', () => {
  seccionInicio.style.display = 'none';
  seccionPacientes.style.display = 'none';
  seccionAgenda.style.display = 'none';
  seccionDashboard.style.display = 'block';
  menuLinks[2].style.color = 'lime';
  menuLinks[1].style.color = 'white';
  menuLinks[0].style.color = 'white';
});

imgLogo.addEventListener('click', () => {
  seccionInicio.style.display = 'block';
  seccionPacientes.style.display = 'none';
  seccionAgenda.style.display = 'none';
  seccionDashboard.style.display = 'none';
});

logout.addEventListener('click', () => {
  signOut(auth)
    .then(() => {
      imgLogo.click();
    })
    .catch(err => {
      alert('Ocurrio un error al cerrar la sesion!');
    });
});

const populateTabla = () => {
  const consulta = query(collection(db, 'pacientes'), orderBy('nombre', 'asc'));
  const allData = onSnapshot(consulta, snapshot => {
    //aqui se itera sobre el cursor resultado (snapshot)
    let table = document.getElementById('pacientes-tbody');
    table.innerHTML = '';

    snapshot.forEach(doc => {
      let data = doc.data();

      let row = `<tr> 
                        <td id="td-titulo">Paciente</td>   
                        <td id="td-id-hidden">${doc.id}</td>                          
                        <td data-label="Nombre">${data.nombre}</td>
                        <td data-label="Apellido">${data.apellido}</td>
                        <td data-label="Edad">${data.edad}</td>
                        <td data-label="Telefono">${data.celular}</td>
                        <td data-label="" class="ver-paciente">  
                           <button class="td-btn t-tip top" id="btn-info-paciente" tip="Ver Historia" data-id=${doc.id}  data-nom=${data.nombre} data-ape=${data.apellido}>
                             <span class="img-btn"><img src="images/a2b9e883de68572b7d20.png" alt="control"</span>
                           </button> 
                           <button  class="td-btn t-tip top" id="btn-ver-paciente" tip="Editar Historia" data-id=${doc.id}  data-nom=${data.nombre} data-ape=${data.apellido}>
                             <span class="img-btn"><img src="images/26790e10b578c609f86f.png" alt="control"</span>
                           </button>        
                           <button class="td-btn t-tip top" id="btn-control-paciente" tip="Control de Asistencia" data-id=${doc.id}  data-nom=${data.nombre} data-ape=${data.apellido}>
                             <span class="img-btn"><img src="images/051ef99d37ac35349b05.png" alt="control"</span>
                           </button>                       
                           <button  class="td-btn t-tip top" id="btn-odograma" tip="Ver/Editar Odograma" data-id=${doc.id}  data-nom=${data.nombre} data-ape=${data.apellido}>
                             <span class="img-btn"><img src="images/34042cb0b9d6eb31f644.png" alt="odograma"</span>
                           </button>                            
                           <button  class="td-btn t-tip left" id="btn-eliminar-paciente" tip="Eliminar este Paciente" data-id=${doc.id}>
                              <span class="img-btn"><img src="images/d17db51e63836a5fa5aa.png" alt="control"</span>
                           </button>
                        </td>
                     </tr>`;

      //filtrar datos en base al buscador
      table.innerHTML += row;

      //seleccionar todos los botones de la tabla
      const btnVerPaciente = document.querySelectorAll('.td-btn');
      //loop de botones de la tabla
      btnVerPaciente.forEach(boton => {
        boton.addEventListener('click', e => {
          let pacienteSeleccionado = e.target.dataset.id;
          localStorage.setItem('pacienteActual', JSON.stringify(pacienteSeleccionado));
          localStorage.setItem('nombrePaciente', JSON.stringify(e.target.dataset.nom));
          localStorage.setItem('apellidoPaciente', JSON.stringify(e.target.dataset.ape));

          if (e.target.id == 'btn-info-paciente') {
            verInfoPaciente(pacienteSeleccionado);
          }

          if (e.target.id == 'btn-ver-paciente') {
            window.open('editar-historia.html', '_self');
          }
          if (e.target.id == 'btn-control-paciente') {
            window.open('control-asistencias.html', '_self');
          }
          if (e.target.id == 'btn-odograma') {
            window.open('odograma.html');
          }
          if (e.target.id == 'btn-eliminar-paciente') {
            deleteAsistencia(pacienteSeleccionado);
          }
        });
      }); //fin del  forEach para loop de todos los botones de la table
    });
  });
}; //FIN DE POPULATE TABLA

function deleteAsistencia(id) {
  const eliminar = confirm('Esta Seguro que quiere Eliminar este Paciente?');
  if (eliminar) {
    const docRef = doc(db, 'pacientes', id);
    deleteDoc(docRef)
      .then(result => {
        alert('Registro Eliminado');
      })
      .catch(error => {
        alert('Error: ', error.message);
      });
  }
} //FIN DE DELETEASISTENCIA

buscador.addEventListener('change', e => {
  const textoBusqueda = e.target.value.toLowerCase();
  const tableRows = document.querySelectorAll('#tabla-paciente > tbody > tr');
  const searchableCells = Array.from(tableRows).map(row => row.querySelectorAll('td'));
  for (const tableCell of searchableCells) {
    const row = tableCell[1].closest('tr');
    const columnaNombre = tableCell[1].textContent.toLowerCase().replace(',', '');
    const columnaApellido = tableCell[2].textContent.toLowerCase().replace(',', '');
    row.style.display = 'block';
    if (columnaNombre.search(textoBusqueda) === -1) {
      // row.style.visibility = 'collapse';
      if (columnaApellido.search(textoBusqueda) === -1) {
        row.style.display = 'none';
      }
    }
  }
});

function verInfoPaciente(id) {
  tablaContainer.style.display = 'none';
  infoContainer.style.display = 'block';

  const docRef = doc(db, 'pacientes', id);
  getDoc(docRef)
    .then(doc => {
      let tableInfo = document.getElementById('info-pacientes-tbody');
      tableInfo.innerHTML = '';
      const historia = doc.data();
      let row = `<tr class="pad-left"> 
                         <td id="td-titulo-info">Historia: ${' ' + historia.nombre + ' ' + historia.apellido}
                        
                         </td> 
                         <td data-label="Cedula">${historia.cedula}</td>  
                         <td data-label="Fecha de Nacimiento">${historia.fnacimiento}</td>
                         <td data-label="Edad">${historia.edad}</td>
                         <td data-label="Telefono Celular">${historia.celular}</td>
                         <td data-label="Telefono Local">${historia.tlflocal}</td>
                         <td data-label="Direccion">${historia.direccion1}</td>
                         <td data-label="Contacto">${historia.contacto}</td>
                         <td data-label="Email">${historia.email}</td>
                         <td data-label="Genero">${historia.genero}</td>
                         <td data-label="Estado Civil">${historia.edocivil}</td>
                         <td data-label="Estatura (mts.)">${historia.estatura}</td>
                         <td data-label="Peso (Kgs.)">${historia.peso}</td>
                         <td data-label="Esta siendo Tratado por un Medico?">${
                           historia.tratadopormedico ? 'si' : 'no'
                         }</td>
                         <td data-label="Es Tratado por alguna enfermedad?">${historia.tratadoporenfermedad}</td>
                         <td data-label="Toma Medicamentos?">${historia.checktomamedicamento ? 'si' : 'no'}</td>
                         <td data-label="Cuales medicamentos">${historia.cualesmedicamentos}</td>
                         <td data-label="Dosis de los medicamentos">${historia.dosismeds}</td>
                         <td data-label="Alergias">${historia.alergias.filter(a => {
                           return a != '';
                         })}</td>
                         <td data-label="Otras Alergias">${historia.textalergicootros}</td>
                         <td data-label="Antecedentes Personales">${historia.antecedentesPersonales.filter(p => {
                           return p != '';
                         })}</td>
                         <td data-label="Antecedentes Familiares">${historia.antecedentesFamiliares.filter(f => {
                           return f != '';
                         })}</td>
                         <td data-label="Sufre alguna otra enfermedad?">${historia.otraenfermedad}</td>
                         <td data-label="Habitos">${
                           historia.texthabitos
                         }</td>                                                               
                  </tr>`;

      //filtrar datos en base al buscador
      tableInfo.innerHTML += row;
    })
    .catch(error => console.log(error.message));
} //fin de info paciente

btnCerrarInfo.addEventListener('click', () => {
  infoContainer.style.display = 'none';
  tablaContainer.style.display = 'block';
});

//***************************AGENDA CODE **************************************** */
//***************************AGENDA CODE **************************************** */
//***************************AGENDA CODE **************************************** */
//***************************AGENDA CODE **************************************** */

const btnUpdateAgenda = document.getElementById('update-agenda');

//FUNCION PARA DESPLEGAR AGENDA POP-UP
(function () {
  'use strict';
  var items = document.querySelectorAll('.timeline li');

  function isElementInViewport(el) {
    var rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  function callbackFunc() {
    var items = document.querySelectorAll('.timeline li');
    for (var i = 0; i < items.length; i++) {
      if (isElementInViewport(items[i])) {
        items[i].classList.add('in-view');
      } else {
        items[i].classList.remove('in-view');
      }
      if (i == 0) {
        items[i].classList.add('in-view');
      }
    } //end of for
  }
  // listen for events
  window.addEventListener('load', callbackFunc);
  window.addEventListener('resize', callbackFunc);
  window.addEventListener('scroll', callbackFunc);
})();
//FIN DE FUNCION PARA DESPLEGAR AGENDA POP-UP

//INICIO DEL LISTENER PARA LA AGENDA
menuLinks[1].addEventListener('click', () => {
  seccionInicio.style.display = 'none';
  seccionPacientes.style.display = 'none';
  seccionDashboard.style.display = 'none';
  seccionAgenda.style.display = 'block';
  menuLinks[1].style.color = 'lime';
  menuLinks[0].style.color = 'white';
  menuLinks[2].style.color = 'white';
  horario();
  let timeLista = document.getElementById('ul-timeline');
  const usersRef = collection(db, 'users');

  getDocs(usersRef)
    .then(snapshot => {
      snapshot.docs.forEach(paciente => {
        let currentID = paciente.id;
        let appObj = { ...paciente.data(), ['id']: currentID };
        pacientex.push(appObj);
      });
    })
    .catch(error => {
      console.log('Ocurrio un Error: ', error.message);
    });

  const populateAgenda = () => {
    let fecha = convertirFecha(new Date());
    const consultaAgenda = query(collection(db, 'citas'), where('fecha', '>=', fecha), orderBy('fecha', 'asc'));
    const allCitas = onSnapshot(consultaAgenda, snapshot => {
      //aqui se itera sobre el cursor resultado (snapshot)
      timeLista.innerHTML = '';
      snapshot.forEach(doc => {
        let data = doc.data();
        let found = pacientex.find(p => p.id === data.paciente);

        let fila = `<li>
          <div> 
               <span class="header-cita">           
                 <h1>Dia: ${formatearFecha(data.fecha)}</h1>
                 <h1>Hora: ${data.hora}</h1>
               </span>

               <h3>
               <span class="bold">Paciente:</span> ${
                 data.status === 'Bloqueada' ? 'Cita Bloqueda por la Dra.' : found.nombre + ' ' + found.apellido
               }
               </h3>
               <h3><span class="bold">Mensaje:</span> ${data.msg}</h3>   
               <button class="btn-eliminar-cita t-tip top" tip="Eliminar Esta Cita" data-idcita=${
                 doc.id
               }>Eliminar</button>
               <span id="id-cita-eliminar">${doc.id}</span>         
          </div>
          </li>`;
        timeLista.innerHTML += fila;

        window.scroll(0, 1);
        //seleccionar todos los botones eliminar cita
        const allButtons = document.querySelectorAll('.btn-eliminar-cita');
        //loop de botones de la tabla

        allButtons.forEach(boton => {
          boton.addEventListener('click', e => {
            let idCita = e.target.dataset.idcita;
            deleteCita(idCita);
          });
        });

        //fin del  forEach para loop de todos los botones de la table
      });
    });
  }; //FIN DE POPULATE TABLA
  populateAgenda();
}); //FINDE LISTENER PARA AGENDA

//funcion para obtener el resto de horas que quedan sin apartar en el dia

function horario() {
  const fecha = convertirFecha(new Date()); //fecha de hoy
  const listaHoras = document.getElementById('listaHoras');
  //array de horas por defecto de 7 a 7 (formato militar)
  var horas = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];
  const citasRef = collection(db, 'citas');
  const q = query(citasRef, where('fecha', '==', fecha));

  onSnapshot(q, snapshot => {
    fechaAgenda.innerHTML = formatearFecha(fecha);
    //aqui se itera sobre el cursor resultado (snapshot)
    console.log('se disparo el onsnapshot de citas-horas');
    snapshot.forEach(doc => {
      let position = horas.indexOf(doc.data().hora);
      if (position >= 0) {
        horas.splice(position, 1);
      }
    });
    listaHoras.innerHTML = '';
    horas.forEach(item => {
      if (item.length > 0) {
        listaHoras.innerHTML += `
        <div>
        <span>${item}</span>
        <button class="btn-bloquear" data-idhora=${item}>Bloquear</button>
        </div>
        `;
      }
    });

    //seleccionar todos los botones eliminar cita
    const allHoras = document.querySelectorAll('.btn-bloquear');
    //loop de botones de la tabla

    allHoras.forEach(boton => {
      boton.addEventListener('click', e => {
        let horaX = e.target.dataset.idhora;
        bloquearHora(fecha, horaX);
      });
    }); //fin del  forEach para loop de todos los botones de la table
  });
}

//END OF HORARIO()

function bloquearHora(fechaBloquear, horaBloquear) {
  addDoc(collection(db, 'citas'), {
    fecha: fechaBloquear,
    hora: horaBloquear,
    telefono: 'Dra. Vanessa',
    msg: 'Para desbloquear pulsa el boton!',
    paciente: auth.currentUser.uid,
    status: 'Bloqueada',
    createdAt: serverTimestamp(),
  });
  menuLinks[1].click();
  window.scroll(0, 2);
}

//***********************SIDEBAR AGENDA *****************************************/

navToggle.addEventListener('click', () => {
  navShow();
});
closeNav.addEventListener('click', () => {
  hideNav();
});

// hide nav after clicked outside of nav
navOverlay.addEventListener('click', e => {
  hideNav();
});

function navShow() {
  navOverlay.style.transition = 'all 0.1s ease';
  navOverlay.classList.add('open');
  nav.style.transition = 'all 0.3s ease 0.5s';
  nav.classList.add('open');
}

function hideNav() {
  nav.style.transition = 'all 0.3s ease';
  nav.classList.remove('open');
  navOverlay.style.transition = 'all 0.2s ease 0.1s';
  navOverlay.classList.remove('open');
}

function deleteCita(id) {
  const eliminar = confirm('Esta Seguro que quiere Eliminar este Paciente?');
  if (eliminar) {
    const docRef = doc(db, 'citas', id);
    deleteDoc(docRef)
      .then(result => {
        menuLinks[1].click();
        alert('Cita Eliminada');
      })
      .catch(error => {
        alert('Error: ', error.message);
      });
  }
} //FIN DE DELETE CITA
