// Generate a random user ID if not already stored
function getUserId() {
	return (
		localStorage.getItem("userId") ||
		localStorage.setItem(
			"userId",
			"user_" + Math.random().toString(36).slice(2, 11),
		)
	);
}

function sendMessageToWorker(message) {
	const baseUrl =
		window.location.hostname === "localhost" ||
		window.location.hostname === "127.0.0.1"
			? "http://localhost:8090"
			: "";
	const isDarkMode =
		document.documentElement.getAttribute("data-theme") === "dark";
	const animalParam = isDarkMode ? "frog" : "chicken";

	updateNavPhrase(isDarkMode ? "Ribbit" : "Cluck", true);

	// Get the body content
	const bodyContent = document.body.innerText;

	// Prepare the message with the body content
	const fullMessage = `Current page content:\n${bodyContent}\n\nUser message: ${message}`;

	fetch(
		`${baseUrl}/ai?message=${encodeURIComponent(fullMessage)}&animal=${animalParam}&userId=${getUserId()}`,
	)
		.then((response) => {
			if (!response.ok)
				throw new Error(`HTTP error! status: ${response.status}`);
			return response.body.getReader();
		})
		.then((reader) => {
			let accumulatedResponse = "";

			function readStream() {
				let buffer = "";
				reader.read().then(function processText({ done, value }) {
					if (done) {
						updateNavPhrase(accumulatedResponse, false);
						return;
					}

					buffer += new TextDecoder().decode(value);
					let newlineIndex;
					while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
						const line = buffer.slice(0, newlineIndex);
						buffer = buffer.slice(newlineIndex + 1);

						if (line.startsWith("data: ")) {
							try {
								const jsonStr = line.slice(5).trim();
								if (jsonStr === "[DONE]") {
									updateNavPhrase(accumulatedResponse, false);
									return;
								}
								const data = JSON.parse(jsonStr);
								if (data.response) {
									accumulatedResponse += data.response;
									updateNavPhrase(accumulatedResponse, false);
								}
							} catch (error) {
								buffer = line + "\n" + buffer;
								break;
							}
						}
					}

					return reader.read().then(processText);
				});
			}

			readStream();
		})
		.catch((error) => {
			console.error("Fetch error:", error);
			updateNavPhrase("Sorry, something went wrong.");
		});
}

function updateNavPhrase(text, isWaiting = false) {
	const navPhrase = document.getElementById("navPhrase");
	navPhrase.textContent = text;
	navPhrase.classList.toggle("waiting", isWaiting);
	navPhrase.classList.toggle("clickable", !isWaiting && text.length > 0);
}

document.addEventListener("DOMContentLoaded", function () {
	const chatTrigger = document.getElementById("chat-toggle");
	const talkBubble = document.querySelector(".nav-bubble");
	const mainContent = document.querySelector("main");
	const navPhrase = document.getElementById("navPhrase");
	const chatReset = document.getElementById("chat-reset");
	let originalContent = navPhrase.innerHTML;

	function resetChatInterface() {
		navPhrase.innerHTML = originalContent;
		talkBubble.classList.remove("chat-active");
		mainContent.classList.remove("chat-active");
	}

	chatReset.addEventListener("click", resetChatInterface);

	function activateChatInterface() {
		navPhrase.innerHTML = `
		<form id="chat-form">
		  <input type="text" id="user-input" placeholder="Search... or say hi?">
		  <button type="submit" style="display:none;">Send</button>
		</form>
		<div id="search-results"></div>
	  `;
		document.getElementById("user-input").focus();

		const searchResults = document.getElementById("search-results");
		let pagefind;

		document
			.getElementById("user-input")
			.addEventListener("input", async function () {
				if (!pagefind) {
					pagefind = await import("/pagefind/pagefind.js");
					await pagefind.options({
						element: "#search-results",
						excerptLength: 15,
						highlightParam: "highlight",
					});
					await pagefind.init();
				}

				const query = this.value.trim();
				if (query.length > 2) {
					const search = await pagefind.search(query);
					const results = await Promise.all(
						search.results.map((r) => r.data()),
					);

					searchResults.innerHTML =
						results.length > 0
							? results
									.map(
										(result) => `
			<a href="${result.url}" class="search-result">
			  <div class="search-result-title">${result.meta.title || "Untitled"}</div>
			  <p>${result.excerpt}</p>
			</a>
		  `,
									)
									.join("")
							: "";
					talkBubble.classList.add("chat-active");
				} else {
					searchResults.innerHTML = "";
				}
			});

		document
			.getElementById("chat-form")
			.addEventListener("submit", function (e) {
				e.preventDefault();
				const userInput = document.getElementById("user-input");
				if (userInput.value.trim() !== "") {
					sendMessageToWorker(userInput.value.trim());
					userInput.value = "";
					searchResults.innerHTML = "";
				}
			});

		document
			.getElementById("user-input")
			.addEventListener("keydown", function (e) {
				if (e.key === "Escape") resetChatInterface();
			});
	}

	function handleChatTrigger() {
		talkBubble.classList.toggle("chat-active");
		mainContent.classList.toggle("chat-active");
		talkBubble.classList.contains("chat-active")
			? activateChatInterface()
			: (navPhrase.innerHTML = originalContent);
	}

	chatTrigger.addEventListener("click", handleChatTrigger);

	navPhrase.addEventListener("click", function (event) {
		if (event.target.tagName.toLowerCase() === "a") return;
		if (
			window.innerWidth < 840 &&
			!talkBubble.classList.contains("chat-active")
		) {
			handleChatTrigger();
		} else if (navPhrase.classList.contains("clickable")) {
			activateChatInterface();
			navPhrase.classList.remove("clickable");
		}
	});
});
