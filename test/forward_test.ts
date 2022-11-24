/* eslint-env node,mocha */
import request from 'supertest';
import forward from '../forward';
import { ForwardPattern } from '../forward_pattern';
import assert from 'assert';

describe('forward.ts', () => {
	const app = forward({'rules': {'*': 'http://example.com'}}).app;
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

	it('replaces domain but not parameter containing https://', () => {
		const pattern = new ForwardPattern('example1.com', 'https://example2.com');
		assert.equal(pattern.resolve('example1.com', '/?redirect=https://example3.com'), 'https://example2.com/?redirect=https://example3.com');
	});

	it('has string repsentation', () => {
		const pattern = new ForwardPattern('example1.com', 'https://example2.com');
		assert.equal(`${pattern}`, 'FP(example1.com, https://example2.com)');
	});
});
