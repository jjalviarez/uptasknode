const Sequelize = require("sequelize");
const passport = require('passport');
const bcrypt = require('bcrypt-nodejs');
const Usuarios = require("../models/Usuarios");
const enviarEmail = require("../handlers/email");
const crypto = require('crypto');
const Op = Sequelize.Op;


//loguear usuario
exports.autenticarUsuario = passport.authenticate('local', { successRedirect: '/',
                                    failureRedirect: '/iniciar-sesion',
                                    failureFlash: true,
                                    badRequestMessage: 'usuario y pass en clanco'
                                });
                                
                                
//Desloguear usuario
exports.cerrarSesion = (req,res) =>{
    req.logout();
    return res.redirect("/iniciar-sesion");
    
    //Metodo de la clase
    /*
    
     req.session.destroy(() => {
        res.redirect('/iniciar-sesion'); // al cerrar sesión nos lleva al login
    });
    
    */
}

//verifica que estes logueado
exports.usuarioAutenticado = (req,res,next) =>{
    if(req.isAuthenticated()){
        //req.isAuthenticated() will return true if user is logged in
        return next();
    } else{
        return res.redirect("/iniciar-sesion");
    }
}

//Enviar Token usuario
exports.enviarToken = async (req,res) =>{
    const {email} = req.body;
    const usuario =  await Usuarios.findOne({
                where: {
                        email
                }
    });
    
    if (!usuario) {
        req.flash('error', 'email invalido');
        
        //hay dos formas de hacer esto
        //haces un render y agregar flash a mesagesn 
        // ó
        // haces un redirect y flash la agrega el middleware
        /*
        res.render('restablecer', {
            mensajes: req.flash(),
            nombrePagina: 'Restablecer Contraseña'
        });*/
        return res.redirect("/restablecer");
    }
    
    //usuarios existe
    
    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expiracion= Date.now()+86400000 ;
    await usuario.save();
    
    const url= 'https://' + req.headers.host + "/restablecer/" + usuario.token;
    
    //Enviar el correo
    await enviarEmail.enviar({
        usuario,
        url, 
        subject: 'Password Reset',
        archivo: 'restablecer-password'
    });
    
    
    req.flash('correcto', 'Se envio un mensaje a tu correo');
    return res.redirect("/iniciar-sesion");
    
    
};


exports.validarToken = async (req,res) =>{
    
    const usuario =  await Usuarios.findOne({
                where: {
                        token: req.params.token,
                        expiracion: {
                            [Op.gte]: Date.now()
                        }
                }
    });
    
    if(!usuario) {
        req.flash('error', 'No valido');
        return res.redirect("/restablecer");
    }
    
    res.render('resetPassword', {
        nombrePagina: 'Restablecer tu Contraseña'
    });
 
}



exports.actualizarPassword = async (req,res) =>{
    
    const usuario =  await Usuarios.findOne({
                where: {
                        token: req.params.token,
                        expiracion: {
                            [Op.gte]: Date.now()
                        }
                }
    });
    
    if(!usuario) {
        req.flash('error', 'Expirado');
        return res.redirect("/restablecer");
    }
    const {password} = req.body;
    if(!password) {
        req.flash('error', 'Contraseña no puede estar en clanco');
        return res.redirect("/restablecer");
    }
    else {
        usuario.password= bcrypt.hashSync(password, bcrypt.genSaltSync(10));
        usuario.token = null;
        usuario.expiracion= null ;
        await usuario.save();
        req.flash('correcto', 'Contraseña Actualizada');
        return res.redirect("/iniciar-sesion");
    }
    
};











