---
pageTitle: Accessible hover image links
date: 2012-05-25    
tags: web
---
<p>Hover images, that is images that change when the pointer moves over them, have always been an integral part of web development. They alert the user to the fact that the image is "active". Usually this indicates it can be clicked.</p>
---

<p>Implementing a hover image is relatively straightforward. But doing so in an accessible manner which does not require the use of Javascript is more tricky. Here's a technique I've recently used, which I like for it's relative simplicity as well as being mostly accessible.</p>
<p>HTML:</p>
<pre>&lt;a class="facebook" href="http://facebook.com/" title="Facebook"&gt;
 &lt;img alt="Facebook" src="Facebook_Icon.png"&gt;
&lt;/a&gt;</pre>
<p>CSS:</p>
<pre>.social-links a.facebook {
  background:url(Facebook_Icon_On.png) no-repeat;
}

.social-links a.facebook:hover img {
  display:none;
  border: 1px solid #000;
}</pre>
<p>This technique is rather straightforward. There's an image, with meaningful alt text for accessibility, wrapped in a anchor tag. The anchor tag itself has a background image with appropriate height and width all set using CSS. The key is the :hover pseudo-class that hides the image using "display:none;". When the image is hidden, you see the background image of the anchor tag. The anchor tag itself is still clickable due to it's fixed height and width.</p>
<p>Having tested this technique in all modern mainstream browsers (ie latest versions of IE, Opera, Firefox, Chrome and Safari) it copes with the following situations better than many more complex techniques.</p>
<ul>
<li><strong>CSS <em>on</em>, Images <em>on</em></strong>: Works as you would expect</li>
<li><strong>CSS <em>off</em>, Images <em>on</em></strong>: Page lays out in basic fashion. Image hover doesn't work, but links do.</li>
<li><strong>CSS <em>on</em>, Images <em>off</em>:</strong> Images replaced by Alt text. Hover creats  a border to create active feel.</li>
<li><strong>CSS <em>off</em>, Images <em>off</em>:</strong> This would be more or less how a screen reader might see the page. The Image is replaced by it's alt text and the link thus remains meaningful.</li>
</ul>
<p>Simple, but effective.</p>
