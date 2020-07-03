---
title: Developer Experience VS User Experience?
date: 2015-05-11
layout: layouts/post.njk
---

A few days ago Jake Archibald [ruffled some feathers](https://twitter.com/jaffathecake/status/814751108975489024) with this observation:

> It seems the web community has decided that developer experience dwarfs user experience, and I'm not sure what to do about that…

This strongly reminded me of the first and most important item in [AMP’s design principles](https://github.com/ampproject/amphtml/blob/master/DESIGN_PRINCIPLES.md#user-experience--developer-experience--ease-of-implementation):
> # User Experience > Developer Experience > Ease of Implementation

So, given that my project is setting very similar guidelines compared to what Jake implied in his tweet, I thought it’d be useful to explain the thinking behind it.

**When creating systems for user facing software, then user experience is more important than developer experience.** We add a third item for AMP: “Ease of implementation” is less important then developer experience. The *implementation* here refers to the creator of the underlying system and framework (in our case AMP). The idea is that the framework creator should always strive to optimize developer experience, even if they have to work harder for it.

Of course, there is **a lot of nuance** to the statement that user experience is more important than developer experience. The most important nuance is that **in many, many cases they do not stand in conflict at all**. Furthermore, **in a large number of cases improving developer experience is the best way to improve user experience, **so rather than being in conflict these goals are often in congruence. My favorite example is to improve developer experience by speeding up the iteration cycle (e.g. by improving build time or providing hot reloading): This is great for developers and it allows them to spend more time improving UX in any given day, thus leading to better results.

Similarly, there are many cases where improved developer experience might just enable a piece of software being build in the first place. The UX might not be perfect, but at least the thing exists. That should typically be a net win :)

Having said all this, there are trade offs where improved developer experience, just leads to bad UX. My favorite example is

`<img src=”./image.jpg”>`

which has much better developer experience, than

`<img src=”./image.jpg” width=400 height=300>`

The first image tag is missing the dimensions. (Ignoring the complexities of responsive sizing that do not impact the point) This is great for the developer. They literally do not need to write the piece of software that determines the dimensions, which saves a little bit of time. Now what happens is that the browser will assume: “Ah, no dimensions, the image is probably 0 pixels big”. Then it will download the image and realize “Ah, it is actually 400x300, lets redraw the page”. This creates a lot of jank for the user every single time a page is looked at.

A system that favors user experience over developer experience would always make sure that the image dimensions are known when the page is downloaded. Now, of course, one could improve developer experience again, by somehow making it very easy (or automatic) to provide the image dimensions. Another case, where one can have the best of both worlds, but getting good UX does require going the extra mile during framework development.

Server side rendering, lazy loading of JavaScript bundles and splitting up CSS files are all optimizations of user experience that do incur a cost on developers. Again, a given framework can chose to make them as automatic as possible, but such abstractions tend to be at least a little bit leaky and add visible complexity.

My post about [tradeoffs in server and client side rendering](https://medium.com/google-developers/tradeoffs-in-server-side-and-client-side-rendering-14dad8d4ff8b#.52um3u2br) tries to dive into that topic in particular. The React style hydration of a server side render right upon initial load is a user experience and developer experience trade off: It is better than not doing server side rendering at all, but it is strictly worse than lazily initializing the JS on the client (because it does an initial eager diff and installs event handlers). User experience may not be ideal, but going the extra mile may not be worth it or delay shipment indefinitely for a large class of applications (maybe that class includes everything except google.com, twitter.com, and facebook.com).

Having said all this, the premise that user experience is more important than developer experience is still an important thing to keep in mind as a framework developer. We always need to ask ourselves:

* What is the right thing to do for user experience?

* How can I provide the best possible DX given my UX goals?

* What is the smallest possible UX tradeoff given my DX goals?

* How can I make tradeoffs that improve **DX while sacrificing UX, but only in development mode?**

* How can I **document things for developers**, so they can make informed tradeoffs between UX and DX?
