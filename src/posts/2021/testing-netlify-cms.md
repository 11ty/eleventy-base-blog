---
layout: blog
title: Testing Netlify CMS
date: 2021-11-24T12:19:07.596Z
---
Currently I use [Forestry](https://forestry.io/) to create posts for this blog.  That workflow works fine, but I was curious about integrating [Netlify CMS](https://www.netlifycms.org/) into my [Eleventy](https://www.11ty.dev/) based static site.

So I followed the instructions on the Netlify CMS website on how to add it to an existing app.  So far so good. Here I am trying to create my first post using the CMS.

Overall Netlify CMS seems OK. Not sure if it is an improvement on Forestry, but for my needs it doesn't appear to worse either.  The only thing I have not managed to do is list all my post subfolders in the collections tab. My site's post folder is structured by year:

`src/posts/2021`\
`src/posts/2020`\
`src/posts/2019`\
`.`\
`.`\
`.`

And I want the same template applied to all of them, plus to be able to decide which folder to place a new blog post in.  I don't want to create an extra item in the "collections" of the config.yml file.

I will keep trying and looking for solutions.