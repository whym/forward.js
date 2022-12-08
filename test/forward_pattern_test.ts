/* eslint-env node,es6,mocha */
import { ForwardPattern } from '../forward_pattern';
import assert from 'assert';

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

	it('joins domain and path', () => {
		assert.equal(
			ForwardPattern.join('https://example.com', '/path'),
			'https://example.com/path');
	});

	it('detects missing https://', () => {
		assert.equal(
			ForwardPattern.validate_url('example.com/path'),
			false);
	});
});
