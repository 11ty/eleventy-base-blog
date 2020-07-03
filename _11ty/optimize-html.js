const purify = require("../third_party/purify-css/purify-css");
const minify = require("html-minifier").minify;

const purifyCss = (rawContent, outputPath) => {
  let content = rawContent;
  if (outputPath.endsWith(".html") && !isAmp(content)) {
    const before = require("fs").readFileSync("css/bahunya.css", {
      encoding: "utf-8",
    });
    const after = purify(rawContent, before, {
      minify: true,
    });
    content = content.replace("</head>", `<style>${after}</style></head>`);
  }
  return content;
};

const minifyHtml = (rawContent, outputPath) => {
  let content = rawContent;
  if (outputPath.endsWith(".html") && !isAmp(content)) {
    content = minify(content, {
      removeAttributeQuotes: true,
      collapseWhitespace: true,
      removeComments: true,
      sortClassName: true,
      sortAttributes: true,
    });
  }
  return content;
};

module.exports = {
  initArguments: {},
  configFunction: async (eleventyConfig, pluginOptions = {}) => {
    eleventyConfig.addTransform("purifyCss", purifyCss);
    eleventyConfig.addTransform("minifyHtml", minifyHtml);
  },
};

function isAmp(content) {
  return /\<html amp/i.test(content);
}
