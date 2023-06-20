/* eslint-env node,es6,mocha */
import request from 'supertest';
import forward from '../forward';
import { readFile } from 'fs/promises';

describe('forward.ts', () => {
	it('redirects (301)', (done) => {
		const app = forward({'rules': {'*': 'http://example.com'}}).app;
		request(app)
			.get('/')
			.expect('Content-Type', 'text/plain; charset=utf-8')
			.expect(301, done);
	});

	it('redirects to http://example.com/poke given /poke', (done) => {
		const app = forward({'rules': {'*': 'http://example.com'}}).app;
		request(app)
			.get('/poke')
			.expect('Moved Permanently. Redirecting to http://example.com/poke')
			.expect(301, done);
	});
});

describe('forward with empty config', () => {
	const app = forward({'rules': {}}).app;
	it('gives 503 to /', (done) => {
		request(app)
			.get('/')
			.expect(503, done);
	});
	it('gives 503 to /foo', (done) => {
		request(app)
			.get('/foo')
			.expect(503, done);
	});
});

describe('forward with broken string config', () => {
	const app = forward('this_is_broken').app;
	it('gives 503 to /', (done) => {
		request(app)
			.get('/')
			.expect(503, done);
	});
});

describe('forward with broken yaml config', () => {
	const app = forward('{"this_is_broken": 1}').app;
	it('gives 503 to /anything', (done) => {
		request(app)
			.get('/anything')
			.expect(503, done);
	});
});

describe('forward with header', () => {
	const app = forward({'rules': {'*': 'http://example.com'}}).app;
	it(' set header ', (done) => {
		request(app)
			.get('/')
			.set('Accept', 'text/plain')
			.expect('Content-Type', 'text/plain; charset=utf-8')
			.expect(301, done);
	});
});

describe('forward with config-sample', async () => {
	const config_sample = await readFile('../config-sample.json', 'utf8');
	const app = forward(config_sample).app;
	it('redirects to English Wikipedia', (done) => {
		request(app)
			.get('/Dictionary')
			.expect('Location', 'https://en.wikipedia.org/wiki/Dictionary')
			.expect(301, done);
	});
	it('redirects to example2.com', (done) => {
		request(app)
			.get('/test')
			.set('Host', 'example.com')
			.expect('Location', 'https://example2.com/test')
			.expect(301, done);
	});
});
