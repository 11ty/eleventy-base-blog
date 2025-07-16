import { IdAttributePlugin, InputPathToUrlTransformPlugin, HtmlBasePlugin } from "@11ty/eleventy";
import { feedPlugin } from "@11ty/eleventy-plugin-rss";
import pluginSyntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import pluginNavigation from "@11ty/eleventy-navigation";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import pluginFilters from "./_config/filters.js";
import { execSync } from "node:child_process";

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
export default async function(eleventyConfig) {
  // Draft handling
  eleventyConfig.addPreprocessor("drafts", "*", (data, content) => {
    if (data.draft && process.env.ELEVENTY_RUN_MODE === "build") {
      return false;
    }
  });

  // Static assets
  eleventyConfig
    .addPassthroughCopy({
      "./public/": "/"
    })
    .addPassthroughCopy("./content/feed/pretty-atom-feed.xsl");

  // Watch targets
  eleventyConfig.addWatchTarget("css/**/*.css");
  eleventyConfig.addWatchTarget("content/**/*.{svg,webp,png,jpg,jpeg,gif}");

  // Per-page Bundles
  eleventyConfig.addBundle("css", {
    toFileDirectory: "dist",
    bundleHtmlContentFromSelector: "style",
  });
  eleventyConfig.addBundle("js", {
    toFileDirectory: "dist",
    bundleHtmlContentFromSelector: "script",
  });

  // Plugins
  eleventyConfig.addPlugin(pluginSyntaxHighlight, {
    preAttributes: { tabindex: 0 }
  });
  eleventyConfig.addPlugin(pluginNavigation);
  eleventyConfig.addPlugin(HtmlBasePlugin);
  eleventyConfig.addPlugin(InputPathToUrlTransformPlugin);
  eleventyConfig.addPlugin(feedPlugin, {
    type: "atom",
    outputPath: "/feed/feed.xml",
    stylesheet: "pretty-atom-feed.xsl",
    templateData: {
      eleventyNavigation: {
        key: "Feed",
        order: 4
      }
    },
    collection: {
      name: "posts",
      limit: 10,
    },
    metadata: {
      language: "en",
      title: "Blog Title",
      subtitle: "This is a longer description about your blog.",
      base: "https://example.com/",
      author: {
        name: "Your Name"
      }
    }
  });
  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    formats: ["avif", "webp", "auto"],
    failOnError: false,
    htmlOptions: {
      imgAttributes: { loading: "lazy", decoding: "async" }
    },
    sharpOptions: { animated: true },
  });

  // Filters
  eleventyConfig.addPlugin(pluginFilters);

  // ID plugin
  eleventyConfig.addPlugin(IdAttributePlugin, {
    // use default slugify selector
  });

  // Build-date shortcode
  eleventyConfig.addShortcode("currentBuildDate", () => {
    return new Date().toISOString();
  });

  // **TAILWIND CSS BUILD HOOK**
  eleventyConfig.on("eleventy.before", () => {
    console.log("🔨 Building Tailwind CSS...");
    execSync(
      "npx tailwindcss -i css/tailwind.css -o _includes/css/tw.css --minify",
      { stdio: "inherit" }
    );
  });

  // Return directories
  return {
    dir: {
      input: "content",
      includes: "../_includes",
      data: "../_data",
      output: "docs"
    },
    pathPrefix: "/eleventy-base-blog/"
  };
}
