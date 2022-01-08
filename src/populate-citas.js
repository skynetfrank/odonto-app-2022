const populateAgenda = () => {
  let fecha = convertirFecha(new Date());
  const consultaAgenda = query(collection(db, 'citas'), where('fecha', '>=', fecha), orderBy('fecha', 'asc'));
  const allCitas = onSnapshot(consultaAgenda, snapshot => {
    //aqui se itera sobre el cursor resultado (snapshot)
    timeLista.innerHTML = '';
    snapshot.forEach(doc => {
      let data = doc.data();
      const found = pacientex.find(p => p.id === data.paciente);

      let fila = `<li>
          <div>
              <button style="display: block" class="btn-eliminar-cita td-btn" data-tip="Eliminar Esta Cita">
              <i class="far fa-trash-alt"></i>
              </button>
              <time>Dia: ${formatearFecha(data.fecha)}
                    Hora: ${data.hora}</time><time>
                    Paciente: ${
                      data.status === 'Bloqueada' ? 'Cita Bloqueda por la Dra.' : found.nombre + ' ' + found.apellido
                    }
              </time>
              Mensaje: ${data.msg}   
              <span id="id-cita-eliminar">${doc.id}</span>         
          </div>
          </li>`;
      timeLista.innerHTML += fila;

      window.scroll(0, 1);
      //seleccionar todos los botones eliminar cita
      const allButtons = document.querySelectorAll('.btn-eliminar-cita');
      //loop de botones de la tabla
      allButtons.forEach(boton => {
        boton.addEventListener('click', async e => {
          let idCita = e.target.parentNode.parentNode.querySelector('span').innerHTML;
          await db
            .collection('citas')
            .doc(idCita)
            .delete()
            .then(resp => console.log('Cita Eliminada!'))
            .catch(error => console.log('error al eliminar cita! verifique...'));
          agenda.click();
        });
      }); //fin del  forEach para loop de todos los botones de la table
    });
  });
}; //FIN DE POPULATE TABLA
