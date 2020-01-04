const Usuarios = require("../models/Usuarios");
const crypto = require('crypto');
const enviarEmail = require("../handlers/email");





exports.formCrearCuenta = (req,res) => {
    res.render('crearCuenta', {
        nombrePagina: 'Crear Cuenta'
    });
};



exports.forminiciarSesion = (req,res) => {
    /*
    const {error} = res.locals.mensajes
    res.render('iniciarSesion', {
        nombrePagina: 'Iniciar Sesion',
        error
    });
    */
    
    res.render('iniciarSesion', {
        nombrePagina: 'Iniciar Sesion'
    });
};



exports.crearCuenta = async (req,res) => {
    const {email, password } = req.body;
    try {
        
        const token = crypto.randomBytes(20).toString('hex');
        await Usuarios.create({email,password,token});
        
        //Enviar correo
        
        const url= 'https://' + req.headers.host + "/iniciar-sesion/" + token;
        
        //Enviar el correo
        await enviarEmail.enviar({
            usuario: {email},
            url, 
            subject: 'Activar usuario',
            archivo: 'confirmar-cuenta'
        });
        
        
        req.flash('correcto', 'Se envio un mensaje a tu correo Para Activar Tu cuenta');
        res.redirect('/iniciar-sesion');
    } catch (error) {
        req.flash('error', error.errors.map(error => error.message))
        res.render('crearCuenta', {
            mensajes: req.flash(),
            nombrePagina: 'Crear Cuenta',
            email, 
            password
        });
        
        
    }
};



exports.formRestablecerPassword = (req,res) => {
    
    res.render('restablecer', {
        nombrePagina: 'Restablecer Contraseña'
    });
    
    
};



exports.activarCuenta = async (req,res) =>{
    
    const usuario =  await Usuarios.findOne({
                where: {
                        token: req.params.token
                }
    });
    
    if(!usuario) {
        req.flash('error', 'No existe Ceunta');
        return res.redirect("/crear-cuenta");
    }
    else {
        usuario.activo= 1;
        usuario.token = null;
        await usuario.save();
        req.flash('correcto', 'Ceunta Activada');
        return res.redirect("/iniciar-sesion");
    }
    
};
