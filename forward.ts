import express from 'express';
import { ForwardPattern } from './forward_pattern';
import YAML from 'yaml';

type ConfigObject = {rules: {[key: string]: string}};

class ForwardApp {
	constructor(readonly app: express.Express, readonly listen: () => void) {}
}

const FALLBACK_CONFIG = {'rules': {}};

export default function forward_from_yaml(yaml: string | ConfigObject, port = 3000): ForwardApp {
	let parsed: ConfigObject;
	if (typeof(yaml) === 'string') {
		parsed = YAML.parse(yaml);
	} else {
		parsed = yaml;
	}

	if (!_is_valid_syntax(parsed)) {
		parsed = FALLBACK_CONFIG;
	}

	const patterns = Object.entries(parsed.rules).map(([k,v]) =>
		new ForwardPattern(k, v));
	return _forward(patterns, port);
}

function _is_valid_syntax(parsed: ConfigObject) {
	if (!parsed.rules) {
		console.error('config should contain "rules":', parsed);
		return false;
	} else if (Object.keys(parsed.rules).length === 0) {
		console.error('config should not be empty:', parsed);
		return false;
	}
	return true;
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
		config = process.env.FORWARD_CONFIG || FALLBACK_CONFIG;
	}

	forward_from_yaml(
		config,
		parseInt(process.env.PORT ?? '3000')
	).listen();
} else {
	module.exports = forward_from_yaml;
}
