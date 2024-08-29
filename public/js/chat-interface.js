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

	updateChatBubble(waitText, true);

	const userId = getUserId();

	fetch(
		`${baseUrl}/ai?message=${encodeURIComponent(message)}&animal=${animalParam}&userId=${userId}`,
	)
		.then((response) => response.json())
		.then((data) => {
			updateChatBubble(data.response || `Error: ${data.error}`);
		})
		.catch((error) => {
			console.error("Fetch error:", error);
			updateChatBubble("Sorry, something went wrong.");
		});
}

function updateChatBubble(text, isWaiting = false) {
	const chatBubble = document.getElementById("chatBubble");
	chatBubble.textContent = text;
	chatBubble.classList.toggle("waiting", isWaiting);

	// Add this line to make the chat bubble clickable again after receiving a response
	if (!isWaiting) {
		chatBubble.classList.add("clickable");
	}
}

document.addEventListener("DOMContentLoaded", function () {
	const chatTrigger = document.getElementById("chat-trigger");
	const talkBubble = document.querySelector(".talk-bubble");
	const mainContent = document.querySelector("main");
	const chatBubble = document.getElementById("chatBubble");
	let originalContent = chatBubble.innerHTML;

	function activateChatInterface() {
		chatBubble.innerHTML = `
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
			chatBubble.innerHTML = originalContent;
		}
	}

	chatTrigger.addEventListener("click", handleChatTrigger);

	// Modify this event listener to handle clicks on the chat bubble
	chatBubble.addEventListener("click", function () {
		if (
			window.innerWidth < 840 &&
			!talkBubble.classList.contains("chat-active")
		) {
			handleChatTrigger();
		} else if (chatBubble.classList.contains("clickable")) {
			activateChatInterface();
			chatBubble.classList.remove("clickable");
		}
	});

	// Handle window resize
	window.addEventListener("resize", function () {
		if (window.innerWidth >= 840) {
			if (!talkBubble.classList.contains("chat-active")) {
				chatBubble.innerHTML = originalContent;
			}
		}
	});
});
