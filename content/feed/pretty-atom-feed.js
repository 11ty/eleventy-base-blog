// Renders the Atom feed as a readable page without XSLT, see #264.
const HTML = "http://www.w3.org/1999/xhtml";
const ATOM = "http://www.w3.org/2005/Atom";

function h(name, attrs = {}, ...children) {
	let el = document.createElementNS(HTML, name);
	for(let [key, value] of Object.entries(attrs)) {
		el.setAttribute(key, value);
	}
	el.append(...children);
	return el;
}

function child(parent, name) {
	return [...parent.children].find(el => el.namespaceURI === ATOM && el.localName === name);
}

// The script runs before the entries are parsed.
document.addEventListener("DOMContentLoaded", () => {
	let feed = document.documentElement;
	let title = child(feed, "title")?.textContent || "";
	let siteUrl = [...feed.children].find(el => el.localName === "link" && !el.hasAttribute("rel"))?.getAttribute("href");

	let entries = [...feed.children].filter(el => el.localName === "entry").map(entry => {
		let updated = child(entry, "updated")?.textContent;
		return h("li", {},
			h("a", { href: child(entry, "link")?.getAttribute("href") || "" }, child(entry, "title")?.textContent || ""),
			updated ? h("small", {}, ` ${new Date(updated).toLocaleDateString()}`) : "",
		);
	});

	let html = h("html", { lang: feed.getAttribute("xml:lang") || "en" },
		h("head", {},
			h("title", {}, title),
			h("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }),
			h("style", {}, `body { font-family: system-ui, sans-serif; max-width: 40em; margin: 2em auto; padding: 0 1em; line-height: 1.5; }
.notice { background: #fffbdd; padding: .5em 1em; }`),
		),
		h("body", {},
			h("p", { class: "notice" }, h("strong", {}, "This is a web feed."), " Subscribe by copying the URL from the address bar into your newsreader. ", h("a", { href: "https://aboutfeeds.com" }, "About Feeds")),
			h("h1", {}, title),
			h("p", {}, "This preview only shows titles, but the actual feed contains the full content."),
			siteUrl ? h("p", {}, h("a", { href: siteUrl }, "Visit Website →")) : "",
			h("h2", {}, "Recent Items"),
			h("ul", {}, ...entries),
		),
	);

	document.replaceChild(html, feed);
});
