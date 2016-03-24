var express = require('express');

var forward = function(target, no_arg, port) {
	port = port || 3000;

	var app = express.createServer(express.logger());
	app.get(/.*/, function(req, res) {
		var destination = no_arg ? target : target + req.url;
		res.writeHead(301, {'Content-Type': 'text/html; charset=UTF-8',
							'Location': destination });
		res.end('<!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 2.0//EN"><html><head><title>301 Moved Permanently</title></head><body><h1>Moved Permanently</h1><p>The document has moved <a href="'+ destination +'">here</a>.</p></body></html>');
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
