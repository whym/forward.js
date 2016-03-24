var express = require('express');

var forward = function(target, no_arg, port) {
	port = port || 3000;

	var app = express();
	app.get(/.*/, function(req, res) {
		var destination = no_arg ? target : target + req.url;
		res.redirect(301, destination);
	});

	app.listen(port, function() {
		console.log('Listening on '+ port + ' forwarding to ' + target);
	});
	return {app: app};
};

if ( require.main === module ) {
	forward(
		process.env.FORWARD_TARGET || 'http://en.wikipedia.org/wiki',
		process.env.NO_ARG ? true: false,
		process.env.PORT
	);
}

module.exports = forward;
