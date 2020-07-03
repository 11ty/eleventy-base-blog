const purify = require("../third_party/purify-css/purify-css");
const minify = require("html-minifier").minify;

const purifyCss = (rawContent, outputPath) => {
  let content = rawContent;
  if (outputPath.endsWith(".html")) {
    const before = require("fs").readFileSync("css/bahunya.css", {
      encoding: "utf-8",
    });
    const after = purify(rawContent, before, {
      minify: true,
    });
    content = content.replace("</head>", `<style>${after}</style>`);
  }
  return content;
};

const minifyHtml = (rawContent, outputPath) => {
  let content = rawContent;
  if (outputPath.endsWith(".html")) {
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
