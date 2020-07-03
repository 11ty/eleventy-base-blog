---
title: Tradeoffs in server side and client side rendering
date: 2015-01-15
layout: layouts/post.njk
---

For a long time there has been a debate in web development as to whether web apps and sites should be rendered on the server or the client — or, of course, both.

With a [recent post by PPK](http://www.quirksmode.org/blog/archives/2015/01/angular_and_tem.html) the debate flamed up again and one thing that struck me as particularly unhelpful was the argument that where something is rendered would be automatically determine whether a given framework is (one dimensionally) good or bad. In my opinion such an simplistic view on things hides the real underlying tradeoffs that should drive decisions.

For some perspective: My day job is building web frameworks for Google. The one I’m designing is from the ground up build to support server side rendering very well (it isn’t open source mostly because I felt Google had enough open source web frameworks already and I didn’t want to make the choice even harder, but I also never want to say never). So, it may seem that I’d be somewhat “partisan” with this respect, but the opposite of true. My framework comes with a disclaimer saying that it is particularly designed for very large consumer-facing web applications. Anything that doesn’t fit that description might still be happy, but there will be tradeoffs made that make their life more difficult than otherwise necessary.

First I’d like to establish that server side rendering is hard beyond the pure ability to render on the server. Assuming you are building a complex app that wants to render initial responses on the server and then update subsequent state using XHR, there are several challenges that a good server side rendering solution needs to overcome and complexity that is added in any case:

* Client side decoration. It is great that you can render a chunk of HTML on the server, but you also need to do things like registering events handlers on the client. Many modern frameworks do that during rendering. One approach is to just immediately after load do a client side render using the same data that was used for server side rendering. React makes this quite nice. But this now means that loading the code that is necessary to make the page interactive includes the code that is necessary for client side rendering (read your templates!) and with that a major benefit of server side rendering is gone.

* I would assume that your templating language (or whatever you use to eventually have a DOM) runs equally well on the client and the server. This isn’t everything, of course: You need to duplicate the data fetching logic and other code. Now one could argue that with e.g. Node.js you could reuse the code but in reality the difference in code you write when your database is 10ms away VS. 100–2000+ms is so big that unless you have a very big abstraction layer there will be significant duplication.

* Both render paths need to be tested and integration tested.

* On a client side render you always know how wide or high the screen is. For very high fidelity sites you at some point will want to make a rendering decision based on something that you cannot express in CSS. There are work arounds for this that still work with server rendering but they will require major discipline by engineers to walk on the thin path of only using information available on the server during rendering even if rendering happens on the client.

* For very high fidelity you may need to sometimes fall back from server side rendering to client side rendering: That is because on the client you can retry and give the user some feedback when a backend is temporarily unavailable while on the server you’d need to show an error page.

* The approach to render everything on the server, even incremental updates to the page is very dangerous and will be make you unhappy, so you need to plan with being able to server and client side render everything. E.g. Rails TurboLinks and I hear Twitter.com uses a similar approach where server side rendered pages are incrementally merged into a running web app: This means that your 5 days old JS may need to be able to handle HTML rendered today. This type of forward and backward compatibility will eventually (or rather really soon) go wrong.

I could go on, but the gist is: server side rendering comes at complexity cost because while all of the issues above can be eliminated the solutions will add very significant complexity to your project.

So why would you do server rendering:

* Some people say that search engines still like it better.

* Or that it is the right thing to do because web.

* You might need to print out some OGP, Twitter Card and Schema.org markup anyway, so some of the extra complexity is not optional.

* It is faster. But only sometimes ([Recent data by Brett Slatkin](http://www.onebigfluke.com/2015/01/experimentally-verified-why-client-side.html)). Yes, you can do really well with client side rendering but the reality is that due to high latency between web client and server it is extremely hard to keep the critical path so ideal that you have a fighting chance of staying competitive with server rendering. I’m not saying it can’t be done, but I’d argue that with a team of 10 people and a year of frequent feature additions the server rendered app will stay significantly faster than the same app rendered only on the client.

Looking at the benefits of server rendering there are entire classes of apps that don’t benefit from it at all:

* Your intranet ERP, HR, Financial, blah software will not want Schema.org markup. In reality most software that is being written falls into this category.

* Slightly hipper things like bug tracking, todo management, or whatever every other startup is building really falls in the same category.

* Google Inbox renders the list of emails on the server when you first go to it. That is kind of nice compared to how GMail loads, but amortized over an entire day the benefit is really marginal.

* The more general case is almost all “Information and Business Systems” : If the typical user loads it at most once a day and then uses it for hours, initial load performance will not be the most important thing.

* All native apps on your phone and tablet are client side rendered. Seems to be alright.

The most obvious class of apps where server side rendering would have major benefits are content publishing sites like the New York Times or, you know, Medium as well as other user generated content sites that rely on referral traffic for perma link pages (Think Instagram, Youtube, Twitter, etc). As one of these the amount of engineering I’d be willing to take on to make my pages just a bit faster, friendlier to BingBot and easier shareable on other social networks may be pretty high. That it may not be high enough can be seen on Instagram which is not server rendered (Update 2016: It is now server rendered using the fastboot pattern. Faster but requires a lot of CPU per page load); I’d not be suprised if that changes in the future, but it seems for them shipping was more important than ultra high fidelity.

I’m excited that [Ember.js is adding server rendering](http://emberjs.com/blog/2014/12/22/inside-fastboot-the-road-to-server-side-rendering.html). I’m sure they’ll do a great job hiding the complexity, but this decision will still impact their project in the long term:

* Some stuff just won’t work on the server. That has to be documented somewhere. People have to read those docs.

* If the above isn’t true, some stuff just will no longer be possible at all.

* Future and present features may need to be slightly tweaked to support server rendering thus getting an ever so slightly worse API than would be possible for client rendering only.

In the more general case there are dozens of tradeoff spaces in which frameworks can make decisions as to what they want to optimize for. Some frameworks have data binding which is awesome if your app has lots of forms and getting shit done is super important and more important than making UX absolutely perfect— in that case adding each event handler one-by-one may not be cool — on the other hand if your job is to build the Facebook image upload dialog you may have a UX team and 2 engineers twiddling every last aspect for multiple months. These are very different types of software and even though both may be rendered from HTML, I’d use a very different underlying system to build them.

In conclusion: Server rendering is great, use it where applicable but be conscious about the hit in productivity due to extra complexity and decide whether it makes sense for your app.
