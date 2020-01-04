const express = require('express');
const route = express.Router();

//importar express-validator
const { body } = require('express-validator');


//Importar el controlador
const proyectosController = require("../controllers/proyectosController");
const tareasController = require("../controllers/tareasController");
const usuariosController = require("../controllers/usuariosController");
const authController = require("../controllers/authController");

module.exports = () => {
    
    //Crear Nueva Cuenta
    route.get('/crear-cuenta',usuariosController.formCrearCuenta);
    route.post('/crear-cuenta',usuariosController.crearCuenta);
    
    //Crear Iniciar Sesion
    route.get('/iniciar-sesion',usuariosController.forminiciarSesion);
    route.post('/iniciar-sesion',authController.autenticarUsuario);
    route.get('/iniciar-sesion/:token',usuariosController.activarCuenta);
    
  //Creat Token para cambio de  Contraseña 
    route.get('/restablecer', usuariosController.formRestablecerPassword);
    route.post('/restablecer', authController.enviarToken); 
    
   //Realizar Cambio de   Contraseña  
    route.get('/restablecer/:token', authController.validarToken);
    route.post('/restablecer/:token', authController.actualizarPassword);
    
    
    
    
    //Todo lo que va antes de esto se puede acceder y lo que va despues requiere login
    //route.use(authController.usuarioAutenticado);
    
    
    
    
    
    
    
     //Ruta de home
    route.get('/', authController.usuarioAutenticado, proyectosController.proyectosHome);
   
    route.get('/nuevo-proyecto', authController.usuarioAutenticado, proyectosController.formularioProyecto);
    
    route.post('/nuevo-proyecto', authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.nuevoProyecto);
        
    
        
    //listar Proyecto    
    route.get('/proyectos/:url', authController.usuarioAutenticado, proyectosController.proyectoPorUrl);
    
    //edita proyecto
    route.get('/proyectos/editar/:id', authController.usuarioAutenticado, proyectosController.formularioEditar);
    
    route.post('/nuevo-proyecto/:id', authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.actualizarProyecto);
        
    //Emilina Proyecto    
    route.delete('/proyectos/:url', authController.usuarioAutenticado, proyectosController.eliminarProyecto);
    
    
    
    
    //Tareas
    route.post('/proyectos/:url', authController.usuarioAutenticado, body('tarea').not().isEmpty().trim().escape(),tareasController.agregarTarea);  
    
    //Actualizar tarea
    route.patch('/tareas/:id', authController.usuarioAutenticado, tareasController.cambiarEstadoTarea);
    
    //Emilina Proyecto    
    route.delete('/tareas/:id', authController.usuarioAutenticado, tareasController.eliminarTarea);
    
    
    //Cerrar sesion
    route.get('/cerrar-sesion', authController.usuarioAutenticado, authController.cerrarSesion);
    
    
    
    
    
    return route;

};

