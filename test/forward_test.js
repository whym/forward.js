/* eslint-env node,mocha */
const request = require('supertest');
const forward = require('../forward');

describe('forward.js', () => {
	const app = forward('http://example.com').app;
	it('redirects (301)', (done) => {
		request(app)
			.get('/')
			.expect('Content-Type', 'text/plain; charset=utf-8')
			.expect(301, done);
	});
	it('redirects to http://example.com/poke given /poke', (done) => {
		request(app)
			.get('/poke')
			.expect('Moved Permanently. Redirecting to http://example.com/poke')
			.expect(301, done);
	});
});
