// const lightningCSS = require("@11tyrocks/eleventy-plugin-lightningcss");

/** @param {import('@11ty/eleventy').UserConfig} eleventyConfig */
module.exports = async function (eleventyConfig) {
	const pagefind = await import("pagefind");
	const { DateTime } = await import("luxon");
	const { default: markdownItAnchor } = await import("markdown-it-anchor");
	const { createCanvas } = await import("canvas");

	const { default: pluginRss } = await import("@11ty/eleventy-plugin-rss");
	const { default: pluginSyntaxHighlight } = await import(
		"@11ty/eleventy-plugin-syntaxhighlight"
	);
	const { default: pluginBundle } = await import(
		"@11ty/eleventy-plugin-bundle"
	);
	const { default: pluginNavigation } = await import(
		"@11ty/eleventy-navigation"
	);
	const { EleventyHtmlBasePlugin } = await import("@11ty/eleventy");

	const { default: pluginDrafts } = await import("./eleventy.config.drafts.js");
	const { default: pluginImages } = await import("./eleventy.config.images.js");

	// const getSVGPathForLetter = await import('./public/js/sound-letters/svg-converter.js');

	// Copy the contents of the `public` folder to the output folder
	// For example, `./public/css/` ends up in `_site/css/`
	eleventyConfig.addPassthroughCopy({
		"./public/": "/",
		"/_site/pagefind": "pagefind",
	});

	// eleventyConfig.addJavaScriptFunction("getSVGPathForLetter", getSVGPathForLetter);
	// eleventyConfig.addNunjucksGlobal("getSVGPathForLetter", getSVGPathForLetter);

	// Run Eleventy when these files change:
	// https://www.11ty.dev/docs/watch-serve/#add-your-own-watch-targets

	// Watch content images for the image pipeline.
	eleventyConfig.addWatchTarget("content/**/*.{svg,webp,png,jpeg}");

	// App plugins
	eleventyConfig.addPlugin(pluginDrafts);
	eleventyConfig.addPlugin(pluginImages);

	// Official plugins
	eleventyConfig.addPlugin(pluginRss);
	eleventyConfig.addPlugin(pluginSyntaxHighlight, {
		preAttributes: { tabindex: 0 },
	});
	eleventyConfig.addPlugin(pluginNavigation);
	eleventyConfig.addPlugin(EleventyHtmlBasePlugin);
	eleventyConfig.addPlugin(pluginBundle);

	// Auto font subsetting
	eleventyConfig.addPlugin(
		require("@photogabble/eleventy-plugin-font-subsetting"),
		{
			srcFiles: [
				"./public/font/Switzer-Variable.woff2",
				"./public/font/Rag-Regular.woff2",
				"./public/font/Rag-Italic.woff2",
				"./public/font/Rag-Bold.woff2",
				"./public/font/Rag-BoldItalic.woff2",
			],
			// enabled: process.env.ELEVENTY_ENV !== 'production'
		},
	);

	eleventyConfig.addFilter("cssmin", function (code) {
		let { code: minifiedCode } = lightningcss.transform({
			code: Buffer.from(code),
			minify: true,
			sourceMap: false,
		});
		return minifiedCode.toString();
	});

	// Watch CSS files for changes
	eleventyConfig.addWatchTarget("public/css/**/*.css");

	// Filters
	eleventyConfig.addFilter("readableDate", (dateObj, format, zone) => {
		// Formatting tokens for Luxon: https://moment.github.io/luxon/#/formatting?id=table-of-tokens
		return DateTime.fromJSDate(dateObj, { zone: zone || "utc" }).toFormat(
			format || "dd LLLL yyyy",
		);
	});

	eleventyConfig.addFilter("htmlDateString", (dateObj) => {
		// dateObj input: https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
		return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("yyyy-LL-dd");
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
	eleventyConfig.addFilter("getAllTags", (collection) => {
		let tagSet = new Set();
		for (let item of collection) {
			(item.data.tags || []).forEach((tag) => tagSet.add(tag));
		}
		return Array.from(tagSet);
	});

	eleventyConfig.addFilter("filterTagList", function filterTagList(tags) {
		return (tags || []).filter(
			(tag) => ["all", "nav", "post", "posts"].indexOf(tag) === -1,
		);
	});

	// Emoji color border
	eleventyConfig.addFilter("getEmojiColor", function (emoji) {
		if (!emoji) return "#f0f0f0";

		const canvas = createCanvas(16, 16);
		const ctx = canvas.getContext("2d");

		ctx.textDrawingMode = "glyph";
		ctx.font = "bold 16px Arial";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText(emoji, 8, 8);

		const imageData = ctx.getImageData(0, 0, 16, 16).data;
		let r = 0,
			g = 0,
			b = 0,
			count = 0;

		for (let i = 0; i < imageData.length; i += 4) {
			if (imageData[i + 3] > 0) {
				r += imageData[i];
				g += imageData[i + 1];
				b += imageData[i + 2];
				count++;
			}
		}

		if (count) {
			r = Math.round(r / count);
			g = Math.round(g / count);
			b = Math.round(b / count);
			return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
		}

		return "#f0f0f0";
	});

	// Customize Markdown library settings:
	eleventyConfig.amendLibrary("md", (mdLib) => {
		mdLib.use(markdownItAnchor, {
			permalink: markdownItAnchor.permalink.ariaHidden({
				placement: "after",
				class: "header-anchor",
				symbol: "#",
				ariaHidden: false,
			}),
			level: [1, 2, 3, 4],
			slugify: eleventyConfig.getFilter("slugify"),
		});
	});

	// Shortcodes
	eleventyConfig.addShortcode("currentBuildDate", () => {
		return new Date().toISOString();
	});

	eleventyConfig.addShortcode(
		"figure",
		function (src, caption, aspectRatio = "16/9") {
			if (src.includes("youtube.com")) {
				let [, queryString] = src.split("watch?");
				let [videoIdPart, ...otherParts] = queryString.split("?");
				let videoId = videoIdPart.split("=")[1];
				let otherParams = otherParts.join("&");

				return `<figure>
				<lite-youtube
					videoid="${videoId}"
					style="background-image: url('https://i.ytimg.com/vi/${videoId}/hqdefault.jpg');"
					${otherParams ? `params="${otherParams}"` : ""}
					data-title="${caption}"
					>
					<button type="button" class="lty-playbtn">
						<span class="lyt-visually-hidden">${caption}</span>
					</button>
				</lite-youtube>
				<figcaption>${caption}</figcaption>
			</figure>`;
			} else if (src.includes("vimeo.com")) {
				const videoId = src.split("/").pop();
				return `<figure>
				<lite-vimeo videoid="${videoId}" style="aspect-ratio: ${aspectRatio};">
					<div class="ltv-playbtn"></div>
				</lite-vimeo>
				<figcaption>${caption}</figcaption>
			</figure>`;
			} else {
				const isVideo = /\.(mp4|webm|ogg)$/i.test(src);
				const isUrl = /^https?:\/\//i.test(src);
				const imgSrc = isUrl ? src : `/img/${src}`;
				const element = isVideo
					? `<video src="${src}" style="aspect-ratio: ${aspectRatio};" controls>Your browser does not support the video tag.</video>`
					: `<img src="${imgSrc}" alt="${caption}" loading="lazy" decoding="async" />`;

				return `<figure>${element}<figcaption>${caption}</figcaption></figure>`;
			}
		},
	);

	eleventyConfig.addShortcode("cite", function (author, year, title, url) {
		const citation = `<p class="citation">${author}. (${year}). <em>${title}</em>`;
		const urlPattern = /^(https?:\/\/[^\s$.?#].[^\s]*)$/i;

		if (url && urlPattern.test(url)) {
			return `${citation}. Retrieved from <a href="${url}">${url}</a></p>`;
		} else if (url) {
			return `${citation}. ${url}</p>`;
		}
		return `${citation}</p>`;
	});

	// Features to make your build faster (when you need them)

	// If your passthrough copy gets heavy and cumbersome, add this line
	// to emulate the file copy on the dev server. Learn more:
	// https://www.11ty.dev/docs/copy/#emulate-passthrough-copy-during-serve

	// eleventyConfig.setServerPassthroughCopyBehavior("passthrough");

	eleventyConfig.on("eleventy.after", async () => {
		process.stdout.write("Running Pagefind...");
		try {
			const { index } = await pagefind.createIndex({
				rootSelector: "main",
				forceLanguage: "en",
				verbose: false,
			});
			await index.addDirectory({
				path: "_site",
			});
			await index.writeFiles({
				outputPath: "_site/pagefind",
			});
			process.stdout.write(" indexing complete.\n");
		} catch (error) {
			console.error("Pagefind error:", error);
		} finally {
			await pagefind.close();
		}
	});

	return {
		// Control which files Eleventy will process
		// e.g.: *.md, *.njk, *.html, *.liquid
		templateFormats: ["md", "njk", "html", "liquid"],

		// Pre-process *.md files with: (default: `liquid`)
		markdownTemplateEngine: "njk",

		// Pre-process *.html files with: (default: `liquid`)
		htmlTemplateEngine: "njk",

		// These are all optional:
		dir: {
			input: "content", // default: "."
			includes: "../_includes", // default: "_includes"
			data: "../_data", // default: "_data"
			output: "_site",
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
