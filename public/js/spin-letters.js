import {
	getRandomHeight,
	getRandomRotate,
	getRandomSize,
	generateColors,
} from "./sound-letters/letter-utils.js";

function initializeLetters() {
	const wordElement = document.querySelector(".word");
	const letterWrappers = wordElement.querySelectorAll(".letter-wrapper");

	const parentHeight = wordElement.offsetHeight;
	const numLetters = letterWrappers.length;

	// Generate new colors on each page load
	const colors = generateColors(numLetters);

	letterWrappers.forEach((wrapper, index) => {
		const letter = wrapper.querySelector(".letter");

		// Generate new random values for each letter
		const rand = getRandomSize();
		const height = getRandomHeight(index, parentHeight);
		const rotation = getRandomRotate();

		// Apply new random styles
		letter.style.setProperty("--random-delay", `${rand / 100}s`);
		letter.style.setProperty("--random-size", rand);
		letter.style.setProperty("--rotation", `${rotation}deg`);
		letter.style.setProperty("--font-weight", "400");
		letter.style.setProperty("--primary-color", colors[index].primary);
		letter.style.setProperty("--accent-color", colors[index].accent);
		letter.style.cursor = "pointer";

		wrapper.style.setProperty("--random-height", `${height}px`);
	});

	// After applying all styles, show the word element
	requestAnimationFrame(() => {
		document.documentElement.classList.add("js-loaded");
	});
}

// Also export the function for potential use elsewhere
export { initializeLetters };
