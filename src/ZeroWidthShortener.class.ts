export class zeroWidthShortener {
	private static _chars: string[] = [
		"\u200c",
		"\u200d",
		"\u{e0061}",
		"\u{e0062}",
		"\u{e0063}",
		"\u{e0064}",
		"\u{e0065}",
		"\u{e0066}",
		"\u{e0067}",
		"\u{e0068}",
		"\u{e0069}",
		"\u{e006a}",
		"\u{e006b}",
		"\u{e006c}",
		"\u{e006d}",
		"\u{e006e}",
		"\u{e006f}",
		"\u{e0070}",
		"\u{e0071}",
		"\u{e0072}",
		"\u{e0073}",
		"\u{e0074}",
		"\u{e0075}",
		"\u{e0076}",
		"\u{e0077}",
		"\u{e0078}",
		"\u{e0079}",
		"\u{e007a}",
		"\u{e007f}",
	];

	private static _maxUrlLength: number = 10;

	private static encode(str: string): string {
		return Buffer.from(str).toString("base64");
	}

	static generateUrl(): shortenerResult {
		//generate a random string of length _maxUrlLength with chars from _chars
		let url = "";
		for (let i = 0; i < this._maxUrlLength; i++) {
			url += this._chars[Math.floor(Math.random() * this._chars.length)];
		}
		return {
			url: this.encode(url),
			shortUrl: url,
		};
	}

	static decode(str: string): string {
		return zeroWidthShortener.encode(str);
	}
}

export interface shortenerResult {
	url: string;
	shortUrl: string;
}
