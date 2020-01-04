const Proyectos = require("../models/Proyectos");
const Tareas = require("../models/Tareas");
//const slug = require('slug');

exports.proyectosHome = async (req,res) => {
        const proyectos = await Proyectos.findAll({
                where: {
                        usuarioId: res.locals.usuario.id
                }
        });
        res.render('index', {
                nombrePagina : 'Proyectos', 
                proyectos
        });
};


exports.formularioProyecto = async(req,res) => {
        const proyectos = await Proyectos.findAll({
                where: {
                        usuarioId: res.locals.usuario.id
                }
        });
        res.render('nuevoProtecto', {
                nombrePagina : 'Nuevo Proyecto',
                proyectos
        });
};

exports.nuevoProyecto = async (req,res,next) => {
        const proyectos = await Proyectos.findAll({
                where: {
                        usuarioId: res.locals.usuario.id
                }
        });
        /*
        res.render('nuevoProtecto', {
                nombrePagina : 'Nuevo Proyecto'
        });
        */
        /*
        console.log(req.body);
        res.send('formulario enviado');
        */
        
        const {nombre} = req.body;
        let errores = [];
        if(!nombre) {
                errores.push({'texto': 'agrega un Nombre al proyecto'});
        }
        
        //si hay errores
        if(errores.length >0) {
                res.render('nuevoProtecto', {
                        nombrePagina : 'Nuevo Proyecto',
                        proyectos,
                        errores
                });
        }
        else {
                //no hay errores
                //insertar en la BD
                //const url = slug(nombre).toLowerCase();
                const usuarioId = res.locals.usuario.id
                const Resultado = await Proyectos.create({nombre, usuarioId});
                if(!Resultado) {
                        return next();
                }
                        
                res.redirect('/');
                
                /*
                Proyectos.create({nombre})
                    .then(()=> console.log('Insertado Correctamente'))
                    .catch((error)=>console.log(error));
                */
        }
        
};
    
exports.proyectoPorUrl = async (req,res,next) => {
        /*
        //de eta forma para que se ejecute el segundo await tiene que esperar por anterior 
        const proyectos = await Proyectos.findAll();
        const proyecto = await Proyectos.findOne({
                where: {
                        url: req.params.url
                }
        });
        */
        //De esta segunda forma esta dos consultas que son independientes se ejecutan de manera asincrona entre ellas
        const proyectosPromise = Proyectos.findAll({
                where: {
                        usuarioId: res.locals.usuario.id
                }
        });
        const proyectoPromise =  Proyectos.findOne({
                where: {
                        url: req.params.url,
                        usuarioId: res.locals.usuario.id
                }
        });
        const [proyectos,proyecto] = await Promise.all([proyectosPromise,proyectoPromise]);
        
        //Tareas del proyecto actual
        
        const tareas =  await Tareas.findAll({
                where: {
                        proyectoId: proyecto.id
                }
                /*
                ,
                include: [
                        {model: Proyectos}
                        ]
                */
        });
        //console.log(tareas);
        
        if(!proyecto) return next();
        
        //rendr a la vista        
        res.render('tareas', {
                nombrePagina : proyecto.nombre,
                proyectos,
                proyecto,
                tareas
                });
};

exports.formularioEditar = async(req,res,next) => {
        const proyectosPromise = Proyectos.findAll({
                where: {
                        usuarioId: res.locals.usuario.id
                }
        });
        const proyectoPromise =  Proyectos.findOne({
                where: {
                        id: req.params.id,
                        usuarioId: res.locals.usuario.id
                }
        });
        const [proyectos,proyecto] = await Promise.all([proyectosPromise,proyectoPromise]);
        if(!proyecto) return next();
        res.render('nuevoProtecto', {
                nombrePagina : 'Editar Proyecto - ' + proyecto.nombre,
                proyectos,
                proyecto
        });
    };
    
    
exports.actualizarProyecto = async (req,res) => {
        const proyectosPromise = Proyectos.findAll({
                where: {
                        usuarioId: res.locals.usuario.id
                }
        });
        const proyectoPromise =  Proyectos.findOne({
                where: {
                        id: req.params.id,
                        usuarioId: res.locals.usuario.id
                }
        });
        const [proyectos,proyecto] = await Promise.all([proyectosPromise,proyectoPromise]);
        const {nombre} = req.body;
        let errores = [];
        if(!nombre) {
                errores.push({'texto': 'agrega un Nombre al proyecto'});
        }
        
        //si hay errores
        if(errores.length >0) {
                res.render('nuevoProtecto', {
                        nombrePagina : 'Editar Proyecto - ' + proyecto.nombre,
                        proyectos,
                        proyecto,
                        errores
                });
        }
        else {
                //no hay errores
                //Actualizar en la BD
                //Forma con update
                /*
                await Proyectos.update({
                          nombre: nombre,
                        }, {
                          where: {
                            id: req.params.id
                          }
                        });
                */
                //Meroto con salve
                proyecto.nombre = nombre;
                await proyecto.save();
                
                res.redirect('/proyectos/' + proyecto.url);
        }
        
};
    
    
exports.eliminarProyecto = async (req,res,next) => {
        //req tiene la informacion
        //y la puedes obtener de 'query ó 'params
        //console.log(req);
        const {urlProyecto} = req.query;
        const resultado = await Proyectos.destroy( {
                        where: {
                                        url: urlProyecto,
                                        usuarioId: res.locals.usuario.id
                                }
                        });
        if (!resultado) {
            //console.log(resultado);

             return next();   
        }
        res.status(200).send('Eminado Correctamenre');
        
};
    
    
    
    
    
    
    