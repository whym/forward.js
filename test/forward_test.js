var request = require('supertest');
var forward = require('../forward');

describe('/', function() {
	var app = forward('http://example.com').app;
    it('redirects (301)', function(done) {
        request(app)
            .get('/')
            .expect('Content-Type', 'text/html; charset=UTF-8')
            .expect(301, done);
    });
    it('redirects to http://example.com/poke given /poke', function(done) {
        request(app)
            .get('/poke')
            .expect('<!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 2.0//EN"><html><head><title>301 Moved Permanently</title></head><body><h1>Moved Permanently</h1><p>The document has moved <a href="http://example.com/poke">here</a>.</p></body></html>')
			.expect(301, done);
    });
});
