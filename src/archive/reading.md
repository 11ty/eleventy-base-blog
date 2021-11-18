---
layout: layouts/archive.njk
title: Reading List
pagination:
  data: collections.reading 
  size: 20
  reverse: true
  alias: posts
---

{% if page.url == pagination.href.first %}
Books I have read over time
{% endif %}

{# Use this https://jamesdoc.com/blog/2021/11ty-posts-by-year/ to list by month as on jeffputz. #}

