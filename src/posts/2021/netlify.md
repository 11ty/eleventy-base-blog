---
pageTitle: Moving to Netlify
date: 2021-04-17
tags: web
---

I've now moved my site over to <a href="https://www.netlify.com/">Netlify</a>. Having hosted it, at least in part, on <a href="https://www.nearlyfreespeech.net/">Nearlyfreespeech</a> for the best part of 15 years, I have decided to go fully serverless. This is not a slight on Nearlyfreespeech, I have had only <a href="/posts/2021/nearlyfreespeech/">positive experiences on Nearlyfreespeech</a> and they will continue to host some legacy files of mine. The main reason for this switch is because <a href="/posts/2021/eleventy-webmentions/">I started using Eleventy</a>, a static site generator, to build my site. This is great, it lead to much faster load times. But it meant I had to be on my personal laptop to update the content. I couldn't use an online service to update the site, like I could previously with <a href="https://wordpress.com">Wordpress</a>. At least not without a lot of extra effort and technical skills I don't really have.   Sure I could create my content in <a href="https://github.com">GitHub</a>, but to build and publish the site I needed to run the scripts that were on my laptop.
  
---

So I started looking for alternatives and decided to finally give Netlify a go. I created a Netlify account, linked it to my GitHub repository and within 3 minutes had created and published my site on Netlify. I then switched the DNS of my domain to Netlify's and after a few hours to allow for the new nameservers to propagate my site was fully live on Netlify. Fantastic. A few more minutes later I updated a post, committed it to GitHub and it was live within seconds. Just brilliant! I'm impressed. I still don't have a CMS to manage my content, but then my site is simple and it's just me editing it, so GitHub is good enough for that. Note to self: [checkout Stackbit](https://www.stackbit.com/).
