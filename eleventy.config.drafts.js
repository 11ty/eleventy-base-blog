function eleventyComputedPermalink() {
	// When using `addGlobalData` and you *want* to return a function, you must nest functions like this.
	// `addGlobalData` acts like a global data file and runs the top level function it receives.
	return (data) => {
		if(data.draft) {
			// BUILD_DRAFTS is set in eleventy.config.js
			if(process.env.BUILD_DRAFTS) {
				return data.permalink;
			}

			// Always skip during non-watch/serve builds
			return false;
		}

		return data.permalink;
	}
};

function eleventyComputedExcludeFromCollections() {
	// When using `addGlobalData` and you *want* to return a function, you must nest functions like this.
	// `addGlobalData` acts like a global data file and runs the top level function it receives.
	return (data) => {
		if(data.draft) {
			// BUILD_DRAFTS is set in eleventy.config.js
			if(process.env.BUILD_DRAFTS) {
				return data.eleventyExcludeFromCollections;
			}

			// Always exclude from non-watch/serve builds
			return true;
		}

		return data.eleventyExcludeFromCollections;
	}
};

module.exports.eleventyComputedPermalink = eleventyComputedPermalink;
module.exports.eleventyComputedExcludeFromCollections = eleventyComputedExcludeFromCollections;

module.exports = eleventyConfig => {
	eleventyConfig.addGlobalData("eleventyComputed.permalink", eleventyComputedPermalink);
	eleventyConfig.addGlobalData("eleventyComputed.eleventyExcludeFromCollections", eleventyComputedExcludeFromCollections);

	let logged = false;
	eleventyConfig.on("eleventy.before", ({runMode}) => {
		let text = "Excluding";
		// Only show drafts in serve/watch modes
		if(runMode === "serve" || runMode === "watch") {
			process.env.BUILD_DRAFTS = true;
			text = "Including";
		}

		// Only log once.
		if(!logged) {
			console.log( `[11ty/eleventy-base-blog] ${text} drafts.` );
		}

		logged = true;
	});
}
