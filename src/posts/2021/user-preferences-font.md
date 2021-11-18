---
pageTitle: Respecting the user's preferred font
date: 2021-11-10
tags: web

---
I feel designing and publishing web content should be more about how the user wishes to experience a site and less about how the designer wants to the site to be experience. The web is after all a more fluid medium than traditional print media.

Most websites, certainly those who care about accessibility and usability by now implement font sizes using relative units such as "ems" or percentages. However few respect a user's preferred font. All common browsers on all common platforms let a user define their preferred font. But almost no websites take this into account. And yet it is trivial. Simply use for your site's font:

    body { 
    	font-family: sans-serif, serif;
    }

This will always display text in the font set by the user in their browser. Of course one thing that is missing in this, is knowing whether a user has actually set a specific font or is simply using the default font of the browser. There seems to be no way of specifying something like:

    body {
    	font-family: user-font, 'Lucia Grande', Arial, sans-serif, serif;
    }

I've now adapted this website to respect this choice for the main text on this site. I've not yet done so for the more specific texts such as header, footer and navigation.  Probably I should.