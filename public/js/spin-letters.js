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

	const delays = [];
	letterWrappers.forEach((wrapper, index) => {
		const letter = wrapper.querySelector(".letter");

		// Generate new random values for each letter
		const size = getRandomSize();
		const height = getRandomHeight(index, parentHeight);
		const rotation = getRandomRotate();
		const delay = size / 100; // Use size for delay to keep it consistent

		// Apply new random styles
		letter.style.cssText = `
			--random-delay: ${delay}s;
			--random-size: ${size};
			--rotation: ${rotation}deg;
			--font-weight: 400;
			--primary-color: ${colors[index].primary};
			--accent-color: ${colors[index].accent};
			cursor: pointer;
			opacity: 0;
		`;

		wrapper.style.setProperty("--random-height", `${height}px`);
		delays.push(delay);
	});

	// After applying all styles, show the word element
	requestAnimationFrame(() => {
		document.documentElement.classList.add("js-loaded");
		delays.forEach((delay, index) => {
			setTimeout(() => {
				letterWrappers[index].querySelector(".letter").style.opacity = "1";
			}, delay * 1000);
		});
	});
}

// Also export the function for potential use elsewhere
export { initializeLetters };
