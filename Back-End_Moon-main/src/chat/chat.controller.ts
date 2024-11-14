import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  UnauthorizedException,
  Req,
  Request,
} from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from '../iam/authentication/guards/access-token/access-token.guard';
import { REQUEST_USER_KEY } from '../iam/iam.constants';

import { ChatService, Conversation } from './chat.service';
import { Chat } from './entities/chat.entity';

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(AccessTokenGuard)
  @Post('read')
  async makeAllRead(
    @Body() { userId }: { userId: number },
    @Req() req: Request,
  ): Promise<Chat[]> {
    const currentUserId: number = req[REQUEST_USER_KEY].sub;
    if (!currentUserId) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.chatService.makeAllRead(userId, currentUserId);
  }

  @UseGuards(AccessTokenGuard)
  @Post('send')
  async sendMessage(
    @Body() { senderId, receiverId, message }: Chat,
  ): Promise<Chat> {
    return this.chatService.sendMessage(senderId, receiverId, message);
  }

  @UseGuards(AccessTokenGuard)
  @Get('history/:userId')
  async getMessageHistory(
    @Param('userId') userId: string,
    @Req() req: Request,
  ): Promise<Chat[]> {
    const currentUserId: number = req[REQUEST_USER_KEY].sub;
    if (!currentUserId.toString()) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.chatService.getMessageHistory(currentUserId, +userId);
  }

  @UseGuards(AccessTokenGuard)
  @Get('history')
  async getChatHistory(@Req() req: Request): Promise<Conversation[]> {
    const currentUserId: number = req[REQUEST_USER_KEY].sub;
    if (!currentUserId) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.chatService.getChatHistory(currentUserId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatService.remove(+id);
  }
}
