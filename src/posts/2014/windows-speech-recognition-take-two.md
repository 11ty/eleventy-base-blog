---
pageTitle: Windows Speech Recognition. Take two.
date: 2014-06-15
tags: web
---
<p>In my <a title="Link rot" href="/posts/2014/link-rot/">previous post</a> about link rot I lamented the fact that a post I made on a forum was no longer helpful as I only provided the link to the solution, but not the solution itself. That link no longer works. I went back and added a new forum post with the content to help a later user with the same problem.</p>
---

<p>I decided I should also post the full solution on my own blog in case the forum also one day no longer works (which is unlikely as it is <a href="http://www.overclock.net/">Overclockers</a>), but who knows.</p>
<p>So, here is the solution to the issue of Windows Speech Recognition and Firefox not playing well together and making Firefox very slow. It was originally posted on <a href="http://speechcomputing.com/node/2720">http://speechcomputing.com</a>, but now only available on the <a href="https://web.archive.org/web/20131010082540/http://speechcomputing.com/node/2720">Internet Аrchive</a>.</p>

<p>I've had performance problems with Firefox and Thunderbird with Windows Speech for a while. Although both applications have some accessibility support---menus, dictating title words switches to that tab in FF, etc.---it seems to be rather hit or miss. This isn't a particularly big deal since both applications have decent keyboard support built in and FF has the mouseless browsing extension, making it pretty easy to automate these applications using Your Favorite Macro Package.</p>
<p>The performance was killing me though: FF started to bog down with only a few tabs open, and the name "Thunderbird" seemed like a cruel joke given how badly the application crawled. Unfortunately, the performance also disrupted macro behavior: the speech engine was constantly spinning, so macros would become erratic, sometimes even after I switched applications.</p>
<p>I'd guessed that the Active Accessibility was the problem: perhaps Firefox is exposing the text of *all* the hyperlinks in all open documents, not just the ones I can see right now. Whatever the cause, at some point the app would hit some sort of internal WSR threshold, after which performance would rapidly fall apart.</p>
<p>Nosing around in the registry this afternoon, I stumbled across the following key:</p>
<p>HKEY_CURRENT_USER\Software\Microsoft\Speech\Preferences\AppCompatDisableMSAA</p>
<p>Hello! From the existing entries, this key appears to accept string values indicating applications that should have Active Accessibility disabled. I added two new string values ("firefox.exe" and "thunderbird.exe"), restarted everything, and BAM! Looks like my computer was built this century after all!</p>
<p>Of course, disabling Active Accessibility disables the "built in" voice support for menus, hyperlinks, tabs, folders, etc., but given the performance difference I think that's a tradeoff I can live with.</p>
<p>I'm curious: have others had performance problems with these applications? Has anyone else tried this solution, and what was your experience with it?</p>
<p>Here are a couple of related posts:</p>
<p><a href="http://www.oldskooldeveloper.com/msgs/4/20018.aspx">http://www.oldskooldeveloper.com/msgs/4/20018.aspx</a><br /><a href="http://social.msdn.microsoft.com/Forums/en-US/wind">http://social.msdn.microsoft.com/Forums/en-US/wind</a></p>
<p>This was the only information I could find; doesn't appear to be a widely discussed capability.</p>