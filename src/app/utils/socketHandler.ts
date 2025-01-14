// src/utils/socket-handler.ts
import { io, type Socket } from "socket.io-client";

let socket: Socket | null = null;

export function initializeSocket(playerId: string) {
	socket = io("https://arcsentry-production.up.railway.app", {
		query: { playerId },
	});

	socket.on("connect", () => {
		console.log("Socket.IO connection established");
	});

	socket.on("disconnect", () => {
		console.log("Socket.IO disconnected");
	});

	// Generic event handler
	socket.onAny((eventName, ...args) => {
		window.dispatchEvent(
			new CustomEvent("socketMessage", {
				detail: { event: eventName, data: args[0] },
			}),
		);
	});
}

export function emitSocketEvent(eventName: string, data: any) {
	if (socket?.connected) {
		console.log("Emitting socket event:", eventName, data);
		socket.emit(eventName, data);
	} else {
		console.error("Socket is not connected");
	}
}
