const Proyectos = require("../models/Proyectos");
const Tareas = require("../models/Tareas");





exports.agregarTarea = async (req,res,next) => {
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
        const {tarea} = req.body;
        let errores = [];
        if(!tarea) {
                errores.push({'texto': 'agrega un Nombre al La tarea'});
        }
        
        //si hay errores
        if(errores.length >0) {
                res.render('tareas', {
                    nombrePagina : proyecto.nombre,
                    proyectos,
                    proyecto,
                    errores
                });
        }
        else {
            const proyectoId = proyecto.id;
            const estado = 0;
            const Resultado = await Tareas.create({tarea, estado, proyectoId });
            if(!Resultado) return next();
                //console.log(tarea);
                res.redirect('/proyectos/'+ proyecto.url);
        }
};


exports.cambiarEstadoTarea = async (req,res,next) => {
    const id = req.params.id;
    const tarea =  await Tareas.findOne({where: { id }});
    tarea.estado = tarea.estado ? 0: 1;
    const resultado = await tarea.save();
    if (!resultado) return next();
    res.status(200).send('Cambio de estado correcto');
        
};

exports.eliminarTarea = async (req,res,next) => {
    const id = req.params.id;
    const resultado = await Tareas.destroy({where:{id}});
    if (!resultado) return next();
    res.status(200).send('Eminado Correctamenre');
};
   