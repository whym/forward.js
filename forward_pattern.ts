export class ForwardPattern {
	wildcarded: boolean;
	domain: RegExp | string;
	
	constructor(readonly matcher: string, readonly replacement: string) {
		if (matcher == '*') {
			this.wildcarded = false;
			this.domain = new RegExp('.*');
		} else if (matcher == ('*/*')) {
			this.wildcarded = true;
			this.domain = new RegExp('.*');
		} else if (matcher.endsWith('/*')) {
			this.wildcarded = true;
			this.domain = matcher.substr(0, matcher.length - 2);
		} else if (matcher.endsWith('/')) {
			this.wildcarded = false;
			this.domain = matcher.substr(0, matcher.length - 1);
		} else {
			this.domain = matcher;
			this.wildcarded = false;
		}
	}

	public resolve(host: string, path: string): string | null {
		if (!this.wildcarded && host.match(this.domain)) {
			return this.join(this.replacement, path);
		} else if (this.wildcarded && host.match(this.domain)) {
			return this.replacement;
		} else {
			return null;
		}
	}

	public toString(): string {
    return `FP(${this.matcher}, ${this.replacement})`;
  }

	private join(u1: string, u2: string): string {
		return u1 + u2;
	}
}
