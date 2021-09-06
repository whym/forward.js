const forward = (target, no_arg, port) => {
	port = port || 3000;

	const express = require('express');
	const app = express();
	app.get(/.*/, (req, res) => {
		const destination = no_arg ? target : target + req.url;
		console.log(`From host "${req.get('HOST')}", path "${req.url}"`);
		res.redirect(301, destination);
	});

	return {
		'app': app,
		'listen': () => {
			app.listen(port, () => {
				console.log('Listening on '+ port + ' forwarding to ' + target);
			});
		}
	};
};

if ( require.main === module ) {
	forward(
		process.env.FORWARD_TARGET || 'http://en.wikipedia.org/wiki',
		!!process.env.NO_ARG,
		process.env.PORT
	).listen();
} else {
	module.exports = forward;
}
