import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";

export default function(eleventyConfig) {
	eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
		// which file extensions to process
		extensions: "html",

		formats: ["avif", "webp", "auto"],

		// widths: ["auto"],

		// urlPath: "/img/",

		// If a urlPath is not specified:

		// 1. Relative image sources (<img src="./possum.png">) will be co-located in your output directory
		// 		with the template they are used in. Warning: if the same source image is used in multiple templates,
		//		it will be written to two different locations!
		// 2. Absolute image sources (<img src="/possum.png">) will be normalized to your input/content directory
		// 		and written to ${OUTPUT_DIR}/img/

		// <img loading decoding> assigned on the HTML tag will override these values.
		defaultAttributes: {
			loading: "lazy",
			decoding: "async"
		}
	});
};
