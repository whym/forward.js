export class ForwardPattern {
	private readonly ignore_path: boolean;
	private readonly domain: RegExp | string;

	constructor(readonly matcher: string, readonly replacement: string) {
		if (matcher == '*') {
			this.ignore_path = false;
			this.domain = /.*/;
		} else if (matcher == ('*/*')) {
			this.ignore_path = true;
			this.domain = /.*/;
		} else if (matcher.endsWith('/*')) {
			this.ignore_path = true;
			this.domain = matcher.slice(0, -2);
		} else if (matcher.endsWith('/')) {
			this.ignore_path = false;
			this.domain = matcher.slice(0, -1);
		} else {
			this.domain = matcher;
			this.ignore_path = false;
		}
	}

	public resolve(host: string | null | undefined, path: string): string | null {
		if (host === null || host === undefined) {
			return null;
		}
		if (this.ignore_path && host.match(this.domain)) {
			return this.replacement;
		} else if (host.match(this.domain)) {
			return this.join(this.replacement, path);
		} else {
			return null;
		}
	}

	public toString(): string {
		return `(${this.matcher} -> ${this.replacement})`;
	}

	private join(u1: string, u2: string): string {
		return u1 + u2;
	}
}
