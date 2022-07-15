# eleventy-base-blog

A starter repository showing how to build a (multi-language friendly) blog with the [Eleventy](https://github.com/11ty/eleventy) static site generator.

[![Build Status](https://travis-ci.org/11ty/eleventy-base-blog.svg?branch=master)](https://travis-ci.org/11ty/eleventy-base-blog)

## Demos

- [Netlify](https://eleventy-base-blog.netlify.com/)
- [GitHub Pages](https://11ty.github.io/eleventy-base-blog/)
- [Remix on Glitch](https://glitch.com/~11ty-eleventy-base-blog)

## Deploy this to your own site

Deploy this Eleventy site in just a few clicks on these services:

- [Get your own Eleventy web site on Netlify](https://app.netlify.com/start/deploy?repository=https://github.com/11ty/eleventy-base-blog)
- [Get your own Eleventy web site on Vercel](https://vercel.com/import/project?template=11ty%2Feleventy-base-blog)

Or, read more about [Deploying an Eleventy project](https://www.11ty.dev/docs/deployment/).

## Getting Started

### 1. Clone this Repository

```
git clone https://github.com/11ty/eleventy-base-blog.git my-blog-name
```

### 2. Navigate to the directory

```
cd my-blog-name
```

Specifically have a look at `.eleventy.js` to see if you want to configure any Eleventy options differently.

### 3. Install dependencies

```
npm install
```

### 4. Edit \_data/metadata.json

### 5. Run Eleventy

```
npx @11ty/eleventy
```

Or build and host locally for local development

```
npx @11ty/eleventy --serve
```

Or in debug mode:

```
DEBUG=Eleventy* npx @11ty/eleventy
```

### Implementation Notes

- `en` is the folder for content (written using the primary language for project, here we’re using English)
- `en/about/index.md` is an example of an English content page.
- `en/blog/` has the English blog posts but really they can live in any directory. They need only the `post` tag to be included in the blog posts [collection](https://www.11ty.dev/docs/collections/).
  - To localize a blog post you will need to add a top level folder for that language (`es` for Spanish, `ja` for Japanese, `en-us` for American English) and match the rest of the file path to the primary language folder. For example `en/blog/my-post.md` could have `ja/blog/my-post.md` or `es/blog/my-post.md`. Read more about [best practices for organizing files for internationalization (i18n) in Eleventy projects](https://www.11ty.dev/docs/i18n/).
- Use the `eleventyNavigation` key in your front matter to add a template to the top level site navigation. For example, this is in use on `index.njk` and `about/index.md`.
  - This makes use of the [Eleventy Navigation plugin](https://www.11ty.dev/docs/plugins/navigation/)
- Content can be any template format (blog posts needn’t be markdown, for example). Configure your supported templates in `.eleventy.js` -> `templateFormats`.
- The `public` folder in your input directory will be copied to the output folder (via `addPassthroughCopy()` in the `.eleventy.js` file). This means `./public/css/*` will live at `./_site/css/*` after your build completes. [When using `--serve` this behavior is emulated](/docs/copy/#passthrough-during-serve) (the files will not show up in `_site`).
- The blog post feed template is in `feed/feed.njk`. This is also a good example of using a global data files in that it uses `_data/metadata.json`.
- This project uses three layouts:
  - `_includes/layouts/base.njk`: the top level HTML structure
  - `_includes/layouts/home.njk`: the home page template (wrapped into `base.njk`)
  - `_includes/layouts/post.njk`: the blog post template (wrapped into `base.njk`)
- `_includes/postslist.njk` is a Nunjucks include and is a reusable component used to display a list of all the posts. `index.njk` has an example of how to use it.

