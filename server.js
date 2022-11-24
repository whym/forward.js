const server = (path) => {
	path = path || './config.json';
	let config;
	try {
		config = require(path);
	} catch (e) {
		config = process.env.FORWARD_CONFIG;
	}
	return require('./dist/forward')(config, process.env.PORT);
};

if ( require.main === module ) {
	server().listen();
} else {
	module.exports = server;
}
