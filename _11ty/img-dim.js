const { JSDOM } = require("jsdom");
const { promisify } = require("util");
const sizeOf = promisify(require("image-size"));
const blurryPlaceholder = require("./blurry-placeholder");

const processImage = async (img) => {
  const src = img.getAttribute("src");
  if (/^(https?\:|\/\/)/i.test(src)) {
    return;
  }
  const dimensions = await sizeOf("_site/" + src);
  img.setAttribute("width", dimensions.width);
  img.setAttribute("height", dimensions.height);
  img.setAttribute("decoding", "async");
  img.setAttribute("loading", "lazy");
  img.setAttribute(
    "style",
    `background-size:cover;background-image:url("${await blurryPlaceholder(
      src
    )}")`
  );
};

const dimImages = async (rawContent, outputPath) => {
  let content = rawContent;

  if (outputPath.endsWith(".html")) {
    const dom = new JSDOM(content);
    const images = [...dom.window.document.querySelectorAll("img")].filter(
      (img) => !img.getAttribute("width")
    );

    if (images.length > 0) {
      await Promise.all(images.map((i) => processImage(i)));
      content = dom.serialize();
    }
  }

  return content;
};

module.exports = {
  initArguments: {},
  configFunction: async (eleventyConfig, pluginOptions = {}) => {
    eleventyConfig.addTransform("imgDim", dimImages);
  },
};
