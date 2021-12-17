import { db, auth } from './js/firebaseconfig';
import { doc, getDoc, query, deleteDoc, onSnapshot, orderBy, collection } from 'firebase/firestore';
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
/* 
window.addEventListener('load', () => {
  spinner.style.display = 'none';
  seccionInicio.style.display = 'none';
  imgLogo.click();
  console.log('Loaded window Auth:', auth?.currentUser);
  //seccionPacientes.style.display = 'block';
  menuLinks[0].style.color = 'lime';
  infoContainer.style.display = 'none';
});
 */

onAuthStateChanged(auth, user => {
  if (user) {
    sesion.style.display = 'none';
    logout.style.display = 'inline-block';
    document.getElementById('usuario').innerText = user.email;
    menuLinks.forEach(link => {
      link.style.pointerEvents = 'all';
      link.style.color = 'white';
    });
    imgLogo.click();
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
      alert(err.message);
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
//nav menu Agenda
menuLinks[1].addEventListener('click', () => {
  seccionInicio.style.display = 'none';
  seccionPacientes.style.display = 'none';
  seccionDashboard.style.display = 'none';
  seccionAgenda.style.display = 'block';
  menuLinks[1].style.color = 'lime';
  menuLinks[0].style.color = 'white';
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
            window.open('editar-historia.html','_self');
          }
          if (e.target.id == 'btn-control-paciente') {
            window.open('control-asistencias.html');
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
  console.log('Ver Informacion del Paciente ID:', id);
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
