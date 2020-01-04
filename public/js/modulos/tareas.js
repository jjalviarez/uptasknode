import Swal from 'sweetalert2';
import axios from 'axios';
import {actualizarAvance } from '../funciones/avance'

const tareas = document.querySelector('.listado-pendientes');

if(tareas) {
    
    tareas.addEventListener('click', e => {
        if(e.target.classList.contains('fa-check-circle')) {
            const icono = e.target;
            const idTarea = icono.parentElement.parentElement.dataset.tarea;
            const url = location.origin + '/tareas/' + idTarea;
            axios.patch(url,{idTarea})
                .then(respuesta => {
                    if (respuesta.status === 200) {
                        icono.classList.toggle('completo');
                        actualizarAvance();
                    }
                });
        }
        else if (e.target.classList.contains('fa-trash')) {
            const Tarea = e.target.parentElement.parentElement;
            const idTarea = Tarea.dataset.tarea;
            //console.log(urlProyecto);
            Swal.fire({
              title: '¿Estas seguro?',
              text: "¡No podrás revertir esto!",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Si, Eliminalo!',
              cancelButtonText: 'Cancelar'
            }).then((result) => {
              if (result.value) {
                  
                // Enviar pericion a axios
                const url = location.origin + '/tareas/' + idTarea;
                //console.log(url);
                axios.delete(url)
                    .then(respuesta => {
                       //console.log(respuesta) 
                       if (respuesta.status === 200) {
                           Tarea.parentElement.removeChild(Tarea);
                           Swal.fire(
                            '¡Tarea Eliminada!',
                            respuesta.data,
                            'success'
                            );
                            actualizarAvance();
                       }
                    })
                    .catch(()=> {
                      Swal.fire({
                        icon: 'error',
                        title: 'Hubo un error',
                        text: "¡No Completo la solicitud",
                        });
                    });
                
                
              }
            });
            
        }
        
    });
}

export default tareas;