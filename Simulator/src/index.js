const { io } = require("socket.io-client");
const logger = require("./logger");
const socket = io("http://localhost:3000");

// Check if socket is enabled (connected)
socket.on("connect", () => {
	logger.info("Socket connected successfully!");
});

socket.on("connect_error", (err) => {
	logger.error("Socket connection failed:", err.message);
});

const message = {
	group_id: 1,
	content: "Hello, group!",
	// ...other SendMessageDto fields if any...
	senderId: 1, // The authenticated user's ID
};

socket.emit("realTimeChat", message);

// Listen for new messages
socket.on("newMessage", (data) => {
	logger.info(`Received new message: ${data.content}`);
});

// Listen for ack
socket.on("messageAck", (ack) => {
	if (ack.status === "ok") {
		logger.info("Message delivered:", ack);
	} else {
		logger.info("Message failed:", ack.error);
	}
});
