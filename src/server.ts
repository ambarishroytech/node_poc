import dotenv from "dotenv";
// Starts the server and listens for incoming requests.
import app from "./app";

import { getDbConnection } from "./config/database";
import logger from "./config/logger";

import { createServer } from "node:http";
import { Server as SocketIOServer } from "socket.io";

import type { SendMessageDto } from "./dtos/message.dto";
import { MessageService } from "./services/message.service";

// Create HTTP server and bind socket.io
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
	cors: { origin: "*" }, // Adjust CORS as needed
});

// Listen for client connections
io.on("connection", (socket) => {
	logger.info("A client connected:", socket.id);

	// Listen for realTimeChat event from client
	socket.on(
		"realTimeChat",
		async (data: SendMessageDto & { senderId: number }) => {
			try {
				logger.info(`Received message from client: ${JSON.stringify(data)}`);
				// Save the message using your service
				const messageService = new MessageService();
				const response = await messageService.sendMessage(data, data.senderId);

				// Send ack to sender
				socket.emit("messageAck", { status: "ok", ...response.AckData });
				logger.info(
					`Sent acknowledgement to the sender: ${JSON.stringify(response.AckData)}`,
				);
			} catch (error) {
				const errorMessage =
					error instanceof Error ? error.message : "An unknown error occurred";
				socket.emit("messageAck", { status: "error", error: errorMessage });
				logger.error(errorMessage);
			}
		},
	);
});

// Make io accessible in your app (for use in controllers/services)
export { io };

// Load environment variables from .env file
dotenv.config();

const PORT = process.env.PORT || 3000;
const WEB_SERVER = process.env.WEB_SERVER || "http://localhost";

const startServer = async () => {
	try {
		// Initialize the database connection pool
		await getDbConnection();
		logger.info("Database connection pool initialized.");

		// Start the server
		httpServer.listen(PORT, () => {
			logger.info(`Server is running on ${WEB_SERVER}:${PORT}`);
		});
	} catch (error) {
		logger.error("Failed to start the server:", { error });
		process.exit(1); // Exit the process if the database connection fails
	}
};

// Start the server
startServer();
