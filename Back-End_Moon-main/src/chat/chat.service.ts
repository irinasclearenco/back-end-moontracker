import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './entities/chat.entity';

export interface Conversation {
  id: number;
  name: string;
  lastMessage: string;
  timestamp: Date;
  isRead: boolean;
}
@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
  ) {}
  create() {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }
  async sendMessage(
    senderId: number,
    receiverId: number,
    message: string,
  ): Promise<Chat> {
    const newMessage = this.chatRepository.create({
      senderId,
      receiverId,
      message,
    });
    newMessage.timestamp = new Date();
    return this.chatRepository.save(newMessage);
  }
  async makeAllRead(userId: number, currentUserId: number): Promise<Chat[]> {
    const chat = await this.chatRepository.find({
      where: [
        { senderId: userId, receiverId: currentUserId, isRead: false },
        { senderId: currentUserId, receiverId: userId, isRead: false },
      ],
    });

    // Mark all fetched messages as read
    for (const message of chat) {
      message.isRead = true;
    }
    // Save all updated messages in a single batch
    return await this.chatRepository.save(chat);
  }
  async getMessageHistory(
    currentUserId: number,
    userId: number,
  ): Promise<Chat[]> {
    return this.chatRepository.find({
      where: [
        { senderId: userId, receiverId: currentUserId },
        { senderId: currentUserId, receiverId: userId },
      ],
      order: { timestamp: 'DESC' },
      relations: ['sender', 'receiver'],
    });
  }
  async getChatHistory(currentUserId: number): Promise<Conversation[]> {
    const senderConversations = await this.chatRepository.find({
      where: { receiverId: currentUserId },
      order: { timestamp: 'DESC' },
      relations: ['sender'],
    });

    const receiverConversations = await this.chatRepository.find({
      where: { senderId: currentUserId },
      order: { timestamp: 'DESC' },
      relations: ['receiver'],
    });

    const conversations: Conversation[] = [];

    const processConversation = (conversation: Chat, isSender: boolean) => {
      const { id, name } = isSender
        ? conversation.sender
        : conversation.receiver;
      const { message, timestamp, isRead } = conversation;
      return { id, name, lastMessage: message, timestamp, isRead };
    };

    senderConversations.forEach((conversation) => {
      conversations.push(processConversation(conversation, true));
    });

    receiverConversations.forEach((conversation) => {
      conversations.push(processConversation(conversation, false));
    });

    const uniqueConversations = conversations.reduce((acc, conversation) => {
      if (!acc.has(conversation.id)) {
        acc.set(conversation.id, conversation);
      }
      return acc;
    }, new Map<number, Conversation>());
    return Array.from(uniqueConversations.values());
  }
  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
