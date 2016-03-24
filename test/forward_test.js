var request = require('supertest');
var app = require('../forward');

describe('/', function() {
    it('redirected (301)', function(done) {
        request(app)
            .get('/')
            .expect('Content-Type', 'text/html; charset=UTF-8')
            .expect(301)
			.end(done);
    });
    it('"example.com/poke" specified', function(done) {
		app.forward_target = 'http://example.com';
        request(app)
            .get('/poke')
            .expect('<!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 2.0//EN"><html><head><title>301 Moved Permanently</title></head><body><h1>Moved Permanently</h1><p>The document has moved <a href="http://example.com/poke">here</a>.</p></body></html>')
			.end(done);
    });
});
