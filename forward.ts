import express from 'express';

class ForwardApp {
	constructor(readonly app: Object, readonly listen: () => void) {}
}

function forward(target: string, no_arg: boolean, port = 3000): ForwardApp {
	const app = express();
	app.get(/.*/, (req, res) => {
		const destination = no_arg ? target : target + req.url;
		console.log(`From host "${req.get('HOST')}", path "${req.url}"`);
		res.redirect(301, destination);
	});

	return new ForwardApp(
		app,
		() => {
			app.listen(port, () => {
				console.log(`Listening on ${port} forwarding to ${target}`);
			});
		});
}

if ( require.main === module ) {
	forward(
		process.env.FORWARD_TARGET || 'http://en.wikipedia.org/wiki',
		!!process.env.NO_ARG,
		parseInt(process.env.PORT ?? '3000')
	).listen();
} else {
	module.exports = forward;
}
export default forward;
