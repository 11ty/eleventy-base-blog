import TextToSVG from "text-to-svg";
const textToSVG = TextToSVG.loadSync();

function getSVGPathForLetter(letter) {
	const options = {
		x: 0,
		y: 0,
		fontSize: 72,
		anchor: "top",
		attributes: { fill: "currentColor" },
	};

	const svgString = textToSVG.getD(letter, options);
	return svgString;
}

export default { getSVGPathForLetter };
