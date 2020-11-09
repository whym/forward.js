const express = require('express');

const forward = function(target, no_arg, port) {
	port = port || 3000;

	const app = express();
	app.get(/.*/, (req, res) => {
		const destination = no_arg ? target : target + req.url;
		console.log(`From host "${req.get('HOST')}", path "${req.url}"`);
		res.redirect(301, destination);
	});

	app.listen(port, () => {
		console.log('Listening on '+ port + ' forwarding to ' + target);
	});
	return {'app': app};
};

if ( require.main === module ) {
	forward(
		process.env.FORWARD_TARGET || 'http://en.wikipedia.org/wiki',
		!!process.env.NO_ARG,
		process.env.PORT
	);
} else {
	module.exports = forward;
}
