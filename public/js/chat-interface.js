const isDevelopment =
	window.location.hostname === "localhost" ||
	window.location.hostname === "127.0.0.1";
const baseUrl = isDevelopment ? "http://localhost:8090" : "";

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

	function activateChatInterface() {
		navPhrase.innerHTML = `
			<form id="chat-form">
				<input type="text" id="user-input" placeholder="Type your message...">
				<button type="submit" style="display:none;">Send</button>
			</form>
		`;
		document.getElementById("user-input").focus();

		document
			.getElementById("chat-form")
			.addEventListener("submit", function (e) {
				e.preventDefault();
				const userInput = document.getElementById("user-input");
				if (userInput.value.trim() !== "") {
					sendMessageToWorker(userInput.value.trim());
					userInput.value = "";
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
	navPhrase.addEventListener("click", function () {
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

	// Handle window resize
	window.addEventListener("resize", function () {
		if (window.innerWidth >= 840) {
			if (!talkBubble.classList.contains("chat-active")) {
				navPhrase.innerHTML = originalContent;
			}
		}
	});
});
