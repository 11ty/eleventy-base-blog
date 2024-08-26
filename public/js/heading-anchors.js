// Thank you to https://github.com/daviddarnes/heading-anchors
// Thank you to https://amberwilson.co.uk/blog/are-your-anchor-links-accessible/

class HeadingAnchors extends HTMLElement {
	static register(tagName) {
		if ("customElements" in window) {
			customElements.define(tagName || "heading-anchors", HeadingAnchors);
		}
	}

	static attributes = {
		exclude: "data-heading-anchors-exclude"
	}

	static classes = {
		anchor: "heading-a",
		heading: "heading-a-h", // only used for nested method
	}

	static defaultSelector = "h2,h3,h4";

	static featureTest() {
		return ;
	}

	static css = `
.${HeadingAnchors.classes.anchor} {
	position: absolute;
	text-decoration: none;
	font-weight: 400;
	opacity: 0;
	transition: opacity .15s;
	padding-left: .25em;
	padding-right: .25em;
}
/* nested */
:is(h1,h2,h3,h4,h5,h6):is(:focus-within, :hover) .${HeadingAnchors.classes.anchor},
/* sibling */
:is(h1,h2,h3,h4,h5,h6) + .${HeadingAnchors.classes.anchor}:is(:focus-within, :hover),
:is(h1,h2,h3,h4,h5,h6):is(:focus-within, :hover) + .${HeadingAnchors.classes.anchor} {
	opacity: 1;
}
@supports not (anchor-name: none) {
	.${HeadingAnchors.classes.heading} {
		position: relative;
	}
	.${HeadingAnchors.classes.anchor} {
		left: 0;
		transform: translateX(-100%);
	}
}
@supports (anchor-name: none) {
	.${HeadingAnchors.classes.anchor} {
		right: anchor(left);
		top: anchor(top);
	}
}`;

	get supportsTest() {
		return "replaceSync" in CSSStyleSheet.prototype;
	}

	get supportsAnchorPosition() {
		return CSS.supports("anchor-name: none");
	}

	constructor() {
		super();

		if(!this.supportsTest) {
			return;
		}

		let sheet = new CSSStyleSheet();
		sheet.replaceSync(HeadingAnchors.css);
		document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
	}

	connectedCallback() {
		if (!this.supportsTest) {
			return;
		}

		this.headings.forEach((heading, index) => {
			if(!heading.hasAttribute(HeadingAnchors.attributes.exclude)) {
				let anchor = this.getAnchorElement(heading);

				// Prefers anchor position approach for better accessibility
				// https://amberwilson.co.uk/blog/are-your-anchor-links-accessible/
				if(this.supportsAnchorPosition) {
					let anchorName = `--ha_${index}`;
					heading.style.anchorName = anchorName;
					anchor.style.positionAnchor = anchorName;

					let fontSize = parseInt(getComputedStyle(heading).getPropertyValue("font-size"), 10);
					anchor.style.fontSize = `${fontSize / 16}em`;

					heading.after(anchor);
				} else {
					heading.classList.add(HeadingAnchors.classes.heading);
					heading.appendChild(anchor);
				}
			}
		});
	}

	getAnchorElement(heading) {
		let anchor = document.createElement("a");
		anchor.href = `#${heading.id}`;
		anchor.classList.add(HeadingAnchors.classes.anchor);
		if(this.supportsAnchorPosition) {
			anchor.innerHTML = `<span class="visually-hidden">Jump to section titled: ${heading.textContent}</span><span aria-hidden="true">#</span>`;
		} else {
			anchor.innerHTML = `<span aria-hidden="true">#</span>`;
		}

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
