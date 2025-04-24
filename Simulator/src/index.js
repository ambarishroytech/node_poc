const { io } = require("socket.io-client");
const chalk = require("chalk").default;

// Map group IDs to chalk color functions
const groupColors = {
	1: chalk.blue,
	2: chalk.green,
	3: chalk.magenta,
	// Add more as needed
};

const colorDefault = chalk.yellow;
const colorError = chalk.red;

const socket = io("http://localhost:3000");

// Check if socket is enabled (connected)
socket.on("connect", () => {
	console.log(colorDefault("Socket connected successfully!"));
});

socket.on("connect_error", (err) => {
	const color = chalk.yellow;
	console.log(colorError("Socket connection failed:", err.message));
});

// Join all groups the user is a member of
const userGroups = [1, 2, 3]; // Example: user is in groups 1, 2, and 3
for (const groupId of userGroups) {
	const color = groupColors[groupId] || chalk.white;
	socket.emit("joinGroup", groupId);
	console.log(color(`Joined group ${groupId}`));
}

// Store messages by group
const groupMessages = {};

// Listen for new messages
socket.on("newMessage", (data) => {
	const groupId = data.group_id;
	const color = groupColors[groupId] || chalk.white;
	if (!groupMessages[groupId]) {
		groupMessages[groupId] = [];
	}
	groupMessages[groupId].push(data);

	console.log(
		color(`Received new message in group ${groupId}: ${data.content}`),
	);
	console.log(
		color(
			`Message count for group ${groupId}: ${groupMessages[groupId].length}`,
		),
	);
});

// // Function to send a message to a specific group
// function sendMessageToGroup(groupId, content, senderId) {
// 	const message = {
// 		group_id: groupId,
// 		content,
// 		senderId,
// 	};
// 	socket.emit("realTimeChat", message);
// }

// // Example: send a message to group 1
// sendMessageToGroup(1, "Hello, group 1!", 1);

// // Listen for ack
// socket.on("messageAck", (ack) => {
// 	if (ack.status === "ok") {
// 		console.log("Message delivered:", ack);
// 	} else {
// 		console.log("Message failed:", ack.error);
// 	}
// });
