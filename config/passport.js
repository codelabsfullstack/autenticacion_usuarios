const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Usuario = require('../Models/Usuarios.js');

passport.serializeUser((usuario, done) => {
	done(null, usuario._id);
})

passport.deserializeUser((id, done) => {
	// encuentra al usuario que tenga el id que esta pasando passport
	Usuario.findById(id, (err, usuario) => {
		done(err, usuario);
	})
})

passport.use(new LocalStrategy(
	{usernameField: 'email'},	// Campo 'email' como username del usuario
	(email, password, done) => {
		Usuario.findOne({email}, (err, usuario) => {
			if(!usuario) {
				return done(null, false, {message: `Este email: ${email} no esta registrado`})
			} else {
				usuario.compararPasword(password, (err, sonIguales) => {
					if (sonIguales) {
						return done(null, usuario);
					} else {
						return done(null, false, {message: 'La contraseña no es válida'})
					}
				})
			}
		})
	}
))

exports.estaAutenticado = (req, res, next) => {
	console.log('estarautenticado')
	if (req.isAuthenticated()) {	// 'isAuthenticated' es un método que passport agrega a todos los 'req'
		return next();
	}

	res.status(401).send('Tienes que hacer login para acceder a este recurso.')
}