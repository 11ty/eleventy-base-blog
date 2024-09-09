const wordElement = document.querySelector(".word");
const letterWrappers = wordElement.querySelectorAll(".letter-wrapper");

const parentWidth = wordElement.offsetWidth;
const parentHeight = wordElement.offsetHeight;
const minGap = parentHeight * 0.75;
const letterHeights = [];

const numLetters = letterWrappers.length;
const fixedWidth = parentWidth / (numLetters + 1);

const hslToRgb = (h, s, l) => {
	const hue2rgb = (p, q, t) => {
		if (t < 0) t += 1;
		if (t > 1) t -= 1;
		return t < 1 / 6
			? p + (q - p) * 6 * t
			: t < 1 / 2
				? q
				: t < 2 / 3
					? p + (q - p) * (2 / 3 - t) * 6
					: p;
	};
	const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
	const p = 2 * l - q;
	return [h + 1 / 3, h, h - 1 / 3].map((t) =>
		Math.round(hue2rgb(p, q, t) * 255),
	);
};

const rgbToHex = (r, g, b) =>
	"#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");

const generateColors = (numLetters) => {
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
};

function getRandomHeight(index) {
	const maxHeight = parentHeight;
	let height = Math.floor(Math.random() * maxHeight);

	if (index > 0) {
		const prevHeight = letterHeights[index - 1];

		if (Math.abs(height - prevHeight) < minGap) {
			// Adjust height
			if (height > prevHeight) {
				height = Math.min(prevHeight + minGap, maxHeight);
			} else {
				height = Math.max(prevHeight - minGap, 0);
			}
		}
	}

	letterHeights.push(height);
	return height;
}

const getRandomRotate = () => Math.floor(Math.random() * 360);

const colors = generateColors(numLetters);

letterWrappers.forEach((wrapper, index) => {
	const letter = wrapper.querySelector(".letter");
	const rand = Math.random();

	letter.style.setProperty("--random-delay", `${rand}s`);
	letter.style.setProperty("--random-size", rand * 100);

	const height = getRandomHeight(index);
	const rotation = getRandomRotate();

	Object.assign(wrapper.style, {
		top: `${height / 2}px`,
	});

	Object.assign(letter.style, {
		textAlign: "center",
		color: colors[index].accent,
		WebkitTextStroke: `1px ${colors[index].primary}`,
		textStroke: `1px ${colors[index].primary}`,
		paintOrder: "stroke fill",
	});

	letter.style.setProperty("--rotation", rotation);
	letter.style.setProperty("--font-weight", "400");

	Object.assign(wrapper.style, {
		width: `${fixedWidth}px`,
		display: "inline-block",
		verticalAlign: "top",
		marginLeft: index > 0 ? "0px" : "",
	});
});
