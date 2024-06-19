import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { ParseUUIDPipe, UnauthorizedException } from '@nestjs/common';
import { User } from '@prisma/client';
import { of } from 'rxjs';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() server: Server;
  private activeUsers: Map<string, number> = new Map();

  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService
  ) {}

  afterInit(server: Server) {
    console.log('Starting...');
  }

  async handleConnection(client: Socket) {
    try {
      
      // on connection, ensure the connection web socket
      // has a valid jwt token
      const token = client.handshake.auth.token;
      const secret = this.configService.get<string>('JWT_SECRET');
      const payload = jwt.verify(token, secret) as jwt.JwtPayload;
      
      const user = await this.usersService.getUser({id: payload.id});

      if (!user) {
        throw new UnauthorizedException('Unauthorized User Connection');
      }
      client.data.userId = payload.id; 
      
      // on connection, update the active user records
      this.activeUsers.set(client.id, payload.id);

      // Fetch all users and send them to the client
      let users = await this.usersService.getUsers({});
      users = this.markActiveUsers(users);
      client.emit('allUsers', users);

      let offlineMessages = await this.usersService.getUserOfflineMessages(payload.id);
      offlineMessages = offlineMessages.map((offlineMessage) => ({
        ...offlineMessage,
        from: offlineMessage.fromUserId,
        to: offlineMessage.toUserId,
      }));

      client.emit("offlineMessages", offlineMessages);
      
      await this.usersService.deleteUserOfflineMessages(payload.id);

      // broadcast to all connections that a new user has joined
      this.server.emit('userJoined', { ...user });
    } catch (error) {
      console.log('Connection error:', error.message);
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    const userId = this.activeUsers.get(client.id);
    if (userId) {
      this.activeUsers.delete(client.id);
      this.server.emit('userDropped', { userId });
    }
  }

  @SubscribeMessage('getOnlineUsers')
  handleGetOnlineUsers(@ConnectedSocket() client: Socket) {
    client.emit('onlineUsers', Array.from(this.activeUsers.values()));
  }

  @SubscribeMessage('sendMessage')
async sendMessage(@ConnectedSocket() client: Socket, @MessageBody() message: any) {
  let recipientSocketId: string | undefined;
  let senderSocketId: string | undefined;

  
  for (const [socketId, userId] of this.activeUsers.entries()) {
    if (userId === message.to) {
      recipientSocketId = socketId;
    }
    if (userId === message.from) {
      senderSocketId = socketId;
    }
  }

  if (recipientSocketId) {
    this.server.to(recipientSocketId).emit('messageReceived', message);
  } else {
    // User is offline, save to temp db
    await this.usersService.saveUserOfflineMessages(message);
  }

  if (senderSocketId) {
    this.server.to(senderSocketId).emit('messageReceived', message);
  } else {
    // User is offline, save to temp db
    await this.usersService.saveUserOfflineMessages(message);
  }
}

@SubscribeMessage('userOnline')
async handleUserOnline(@ConnectedSocket() client: Socket, @MessageBody() message: { userId: number }) {
  const { userId } = message;
  this.activeUsers.set(client.id, userId);
  this.server.emit('userOnline', { userId });
}
  

@SubscribeMessage('userOffline')
handleUserOffline(@ConnectedSocket() client: Socket,@MessageBody() message: { userId: number }) {
  const { userId } = message;
  this.activeUsers.delete(client.id);
  this.server.emit('userOffline', { userId });
}

 
  @SubscribeMessage('searchUsers')
  async handleSearchUsers(@MessageBody() query: string, @ConnectedSocket() client: Socket) {
    let users: User[];
    if (query) {
      users = await this.usersService.getUsers({
        where: {
          OR: [
            { email: { contains: query } },
            { phoneNumber: { contains: query } },
          ],
        },
      });  
    }else {
      users = await this.usersService.getUsers({});
    }
    
    const activeUsers = this.markActiveUsers(users);
    client.emit('searchResults', activeUsers);
  }


  markActiveUsers(users: User[]): User[] {
    let activeUserIds = Array.from(this.activeUsers.values());
    activeUserIds = activeUserIds.map(activeId => activeId)
    return users.map(user => ({
      ...user,
      online: activeUserIds.includes(user.id)
    }));
  }
}
