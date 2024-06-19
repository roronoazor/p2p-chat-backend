import { Injectable } from '@nestjs/common';
import { Prisma, User, OfflineMessage } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    async getUser(
        userWhereUniqueInput: Prisma.UserWhereUniqueInput,
      ): Promise<User | null> {
        return this.prisma.user.findUnique({
          where: userWhereUniqueInput,
        });
      }

    async getUsers(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.UserWhereUniqueInput;
        where?: Prisma.UserWhereInput;
        orderBy?: Prisma.UserOrderByWithRelationInput;
      }): Promise<User[]> {
        const { skip, take, cursor, where, orderBy } = params;
        return this.prisma.user.findMany({
          skip,
          take,
          cursor,
          where,
          orderBy,
        });
      }

    async createUser(data: Prisma.UserCreateInput): Promise<User>{
        return this.prisma.user.create({
            data
        })
    }

    async getUserOfflineMessages(userId: number): Promise<OfflineMessage[]> {
      return await this.prisma.offlineMessage.findMany({
        where: { toUserId: { equals: userId } },
      });
    }

    async saveUserOfflineMessages(message: any) {
      return await this.prisma.offlineMessage.create({
        data: {
          fromUserId: message.from,
          toUserId: message.to,
          message: message.message,
        },
      });
    }

    async deleteUserOfflineMessages(userId:number){
      return await this.prisma.offlineMessage.deleteMany({
        where: { toUserId: {
          equals: userId
        }},
      });
    }
}
