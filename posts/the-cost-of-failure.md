---
title: The cost of failure
date: 2015-05-11
layout: layouts/post.njk
---

In UI engineering the path to an excellent product is often not clearly set. Especially if we push the boundaries of hardware across numerous devices experimentation and tweaking are an integral part of polishing the experience. Experimentation is an iterative process, a string of small failures, that eventually leads to the desired result. Minimizing the cost of these failures can materially impact the quality of the final product.

We know from the [mythical man month](http://en.wikipedia.org/wiki/The_Mythical_Man-Month) that adding more engineers to a projects doesn’t necessarily increase output and every project will want to eventually ship. This is 2015 so we ship MVPs, but we still have to ship them at some point.

My thesis is that quality/excellence/fidelity of that final product given time and resource constraints is a function of the number of iterations the team was able to make within the available time.
> # Within those constraints the remaining way to improve product excellence is to increase the iteration speed.

Lets consider the following example: The product spec calls for an animation where state A of the product morphs into state B. Cool, most talented UI engineers will be able to implement it given enough time. But will it be good? Slight variations in how the animations are performed will dramatically affect how the GPU handles the task, etc. It may need to be tested with various forms of content and one 4–5 different devices. The iteration speed determines how long it takes to tweak the animation and complete each experiment.
> # Engineers will typically spend a fixed amount of time tweaking a particular part of the UI. If they were able to do more tweaks within that fixed time the fidelity will be better.

So what is iteration speed in concrete terms? The length of the cycle of:

1. Having the idea that a change may improve fidelity.

1. Implementing that change.

1. Compiling the program.

1. Deploying it onto the target device.

1. Reinstating the state of the program to where the behavior-under-improvement is exhibited.

1. Observing/measuring whether the fidelity is improved.

1. Optionally repeat 4–6 on N devices.

Differing development environments exhibit vastly differing times for each elements of the cycle.

Steps 1, 2 and 6 are the only steps that are necessary. All other steps would ideally take 0 seconds and there are, indeed, systems that do not require these steps at all.

![Image of a horse carousel https://cdn-images-1.medium.com/max/7800/1*OfniTBae22oCGP5ZrXObrw.jpeg](https://cdn-images-1.medium.com/max/7800/1*OfniTBae22oCGP5ZrXObrw.jpeg)

The get-off-my-lawn old person in me remembers the golden days of the 90s where in VisualWorks SmallTalk one would just stop the UI, unwind to some previous state, change the running program and rerun the relevant part.

However, it isn’t the 90s and things are much worse. There are web developers who not only have to compile their program for dozens of seconds, they even have to manually invoke that compilation; there are native mobile developers who have to compile and transfer a program to the device and then have to touch their app’s icon to start it and then manually click through their app to get back to the part they were working on. And then they put another device on the USB cable and repeat.

Lets do some hypothetical calculations:

Assume it takes about 5 minutes to come up with an idea for an improvement, implement it and measure whether there was an improvement.

If the overhead (Steps 3, 4 and 5) takes 0 seconds we can make a program better 12 times per hour. What is more important because there are no context switches it is actually feasible to do so and we can take 15 minutes out of the hour for a nice coffee break.

What happens when compilation, or deployment or state recreation take 2 minutes? In theory we could still do 8 iterations per hour, but now we have those frequent 2 minute breaks. Reddit, HackerNews and Twitter will get in the way. 5 iterations are more realistic under this setting, but things get even worse if testing has to be repeated on multiple devices.

As a consequence even what may seem to be relatively short breaks can fast cut the number of iterations that can be done on a given product in half. And it just won’t be as good.

So what can be done to improve iteration speed?

* Cut human interaction out of tasks: The system should sense when a task needs to be done, not wait for user invocation.
Can eliminate or shorten steps 3 & 4.

* Cut all tasks that do not need to block iteration out of the critical path. Type checking? Its nice, but doesn’t have to block running the program.
Eliminates step 3.

* Invest in hot code replacement.
Eliminates step 3 & 4 and shortens step 5.

* Invest in time traveling debuggers.
Together with hot code replacement eliminates steps 3, 4 & 5.

* Fan out hot code replacement: Do just in time hot code replacement on N devices concurrently.

Even if a system trades off being able to do these things against a lesser maximum performance (a classic choice between lower and higher level programming constructs. E.g. late binding VS. early binding), the increased fidelity through higher iteration speed will quickly make the net performance better.
> # A productive stack wins over an unproductive stack even if the unproductive stack has better theoretical best case performance.

Obviously the above is only true within certain limits, but I feel that we as a software engineering community are underinvested in increasing development productivity. This is the one part of the equation that we can directly influence ourselves by building better tools and we should make it a priority.
