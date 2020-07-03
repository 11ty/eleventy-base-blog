const purify = require("../third_party/purify-css/purify-css");

const purifyCss = async (rawContent, outputPath) => {
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

module.exports = {
  initArguments: {},
  configFunction: async (eleventyConfig, pluginOptions = {}) => {
    eleventyConfig.addTransform("purifyCss", purifyCss);
  },
};
