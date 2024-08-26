const isDevelopment =
	window.location.hostname === "localhost" ||
	window.location.hostname === "127.0.0.1";
const baseUrl = isDevelopment ? "http://localhost:8090" : "";

const chatBubble = document.getElementById("chatBubble");
const originalContent = chatBubble.dataset.originalContent;
let isInputMode = false;

chatBubble.addEventListener("click", function () {
	if (!isInputMode) {
		isInputMode = true;
		chatBubble.innerHTML =
			'<input type="text" id="chatInput" placeholder="What do you want to know?">';
		document.getElementById("chatInput").focus();
	}
});

document.addEventListener("keypress", function (e) {
	if (e.key === "Enter" && isInputMode) {
		const input = document.getElementById("chatInput");
		if (input.value.trim()) {
			chatBubble.innerHTML = "Processing...";
			sendMessageToWorker(input.value.trim());
		}
	}
});

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
		})
		.finally(() => {
			isInputMode = false;
		});
}

function updateChatBubble(text, isWaiting = false) {
	chatBubble.textContent = text;
	chatBubble.classList.toggle("waiting", isWaiting);
}
