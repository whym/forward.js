var express = require('express');
var app = express.createServer(express.logger());
var target = process.env.FORWARD_TARGET || 'http://en.wikipedia.org/wiki';
app.get(/.*/, function(req, res) {
  var destination = target + req.url;
  res.writeHead(301, {'Content-Type': 'text/html; charset=UTF-8',
					  'Location': destination });
  res.end('<!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 2.0//EN"><html><head><title>301 Moved Permanently</title></head><body><h1>Moved Permanently</h1><p>The document has moved <a href="'+ destination +'">here</a>.</p></body></html>');
});
var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port + " forwarding to " + target);
});
