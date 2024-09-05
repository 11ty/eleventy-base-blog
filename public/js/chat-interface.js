// Generate a random user ID if not already stored
function getUserId() {
	let userId = localStorage.getItem("userId");
	if (!userId) {
		userId = "user_" + Math.random().toString(36).slice(2, 11);
		localStorage.setItem("userId", userId);
	}
	return userId;
}

function sendMessageToWorker(message) {
	const isDevelopment =
		window.location.hostname === "localhost" ||
		window.location.hostname === "127.0.0.1";
	const baseUrl = isDevelopment ? "http://localhost:8090" : "";

	const isDarkMode =
		document.documentElement.getAttribute("data-theme") === "dark";
	const animalParam = isDarkMode ? "frog" : "chicken";
	const waitText = isDarkMode ? "Ribbit" : "Cluck";

	updateNavPhrase(waitText, true);

	const userId = getUserId();

	fetch(
		`${baseUrl}/ai?message=${encodeURIComponent(message)}&animal=${animalParam}&userId=${userId}`,
	)
		.then((response) => response.json())
		.then((data) => {
			updateNavPhrase(data.response || `Error: ${data.error}`);
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

	// Add this line to make the chat bubble clickable again after receiving a response
	if (!isWaiting) {
		navPhrase.classList.add("clickable");
	}
}

document.addEventListener("DOMContentLoaded", function () {
	const chatTrigger = document.getElementById("chat-toggle");
	const talkBubble = document.querySelector(".nav-bubble");
	const mainContent = document.querySelector("main");
	const navPhrase = document.getElementById("navPhrase");
	let originalContent = navPhrase.innerHTML;

	const chatReset = document.getElementById("chat-reset");

	function resetChatInterface() {
		navPhrase.innerHTML = originalContent;
		talkBubble.classList.remove("chat-active");
		mainContent.classList.remove("chat-active");
	}

	chatReset.addEventListener("click", resetChatInterface);

	function activateChatInterface() {
		navPhrase.innerHTML = `
			<form id="chat-form">
				<input type="text" id="user-input" placeholder="Type your message or search...">
				<button type="submit" style="display:none;">Send</button>
			</form>
			<div id="search-results"></div>
		`;
		const userInput = document.getElementById("user-input");
		userInput.focus();

		const searchResults = document.getElementById("search-results");
		let pagefind;

		userInput.addEventListener("input", async function () {
			if (!pagefind) {
				pagefind = await import("/pagefind/pagefind.js");
				await pagefind.options({
					element: "#search-results",
					excerptLength: 15,
					highlightParam: "highlight",
				});
				await pagefind.init();
			}

			const query = userInput.value.trim();
			if (query.length > 2) {
				const search = await pagefind.search(query);
				const results = await Promise.all(search.results.map((r) => r.data()));

				if (results.length > 0) {
					searchResults.innerHTML = results
						.map(
							(result) => `
							<a href="${result.url}" class="search-result">
								<div class="search-result-title">${result.meta.title || "Untitled"}</div>
								<p>${result.excerpt}</p>
							</a>
						`,
						)
						.join("");
					talkBubble.classList.add("chat-active");
				} else {
					searchResults.innerHTML = "";
				}
			} else {
				searchResults.innerHTML = "";
			}
		});

		document
			.getElementById("chat-form")
			.addEventListener("submit", function (e) {
				e.preventDefault();
				if (userInput.value.trim() !== "") {
					sendMessageToWorker(userInput.value.trim());
					userInput.value = "";
					searchResults.innerHTML = "";
				}
			});

		// Add event listener for escape key to reset chat interface
		userInput.addEventListener("keydown", function (e) {
			if (e.key === "Escape") {
				resetChatInterface();
			}
		});
	}

	function handleChatTrigger() {
		talkBubble.classList.toggle("chat-active");
		mainContent.classList.toggle("chat-active");

		if (talkBubble.classList.contains("chat-active")) {
			activateChatInterface();
		} else {
			navPhrase.innerHTML = originalContent;
		}
	}

	chatTrigger.addEventListener("click", handleChatTrigger);

	// Modify this event listener to handle clicks on the chat bubble
	navPhrase.addEventListener("click", function (event) {
		// Check if the clicked element is a link
		if (event.target.tagName.toLowerCase() === "a") {
			// If it's a link, let the default action happen (follow the link)
			return;
		}

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
