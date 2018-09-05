const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const passport = require('passport');
const passportConfig = require('./config/passport.js');

const MONGO_URL ='mongodb://127.0.0.1:27017/auth';
const app = express();

mongoose.Promise = global.Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on('error', (err) => {
	throw err;
	process.exit(1);
});

const Usuario = require('./Models/Usuarios.js');
// const u = new Usuario({
// 	email: 'ricardo@gmail.com',
// 	nombre: 'Ricardo',
// 	password: '123456'
// });

// u.save()
// 	.then(() => {
// 		console.log('guardado');
// 	})
// 	.catch((error) => {
// 		console.log(error);
// 	})

app.use(session({
	secret: 'ESTO ES SECRETO',
	resave: true,
	saveUninitialized: true,
	store: new MongoStore({
		url: MONGO_URL,
		autoReconnect: true
	})
}))

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// app.get('/', (req, res) => {
// 	req.session.cuenta = req.session.cuenta ? req.session.cuenta + 1 : 1;
// 	res.send(`Hola! Has visto esta página: ${req.session.cuenta}`);
// });

const controladorUsuario = require('./controllers/usuario.js');
app.post('/signup', controladorUsuario.postSignup);
app.post('/login', controladorUsuario.postLogin);
app.get('/logout', passportConfig.estaAutenticado, controladorUsuario.logout);

app.get('/usuarioInfo', (req, res) => {
	// passport agrega 'user' al objecto 'req'
	
	res.json(req.user);
})

app.listen(3000, () => {
	console.log('Escuchando en el puerto 3000')
})