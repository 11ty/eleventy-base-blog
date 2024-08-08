// Thank you to https://github.com/daviddarnes/heading-anchors

class HeadingAnchors extends HTMLElement {
	static register(tagName) {
		if ("customElements" in window) {
			customElements.define(tagName || "heading-anchors", HeadingAnchors);
		}
	}

	connectedCallback() {
		this.headings.forEach((heading) => {
			if(!heading.querySelector("a.direct-link") || heading.hasAttribute("data-heading-anchors-optout")) {
				heading.append(this.anchor(heading));
				heading.setAttribute("tabindex", "-1");
			}
		});
	}

	anchor(heading) {
		// TODO this would be good use case for shadow dom
		let anchor = document.createElement("a");
		anchor.setAttribute("data-pagefind-ignore", "");
		anchor.href = `#${heading.id}`;
		anchor.classList.add("heading-anchor");
		anchor.innerHTML = `<span class="visually-hidden">Jump to heading</span><span aria-hidden="true">#</span>`;
		return anchor;
	}

	get headings() {
		return this.querySelectorAll(this.selector.split(",").map(entry => `${entry.trim()}[id]`));
	}

	get selector() {
		return this.getAttribute("selector") || "h1,h2,h3,h4"
	}
}

HeadingAnchors.register();
