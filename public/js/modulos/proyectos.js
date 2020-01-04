import Swal from 'sweetalert2';
import axios from 'axios';

const btnEliminar = document.querySelector('#eliminar-proyecto');

if (btnEliminar) {
    btnEliminar.addEventListener('click', e => {
        const urlProyecto = e.target.dataset.proyectoUrl;
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
            const url = location.origin + '/proyectos/' + urlProyecto;
            //console.log(url);
            axios.delete(url, {params: {urlProyecto}})
                .then(respuesta => {
                   //console.log(respuesta) 
                   
                   Swal.fire(
                    '¡Eliminado!',
                    respuesta.data,
                    'success'
                    );
                    
                   //Redirecionar al inicio
                   setTimeout(() =>{
                      window.location.href = '/';
                   },3000);
            
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
    });
}

export default btnEliminar;