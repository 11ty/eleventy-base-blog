---
layout: layouts/archive.njk
title: Archive
eleventyNavigation:
  key: Archive
  order: 300
pagination:
  data: collections.posts 
  size: 20
  reverse: true
  alias: posts
---

{% if page.url == pagination.href.first %}
This is the complete works, listed in reverse chronological order. You can also browse my posts,  by <a href="/archive/photos/">photos</a>, <a href="/archive/travel/">travel entries</a>, <a href="/archive/web/">web related content</a>, <a href="/archive/reading/">my reading list</a>, <a href="/archive/general/">general tidbits</a> or see all my posts on this archive page</a>. 

You can find all the <a href="/archive/work/">websites I helped produce whilst working for Minervation</a> - still my favourite employers, although not where I currently work.

Finally, you can browse my <a href="/archive/tags/">posts by tag</a> and here is a <a href="/archive/all-posts/">list of all my posts</a>. 
{% endif %}


{# Use this https://jamesdoc.com/blog/2021/11ty-posts-by-year/ to list by month as on jeffputz. #}
