const server = (path) => {
	path = path || './config.json';
	const config = require(path);
	return require('./forward')(config.target, !config.args, process.env.PORT);
};

if ( require.main === module ) {
	server();
} else {
	module.exports = server;
}
