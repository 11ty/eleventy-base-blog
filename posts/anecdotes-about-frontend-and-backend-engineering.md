---
title: Anecdotes about frontend and backend engineering
date: 2015-04-06
layout: layouts/post.njk
---

This is the story about how I became what some people would call a frontend engineer and an exploration into what that even means.
> # I’m a frontend engineer because I was really mad and really full of myself.

This was October 2008 and I just joined a new company and was leading a team of 11 or so engineers in a company of roughly 200.

I was also really excited about this new company but then I discovered the thing that made me really mad:
> # *Almost all the experienced, senior and well-respected engineers called themselves “backend developers” and refused to do client side work and so the client side was left to the inexperienced, junior and not as well-respected engineers (with a few exceptions, of course).*

Me being the new manager for the team I decided to do some pair programming with each person on the team to kinda get a feel for what their work was like. When I eventually got to work with the first dev doing client side work I went completely What The Fuck?!?! Their work flow for JS and CSS was to make the changes and then click the deploy button in Eclipse, which would then

* Start up ant

* Cleanly shutdown tomcat

* Recompile the Java project to include the updated files as a resource

* Startup tomcat

Overall a cool few minutes would pass by only to see a new background color.

So, I was yelling *“What The Fuck?!?*” or probably something more along the lines *“How do you put up with this? This is completely unacceptable! We should stop doing anything else and make this better first”.*

Luckily it turned out the person responsible for the Java build process was sitting right next to us. He was like: *“Wait, go to Eclipse and from the build menu select the ‘Deploy resources’ item. Does the job and only takes 1–2 seconds. I made this because I was annoyed when I needed to make a JS change, but I guess I never really told anyone else.”*

There were 2 major fails here:

1. The client side dev didn’t go on strike the second they realized there was no reload-to-refresh in the system they were working on.

1. While the “backend dev” realized there was a problem, they didn’t actually communicate this to the “frontend dev” sitting literally a chair to the right.

The reality was that those 2 people were sitting on the same desk but they had essentially never talked to each other nor were they aware of each other’s problems.

This was just one of several similar experiences and so I was really mad: The work product was not good and it seemed so obvious how to fix it. We were building consumer facing ecommerce web apps and I was feeling like we weren’t able to deliver the type of experience that the consumers deserved. While there are definitely cases where backend work leads to hard-to-copy differentiating features, this is not what happens in many areas. Backend systems are often commodities (vast majority of ecommerce sites work this way), and real differentiation is achieved through excellent user experience.

Now we come to the part where I was full of myself. I was thinking: *“While all the senior people do backend work, I’m like the best senior engineer and from now on I am going to be a frontend engineer”.*

So, I did a presentation at the next engineering all hands meeting talking about the anecdote above and how that is unacceptable and: *“If you want to join the new cool kids, better do work on the client. We need the best of you all doing work closest to our users.”*

Needless to say that actually worked. While there was certainly larger changes at play at the company that shifted the perception and role of the non-engineering work in UX, etc. as well, the baseline quality of the work product the entire company delivered has risen very significantly since.
> # If your engineering organization does not value and invest in user facing engineering your product will be replaced by one that does.

I just made up the term “user facing engineering”; I’m not personally a fan of using the word frontend as a category of engineering. I now work at Google where like 98% of engineers build [bigtable](http://en.wikipedia.org/wiki/BigTable) frontends or frontends to those frontends and bigtable itself is basically just a physical storage frontend. The term is relative and thus meaningless without context. The Chrome browser has a backend team: it implements the actual HTML rendering on the client.

On the other hand “backend engineer” as typically used is also hard to define. In my cynical mind it means: ”spends most of their time with data migrations from the legacy system to the future legacy system.”

So, should everyone be a *“full stack engineer”*? The answer is a clear **No**. What is important is that skills are equally distributed across disciplines and that communication across engineers on different layers of the stack happens regularly. If you talk to a colleague on a different layer all the time, eventually you will know enough about that layer to be a little more “full stack” and you’ll be able to design systems that impact or span multiple layers of the stack. To me that is one of the most important aspects of “seniority”.

But you will still be an expert for probably just one of the layers and that is completely fine. Each layer of software engineering is deep enough to spend many many years in perfecting its craft and really hard problems require specialists.

Coming back to the “frontend” or the “client side” or the “user facing engineering”: As the medium “computer” matures, the discipline of engineering that deals with computer user interfaces has become so “deep” that I would not want to leave it to my least experienced engineers. We need people who are really good at applied matrix math, deeply understand how GPUs and networks work, can design multi-million-lines-of-code systems, understand accessibility requirements and maybe even have a sense for design aesthetics (I so wish I would fall into that latter category). To me all of these seem sufficiently hard and interesting that I dedicated my career to getting better at them and maybe eventually actually be a senior engineer ☺
