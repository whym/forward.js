const server = (path) => {
	path = path || './config.json';
	const config = require(path);
	return require('./dist/forward')(config.target, !config.args, process.env.PORT);
};

if ( require.main === module ) {
	server().listen();
} else {
	module.exports = server;
}
