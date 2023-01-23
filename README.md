# eleventy-base-blog v8

A starter repository showing how to build a blog with the [Eleventy](https://www.11ty.dev/) site generator (using the [v2.0 beta release](https://www.11ty.dev/blog/eleventy-v2-beta/)).

## Features

- Using [Eleventy v2.0](https://www.11ty.dev/blog/eleventy-v2-beta/) with zero-JavaScript output.
- Content is entirely pre-rendered (this is a static site).
- Easily [deploy](#deploy-this-to-your-own-site) to various hosting providers.
- Live reload provided by [Eleventy Dev Server](https://www.11ty.dev/docs/dev-server/).
- Content-driven [hierarchical navigation](https://www.11ty.dev/docs/plugins/navigation/)
- Automated [image optimization](https://www.11ty.dev/docs/plugins/image/) via the `{% image %}` shortcode (images can be co-located with posts) (with zero-JavaScript output).
- Built-in [syntax highlighter](https://www.11ty.dev/docs/plugins/syntaxhighlight/) (with zero-JavaScript output).
- Automated next/previous links on blog posts.
- Use `draft: true` to only show draft blog posts (during `--serve` and `--watch` run modes). Drafts are excluded from full builds.
- Easily [deploy to a subfolder without changing any content](https://www.11ty.dev/docs/plugins/html-base/)
- Easily configure templates via the [Eleventy Data Cascade](https://www.11ty.dev/docs/data-cascade/)
- Output URLs are independent of content’s location on the file system.
- Generated:
	1. [feeds for Atom and JSON](https://www.11ty.dev/docs/plugins/rss/)
	1. `sitemap.xml`
	1. Tag pages ([demo](https://eleventy-base-blog.netlify.app/tags/))
	1. Content not found (404) page

## Demos

- [Netlify](https://eleventy-base-blog.netlify.com/)
- [GitHub Pages](https://11ty.github.io/eleventy-base-blog/)
- [Remix on Glitch](https://glitch.com/~11ty-eleventy-base-blog)

## Deploy this to your own site

Deploy this Eleventy site in just a few clicks on these services:

- [Get your own Eleventy web site on Netlify](https://app.netlify.com/start/deploy?repository=https://github.com/11ty/eleventy-base-blog)
- If you run Eleventy locally you can drag your `_site` folder to [`drop.netlify.com`](https://drop.netlify.com/) to upload it!
- [Get your own Eleventy web site on Vercel](https://vercel.com/import/project?template=11ty%2Feleventy-base-blog)
- Read more about [Deploying an Eleventy project](https://www.11ty.dev/docs/deployment/) to the web.

## Getting Started

### 1. Clone this Repository

```
git clone https://github.com/11ty/eleventy-base-blog.git my-blog-name
```

### 2. Navigate to the directory

```
cd my-blog-name
```

Specifically have a look at `eleventy.config.js` to see if you want to configure any Eleventy options differently.

### 3. Install dependencies

```
npm install
```

### 4. Edit `_data/metadata.json`

### 5. Run Eleventy

Generate a production-ready build:

```
npx @11ty/eleventy
```

Or build and host locally on a local development server:

```
npx @11ty/eleventy --serve
```

Or in debug mode to see all the internals:

```
DEBUG=Eleventy* npx @11ty/eleventy
```

### Implementation Notes

- `content/about/index.md` is an example of a content page.
- `content/blog/` has the blog posts but really they can live in any directory. They need only the `post` tag to be included in the blog posts [collection](https://www.11ty.dev/docs/collections/).
- Use the `eleventyNavigation` key (via the [Eleventy Navigation plugin](https://www.11ty.dev/docs/plugins/navigation/)) in your front matter to add a template to the top level site navigation. This is in use on `content/index.njk` and `content/about/index.md`.
- Content can be in _any template format_ (blog posts needn’t exclusively be markdown, for example). Configure your project’s supported templates in `eleventy.config.js` -> `templateFormats`.
- The `public` folder in your input directory will be copied to the output folder (via `addPassthroughCopy` in the `eleventy.config.js` file). This means `./public/css/*` will live at `./_site/css/*` after your build completes.
- The blog post feed template is in `feed/feed.njk`. This feed also uses the global data file at `_data/metadata.json`.
- This project uses three layouts:
  - `_includes/layouts/base.njk`: the top level HTML structure
  - `_includes/layouts/home.njk`: the home page template (wrapped into `base.njk`)
  - `_includes/layouts/post.njk`: the blog post template (wrapped into `base.njk`)
- `_includes/postslist.njk` is a Nunjucks include and is a reusable component used to display a list of all the posts. `index.njk` has an example of how to use it.

