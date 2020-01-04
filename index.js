const express = require('express');
const path = require('path');
const route = require('./routes');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('./config/passport');

require('dotenv').config({path: 'variables.env'});

//helpers con alfunas funciones
const helpers = require('./helpers');

//conexion con la BD
const db = require("./config/db");

//Modelos
require("./models/Proyectos");
require("./models/Tareas");
require("./models/Usuarios");

db.sync()
    .then(()=> console.log('conectado'))
    .catch((error)=>console.log(error));
    


//crear un app en express
const app = express();

//Se habilita el bodyParser para los req de datos
app.use(bodyParser.urlencoded({extended: false }));




//Carpeta de archivos estaticos
app.use(express.static('public'));

//hablilitar pug (Templete Engine son como 20 que hay)
 app.set('view engine', 'pug');


//agregra la caprteta de las vistas 
app.set('views',path.join(__dirname, './views'));


//habilitar flash Menssages
app.use(flash());

//habilitar cookieParser
app.use(cookieParser());


//habilitar session
app.use(session({
  secret: 'Clave bien secreta',
  resave: false,
  saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());



//pasar vardum a la app
app.use((req, res, next) => {
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user} || null;
    next(); 
});




//Se referencian las rutas en el archivo principal
app.use('/',route());

const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || '8080'
app.listen(port, host, function () {
  console.log('Server running at http://' + host + ':' + port + '/'); 
});







