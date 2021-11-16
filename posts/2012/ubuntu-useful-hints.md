---
pageTitle: Ubuntu useful hints
date: 2012-03-09  
tags: web
---
<p>In this post I will be maintaing a list of useful hints for future reference.</p>
<p><strong>Mouse speed</strong></p>
<p>I find the default mouse speed much too fast. And even after reducing both speed and acceleration to a minimum it is still too fast. Some googling through up this handy hint:</p>
<p><a href="http://patrickmylund.com/blog/lowering-gaming-mouse-sensitivity-in-ubuntu-9-10/">http://patrickmylund.com/blog/lowering-gaming-mouse-sensitivity-in-ubuntu-9-10/</a></p>
<p>So I ran these commands:<code></code></p>
<p><code>xinput --list --short<br />
xinput --set-prop "Device name or ID" "Device Accel Constant Deceleration" 2<br />
</code></p>
---

<p><strong>View hidden files in browser:</strong> CTRL+H</p>
<p><strong>List only directories:</strong> ls -l | grep ^d</p>
<p>This, if I understand it properly, takes a list in "long" format, pipes it through grep and includes only lines starting with "d". d being the directory indicator.</p>
<p><strong>Windows Manager</strong></p>
<p>To get the Compiz working in Ubuntu, install CompizConfig Settings Manager: sudo apt-get install compizconfig-settings-manager</p>
<p>Moving window to next screen (on dual monitor): CompizConfig Settings Manager -&gt; Window Management -&gt; Put -&gt; Bindings (tab) -&gt; Put To Next Output (keyboard shortcut)</p>
<p><strong>Handy shortcuts</strong></p>
<p>http://www.techdrivein.com/2011/04/31-useful-ubuntu-1104-unity.html</p>
<p><strong>Default programs/extensions</strong></p>
<p>Useful info here: http://askubuntu.com/questions/16580/where-are-file-associations-stored</p>
<p>Associations are located here: ~/.local/share/applications/mimeapps.list<br /><strong>Mounting Windows drive on startup</strong></p>
<p>This is done using fstab, see here: <a href="http://askubuntu.com/questions/46588/how-to-automount-ntfs-partitions">http://askubuntu.com/questions/46588/how-to-automount-ntfs-partitions</a></p>
<p>Also had to prevent auto-mounting by Nautilus: <a href="http://askubuntu.com/questions/89244/how-to-disable-automount-in-nautiluss-preferences">http://askubuntu.com/questions/89244/how-to-disable-automount-in-nautiluss-preferences</a></p>