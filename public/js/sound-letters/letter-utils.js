// Utils for letter animations

export function getRandomHeight(index, parentHeight, letterHeights = []) {
	const maxHeight = parentHeight;
	const minGap = parentHeight * 0.5;
	let height = Math.floor(Math.random() * maxHeight);

	if (index > 0 && letterHeights[index - 1]) {
		const prevHeight = letterHeights[index - 1];
		if (Math.abs(height - prevHeight) < minGap) {
			height =
				height > prevHeight
					? Math.min(prevHeight + minGap, maxHeight)
					: Math.max(prevHeight - minGap, 0);
		}
	}

	letterHeights[index] = height;
	return height;
}

export function getRandomRotate() {
	return Math.floor(Math.random() * 360);
}

export function getRandomSize() {
	return Math.random() * 100;
}

export function hslToRgb(h, s, l) {
	let r, g, b;

	if (s === 0) {
		r = g = b = l;
	} else {
		const hue2rgb = (p, q, t) => {
			if (t < 0) t += 1;
			if (t > 1) t -= 1;
			if (t < 1 / 6) return p + (q - p) * 6 * t;
			if (t < 1 / 2) return q;
			if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
			return p;
		};

		const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		const p = 2 * l - q;
		r = hue2rgb(p, q, h + 1 / 3);
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - 1 / 3);
	}

	return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

export function rgbToHex(r, g, b) {
	return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
}

export function generateColors(numLetters) {
	const baseHue = Math.random();
	return Array(numLetters)
		.fill()
		.map((_, i) => {
			const [r, g, b] = hslToRgb((baseHue + i / numLetters) % 1, 0.4, 0.5);
			const accent = [r, g, b].map((c) => Math.min(255, c + 30));
			return {
				primary: rgbToHex(r, g, b),
				accent: rgbToHex(...accent),
			};
		});
}
