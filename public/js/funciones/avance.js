import Swal from 'sweetalert2';

export const actualizarAvance = () => {
    //Selecionar la tareas tentes 
    const tareas = document.querySelectorAll('li.tarea');
    if (tareas.length>0) {
        
        const tareasCompletas = document.querySelectorAll('li.tarea i.completo');
        //console.log(tareas);
        
        const completao = Math.round((tareasCompletas.length*100)/tareas.length);
        
        const porcentaje = document.getElementById('porcentaje');
        const porcentajeAnterior = porcentaje.style.width;
        porcentaje.style.width = completao + '%';
        console.log();
        if ((porcentaje.style.width == '100%') && (porcentajeAnterior != porcentaje.style.width) && !(porcentajeAnterior=== "")) {
            Swal.fire(
                '¡Proyecto Terminado!',
                'Todas las tareas estan Completadas',
                'success'
            );
        }
        const avanceCompletado = document.querySelector('div.avance h2'); 
        if (porcentaje.style.width == '100%') {
            avanceCompletado.innerText = 'Proyecto Compeltado';
            
        }
        else if (porcentajeAnterior != porcentaje.style.width) {
            avanceCompletado.innerText = 'Avance del proyecyo';
        }
    }

    
};
/*
export const proyectoCompletado = () => {
    const porcentaje = document.getElementById('porcentaje');
    console.log(porcentaje);
    if (porcentaje) {
        if (porcentaje.style.width == 100) {
            Swal.fire(
                '¡Proyecto Terminado!',
                'Todas las tareas estan Completadas',
                'success'
            );
        }
    }
       
};

*/