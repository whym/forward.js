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
		console.error('config should contain "rules":', parsed);
	}
	if (Object.keys(parsed.rules).length === 0) {
		console.error('config should not be empty:', parsed);
	}
}

function _forward(patterns: ForwardPattern[], port = 3000): ForwardApp {
	const app = express();
	app.get(/.*/, (req, res) => {
		for (const pat of patterns) {
			const dest = pat.resolve(req.get('HOST'), req.url);
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
				console.log(`Listening on ${port}; ${process.env.NODE_ENV}; using [${patterns.join()}]`);
			});
		});
}

if ( require.main === module ) {
	let config;
	try {
		config = require('./config.json');
	} catch (e) {
		config = process.env.FORWARD_CONFIG || {'rules': {}};
	}

	forward_from_yaml(
		config,
		parseInt(process.env.PORT ?? '3000')
	).listen();
} else {
	module.exports = forward_from_yaml;
}
