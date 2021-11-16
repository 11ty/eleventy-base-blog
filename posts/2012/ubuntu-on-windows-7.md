---
pageTitle: Using Google to install Ubuntu on a separate hard disk without touching Windows 7
date: 2012-02-29    
tags: web
---
<p>As we develop more and more Wordpress sites at Minervation, Linux is becoming an operating system I can no longer ignore. Sure Wordpress runs just fine on Windows however most of the information written about Wordpress pertains to Linux and Apache. It also makes little sense to pay licence fees in order to use Open Source Software. So I decided to install Ubuntu Linux on my PC over the weekend.</p>
---

<p>What has this got to do with Google searching? Well my requirements for installing Ubuntu were quite specific but not unusual (or at least I thought so): Ubuntu needs to be on a separate hard disk and not touch my Windows 7 hard disk in anyway, <em>whatsoever</em>. My entire work life is on my Windows hard disk so I couldn't risk it being corrupted in anyway. I have used Ubuntu using their excellent Wubi installer as well using Virtual Machines, but that was not what I wanted. My aim was a clean install as the main OS on a separate hard disk on my PC with a bootloader to choose which OS to boot into.</p>
<p>So I downloaded the iso file for my system from the Ubuntu website and burnt it to a CD. I then started to search the web for instructions on how to achieve what I wanted. My main premise with anything technical is always that someone has:</p>
<p>a) already solved this problem<br />b) written about it in on the web</p>
<p>I am not so foolish to believe that I am the first one to come across my specific problem.</p>
<p>So I started searching the web with searches such as:</p>
<blockquote>
<p>install ubuntu windows 7 on separate hard disk</p>
</blockquote>
<p>This led me to lots of useful links about installing Ubuntu, but interestingly most of them would mess with my Windows 7 disk in order give me the option to choose Ubuntu on starting the PC. I really didn't want to touch that hard disk. After reading through lots and lots info I came across this link:</p>
<p><a title="Installing Ubuntu and Windows 7 on seperate drives" href="http://forums.techarena.in/operating-systems/1258191.htm" target="_blank" rel="noopener">http://forums.techarena.in/operating-systems/1258191.htm</a></p>
<p>Where the <a href="http://forums.techarena.in/operating-systems/1258191.htm#post4650143" target="_blank" rel="noopener">final comment by Rudra.J</a> suggested exactly what I was looking for:</p>
<blockquote>
<p>...just change the disk boot priority and make the ubuntu as the first disk. Now boot into ubuntu and run the following command</p>
<p>... [example code to edit GRUB]...</p>
<p>I am considering there are two hard disk and on the first one, you have installed Ubuntu and Windows 7 on the second hard disk after changing the disk priority. Ubuntu is the first disk here and Windows 7 is the second disk so for ubuntu the disk is hd0,0 and for Windows 7 it is hd1,0. This above will let to add a boot entry in Ubuntu's boot loader [grub] without making any changes to any disk's MBR. This means even if there occurs any problem in any of one disk, the other OS will remain intact.</p>
</blockquote>
<p>All the other suggestions were to have the Windows disk with highest boot priority, but this would involve messing with the MBR on the Windows disk. This I really did not want.</p>
<p>So it was time to install Ubuntu. Many posts also suggested disconnecting the Windows disk whilst installing Ubuntu and I decided this was prudent. So I disconnected that disk, placed my Ubuntu CD into the cd drive and rebooted. The installation went smoothly and took about 15 minutes.</p>
<p>I then reconnected my Windows 7 drive and set it to priority one to check that Windows was still working. It was. Reboot again. Set Ubuntu drive to priority one and log into Ubuntu. Obviously I didn't want to switch drive priorities in the BIOS everytime I changed OS. So I ran the example code in the above comment and rebooted. And landed straight back in Ubuntu. I was given no choice to switch to Windows. Not ideal.</p>
<p>I then noted that the comment was from a couple of years back and might be outdated, so I started searching for GRUB and Ubuntu</p>
<blockquote>
<p>ubuntu grub</p>
</blockquote>
<p>After reading through a bunch of info on this it became clear that there is now a GRUB2 and that this the default in Ubuntu for quite some time:</p>
<p><a title="GRUB2 - Ubuntu" href="https://help.ubuntu.com/community/Grub2" target="_blank" rel="noopener">https://help.ubuntu.com/community/Grub2</a></p>
<p>So I refined my search to:</p>
<blockquote>
<p>ubuntu grub2 Windows 7</p>
</blockquote>
<p>This had lots of useful info and led me to this thread:</p>
<p><a href="http://ubuntuforums.org/showthread.php?t=1264354" target="_blank" rel="noopener">Grub2 won't load Windows 7 (which is on second hard drive)</a></p>
<p>Which was exactly my situation. Lots of info in here about editing files and whatnot, but hidden away amongst them was this <a href="http://ubuntuforums.org/showthread.php?t=1264354#post8768311" target="_blank" rel="noopener">gem of a suggestion by Mark Phelps</a></p>
<blockquote>
<p>Did you try just letting GRUB2 find Win7 and add its own entries?</p>
<p>I have multiple drives, with Win7 NOT on the first drive, I boot from one of my Ubuntu drives -- and GRUB2 found the Win7 OS just fine when I ran update-grub.</p>
</blockquote>
<p>So back in an Ubuntu terminal I ran:</p>
<blockquote>
<p>sudo update-grub</p>
</blockquote>
<p>And, hey presto, I now have Windows 7 as an option when my PC boots up and I never touched the Windows 7 hard disk. Mission accomplished.</p>
<p>And a big thanks to all the bloggers, forum frequenters, documentation writers and of course Google for helping me accomplishing my aim.</p>