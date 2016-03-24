var request = require('supertest');
var forward = require('../forward');

describe('/', function() {
	var app = forward('http://example.com').app;
    it('redirects (301)', function(done) {
        request(app)
            .get('/')
            .expect('Content-Type', 'text/plain; charset=utf-8')
            .expect(301, done);
    });
    it('redirects to http://example.com/poke given /poke', function(done) {
        request(app)
            .get('/poke')
            .expect('Moved Permanently. Redirecting to http://example.com/poke')
			.expect(301, done);
    });
});
