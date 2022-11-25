import express from 'express';
import { ForwardPattern } from './forward_pattern';
import YAML from 'yaml';

type ConfigObject = {rules: {[key: string]: string}};

class ForwardApp {
	constructor(readonly app: unknown, readonly listen: () => void) {}
}

export default function forward_from_yaml(yaml: string | ConfigObject, port = 3000): ForwardApp {
	let parsed: ConfigObject;
	if (typeof(yaml) === 'string') {
		parsed = YAML.parse(yaml);
	} else {
		parsed = yaml;
	}
	_check_syntax(parsed);
	const patterns = Object.entries(parsed.rules).map((x) =>
		new ForwardPattern(x[0], x[1]));
	return _forward(patterns, port);
}

function _check_syntax(parsed: ConfigObject) {
	if (!parsed.rules) {
		console.error('yaml should contain "rules":', parsed);
	}
}

function _forward(patterns: ForwardPattern[], port = 3000): ForwardApp {
	const app = express();
	app.get(/.*/, (req, res) => {
		for (const pat of patterns) {
			const dest = pat.resolve(req.get('HOST') || 'localhost', req.url);
			if (dest != null) {
				console.log(`Forwarding from host "${req.get('HOST')}", path "${req.url}", to "${dest}"`)
				res.redirect(301, dest);
				return;
			}
		}
		res.status(503).send('no match');
	});

	return new ForwardApp(
		app,
		() => {
			app.listen(port, () => {
				console.log(`Listening on ${port}; using ${patterns.join()}`);
			});
		});
}

if ( require.main === module ) {
	let config;
	try {
		config = require('./config.json');
	} catch (e) {
		config = process.env.FORWARD_CONFIG;
	}

	forward_from_yaml(
		config,
		parseInt(process.env.PORT ?? '3000')
	).listen();
} else {
	module.exports = forward_from_yaml;
}
