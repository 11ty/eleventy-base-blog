import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";

export default function(eleventyConfig) {
	// Read more about this plugin: https://www.11ty.dev/docs/plugins/image/#eleventy-transform

	eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
		// file extensions to process
		extensions: "html",

		formats: ["avif", "webp", "auto"],

		// widths: ["auto"],

		// e.g. <img loading decoding> assigned on the HTML tag will override these values.
		defaultAttributes: {
			loading: "lazy",
			decoding: "async"
		}
	});
};
