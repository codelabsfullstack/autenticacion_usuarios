const passport = require('passport');
const Usuario = require('../Models/Usuarios.js');

exports.postSignup = (req, res, next) => {
	console.log(req.isAuthenticated())
	const nuevoUsuario = new Usuario({
		email: req.body.email,
		nombre: req.body.nombre,
		password: req.body.password
	});

	Usuario.findOne({email: req.body.email}, (err, usuarioExistente) => {
		if(usuarioExistente) {
			return res.status(400).send('Ya ese email esta registrado');
		}

		nuevoUsuario.save((err) => {
			if(err) {
				next(err)
			}
			// Moongose se encargo de agregar el método login al 'req'
			req.logIn(nuevoUsuario, (err) => {
				if(err) {
					next(err)
				}
				res.send('Usuario creado exitosamente');
			});
		})
	})
	console.log(req.isAuthenticated())
}

exports.postLogin = (req, res, next) => {
	// Estrategia local
	passport.authenticate('local', (err, usuario, info) => {
		if(err) {
			next(err);
		}
		if(!usuario) {
			return res.status(400).send('Email o contraseña no válidos');
		}

		req.logIn(usuario, (err) => {
			if (err) {
				nexgt(err);
			}
			res.send('Login exitosos');
		})
	})(req, res, next)
}

exports.logout = (req, res) => {
	req.logout();
	res.send('Logout exitoso')
}
// const usuario = new Usuario({
// 	email: "psdtocss@gmail.com",
// 	nombre: "Victor",
// 	password: "12345"
// });
// Usuario.findOne({nombre: 'Victor'}, (err, usuarioExistente) => {
// 	console.log(usuarioExistente);
// })