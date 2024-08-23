/** @param {import('@11ty/eleventy').UserConfig} eleventyConfig */
module.exports = async function (eleventyConfig) {
	const { DateTime } = await import("luxon");
	const { default: markdownItAnchor } = await import("markdown-it-anchor");

	const { default: pluginRss } = await import("@11ty/eleventy-plugin-rss");
	const { default: pluginSyntaxHighlight } = await import("@11ty/eleventy-plugin-syntaxhighlight");
	const { default: pluginBundle } = await import("@11ty/eleventy-plugin-bundle");
	const { default: pluginNavigation } = await import("@11ty/eleventy-navigation");
	const { EleventyHtmlBasePlugin } = await import("@11ty/eleventy");

	const { default: pluginDrafts } = await import("./eleventy.config.drafts.js");
	const { default: pluginImages } = await import("./eleventy.config.images.js");

	const { getSVGPathForLetter } = await import('./public/js/sound_letters/svg-converter.js');

	// Copy the contents of the `public` folder to the output folder
	// For example, `./public/css/` ends up in `_site/css/`
	eleventyConfig.addPassthroughCopy({
		"./public/": "/",
	});
	eleventyConfig.addPassthroughCopy({ "css": "css" });
	eleventyConfig.addPassthroughCopy({ "js": "js" });

	eleventyConfig.addJavaScriptFunction("getSVGPathForLetter", getSVGPathForLetter);
	eleventyConfig.addNunjucksGlobal("getSVGPathForLetter", getSVGPathForLetter);

	// Run Eleventy when these files change:
	// https://www.11ty.dev/docs/watch-serve/#add-your-own-watch-targets

	// Watch content images for the image pipeline.
	eleventyConfig.addWatchTarget("content/**/*.{svg,webp,png,jpeg,css}");

	// App plugins
	eleventyConfig.addPlugin(pluginDrafts);
	eleventyConfig.addPlugin(pluginImages);

	// Official plugins
	eleventyConfig.addPlugin(pluginRss);
	eleventyConfig.addPlugin(pluginSyntaxHighlight, {
		preAttributes: { tabindex: 0 }
	});
	eleventyConfig.addPlugin(pluginNavigation);
	eleventyConfig.addPlugin(EleventyHtmlBasePlugin);
	eleventyConfig.addPlugin(pluginBundle);

	// Filters
	eleventyConfig.addFilter("readableDate", (dateObj, format, zone) => {
		// Formatting tokens for Luxon: https://moment.github.io/luxon/#/formatting?id=table-of-tokens
		return DateTime.fromJSDate(dateObj, { zone: zone || "utc" }).toFormat(format || "dd LLLL yyyy");
	});

	eleventyConfig.addFilter('htmlDateString', (dateObj) => {
		// dateObj input: https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
		return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('yyyy-LL-dd');
	});

	// Get the first `n` elements of a collection.
	eleventyConfig.addFilter("head", (array, n) => {
		if (!Array.isArray(array) || array.length === 0) {
			return [];
		}
		if (n < 0) {
			return array.slice(n);
		}

		return array.slice(0, n);
	});

	// Return the smallest number argument
	eleventyConfig.addFilter("min", (...numbers) => {
		return Math.min.apply(null, numbers);
	});

	// Return all the tags used in a collection
	eleventyConfig.addFilter("getAllTags", collection => {
		let tagSet = new Set();
		for (let item of collection) {
			(item.data.tags || []).forEach(tag => tagSet.add(tag));
		}
		return Array.from(tagSet);
	});

	eleventyConfig.addFilter("filterTagList", function filterTagList(tags) {
		return (tags || []).filter(tag => ["all", "nav", "post", "posts"].indexOf(tag) === -1);
	});

	// Customize Markdown library settings:
	eleventyConfig.amendLibrary("md", mdLib => {
		mdLib.use(markdownItAnchor, {
			permalink: markdownItAnchor.permalink.ariaHidden({
				placement: "after",
				class: "header-anchor",
				symbol: "#",
				ariaHidden: false,
			}),
			level: [1, 2, 3, 4],
			slugify: eleventyConfig.getFilter("slugify")
		});
	});

	// Shortcodes
	eleventyConfig.addShortcode("currentBuildDate", () => {
		return (new Date()).toISOString();
	})

	eleventyConfig.addShortcode("figure", function (src, caption, width = '100%') {
		const getMediaElement = () => {
			if (src.includes('youtube.com') || src.includes('youtu.be')) {
				const [baseUrl, params] = src.split('?');
				const videoId = baseUrl.split('v=')[1] || baseUrl.split('/').pop();
				const youtubeParams = params ? `params="${params}"` : '';

				return `
					<lite-youtube videoid="${videoId}" ${youtubeParams} style="background-image: url('https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg');" title="${caption}">
						<a href="${src}" class="lty-playbtn" title="${caption}">
							<span class="lyt-visually-hidden">${caption}</span>
						</a>
					</lite-youtube>`;
			}

			const extension = src.split('.').pop().toLowerCase();
			if (['mp4', 'webm', 'ogg'].includes(extension)) {
				return `<video src="${src}" width="${width}" controls>Your browser does not support the video tag.</video>`;
			}

			return `<img src="${src}" width="${width}" alt="${caption}" />`;
		};

		return `<figure>
			${getMediaElement()}
			<figcaption>${caption}</figcaption>
		</figure>`;
	});





	// Features to make your build faster (when you need them)

	// If your passthrough copy gets heavy and cumbersome, add this line
	// to emulate the file copy on the dev server. Learn more:
	// https://www.11ty.dev/docs/copy/#emulate-passthrough-copy-during-serve

	// eleventyConfig.setServerPassthroughCopyBehavior("passthrough");

	return {
		// Control which files Eleventy will process
		// e.g.: *.md, *.njk, *.html, *.liquid
		templateFormats: [
			"md",
			"njk",
			"html",
			"liquid",
		],

		// Pre-process *.md files with: (default: `liquid`)
		markdownTemplateEngine: "njk",

		// Pre-process *.html files with: (default: `liquid`)
		htmlTemplateEngine: "njk",

		// These are all optional:
		dir: {
			input: "content",          // default: "."
			includes: "../_includes",  // default: "_includes"
			data: "../_data",          // default: "_data"
			output: "_site"
		},

		// -----------------------------------------------------------------
		// Optional items:
		// -----------------------------------------------------------------

		// If your site deploys to a subdirectory, change `pathPrefix`.
		// Read more: https://www.11ty.dev/docs/config/#deploy-to-a-subdirectory-with-a-path-prefix

		// When paired with the HTML <base> plugin https://www.11ty.dev/docs/plugins/html-base/
		// it will transform any absolute URLs in your HTML to include this
		// folder name and does **not** affect where things go in the output folder.
		pathPrefix: "/",
	};
};
