/* eslint-env node,es6,mocha */
import request from 'supertest';
import forward from '../forward';
import { ForwardPattern } from '../forward_pattern';
import assert from 'assert';

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

describe('forward with config-sample', () => {
	const app = forward(require('../config-sample.json')).app;
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

describe('ForwardPattern', () => {
	it('replaces example1 with example2 retaining path', () => {
		const pattern = new ForwardPattern('example1.com', 'https://example2.com');
		assert.equal(pattern.resolve('example1.com', '/test'), 'https://example2.com/test');
	});

	it('replaces example1 with example2 prefixing path', () => {
		const pattern = new ForwardPattern('example1.com', 'https://example2.com/parent');
		assert.equal(pattern.resolve('example1.com', '/test'), 'https://example2.com/parent/test');
	});

	it('replaces example1 with example2 not retaining path', () => {
		const pattern = new ForwardPattern('example1.com/*', 'https://example2.com/always-here');
		assert.equal(pattern.resolve('example1.com', '/test'), 'https://example2.com/always-here');	});

	it('does not replace for non-matching domain', () => {
		const pattern = new ForwardPattern('example1.com/*', 'https://example2.com');
		assert.equal(pattern.resolve('example3.com', '/test'), null);
	});

	it('replaces everything not retaining path', () => {
		const pattern = new ForwardPattern('*/*', 'https://example.com');
		assert.equal(pattern.resolve('example3.com', '/test'), 'https://example.com');
	});

	it('replaces everything retaining path', () => {
		const pattern = new ForwardPattern('*', 'https://example.com');
		assert.equal(pattern.resolve('example3.com', '/test'), 'https://example.com/test');
	});

	it('cannot resolve when matcher contains 2 slashes', () => {
		const pattern = new ForwardPattern('example1.com/first/', 'https://example2.com/second');
		assert.equal(pattern.resolve('example1.com', '/first'), null);
	});

	it('cannot resolve when host is null or undefined', () => {
		const pattern = new ForwardPattern('example1.com', 'https://example2.com/root');
		assert.equal(pattern.resolve(null, '/my-path'), null);
		assert.equal(pattern.resolve(undefined, '/my-path'), null);
	});

	it('replaces domain but not parameter containing https://', () => {
		const pattern = new ForwardPattern('example1.com', 'https://example2.com');
		assert.equal(pattern.resolve('example1.com', '/?redirect=https://example3.com'), 'https://example2.com/?redirect=https://example3.com');
	});

	it('has string repsentation', () => {
		const pattern = new ForwardPattern('example1.com', 'https://example2.com');
		assert.equal(`${pattern}`, '(example1.com -> https://example2.com)');
	});
});
