---
title: 10x engineer 10% of the time
date: 2015-02-05
layout: layouts/post.njk
---

I’ve lately been thinking about what patterns could explain perceived differences in individual productivity in software engineering. I’m using the word perceived because productivity is really a complex topic and I can think of few ways how to effectively measure it within the complex social structure of a larger engineering team.

So, this is the list of things I came up with:
> # Be really good at debugging

Programming languages, tools and frameworks come and go, but having a great debugging instinct and skill set will pay back for the rest of one’s career. Debugging can and must be practiced. I personally think that for someone new to software engineering who asks “What should I focus on in my career” debugging should be the #1 answer. It is the one thing that will always be there in our jobs.
> # Never be blocked

Manage your work load and make sure that whenever a given task can not be continued there is something else waiting to be done already.

During the typical software engineering job there are millions of reasons why one may not be able to proceed working on the current task: waiting on a designer, product manager, another team making a release, etc.. The ability to embrace this situation and switch to a different task while the other is waiting is I think the most hated, stress producing and still helpful skill for using a larger percentage of the time available for actual programming. The key is finding the sweet spot between reduced productivity from task switching and increased productivity from larger utilization. Everyone will have a different sweet spot but I think that professionally embracing the fact that task switches are part of everyday work allows us to get better at it over time.
> # Know when to do redundant work or build a tool

In software engineering we often face the decision whether to automate a piece of work or just do it manually. Some examples:

* Create a scaffolding script or write the boilerplate by hand?

* Improve the error message after debugging found what was wrong, so the problem is obvious next time it happens, or let the next person search for it again?

* Set up hotswapping or restart the server all the time?

Knowing when to do one or the other is in my experience one of the greatest signals of seniority in software engineering.

In my experience most engineers tend to overestimate the amount of work to build the tool and thus choose to do manual labor when they could have saved hours, days or weeks of engineering time with a tool that takes 8 hours to build. But there is certainly also the other extreme: Automating everything while creating a maintenance burden for tools that almost never run.

Having good intuition as to what way to go can be learned. I know I was certainly in the “too much manual work” camp, but I learned to correct myself for that, and it seems from hindsight I’ve been able to chose correctly more often.
> # Be really good at reading code

It could be argued that the reading code is more important than writing code; it gives perspective and insights into our fellow engineer’s brilliant minds but the truly most important reason that reading code is so important: documentation is bad and always will be bad. So making oneself independent of docs as much as possible is super important for getting things done. Not enough is being talked about good code reading techniques: I personally always try to empathize with the authors based on the code I’m seeing and try to get a feel for how they write software, so I can more quickly start to make correct assumptions from scanning other code in the same project.

Programming is often seen as this magical thing where some people are just better than others by talent or whatever; instead it is a craft, a craft that one can get better at. Getting better takes practice and with limited time practice should focus on the most important aspects of the craft. This posts focuses on the workflow side of things — there are obviously many more important fields like coding itself and software design. I’m very interested in feedback and maybe I’ll eventually get to talk about the other topics in another posts.
