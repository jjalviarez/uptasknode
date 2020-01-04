import proyecto from './modulos/proyectos'
import tareas from './modulos/tareas'
import focoProyecto from './funciones/focoProyecto'
import {actualizarAvance} from './funciones/avance'

document.addEventListener('DOMContentLoaded', () => {
    actualizarAvance();
});

