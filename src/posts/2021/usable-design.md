---
pageTitle: Usable design
date: 2021-08-05
tags: web

---
### Clean interfaces

Too much web design is focused on visual aesthetics and not on making things usable. Aesthetics has its place and not everything has to be intuitively usable. Cleanly designed web interface do look good. However, removing interaction clues in order to make something look neat and tidy is not always in the interests of the user.  Making them difficult to interact with leads to more user frustration.

Microsoft's web based [Outlook](https://outlook.com) is a good example. Don't get me wrong, I think Outlook is great. I use it every day, both at work and for my personal emails. The web version is very functional and generally well thought out in my opinion. Yet, the way the scrollbars are implemented is frustrating. Here's a screenshot of Outlook's user interface to illustrate my point:

![User interface of outlook](/assets/images/use-outlook-1.PNG)

The layout is split into four columns. The application icons on the far left, the list of folders next to them, the list of emails in the selected folder and the content of the email selected to be read in the largest column on the right hand side. All four columns has a vertical scrollbar if needed. In the image you see it on the list of emails. There is no scrollbar in the email display column itself, because it is not needed. You would see it if the email was longer. However on the first two columns the scrollbar is needed because there is more content to scroll to. However you don't see it. It only appears if you hover over those columns, in which case it looks like in this image:

![Scrollbar in column showing list of folders](/assets/images/use-outlook-2.PNG)

So what issues do I have with this?

### Inconsistency

First of all I do not see the point in hiding the scrollbars when hover is removed from the column. This is inconsistent. Some scrollbars are permanently visible. Some aren't. How do I know there are more folders in the folder list without hovering over them?

Hiding the scrollbars serves no purpose. They don't cover anything up when they do appear, so hiding them seems pointless. In addition they are so thin that even if they did cover up folder names, the amount covered would be minimal. Which leads me to the next point.

### Interaction issues

Because these scrollbars are so thin, I find them difficult use. I don't have a target area before hovering over the list of folders. So I move the pointer over the list. The scrollbar appears and I have to move the pointer back a little to get to the scrollbar in order to scroll. However sometimes I move too far and the pointer leaves the column. As it is no longer hovering over that column, the scrollbar disappears. Then I move the pointer back over folder list. It occasionally leads to the frustrating effect of me chasing the scrollbar. Why can't it just remain visible all the time?

### Old School

Interestingly this design is not repeated in Microsoft's desktop explorer:

![Windows explorer with visible scrollbars](/assets/images/use-desktop-1.PNG)

As you can see all the scrollbars are visible and they are much wider than in the web interface. Admittedly this a bit of an old school design. But it works and is much more usable than the implementation of scrollbars in the Outlook web interface.

Sometimes the old tried and tested design is better than the shiny new one.