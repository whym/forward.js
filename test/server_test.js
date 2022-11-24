/* eslint-env node,mocha */

const supertest = require('supertest');
const server = require('../server');

describe('server.js', () => {
	const requestWithSample = supertest(server('./config-sample.json').app);
  it('Sample config resolves into English Wikipedia', async () => {
    await requestWithSample.get('/Dictionary')
			.expect('Location', 'https://en.wikipedia.org/wiki/Dictionary')
			.expect(301);
  });

  it('Sample config resolves into example2.com', async () => {
    await requestWithSample.get('/test')
			.set('Host', 'example.com')
			.expect('Location', 'https://example2.com/test')
			.expect(301);
  });
});
