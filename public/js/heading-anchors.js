// Thank you to https://github.com/daviddarnes/heading-anchors
// Thank you to https://amberwilson.co.uk/blog/are-your-anchor-links-accessible/#what-are-anchor-links-exactly%3F

class HeadingAnchors extends HTMLElement {
	static register(tagName) {
		if ("customElements" in window) {
			customElements.define(tagName || "heading-anchors", HeadingAnchors);
		}
	}

	static defaultSelector = "h2,h3,h4";

	static featureTest() {
		return "replaceSync" in CSSStyleSheet.prototype;
	}

	static css = `
.heading-anchor {
	text-decoration: none;
}
/* For headings that already have links */
:is(h1, h2, h3, h4, h5, h6):has(a[href]:not(.heading-anchor)):is(:hover, :focus-within) .heading-anchor:after {
	opacity: 1;
}
.heading-anchor:focus:after,
.heading-anchor:hover:after {
	opacity: 1;
}
.heading-anchor:after {
	content: "#";
	content: "#" / "";
	margin-left: .25em;
	color: #aaa;
	opacity: 0;
}`;

	constructor() {
		if (!HeadingAnchors.featureTest()) {
			return;
		}

		super();

		let sheet = new CSSStyleSheet();
		sheet.replaceSync(HeadingAnchors.css);
		document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
	}

	connectedCallback() {
		if (!HeadingAnchors.featureTest()) {
			return;
		}

		this.headings.forEach((heading) => {
			if(!heading.hasAttribute("data-heading-anchors-optout")) {
				let anchor = this.getAnchorElement(heading);
				if(heading.querySelector(":scope a[href]")) {
					// Fallback if the heading already has a link
					anchor.setAttribute("aria-label", `Jump to section: ${heading.textContent}`);
					heading.appendChild(anchor);
				} else {
					// entire heading is a link
					for(let child of heading.childNodes) {
						anchor.appendChild(child);
					}
					heading.appendChild(anchor);
				}
			}
		});
	}

	getAnchorElement(heading) {
		let anchor = document.createElement("a");
		anchor.href = `#${heading.id}`;
		anchor.classList.add("heading-anchor");
		return anchor;
	}

	get headings() {
		return this.querySelectorAll(this.selector.split(",").map(entry => `${entry.trim()}[id]`));
	}

	get selector() {
		return this.getAttribute("selector") || HeadingAnchors.defaultSelector;
	}
}

HeadingAnchors.register();
