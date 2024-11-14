// chat.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface Message {
  roomId: string;
  senderId: string;
  text: string;
  timestamp: Date;
  name: string;
  receiverId: string;
}

interface ChatRoom {
  id: string;
  participants: Set<string>;
}

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  activeRooms: Map<string, ChatRoom> = new Map();
  // activeUsersTest: Set<string> = new Set();
  messages: Message[] = [];

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.leaveAllRooms(client);
  }

  @SubscribeMessage('joinChat')
  handleJoinChat(client: Socket, roomId: string) {
    console.log(`Client ${client.id} joining chat room ${roomId}`);

    let room = this.activeRooms.get(roomId);
    if (!room) {
      room = { id: roomId, participants: new Set() };
      this.activeRooms.set(roomId, room);
    }

    room.participants.add(client.id);
    client.join(roomId);

    // Emit an event to inform other participants about the new participant
    client.to(roomId).emit('participantJoined', client.id);
  }

  @SubscribeMessage('message')
  handleMessage(
    client: Socket,
    payload: { roomId: string; text: string; name: string; receiverId: string },
  ) {
    console.log(
      `Received message from ${client.id} in room ${payload.roomId}: ${payload.text}`,
    );

    const message: Message = {
      name: payload.name,
      roomId: payload.roomId,
      senderId: client.id,
      text: payload.text,
      timestamp: new Date(),
      receiverId: payload.receiverId,
    };

    this.messages.push(message);

    // Broadcast the message to all participants in the room
    client.to(payload.roomId).emit('message', message);
  }

  private leaveAllRooms(client: Socket) {
    this.activeRooms.forEach((room, roomId) => {
      if (room.participants.has(client.id)) {
        room.participants.delete(client.id);
        client.leave(roomId);
        // Emit an event to inform other participants about the participant leaving
        client.to(roomId).emit('participantLeft', client.id);
      }
    });
  }
}
