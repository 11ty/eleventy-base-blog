module.exports = eleventyConfig => {

	var isServing = false;
	var isLogged = false;

	eleventyConfig.addGlobalData("eleventyComputed.permalink", () => {
		// When using `addGlobalData` and you *want* to return a function, you must nest functions like this.
		// `addGlobalData` acts like a global data file and runs the top level function it receives.
		return (data) => {
			if (isServing) return data.permalink;
			// Always skip during non-watch/serve builds
			return data.draft ? false : data.permalink;
		}
	});

	eleventyConfig.addGlobalData("eleventyComputed.eleventyExcludeFromCollections", () => {
		// When using `addGlobalData` and you *want* to return a function, you must nest functions like this.
		// `addGlobalData` acts like a global data file and runs the top level function it receives.
		return (data) => {			
			if (isServing) return data.eleventyExcludeFromCollections;
			// Always exclude from non-watch/serve builds
			return data.draft ? true : data.eleventyExcludeFromCollections;
		}
	});

	eleventyConfig.on("eleventy.before", ({ runMode }) => {
		isServing = runMode === "serve" || runMode === "watch";
		var text = isServing ? "Including" : "Excluding";
		if (!isLogged) {
			console.log(`[11ty/eleventy-base-blog] ${text} drafts.`);
			isLogged = true;
		}
	});
}
